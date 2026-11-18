const pad = (n: number) => String(n).padStart(2, '0')

export const toLocal = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`

export const nowLocal = () => toLocal(new Date())

export const offset = (days: number, h = 8) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(h, 0, 0, 0)
  return toLocal(d)
}

export const fmt = (s?: string) =>
  s
    ? new Date(s).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
    : '—'

export const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString('fr-FR', { dateStyle: 'medium' }) : '—'

export const uid = () => Math.random().toString(36).slice(2, 9)
