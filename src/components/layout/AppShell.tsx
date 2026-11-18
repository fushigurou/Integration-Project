import { useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LogOut, Menu, Search, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { initials } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { Logo } from './Logo'
import { NAV, ROLE_LABEL } from './nav'

export function AppShell() {
  const { session, logout, db, go } = useApp()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')

  const items = session ? NAV[session.role] : []

  const searchHits = useMemo(() => {
    if (!q.trim() || !session) return []
    const needle = q.trim().toLowerCase()
    const regionScope = session.role === 'dr' ? session.regionId : undefined
    const hits: Array<{ label: string; to: string }> = []

    db.regions
      .filter((r) => !regionScope || r.id === regionScope)
      .filter((r) => r.nom.toLowerCase().includes(needle))
      .forEach((r) => hits.push({ label: `Région · ${r.nom}`, to: '/regions' }))

    db.drs
      .filter((d) => !regionScope || d.regionId === regionScope)
      .filter((d) => `${d.prenom} ${d.nom}`.toLowerCase().includes(needle))
      .forEach((d) => hits.push({ label: `DR · ${d.prenom} ${d.nom}`, to: '/directeurs' }))

    db.drivers
      .filter((d) => !regionScope || d.regionId === regionScope)
      .filter((d) => `${d.prenom} ${d.nom}`.toLowerCase().includes(needle))
      .forEach((d) => hits.push({ label: `Chauffeur · ${d.prenom} ${d.nom}`, to: '/chauffeurs' }))

    db.vehicles
      .filter((v) => !regionScope || v.regionId === regionScope)
      .filter((v) => `${v.matricule} ${v.marque}`.toLowerCase().includes(needle))
      .forEach((v) => hits.push({ label: `Véhicule · ${v.matricule}`, to: '/vehicules' }))

    return hits.slice(0, 8)
  }, [q, db, session])

  if (!session) return null

  const Sidebar = (
    <div className="flex h-full flex-col bg-brand-900 p-4">
      <div className="mb-8 flex items-center justify-between">
        <Logo light />
        <button
          type="button"
          className="cursor-pointer text-white lg:hidden"
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
      </div>
      <nav className="flex-1 space-y-1" aria-label="Navigation principale">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  'flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-brand-900'
                    : 'text-brand-100 hover:bg-white/10',
                ].join(' ')
              }
            >
              <Icon className="size-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )

  return (
    <div className="min-h-screen lg:pl-64">
      <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block">{Sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
          />
          <aside className="relative z-10 h-full w-64">{Sidebar}</aside>
        </div>
      )}

      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 sm:px-6">
        <button
          type="button"
          className="cursor-pointer rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
          <input
            aria-label="Recherche globale"
            placeholder="Rechercher régions, directeurs, chauffeurs, véhicules…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-50 pr-3 pl-9 text-sm placeholder:text-slate-500"
          />
          {q.trim() && (
            <div className="absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              {searchHits.length === 0 ? (
                <p className="px-4 py-3 text-sm text-slate-500">Aucun résultat</p>
              ) : (
                searchHits.map((hit) => (
                  <button
                    key={hit.label}
                    type="button"
                    className="block w-full cursor-pointer px-4 py-2.5 text-left text-sm hover:bg-brand-50"
                    onClick={() => {
                      setQ('')
                      go(hit.to)
                    }}
                  >
                    {hit.label}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <div className="text-sm font-semibold text-slate-900">{session.name}</div>
            <div className="mt-0.5">
              <Badge tone="brand">{ROLE_LABEL[session.role]}</Badge>
            </div>
          </div>
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
            {initials(session.name)}
          </span>
          <button
            type="button"
            aria-label="Déconnexion"
            title="Déconnexion"
            onClick={logout}
            className="cursor-pointer rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  )
}
