import type { ReactNode } from 'react'
import { cx } from '../../lib/utils'

const tones = {
  green: 'bg-emerald-100 text-emerald-800',
  amber: 'bg-amber-100 text-amber-900',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-sky-100 text-sky-800',
  brand: 'bg-brand-100 text-brand-800',
  grey: 'bg-slate-100 text-slate-700',
} as const

export type Tone = keyof typeof tones

export function Badge({
  tone = 'grey',
  children,
  className,
}: {
  tone?: Tone
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  )
}

const statusTone: Record<string, Tone> = {
  AVAILABLE: 'green',
  ON_MISSION: 'amber',
  UNDER_MAINTENANCE: 'red',
  UNAVAILABLE: 'grey',
}

const statusLabel: Record<string, string> = {
  AVAILABLE: 'Disponible',
  ON_MISSION: 'En mission',
  UNDER_MAINTENANCE: 'En maintenance',
  UNAVAILABLE: 'Indisponible',
}

export function StatusBadge({ s }: { s: string }) {
  return <Badge tone={statusTone[s] ?? 'grey'}>{statusLabel[s] ?? s}</Badge>
}
