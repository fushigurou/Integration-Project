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
  deleteDriver,
  deleteRegion,
  deleteVehicle,
  fetchDb,
  fetchDirecteursGeneraux,
  saveDirecteur,
  saveDriver,
  saveRegion,
  saveVehicle,
} from '../lib/api'

type AppContextValue = {
  db: Db
  loading: boolean
  refresh: () => Promise<void>
  save: <K extends keyof Db>(key: K, item: Db[K][number]) => Promise<void>
  del: <K extends keyof Db>(key: K, id: string) => Promise<void>
  toast: (message: string, kind?: ToastKind) => void
  toasts: ToastItem[]
  dismissToast: (id: string) => void
  session: Session | null
  login: (email: string, pw: string) => Promise<string | Session>
  loginAs: (s: Session) => void
  logout: () => void
  regionFilter: string
  setRegionFilter: (v: string) => void
  scopedRegionId: string | undefined
  go: (path: string) => void
}

const emptyDb: Db = { regions: [], drs: [], vehicles: [], drivers: [] }

const C = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const [db, setDb] = useState<Db>(emptyDb)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [regionFilter, setRegionFilter] = useState('')
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
    })()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, [])

  const save = useCallback(
    async <K extends keyof Db>(key: K, item: Db[K][number]) => {
      if (key === 'regions') await saveRegion(item as Db['regions'][number])
      else if (key === 'drs') await saveDirecteur(item as Db['drs'][number])
      else if (key === 'drivers') await saveDriver(item as Db['drivers'][number])
      else if (key === 'vehicles') await saveVehicle(item as Db['vehicles'][number])
      await refresh()
    },
    [refresh],
  )

  const del = useCallback(
    async <K extends keyof Db>(key: K, id: string) => {
      if (key === 'regions') await deleteRegion(id)
      else if (key === 'drs') await deleteDirecteur(id)
      else if (key === 'drivers') await deleteDriver(id)
      else if (key === 'vehicles') await deleteVehicle(id)
      await refresh()
    },
    [refresh],
  )

  const login = useCallback(
    async (email: string, pw: string): Promise<string | Session> => {
      const e = email.trim().toLowerCase()
      if (pw !== 'steg1234') {
        return 'Identifiants incorrects. Vérifiez votre email et votre mot de passe.'
      }

      try {
        const [dgs, data] = await Promise.all([fetchDirecteursGeneraux(), fetchDb()])
        setDb(data)

        const dg = dgs.find((x) => x.utilisateur.email.toLowerCase() === e)
        if (dg) {
          return {
            role: 'dg',
            id: String(dg.id_dg),
            name: `${dg.utilisateur.prenom} ${dg.utilisateur.nom}`,
          }
        }

        const dr = data.drs.find((x) => x.email.toLowerCase() === e)
        if (dr) {
          return {
            role: 'dr',
            id: dr.id,
            name: `${dr.prenom} ${dr.nom}`,
            regionId: dr.regionId || undefined,
          }
        }

        return 'Identifiants incorrects. Vérifiez votre email et votre mot de passe.'
      } catch (err) {
        return err instanceof Error ? err.message : 'Erreur de connexion au serveur.'
      }
    },
    [],
  )

  const loginAs = useCallback((s: Session) => setSession(s), [])

  const logout = useCallback(() => {
    setSession(null)
    setRegionFilter('')
    navigate('/')
  }, [navigate])

  const scopedRegionId = session?.role === 'dr' ? session.regionId : regionFilter || undefined

  const value = useMemo(
    () => ({
      db,
      loading,
      refresh,
      save,
      del,
      toast,
      toasts,
      dismissToast,
      session,
      login,
      loginAs,
      logout,
      regionFilter,
      setRegionFilter,
      scopedRegionId,
      go,
    }),
    [
      db,
      loading,
      refresh,
      save,
      del,
      toast,
      toasts,
      dismissToast,
      session,
      login,
      loginAs,
      logout,
      regionFilter,
      scopedRegionId,
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
