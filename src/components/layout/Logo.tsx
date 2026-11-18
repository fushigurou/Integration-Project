import { cx } from '../../lib/utils'

export function Logo({ light }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/steg-logo.jpeg"
        alt="Logo STEG"
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-lg bg-white object-contain"
      />
      <div className="leading-tight">
        <div className={cx('text-base font-bold', light ? 'text-white' : 'text-brand-900')}>
          STEG Missions
        </div>
        <div className={cx('text-[11px]', light ? 'text-brand-200' : 'text-slate-600')}>
          Gestion des missions véhicules
        </div>
      </div>
    </div>
  )
}
