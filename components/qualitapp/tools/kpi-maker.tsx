'use client'

import { useId, useState } from 'react'
import { Download, Info, Target, TrendingDown, TrendingUp, Calculator } from 'lucide-react'

type Direction = 'up' | 'down'
type Mode = 'points' | 'relative'
type Input = 'percent' | 'ratio'
type TipoIndicatore = 'struttura' | 'processo' | 'esito'

const PRESETS: { label: string; baseline: number; direction: Direction; tipo: TipoIndicatore }[] = [
  { label: 'Compilazione Surgical Safety Checklist', baseline: 72, direction: 'up', tipo: 'processo' },
  { label: 'Valutazione rischio lesioni da pressione entro 24h', baseline: 58, direction: 'up', tipo: 'processo' },
  { label: 'Tasso di infezioni del sito chirurgico (ISC)', baseline: 30, direction: 'down', tipo: 'esito' },
  { label: 'Presenza di defibrillatori operativi per postazione', baseline: 100, direction: 'up', tipo: 'struttura' },
]

const clamp = (n: number) => Math.min(100, Math.max(0, n))
const round = (n: number) => Math.round(n * 10) / 10

function nextTarget(value: number, direction: Direction, mode: Mode) {
  const delta = mode === 'points' ? 10 : value * 0.1
  return clamp(round(direction === 'up' ? value + delta : value - delta))
}

export function Calcolatore() {
  const id = useId()
  const [indicator, setIndicator] = useState('')
  const [tipo, setTipo] = useState<TipoIndicatore>('processo')
  const [macroArea, setMacroArea] = useState('Percorso Clinico-Assistenziale')
  const [input, setInput] = useState<Input>('percent')
  const [baselineStr, setBaselineStr] = useState('60')
  const [num, setNum] = useState('')
  const [den, setDen] = useState('')
  const [direction, setDirection] = useState<Direction>('up')
  const [mode, setMode] = useState<Mode>('points')

  let baseline: number | null = null
  let error: string | null = null

  if (input === 'percent') {
    const v = Number(baselineStr.replace(',', '.'))
    if (baselineStr.trim() === '' || Number.isNaN(v)) error = 'Inserisci un valore numerico valido.'
    else if (v < 0 || v > 100) error = 'La baseline percentuale deve essere compresa tra 0 e 100%.'
    else baseline = round(v)
  } else {
    const n = Number(num)
    const d = Number(den)
    if (num === '' || den === '') error = 'Inserisci sia il numeratore che il denominatore.'
    else if (!Number.isFinite(n) || !Number.isFinite(d) || n < 0 || d <= 0)
      error = 'Valori non validi: il denominatore deve essere maggiore di 0.'
    else if (n > d) error = 'Il numeratore non può superare il denominatore.'
    else baseline = round((n / d) * 100)
  }

  const target = baseline !== null ? nextTarget(baseline, direction, mode) : null
  const cycles: number[] = []
  if (baseline !== null) {
    let v = baseline
    for (let i = 0; i < 3; i++) {
      v = nextTarget(v, direction, mode)
      cycles.push(v)
    }
  }
  const utopian = target !== null && (target === 100 || target === 0)

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setIndicator(p.label)
    setInput('percent')
    setBaselineStr(String(p.baseline))
    setDirection(p.direction)
    setTipo(p.tipo)
  }

  const scaricaReport = () => {
    if (baseline === null || target === null) return

    const reportContent = `==================================================
 SCHEDA TECNICA KPI & REALISMO PROGRESSIVO
 (QualitApp - "Scrivere la Qualità in Sanità")
==================================================

1. ANAGRAFICA INDICATORE
- Nome Indicatore: ${indicator || 'Indicatore non specificato'}
- Macro-Area di Riferimento: ${macroArea}
- Tipologia: ${tipo.toUpperCase()} (${
      tipo === 'struttura' ? 'Risorse, spazi e dotazioni' :
      tipo === 'processo' ? 'Attività, tempistiche e aderenza procedurale' :
      'Esito clinico e cambiamento dello stato di salute'
    })

2. PARAMETRI MATEMATICI (BASELINE)
- Modalità di calcolo: ${input === 'percent' ? 'Valore percentuale diretto' : 'Rapporto Numeratore / Denominatore'}
- Baseline iniziale: ${baseline}%
${input === 'ratio' ? `- Dati grezzi: Numeratore (${num}) / Denominatore (${den})` : ''}

3. OBIETTIVO E TARGET (REALISMO PROGRESSIVO +10%)
- Direzione: ${direction === 'up' ? 'Aumentare la performance' : "Ridurre l'evento avverso"}
- Metodo di incremento: ${mode === 'points' ? '+10 punti percentuali' : '+10% relativo'}
- Target Sostenibile Calcolato: ${target}%

4. PROIEZIONE CICLI SUCCESSIVI DI MIGLIORAMENTO
- Ciclo 1: ${cycles[0]}%
- Ciclo 2: ${cycles[1]}%
- Ciclo 3: ${cycles[2]}%

--------------------------------------------------
Documento generato a memento per l'Unità Operativa.
Conforme ai principi di governance clinica e change management sostenibile.
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Scheda_KPI_${(indicator || 'indicatore').replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="flex gap-2 rounded-2xl bg-accent/60 p-4 text-sm text-accent-foreground">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>
          <strong>Il GPS Procedurale:</strong> gli indicatori misurano l&apos;aderenza agli standard. Il principio del <strong>Realismo Progressivo (+10%)</strong> evita target utopistici, rendendo il miglioramento sostenibile per l&apos;équipe[cite: 23, 24, 29].
        </span>
      </p>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Esempi rapidi da manuale
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-ind`} className="text-sm font-medium">
            Nome dell&apos;Indicatore
          </label>
          <input
            id={`${id}-ind`}
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            maxLength={120}
            placeholder="Es. % di corretta compilazione della Checklist"
            className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${id}-area`} className="text-sm font-medium">
            Macro-Area di Reparto
          </label>
          <select
            id={`${id}-area`}
            value={macroArea}
            onChange={(e) => setMacroArea(e.target.value)}
            className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
          >
            <option value="Governance e Organizzazione">Governance e Organizzazione</option>
            <option value="Percorso Clinico-Assistenziale">Percorso Clinico-Assistenziale</option>
            <option value="Gestione Farmaci e Magazzino">Gestione Farmaci e Magazzino</option>
            <option value="Sicurezza, Igiene e Rischio Clinico">Sicurezza, Igiene e Rischio Clinico</option>
            <option value="Manutenzione e Qualità">Manutenzione e Qualità</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">Tripartizione dell&apos;Indicatore (Classificazione)</span>
        <div role="radiogroup" aria-label="Tipologia indicatore" className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1">
          {(['struttura', 'processo', 'esito'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={tipo === t}
              onClick={() => setTipo(t)}
              className={`rounded-lg px-2 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                tipo === t
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground italic">
          {tipo === 'struttura' && 'Misura risorse, spazi, dotazioni e rapporti di personale.'}
          {tipo === 'processo' && 'Misura ciò che viene fatto e le tempistiche di aderenza procedurale[cite: 29].'}
          {tipo === 'esito' && 'Misura il cambiamento finale nello stato di salute o sicurezza del paziente[cite: 29].'}
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1.5 text-sm font-medium">Baseline iniziale (Stato attuale)</legend>
        <Segmented
          label="Modalità inserimento dati"
          value={input}
          onChange={setInput}
          options={[
            { value: 'percent', label: 'Valore % diretto' },
            { value: 'ratio', label: 'Casi / Totale (Numeratore / Denominatore)' },
          ]}
        />
        {input === 'percent' ? (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={Number(baselineStr) || 0}
              onChange={(e) => setBaselineStr(e.target.value)}
              aria-label="Baseline (cursore)"
              className="flex-1 accent-primary"
            />
            <div className="relative w-24">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.1}
                value={baselineStr}
                onChange={(e) => setBaselineStr(e.target.value)}
                aria-label="Baseline in percentuale"
                aria-invalid={!!error}
                className="w-full rounded-xl border border-input bg-card py-2.5 pl-3 pr-7 text-right text-sm tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-num`} className="text-xs text-muted-foreground">
                Casi conformi (Numeratore)
              </label>
              <input
                id={`${id}-num`}
                type="number"
                inputMode="numeric"
                min={0}
                value={num}
                onChange={(e) => setNum(e.target.value)}
                placeholder="Es. 36"
                className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor={`${id}-den`} className="text-xs text-muted-foreground">
                Casi totali (Denominatore)
              </label>
              <input
                id={`${id}-den`}
                type="number"
                inputMode="numeric"
                min={1}
                value={den}
                onChange={(e) => setDen(e.target.value)}
                placeholder="Es. 50"
                className="rounded-xl border border-input bg-card px-3 py-2.5 text-sm tabular-nums outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
        )}
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <Segmented
          label="Direzione dell'obiettivo"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'up', label: 'Aumentare performance' },
            { value: 'down', label: 'Ridurre evento avverso' },
          ]}
        />
        <Segmented
          label="Criterio Realismo Progressivo"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'points', label: '+10 punti %' },
            { value: 'relative', label: '+10% relativo' },
          ]}
        />
      </div>

      <section
        aria-live="polite"
        className="rounded-2xl bg-primary p-5 text-primary-foreground"
      >
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-80">
          <Target className="size-4" aria-hidden="true" />
          Target sostenibile {indicator && `· ${indicator}`}
        </p>
        <div className="mt-3 flex items-end gap-6">
          <div>
            <p className="text-xs opacity-75">Baseline</p>
            <p className="text-2xl font-semibold tabular-nums">
              {baseline !== null ? `${baseline}%` : '—'}
            </p>
          </div>
          {direction === 'up' ? (
            <TrendingUp className="mb-1.5 size-6 opacity-75" aria-hidden="true" />
          ) : (
            <TrendingDown className="mb-1.5 size-6 opacity-75" aria-hidden="true" />
          )}
          <div>
            <p className="text-xs opacity-75">Target (+10%)</p>
            <p className="text-4xl font-bold tabular-nums">{target !== null ? `${target}%` : '—'}</p>
          </div>
        </div>
        {baseline !== null && (
          <div className="mt-4">
            <p className="text-xs opacity-75">Proiezione a cicli successivi di miglioramento</p>
            <ol className="mt-2 grid grid-cols-3 gap-2">
              {cycles.map((c, i) => (
                <li key={i} className="rounded-xl bg-primary-foreground/10 px-3 py-2">
                  <span className="block text-[11px] opacity-75">Ciclo {i + 1}</span>
                  <span className="text-lg font-semibold tabular-nums">{c}%</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {target !== null && (
        <button
          type="button"
          onClick={scaricaReport}
          className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold shadow-sm hover:bg-accent transition-colors"
        >
          <Download className="size-4 text-primary" />
          Scarica Scheda Tecnica KPI (.txt)
        </button>
      )}

      {utopian && (
        <p className="rounded-2xl border border-warning/50 bg-warning/10 p-4 text-sm">
          Attenzione: il target raggiunge un valore assoluto ({target}%). Valuta se sia
          realisticamente sostenibile per l&apos;équipe ed evita obiettivi utopistici che generano
          demotivazione[cite: 23, 24].
        </p>
      )}
    </div>
  )
}

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            onClick={() => onChange(o.value)}
            className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              value === o.value
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}