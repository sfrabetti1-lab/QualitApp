'use client'

import { useState } from 'react'
import { Check, ChevronDown, RotateCcw, ShieldCheck, TriangleAlert } from 'lucide-react'
import { CHECKLIST_AREAS } from '@/lib/qualita-data'

const TOTAL = CHECKLIST_AREAS.reduce((acc, a) => acc + a.items.length, 0)

export function ChecklistRedazione() {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [openArea, setOpenArea] = useState<string | null>(CHECKLIST_AREAS[0].id)

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleArea = (ids: string[], allChecked: boolean) =>
    setChecked((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (allChecked ? next.delete(id) : next.add(id)))
      return next
    })

  const count = checked.size
  const percent = Math.round((count / TOTAL) * 100)
  const complete = count === TOTAL

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-border bg-muted/40 p-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Avanzamento
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {count}
              <span className="text-lg font-medium text-muted-foreground">/{TOTAL}</span>
            </p>
          </div>
          <p className="text-2xl font-semibold tabular-nums text-primary">{percent}%</p>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="Avanzamento checklist"
          className="mt-3 h-2.5 overflow-hidden rounded-full bg-border"
        >
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p
          aria-live="polite"
          className={`mt-3 flex items-start gap-2 text-sm ${complete ? 'text-primary' : 'text-muted-foreground'}`}
        >
          {complete ? (
            <>
              <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Reality Check superato: il documento è pronto per la sottomissione formale alla
              Direzione.
            </>
          ) : (
            <>
              <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              Mancano {TOTAL - count} verifiche prima della sottomissione alla Direzione.
            </>
          )}
        </p>
      </section>

      <div className="flex flex-col gap-3">
        {CHECKLIST_AREAS.map((area) => {
          const ids = area.items.map((i) => i.id)
          const areaCount = ids.filter((id) => checked.has(id)).length
          const allChecked = areaCount === ids.length
          const isOpen = openArea === area.id
          const panelId = `panel-${area.id}`
          return (
            <section key={area.id} className="overflow-hidden rounded-2xl border border-border">
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenArea(isOpen ? null : area.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-muted/60"
                >
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      allChecked
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent text-primary'
                    }`}
                  >
                    {allChecked ? <Check className="size-4" aria-hidden="true" /> : area.numero}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{area.titolo}</span>
                    <span className="block text-xs text-muted-foreground">
                      {areaCount}/{ids.length} completati
                    </span>
                  </span>
                  <ChevronDown
                    className={`size-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {isOpen && (
                <div id={panelId} className="border-t border-border px-4 py-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">{area.descrizione}</p>
                    <button
                      type="button"
                      onClick={() => toggleArea(ids, allChecked)}
                      className="shrink-0 text-xs font-medium text-primary hover:underline"
                    >
                      {allChecked ? 'Deseleziona' : 'Seleziona tutto'}
                    </button>
                  </div>
                  <ul className="flex flex-col">
                    {area.items.map((item) => {
                      const isChecked = checked.has(item.id)
                      return (
                        <li key={item.id}>
                          <label className="flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggle(item.id)}
                              className="peer sr-only"
                            />
                            <span
                              aria-hidden="true"
                              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-ring ${
                                isChecked
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-input bg-card'
                              }`}
                            >
                              {isChecked && <Check className="size-3.5" strokeWidth={3} />}
                            </span>
                            <span
                              className={`text-sm ${isChecked ? 'text-muted-foreground line-through decoration-primary/40' : ''}`}
                            >
                              {item.label}
                            </span>
                          </label>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </section>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setChecked(new Set())}
        disabled={count === 0}
        className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Azzera checklist
      </button>
    </div>
  )
}
