import { Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, home, useApp } from './context/AppContext'
import { AppShell } from './components/layout/AppShell'
import { ToastStack } from './components/ui/ToastStack'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Directeurs } from './pages/Directeurs'
import type { ReactNode } from 'react'
import type { Role } from './data/types'

function Guard({
  children,
  roles,
}: {
  children: ReactNode
  roles?: Role[]
}) {
  const { session, authReady } = useApp()
  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Chargement de la session…
      </div>
    )
  }
  if (!session) return <Navigate to="/" replace />
  if (roles && !roles.includes(session.role)) {
    return <Navigate to={home(session)} replace />
  }
  return children
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { session, authReady } = useApp()
  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Chargement de la session…
      </div>
    )
  }
  if (session) return <Navigate to={home(session)} replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          element={
            <Guard>
              <AppShell />
            </Guard>
          }
        >
          <Route
            path="/dashboard"
            element={
              <Guard roles={['dg', 'dr']}>
                <Dashboard />
              </Guard>
            }
          />
          <Route
            path="/directeurs"
            element={
              <Guard roles={['dg']}>
                <Directeurs />
              </Guard>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastStack />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
