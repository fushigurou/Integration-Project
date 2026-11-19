import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import type { Db, Session, ToastItem, ToastKind } from '../data/types'
import { uid } from '../lib/dates'
import {
  deleteDirecteur,
  fetchDb,
  fetchMe,
  loginRequest,
  logoutRequest,
  saveDirecteur,
  setToken,
} from '../lib/api'

type AppContextValue = {
  db: Db
  loading: boolean
  authReady: boolean
  refresh: () => Promise<void>
  save: <K extends keyof Db>(key: K, item: Db[K][number]) => Promise<void>
  del: <K extends keyof Db>(key: K, id: string) => Promise<void>
  toast: (message: string, kind?: ToastKind) => void
  toasts: ToastItem[]
  dismissToast: (id: string) => void
  session: Session | null
  login: (email: string, pw: string) => Promise<string | Session>
  logout: () => Promise<void>
  go: (path: string) => void
}

const emptyDb: Db = { drs: [] }

const C = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [db, setDb] = useState<Db>(emptyDb)
  const [loading, setLoading] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const go = useCallback((path: string) => navigate(path), [navigate])

  const toast = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = uid()
    setToasts((t) => [...t, { id, kind, message }])
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const refresh = useCallback(async () => {
    const next = await fetchDb()
    setDb(next)
  }, [])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const me = await fetchMe()
        if (!alive) return
        if (me) {
          setSession(me)
          setLoading(true)
          try {
            const next = await fetchDb()
            if (alive) setDb(next)
          } catch (e) {
            if (alive) {
              toast(
                e instanceof Error ? e.message : 'Impossible de charger les données.',
                'error',
              )
            }
          } finally {
            if (alive) setLoading(false)
          }
        }
      } finally {
        if (alive) setAuthReady(true)
      }
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore session once
  }, [])

  const save = useCallback(
    async <K extends keyof Db>(key: K, item: Db[K][number]) => {
      if (key === 'drs') await saveDirecteur(item as Db['drs'][number])
      await refresh()
    },
    [refresh],
  )

  const del = useCallback(
    async <K extends keyof Db>(key: K, id: string) => {
      if (key === 'drs') await deleteDirecteur(id)
      await refresh()
    },
    [refresh],
  )

  const login = useCallback(
    async (email: string, pw: string): Promise<string | Session> => {
      try {
        const nextSession = await loginRequest(email, pw)
        setSession(nextSession)
        setLoading(true)
        try {
          const next = await fetchDb()
          setDb(next)
        } finally {
          setLoading(false)
        }
        return nextSession
      } catch (err) {
        setToken(null)
        setSession(null)
        return err instanceof Error
          ? err.message
          : 'Erreur de connexion au serveur.'
      }
    },
    [],
  )

  const logout = useCallback(async () => {
    await logoutRequest()
    setSession(null)
    setDb(emptyDb)
    navigate('/')
  }, [navigate])

  const value = useMemo(
    () => ({
      db,
      loading,
      authReady,
      refresh,
      save,
      del,
      toast,
      toasts,
      dismissToast,
      session,
      login,
      logout,
      go,
    }),
    [
      db,
      loading,
      authReady,
      refresh,
      save,
      del,
      toast,
      toasts,
      dismissToast,
      session,
      login,
      logout,
      go,
    ],
  )

  return <C.Provider value={value}>{children}</C.Provider>
}

export function useApp() {
  const ctx = useContext(C)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export const home = (_s: Session) => '/dashboard'
