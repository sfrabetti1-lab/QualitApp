'use client'

import { ArrowRight, ChevronRight, FileText, Layers, Target } from 'lucide-react'
import { RACCOMANDAZIONI, type MacroArea } from '@/lib/qualita-data'

export function MacroAreaDetail({
  area,
  onOpenRm,
}: {
  area: MacroArea
  onOpenRm: (n: number) => void
}) {
  const rms = RACCOMANDAZIONI.filter((r) => area.rmCollegate.includes(r.numero))

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl bg-accent/60 p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
          <Target className="size-3.5" aria-hidden="true" />
          Obiettivo di Governance
        </p>
        <p className="mt-1 font-semibold">{area.obiettivoGovernance}</p>
        <p className="mt-2 text-sm text-muted-foreground">{area.obiettivo}</p>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <FileText className="size-4 text-primary" aria-hidden="true" />
          Strumenti documentali chiave
        </h3>
        <ul className="grid gap-3 sm:grid-cols-2">
          {area.documenti.map((d) => (
            <li key={d.titolo} className="flex flex-col gap-2 rounded-2xl border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold leading-snug">{d.titolo}</h4>
                <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {d.strumento}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{d.descrizione}</p>
              <p className="mt-auto flex items-start gap-1.5 rounded-lg bg-accent/50 px-2.5 py-1.5 text-xs text-accent-foreground">
                <ArrowRight className="mt-0.5 size-3 shrink-0" aria-hidden="true" />
                {d.focus}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {area.scomposizione && (
        <section>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Layers className="size-4 text-primary" aria-hidden="true" />
            Scomposizione gerarchica
          </h3>
          <ol className="flex flex-col gap-2">
            {area.scomposizione.map((s, i) => (
              <li
                key={s.livello}
                className="flex items-center gap-3 rounded-xl border border-border p-3"
                style={{ marginLeft: `${i * 0.75}rem` }}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm">
                  <strong>{s.livello}:</strong>{' '}
                  <span className="text-muted-foreground">{s.testo}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {rms.length > 0 && (
        <section>
          <h3 className="mb-3 text-sm font-semibold">Raccomandazioni Ministeriali collegate</h3>
          <ul className="flex flex-col gap-2">
            {rms.map((rm) => (
              <li key={rm.numero}>
                <button
                  type="button"
                  onClick={() => onOpenRm(rm.numero)}
                  className="group flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-left transition-colors hover:border-primary hover:bg-accent/40"
                >
                  <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                    RM {rm.numero}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm">{rm.titolo}</span>
                  <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
