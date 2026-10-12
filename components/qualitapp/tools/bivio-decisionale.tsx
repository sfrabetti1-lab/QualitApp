'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  Lightbulb,
  RotateCcw,
} from 'lucide-react'
import {
  BIVIO_LEVELS,
  DOC_TYPES,
  REDAZIONE_TIPS,
  type BivioLevel,
  type DocType,
} from '@/lib/qualita-data'

interface Answers {
  l1?: 'piu' | 'una'
  l2?: 'chi' | 'come'
  l3?: 'si' | 'no'
}

type View = 'guida' | 'tassonomia'

function resolve(answers: Answers): { primary: DocType; modulo: boolean } | null {
  if (answers.l1 === 'piu') return { primary: 'PDTA', modulo: false }
  if (answers.l1 === 'una' && answers.l2 && answers.l3) {
    return { primary: answers.l2 === 'chi' ? 'PROCEDURA' : 'IO', modulo: answers.l3 === 'si' }
  }
  return null
}

function currentLevel(answers: Answers): 1 | 2 | 3 | null {
  if (!answers.l1) return 1
  if (answers.l1 === 'piu') return null
  if (!answers.l2) return 2
  if (!answers.l3) return 3
  return null
}

export function BivioDecisionale() {
  const [view, setView] = useState<View>('guida')
  const [answers, setAnswers] = useState<Answers>({})

  const level = currentLevel(answers)
  const result = resolve(answers)

  const choose = (lvl: 1 | 2 | 3, value: string) => {
    setAnswers((prev) => ({ ...prev, [`l${lvl}`]: value }))
  }

  const back = () => {
    setAnswers((prev) => {
      if (prev.l3) return { l1: prev.l1, l2: prev.l2 }
      if (prev.l2) return { l1: prev.l1 }
      return {}
    })
  }

  const reset = () => setAnswers({})

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" aria-label="Sezioni" className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {(['guida', 'tassonomia'] as const).map((v) => (
          <button
            key={v}
            role="tab"
            type="button"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              view === v
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {v === 'guida' ? 'Algoritmo guidato' : 'Tassonomia dei 4 standard'}
          </button>
        ))}
      </div>

      {view === 'tassonomia' ? (
        <Tassonomia />
      ) : (
        <>
          <Stepper answers={answers} done={!!result} />

          {level && (
            <LevelStep
              key={level}
              data={BIVIO_LEVELS[level]}
              onChoose={(value) => choose(level, value)}
            />
          )}

          {result && <Result primary={result.primary} modulo={result.modulo} answers={answers} />}

          {(answers.l1 || result) && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={back}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                Indietro
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-accent"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                Ricomincia
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Stepper({ answers, done }: { answers: Answers; done: boolean }) {
  const steps = [
    { n: 1, label: 'Scopo', complete: !!answers.l1 },
    { n: 2, label: 'Dubbio', complete: !!answers.l2, skipped: answers.l1 === 'piu' },
    { n: 3, label: 'Traccia', complete: !!answers.l3, skipped: answers.l1 === 'piu' },
  ]
  return (
    <ol className="flex items-center gap-2" aria-label="Avanzamento">
      {steps.map((s, i) => (
        <li key={s.n} className="flex flex-1 items-center gap-2">
          <span
            className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
              s.complete
                ? 'bg-primary text-primary-foreground'
                : s.skipped
                  ? 'bg-muted text-muted-foreground line-through'
                  : 'border border-primary/40 text-primary'
            }`}
          >
            {s.n}
          </span>
          <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
          {i < steps.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden="true" />}
        </li>
      ))}
      <li className="sr-only">{done ? 'Percorso completato' : 'In corso'}</li>
    </ol>
  )
}

function LevelStep({ data, onChoose }: { data: BivioLevel; onChoose: (v: string) => void }) {
  return (
    <section className="animate-in fade-in slide-in-from-right-4 duration-300">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">
        Livello {data.livello} · {data.titolo}
      </p>
      <h3 className="mt-1 text-xl font-semibold text-balance">{data.domanda}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {data.options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChoose(opt.id)}
            className="group flex flex-col items-start gap-2 rounded-2xl border border-border bg-card p-4 text-left transition-all hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring"
          >
            <span className="flex w-full items-center justify-between">
              <span className="font-semibold">{opt.label}</span>
              <ChevronRight
                className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden="true"
              />
            </span>
            <span className="text-sm text-muted-foreground">{opt.descrizione}</span>
            <span className="rounded-lg bg-muted px-2.5 py-1.5 text-xs italic text-muted-foreground">
              Es. {opt.esempio}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function Result({
  primary,
  modulo,
  answers,
}: {
  primary: DocType
  modulo: boolean
  answers: Answers
}) {
  const info = DOC_TYPES[primary]
  const recap = [
    answers.l1 && BIVIO_LEVELS[1].options.find((o) => o.id === answers.l1)?.label,
    answers.l2 && BIVIO_LEVELS[2].options.find((o) => o.id === answers.l2)?.label,
    answers.l3 && `Traccia: ${BIVIO_LEVELS[3].options.find((o) => o.id === answers.l3)?.label}`,
  ].filter(Boolean) as string[]

  return (
    <section
      aria-live="polite"
      className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300"
    >
      <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
          <CheckCircle2 className="size-4" aria-hidden="true" />
          Strumento consigliato
        </p>
        <p className="mt-2 text-2xl font-bold">
          {primary === 'PDTA'
            ? 'SERVE UN PDTA'
            : primary === 'PROCEDURA'
              ? 'SERVE UNA PROCEDURA'
              : "SERVE UN'ISTRUZIONE OPERATIVA"}
          {modulo && ' + MODULO'}
        </p>
        <p className="mt-1 text-sm opacity-90">
          {primary === 'PDTA'
            ? 'Mappa integrata del viaggio del paziente'
            : primary === 'PROCEDURA'
              ? 'Definisce flussi e responsabilità'
              : 'Il "manuale d\'uso" della prestazione'}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Percorso scelto">
          {recap.map((r) => (
            <li key={r} className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs">
              {r}
            </li>
          ))}
        </ul>
      </div>

      <DocCard type={primary} />

      {modulo ? (
        <>
          <div className="flex gap-3 rounded-2xl border border-warning/50 bg-warning/10 p-4 text-sm">
            <FileCheck2 className="size-5 shrink-0 text-foreground" aria-hidden="true" />
            <p>
              <strong>SERVE UN MODULO:</strong> registrazione dell&apos;azione. Deve essere sempre
              &quot;figlio&quot; della {info.nome} che ne disciplina compilazione e archiviazione —
              preferibilmente con autocompilazione guidata (check-list).
            </p>
          </div>
          <DocCard type="MODULO" />
        </>
      ) : (
        primary !== 'PDTA' && (
          <p className="rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">NON SERVE UN MODULO:</strong> attenersi alla{' '}
            {info.nome} esistente.
          </p>
        )
      )}
    </section>
  )
}

function DocCard({ type }: { type: DocType }) {
  const info = DOC_TYPES[type]
  return (
    <article className="rounded-2xl border border-border p-4">
      <header className="flex items-center gap-2">
        <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-primary">
          {info.sigla}
        </span>
        <h4 className="font-semibold">{info.nome}</h4>
      </header>
      <ul className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
        {info.definizione.map((d) => (
          <li key={d} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            {d}
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        <span className="font-medium">Quesito guida: </span>
        <span className="italic text-muted-foreground">&ldquo;{info.quesito}&rdquo;</span>
      </p>
      <p className="mt-1 text-sm">
        <span className="font-medium">Esempio: </span>
        {info.esempio} <span className="text-muted-foreground">({info.esempioDettaglio})</span>
      </p>
      <details className="group mt-3 rounded-xl bg-muted/60 p-3 text-sm">
        <summary className="flex cursor-pointer list-none items-center gap-2 font-medium text-primary">
          <Lightbulb className="size-4" aria-hidden="true" />
          Come redigerlo
          <ChevronRight
            className="ml-auto size-4 transition-transform group-open:rotate-90"
            aria-hidden="true"
          />
        </summary>
        <ul className="mt-2 flex flex-col gap-1.5 text-muted-foreground">
          {REDAZIONE_TIPS[type].map((t) => (
            <li key={t} className="flex gap-2">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </details>
    </article>
  )
}

function Tassonomia() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Quattro livelli gerarchici, distinti per finalità organizzativa e perimetro di
        applicazione.
      </p>
      {(['PDTA', 'PROCEDURA', 'IO', 'MODULO'] as const).map((t) => (
        <DocCard key={t} type={t} />
      ))}
    </div>
  )
}
