'use client'

import { useEffect, useState } from 'react'
import {
  Calculator,
  ChevronRight,
  ClipboardCheck,
  GitFork,
  Landmark,
  Pill,
  ScrollText,
  Stethoscope,
  ShieldAlert,
  GitCommit,
  Users,
  ShieldCheck,
  FileText,
  Layers,
  DownloadCloud,
  type LucideIcon,
} from 'lucide-react'
import { MACRO_AREE, type MacroArea } from '@/lib/qualita-data'
import { DashboardHeader } from './dashboard-header'
import { Modal } from './modal'
import { BivioDecisionale } from './tools/bivio-decisionale'
import { ChecklistRedazione } from './tools/checklist-redazione'
import { Raccomandazioni } from './tools/raccomandazioni'
import { Calcolatore } from './tools/kpi-maker'
import { FlowchartMaker } from './tools/flowchart-maker'
import { MacroAreaDetail } from './tools/macro-area-detail'
import { GapAnalysisModal } from './tools/gap-analysis'
import { FmeaModal } from './tools/fmea'
import { RootCauseModal } from './tools/root-cause'
import { RaciModal } from './tools/raci-matrix'
import { RiskRegisterModal } from './tools/risk-register'

type ToolId = 'bivio' | 'checklist' | 'rm' | 'calcolatore' | 'flowchart' | 'gap' | 'fmea' | 'rca' | 'raci' | 'risk'
type Active = { kind: 'tool'; id: ToolId } | { kind: 'area'; id: MacroArea['id'] } | null

const RISK_TOOLS: { id: ToolId; title: string; subtitle: string; icon: LucideIcon }[] = [
  {
    id: 'gap',
    title: 'Gap Analysis',
    subtitle: 'Autovalutazione processi a 360°',
    icon: ClipboardCheck,
  },
  {
    id: 'fmea',
    title: 'FMEA Sanitaria',
    subtitle: 'Analisi dei rischi e indice IPR',
    icon: ShieldAlert,
  },
  {
    id: 'rca',
    title: 'Root Cause Analysis',
    subtitle: 'Analisi cause radice (5 Whys)',
    icon: GitCommit,
  },
  {
    id: 'raci',
    title: 'Matrice RACI',
    subtitle: 'Definizione ruoli e responsabilità',
    icon: Users,
  },
  {
    id: 'risk',
    title: 'Registro Rischi',
    subtitle: 'Cruscotto monitoraggio criticità',
    icon: ShieldCheck,
  },
]

const DOC_TOOLS: { id: ToolId; title: string; subtitle: string; icon: LucideIcon }[] = [
  { id: 'bivio', title: 'Bivio Decisionale', subtitle: 'Algoritmo scelta documentale', icon: GitFork },
  {
    id: 'checklist',
    title: 'Checklist Redazione',
    subtitle: 'Autovalutazione Reality Check',
    icon: ClipboardCheck,
  },
  { id: 'rm', title: 'Raccomandazioni Ministeriali', subtitle: 'Repertorio Ministeriale', icon: ScrollText },
  {
    id: 'calcolatore',
    title: 'KPI Maker & Realismo',
    subtitle: 'Target e indicatori di qualità',
    icon: Calculator,
  },
  {
    id: 'flowchart',
    title: 'Flowchart Maker',
    subtitle: 'Generatore di flussi procedurali',
    icon: GitFork,
  },
]

const AREA_ICONS: Record<MacroArea['id'], LucideIcon> = {
  governance: Landmark,
  clinico: Stethoscope,
  farmaci: Pill,
}

export function DashboardHome() {
  const [active, setActive] = useState<Active>(null)
  const [focusRm, setFocusRm] = useState<number | null>(null)

  useEffect(() => {
    document.documentElement.style.overflow = active ? 'hidden' : ''
  }, [active])

  const isTool = (id: ToolId) => active?.kind === 'tool' && active.id === id
  const closeTool = (id: ToolId) =>
    setActive((cur) => (cur?.kind === 'tool' && cur.id === id ? null : cur))
  const closeArea = (id: MacroArea['id']) =>
    setActive((cur) => (cur?.kind === 'area' && cur.id === id ? null : cur))

  const openRm = (n: number | null) => {
    setFocusRm(n)
    setActive({ kind: 'tool', id: 'rm' })
  }

  return (
    <div className="min-h-dvh bg-background">
      <DashboardHeader />

      <main className="relative mx-auto -mt-6 flex max-w-5xl flex-col gap-10 px-5 pb-16 sm:px-8">
        
        {/* Sezione di Benvenuto / Landing Page */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                Governance Clinica e Risk Management
              </span>
              <span className="inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full">
                <DownloadCloud className="size-3.5 text-primary" />
                Report scaricabili a memento
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              QualitApp
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Infrastruttura digitale di supporto metodologico e organizzativo per i professionisti della sanità, dedicata alla governance clinica, alla gestione strutturata del rischio e al governo dei percorsi assistenziali.
            </p>
          </div>
        </section>

        {/* Categoria 1: Risk Management & Analisi Avanzata */}
        <section aria-labelledby="risk-tools">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldAlert className="size-4" />
            </span>
            <h2 id="risk-tools" className="text-lg font-semibold">
              Risk Management & Analisi di Processo
            </h2>
          </div>
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {RISK_TOOLS.map((tool) => (
                <li key={tool.id}>
                  <button
                    type="button"
                    onClick={() => setActive({ kind: 'tool', id: tool.id })}
                    className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <tool.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 max-w-full">
                      <span className="block font-semibold leading-tight">{tool.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                        {tool.subtitle}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Categoria 2: Supporto alla Stesura Documentale */}
        <section aria-labelledby="doc-tools">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-4" />
            </span>
            <h2 id="doc-tools" className="text-lg font-semibold">
              Governance & Semplificazione Documentale
            </h2>
          </div>
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {DOC_TOOLS.map((tool) => (
                <li key={tool.id}>
                  <button
                    type="button"
                    onClick={() =>
                      tool.id === 'rm' ? openRm(null) : setActive({ kind: 'tool', id: tool.id })
                    }
                    className="group flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-5"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <tool.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 max-w-full">
                      <span className="block font-semibold leading-tight">{tool.title}</span>
                      <span className="mt-1 block text-xs text-muted-foreground sm:text-sm">
                        {tool.subtitle}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Categoria 3: Macro-Aree come Base di Partenza */}
        <section aria-labelledby="macro-aree">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </span>
            <div>
              <h2 id="macro-aree" className="text-lg font-semibold">
                Macro-Aree di Reparto (Base di Partenza)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Repertorio flessibile e adattabile per ogni struttura o unità operativa.
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MACRO_AREE.map((area) => {
              const Icon = AREA_ICONS[area.id]
              return (
                <li key={area.id}>
                  <button
                    type="button"
                    onClick={() => setActive({ kind: 'area', id: area.id })}
                    className="group flex h-full w-full flex-col items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-base">{area.titolo}</span>
                      <span className="mt-1 block text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {area.sottotitolo}
                      </span>
                    </span>
                    <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:underline">
                      Esplora area <ChevronRight className="size-3.5" />
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Footer completo con Copyright, Marchio UIBM, Disclaimer e Contatti */}
        <footer className="border-t border-border pt-6 pb-8 text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <p>&copy; 2026 Simone Frabetti. Tutti i diritti riservati.</p>
            <p className="text-xs font-semibold text-foreground/80">
              QualitApp™ &mdash; Marchio Depositato UIBM n. 302026000175252
            </p>
          </div>
          
          <p className="mt-2 text-xs">
            Contenuti e metodologia tratti da <em>&ldquo;Scrivere la Qualità in Sanità&rdquo;</em> di{' '}
            <span className="font-medium text-foreground">Simone Frabetti</span>.
          </p>

          {/* Nota di Proprietà Intellettuale */}
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
            <strong>Proprietà Intellettuale:</strong> Il nome, il logo e la veste grafica di QualitApp sono oggetto di domanda di registrazione per marchio d&apos;impresa depositata presso il Ministero delle Imprese e del Made in Italy &ndash; UIBM (Domanda N. 302026000175252 del 12/10/2026). È vietata la riproduzione non autorizzata.
          </p>

          {/* Disclaimer Operativo */}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
            <strong>Disclaimer:</strong> QualitApp è una suite digitale di supporto metodologico e organizzativo per la qualità assistenziale. 
            L&apos;applicazione pratica dei protocolli e dei documenti all&apos;interno delle singole strutture sanitarie rimane di esclusiva responsabilità delle Direzioni e dei professionisti competenti.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4 text-xs">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <a href="mailto:sfrabetti1@gmail.com" className="text-primary hover:underline">
                sfrabetti1@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/simone-frabetti"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                LinkedIn
              </a>
            </div>
            <span className="text-muted-foreground/60">
              www.qualitapp.it
            </span>
          </div>
        </footer>
      </main>

      {/* Modali */}
      <Modal
        open={isTool('bivio')}
        onClose={() => closeTool('bivio')}
        title="Bivio Decisionale"
        subtitle="Quale strumento documentale redigere?"
        icon={GitFork}
      >
        <BivioDecisionale />
      </Modal>

      <Modal
        open={isTool('checklist')}
        onClose={() => closeTool('checklist')}
        title="Checklist di Redazione"
        subtitle="Reality Check prima della sottomissione alla Direzione"
        icon={ClipboardCheck}
      >
        <ChecklistRedazione />
      </Modal>

      <Modal
        open={isTool('rm')}
        onClose={() => closeTool('rm')}
        title="Raccomandazioni Ministeriali"
        subtitle="Mappatura Livello Aziendale e Unità Operativa"
        icon={ScrollText}
        size="lg"
      >
        <Raccomandazioni key={focusRm ?? 'all'} focusRm={focusRm} />
      </Modal>

      <Modal
        open={isTool('calcolatore')}
        onClose={() => closeTool('calcolatore')}
        title="KPI Maker & Realismo Progressivo"
        subtitle="Definizione indicatori e calcolo target sostenibile"
        icon={Calculator}
      >
        <Calcolatore />
      </Modal>

      <Modal
        open={isTool('flowchart')}
        onClose={() => closeTool('flowchart')}
        title="Flowchart Maker"
        subtitle="Generatore di diagrammi di flusso per procedure e istruzioni operative"
        icon={GitFork}
        size="lg"
      >
        <FlowchartMaker />
      </Modal>

      {isTool('gap') && (
        <GapAnalysisModal open={isTool('gap')} onClose={() => closeTool('gap')} />
      )}

      {isTool('fmea') && (
        <FmeaModal open={isTool('fmea')} onClose={() => closeTool('fmea')} />
      )}

      {isTool('rca') && (
        <RootCauseModal open={isTool('rca')} onClose={() => closeTool('rca')} />
      )}

      {isTool('raci') && (
        <RaciModal open={isTool('raci')} onClose={() => closeTool('raci')} />
      )}

      {isTool('risk') && (
        <RiskRegisterModal open={isTool('risk')} onClose={() => closeTool('risk')} />
      )}

      {MACRO_AREE.map((area) => (
        <Modal
          key={area.id}
          open={active?.kind === 'area' && active.id === area.id}
          onClose={() => closeArea(area.id)}
          title={area.titolo}
          subtitle="Documentazione necessaria nell'Unità Operativa"
          icon={AREA_ICONS[area.id]}
          size="lg"
        >
          <MacroAreaDetail area={area} onOpenRm={(n) => openRm(n)} />
        </Modal>
      ))}
    </div>
  )
}