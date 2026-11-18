import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cx } from '../../lib/utils'

export function ToastStack() {
  const { toasts, dismissToast } = useApp()
  return (
    <div
      className="fixed right-4 bottom-4 left-4 z-[100] flex flex-col items-end gap-2 sm:left-auto"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="anim-up flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-lg"
        >
          {t.kind === 'success' ? (
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          ) : t.kind === 'error' ? (
            <CircleAlert className="mt-0.5 size-5 shrink-0 text-red-600" />
          ) : (
            <Info className="mt-0.5 size-5 shrink-0 text-sky-600" />
          )}
          <p className="flex-1 text-sm text-slate-800">{t.message}</p>
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => dismissToast(t.id)}
            className={cx('cursor-pointer rounded p-1 text-slate-500 hover:bg-slate-100')}
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
