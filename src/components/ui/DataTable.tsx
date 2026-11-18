import { useMemo, useState, type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cx } from '../../lib/utils'

export type Column<T> = {
  key: string
  header: string
  render: (row: T) => ReactNode
  className?: string
  align?: 'left' | 'right'
}

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchKeys,
  toolbar,
  pageSize = 8,
}: {
  rows: T[]
  columns: Column<T>[]
  searchKeys?: Array<(row: T) => string>
  toolbar?: ReactNode
  pageSize?: number
}) {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!q.trim() || !searchKeys?.length) return rows
    const needle = q.trim().toLowerCase()
    return rows.filter((row) =>
      searchKeys.some((fn) => fn(row).toLowerCase().includes(needle)),
    )
  }, [rows, q, searchKeys])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * pageSize
  const pageRows = filtered.slice(start, start + pageSize)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500" />
          <input
            aria-label="Rechercher…"
            placeholder="Rechercher…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pr-3 pl-9 text-sm placeholder:text-slate-500 hover:border-slate-400"
          />
        </div>
        <div className="ml-auto">{toolbar}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold tracking-wide text-slate-600 uppercase">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cx(
                    'px-4 py-3 whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">
                  Aucun résultat.
                </td>
              </tr>
            ) : (
              pageRows.map((row) => (
                <tr key={row.id} className="hover:bg-brand-50/50">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cx(
                        'px-4 py-3 align-middle',
                        col.align === 'right' && 'text-right',
                        col.className,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600">
        <span>
          {filtered.length === 0
            ? '0 sur 0'
            : `${start + 1}–${Math.min(start + pageSize, filtered.length)} sur ${filtered.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="cursor-pointer rounded-lg border border-slate-300 p-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Page précédente"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span>
            Page {safePage} / {totalPages}
          </span>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="cursor-pointer rounded-lg border border-slate-300 p-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Page suivante"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
