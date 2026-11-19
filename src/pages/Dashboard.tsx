import { UserCog } from 'lucide-react'
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
import { DataTable } from '../components/ui/DataTable'
import { cx } from '../lib/utils'

const BRAND = {
  700: '#146345',
  600: '#1a754f',
  500: '#24875e',
  300: '#85c6a2',
  amber: '#d97706',
  slate: '#64748b',
}

const PIE_COLORS = [BRAND[700], BRAND[600], BRAND[500], BRAND.amber, BRAND[300], BRAND.slate]

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
  const { session, db, go } = useApp()
  if (!session) return null

  const directeurs = useMemo(() => {
    if (session.role === 'dr') return db.drs.filter((d) => d.id === session.id)
    return db.drs
  }, [db.drs, session])

  const byRegion = useMemo(() => {
    const counts = new Map<string, number>()
    for (const d of directeurs) {
      const key = d.region || 'Non assigné'
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return [...counts.entries()].map(([name, value]) => ({ name, value }))
  }, [directeurs])

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        subtitle={`Bonjour ${session.name}, vue des directeurs régionaux.`}
      />

      <button
        type="button"
        onClick={() => session.role === 'dg' && go('/directeurs')}
        className={cx(
          'w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-colors',
          session.role === 'dg' && 'cursor-pointer hover:border-brand-300',
        )}
      >
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <UserCog className="size-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tabular-nums">
              {directeurs.length}
            </div>
            <div className="text-sm text-slate-600">Directeurs régionaux</div>
          </div>
        </div>
      </button>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <ChartCard
          className="lg:col-span-3"
          title="Répartition par région"
          subtitle="Nombre de directeurs régionaux"
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
                <Bar dataKey="value" name="Directeurs" fill={BRAND[700]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard
          className="lg:col-span-2"
          title="Part par région"
          subtitle="Répartition des directeurs"
        >
          {byRegion.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-slate-500">
              Aucun directeur.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byRegion}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="48%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {byRegion.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
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

      <div className="mt-6">
        <h2 className="mb-3 font-semibold text-slate-900">Liste des directeurs régionaux</h2>
        <DataTable
          rows={directeurs}
          searchKeys={[(d) => `${d.prenom} ${d.nom}`, (d) => d.email, (d) => d.region]}
          columns={[
            {
              key: 'nom',
              header: 'Nom',
              render: (d) => (
                <span className="font-semibold text-slate-900">
                  {d.prenom} {d.nom}
                </span>
              ),
            },
            { key: 'email', header: 'Email', render: (d) => d.email },
            { key: 'tel', header: 'Téléphone', render: (d) => d.tel },
            { key: 'region', header: 'Région', render: (d) => d.region || '—' },
          ]}
        />
      </div>
    </>
  )
}
