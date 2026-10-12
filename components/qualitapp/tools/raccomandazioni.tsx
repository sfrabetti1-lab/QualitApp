'use client'

import { useMemo, useState } from 'react'
import { Building2, ChevronDown, Search, Stethoscope } from 'lucide-react'
import { RACCOMANDAZIONI, RM_AREA_LABELS, type RmArea } from '@/lib/qualita-data'

type Filter = 'tutte' | RmArea

const FILTERS: Filter[] = ['tutte', 'farmaci', 'clinico', 'sicurezza', 'manutenzione']

export function Raccomandazioni({ focusRm }: { focusRm?: number | null }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('tutte')
  const [expanded, setExpanded] = useState<number | null>(focusRm ?? null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return RACCOMANDAZIONI.filter((rm) => {
      if (filter !== 'tutte' && rm.area !== filter) return false
      if (!q) return true
      return (
        `rm ${rm.numero}`.includes(q) ||
        String(rm.numero) === q ||
        rm.titolo.toLowerCase().includes(q) ||
        rm.breve.toLowerCase().includes(q) ||
        rm.aziendale.toLowerCase().includes(q) ||
        rm.unitaOperativa.some((u) => u.toLowerCase().includes(q))
      )
    })
  }, [query, filter])

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-2xl bg-accent/60 p-4 text-sm text-accent-foreground">
        <strong>Cascata documentale:</strong> la Direzione recepisce la RM a livello{' '}
        <em>Macro (Aziendale)</em> con atti formali vincolanti; le Unità Operative (livello{' '}
        <em>Micro</em>) la traducono in Istruzioni Operative, protocolli d&apos;équipe e moduli di
        registrazione.
      </p>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="rm-search" className="sr-only">
          Cerca raccomandazione
        </label>
        <input
          id="rm-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca per numero, tema o documento (es. LASA, SBAR)"
          className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtra per area">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground'
            }`}
          >
            {f === 'tutte' ? 'Tutte (18)' : RM_AREA_LABELS[f]}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground" aria-live="polite">
        {results.length} {results.length === 1 ? 'raccomandazione' : 'raccomandazioni'}
      </p>

      <ul className="flex flex-col gap-2">
        {results.map((rm) => {
          const isOpen = expanded === rm.numero
          return (
                <li
                  key={rm.numero}
                  ref={
                    rm.numero === focusRm
                      ? (el) => {
                          // The parent dialog opens after this mounts, so wait a frame before scrolling.
                          if (el) requestAnimationFrame(() => el.scrollIntoView({ block: 'start', behavior: 'smooth' }))
                        }
                      : undefined
                  }
                  className="scroll-mt-4 overflow-hidden rounded-2xl border border-border bg-card"
                >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setExpanded(isOpen ? null : rm.numero)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60"
              >
                <span className="flex h-9 min-w-12 shrink-0 items-center justify-center rounded-lg bg-primary px-2 text-xs font-bold text-primary-foreground">
                  RM {rm.numero}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">{rm.breve}</span>
                  <span className="block truncate text-xs text-muted-foreground">{rm.titolo}</span>
                </span>
                <ChevronDown
                  className={`size-5 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="border-t border-border px-4 py-4">
                  <p className="text-sm font-medium text-balance">{rm.titolo}</p>
                  <span className="mt-2 inline-block rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                    {RM_AREA_LABELS[rm.area]}
                  </span>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-muted/60 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Building2 className="size-3.5" aria-hidden="true" />
                        Livello Aziendale
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Recepimento e Governance
                      </p>
                      <p className="mt-2 text-sm">{rm.aziendale}</p>
                    </div>
                    <div className="rounded-xl border border-primary/25 bg-accent/40 p-3">
                      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Stethoscope className="size-3.5" aria-hidden="true" />
                        Livello Unità Operativa
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Attuazione e Operatività
                      </p>
                      <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                        {rm.unitaOperativa.map((u) => (
                          <li key={u} className="flex gap-2">
                            <span
                              className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                              aria-hidden="true"
                            />
                            {u}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
        {results.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            Nessuna raccomandazione corrisponde alla ricerca.
          </li>
        )}
      </ul>

      <p className="text-xs text-muted-foreground">
        Tabella proposta a titolo esemplificativo e metodologico: modello flessibile e adattabile
        da ogni Azienda Sanitaria e Unità Operativa.
      </p>
    </div>
  )
}
