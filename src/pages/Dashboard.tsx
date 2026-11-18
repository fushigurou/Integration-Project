import { Car, Map, UserCog, Users } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { PageHeader } from '../components/ui/PageHeader'
import { Select } from '../components/ui/Field'
import { cx } from '../lib/utils'
import type { VehicleEtat } from '../data/types'

const BRAND = {
  600: '#1a754f',
  700: '#146345',
  500: '#24875e',
  300: '#85c6a2',
  amber: '#d97706',
  red: '#b91c1c',
  slate: '#64748b',
}

const ETAT_LABEL: Record<VehicleEtat, string> = {
  AVAILABLE: 'Disponible',
  ON_MISSION: 'En mission',
  UNDER_MAINTENANCE: 'En maintenance',
  UNAVAILABLE: 'Indisponible',
}

const ETAT_COLOR: Record<VehicleEtat, string> = {
  AVAILABLE: BRAND[600],
  ON_MISSION: BRAND.amber,
  UNDER_MAINTENANCE: BRAND.red,
  UNAVAILABLE: BRAND.slate,
}

function StatCard({
  icon: Icon,
  value,
  label,
  onClick,
}: {
  icon: typeof Map
  value: number
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors hover:border-brand-300"
    >
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Icon className="size-6" />
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-900 tabular-nums">{value}</div>
          <div className="text-sm text-slate-600">{label}</div>
        </div>
      </div>
    </button>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
  className,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cx('rounded-xl border border-slate-200 bg-white p-5 shadow-sm', className)}>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-4 h-64">{children}</div>
    </div>
  )
}

export function Dashboard() {
  const { session, db, regionFilter, setRegionFilter, scopedRegionId, go } = useApp()
  if (!session) return null

  const regionId = scopedRegionId

  const vehicles = useMemo(
    () => db.vehicles.filter((v) => !regionId || v.regionId === regionId),
    [db.vehicles, regionId],
  )
  const drivers = useMemo(
    () => db.drivers.filter((d) => !regionId || d.regionId === regionId),
    [db.drivers, regionId],
  )
  const directeurs = useMemo(
    () => db.drs.filter((d) => !regionId || d.regionId === regionId),
    [db.drs, regionId],
  )

  const regionsForCharts = useMemo(
    () => db.regions.filter((r) => !regionId || r.id === regionId),
    [db.regions, regionId],
  )

  const byRegion = useMemo(
    () =>
      regionsForCharts.map((r) => ({
        name: r.nom,
        vehicules: db.vehicles.filter((v) => v.regionId === r.id).length,
        chauffeurs: db.drivers.filter((d) => d.regionId === r.id).length,
      })),
    [regionsForCharts, db.vehicles, db.drivers],
  )

  const byEtat = useMemo(() => {
    const order: VehicleEtat[] = [
      'AVAILABLE',
      'ON_MISSION',
      'UNDER_MAINTENANCE',
      'UNAVAILABLE',
    ]
    return order
      .map((etat) => ({
        key: etat,
        name: ETAT_LABEL[etat],
        value: vehicles.filter((v) => v.etat === etat).length,
        color: ETAT_COLOR[etat],
      }))
      .filter((x) => x.value > 0)
  }, [vehicles])

  const available = vehicles.filter((v) => v.etat === 'AVAILABLE').length
  const availabilityRate =
    vehicles.length === 0 ? 0 : Math.round((available / vehicles.length) * 100)

  const ratio =
    drivers.length === 0
      ? null
      : (vehicles.length / drivers.length).toFixed(1)

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bonjour ${session.name}, voici la situation de la STEG.`}
        actions={
          session.role === 'dg' ? (
            <Select
              aria-label="Filtrer par région"
              className="!w-48"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="">Toutes les régions</option>
              {db.regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nom}
                </option>
              ))}
            </Select>
          ) : undefined
        }
      />

      <div
        className={cx(
          'grid gap-4 sm:grid-cols-2',
          session.role === 'dg' ? 'xl:grid-cols-4' : 'xl:grid-cols-3',
        )}
      >
        {session.role === 'dg' && (
          <StatCard
            icon={Map}
            value={regionFilter ? 1 : db.regions.length}
            label="Régions"
            onClick={() => go('/regions')}
          />
        )}
        {session.role === 'dg' && (
          <StatCard
            icon={UserCog}
            value={directeurs.length}
            label="Directeurs régionaux"
            onClick={() => go('/directeurs')}
          />
        )}
        <StatCard
          icon={Car}
          value={vehicles.length}
          label="Véhicules"
          onClick={() => go('/vehicules')}
        />
        <StatCard
          icon={Users}
          value={drivers.length}
          label="Chauffeurs"
          onClick={() => go('/chauffeurs')}
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Taux de disponibilité parc</p>
          <p className="mt-2 text-3xl font-bold text-brand-700 tabular-nums">
            {availabilityRate}
            <span className="text-lg font-semibold text-slate-500"> %</span>
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {available} véhicule{available !== 1 ? 's' : ''} disponible
            {available !== 1 ? 's' : ''} sur {vehicles.length}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600 transition-all"
              style={{ width: `${availabilityRate}%` }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Ratio véhicules / chauffeurs</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 tabular-nums">
            {ratio ?? '—'}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} pour {drivers.length}{' '}
            chauffeur{drivers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <ChartCard
          className="lg:col-span-3"
          title="Répartition par région"
          subtitle="Véhicules et chauffeurs"
        >
          {byRegion.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-slate-500">
              Aucune donnée.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byRegion} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#f0f8f3' }}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="vehicules" name="Véhicules" fill={BRAND[700]} radius={[6, 6, 0, 0]} />
                <Bar
                  dataKey="chauffeurs"
                  name="Chauffeurs"
                  fill={BRAND[300]}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="État du parc"
          subtitle="Répartition des véhicules"
        >
          {byEtat.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-slate-500">
              Aucun véhicule.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byEtat}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {byEtat.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(15,23,42,0.06)',
                  }}
                  formatter={(value, name) => [`${value}`, String(name)]}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ fontSize: 12 }}
                  formatter={(value) => (
                    <span className="text-slate-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </>
  )
}
