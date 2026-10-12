'use client'

import { useState } from 'react'
import { Modal } from '../modal'
import { GitCommit, ArrowRight, ArrowLeft, Download } from 'lucide-react'

interface RootCauseModalProps {
  open: boolean
  onClose: () => void
}

export function RootCauseModal({ open, onClose }: RootCauseModalProps) {
  const [step, setStep] = useState(1)
  const [problem, setProblem] = useState('')
  const [category, setCategory] = useState('Fattore Organizzativo / Procedurale')
  const [why1, setWhy1] = useState('')
  const [why2, setWhy2] = useState('')
  const [why3, setWhy3] = useState('')
  const [why4, setWhy4] = useState('')
  const [why5, setWhy5] = useState('')
  const [correctiveAction, setCorrectiveAction] = useState('')

  const handleClose = () => {
    setStep(1)
    setProblem('')
    setCategory('Fattore Organizzativo / Procedurale')
    setWhy1('')
    setWhy2('')
    setWhy3('')
    setWhy4('')
    setWhy5('')
    setCorrectiveAction('')
    onClose()
  }

  const scaricaReport = () => {
    const reportContent = `==================================================
 REPORT ROOT CAUSE ANALYSIS (5 WHYS)
 (QualitApp - Governance e Risk Management)
==================================================

CATEGORIA EVENTO:
${category}

PROBLEMA INIZIALE:
${problem || 'Non specificato'}

CATENA CAUSALE (5 PERCHÉ):
- Perché 1: ${why1 || 'N/D'}
- Perché 2: ${why2 || 'N/D'}
- Perché 3: ${why3 || 'N/D'}
- Perché 4: ${why4 || 'N/D'}
- Perché 5 (Causa Radice Sistemica): ${why5 || 'N/D'}

AZIONE CORRETTIVA PRIORITARIA:
${correctiveAction || 'Non definita'}

--------------------------------------------------
Documento generato a memento per l'Unità Operativa.
Conforme ai principi di "Scrivere la Qualità in Sanità".
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Report_RCA_${(category || 'analisi').replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Root Cause Analysis Avanzata (5 Whys)"
      subtitle="Analisi approfondita delle cause radice per la prevenzione sistemica degli eventi"
      icon={GitCommit}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-border bg-background hover:bg-muted transition-colors"
            >
              <ArrowLeft className="size-4" /> Indietro
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              type="button"
              disabled={(step === 1 && !problem.trim()) || (step === 2 && !why1.trim())}
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Avanti <ArrowRight className="size-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scaricaReport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-accent transition-colors"
              >
                <Download className="size-4 text-primary" /> Scarica Report (.txt)
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Termina e Chiudi
              </button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 1 di 4</span>
              <h3 className="text-xl font-bold">Definizione dell'Evento o Non Conformità</h3>
              <p className="text-sm text-muted-foreground">
                Descrivi l'effetto visibile dell'evento avverso o del near miss, focalizzandoti sui fatti oggettivi.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Descrizione dettagliata del problema:</label>
                <textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  rows={3}
                  placeholder="Es. Disallineamento nella somministrazione della terapia farmacologica in reparto durante il turno festivo..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Categoria preliminare di riferimento:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Fattore Organizzativo / Procedurale">Fattore Organizzativo / Procedurale (Flussi, Procedure)</option>
                  <option value="Fattore Umano / Competenze">Fattore Umano / Competenze (Formazione, Carico di lavoro)</option>
                  <option value="Fattore Tecnologico / Strumentale">Fattore Tecnologico / Strumentale (Dispositivi, SW)</option>
                  <option value="Fattore Ambientale / Logistico">Fattore Ambientale / Logistico (Spazi, Comunicazione)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 2 di 4</span>
              <h3 className="text-xl font-bold">La Catena Causale (Fase 1: Dai sintomi alle cause dirette)</h3>
              <p className="text-sm text-muted-foreground">
                Partiamo dal problema: <strong className="text-foreground">{problem}</strong>
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">1. Perché è accaduto l'evento?</label>
                <input
                  type="text"
                  value={why1}
                  onChange={(e) => setWhy1(e.target.value)}
                  placeholder="Es. La prescrizione non risultava tracciata nel registro di reparto..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">2. Perché non era tracciata?</label>
                <input
                  type="text"
                  value={why2}
                  onChange={(e) => setWhy2(e.target.value)}
                  placeholder="Es. Il passaggio consegne tra il turno precedente non ha evidenziato la variazione..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 3 di 4</span>
              <h3 className="text-xl font-bold">La Catena Causale (Fase 2: Verso la Causa Radice)</h3>
              <p className="text-sm text-muted-foreground">Scendiamo in profondità nei processi organizzativi.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">3. Perché il passaggio consegne non l'ha evidenziato?</label>
                <input
                  type="text"
                  value={why3}
                  onChange={(e) => setWhy3(e.target.value)}
                  placeholder="Es. Mancava uno schema standardizzato e condiviso per il briefing di reparto..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-muted-foreground mb-1">4. Perché mancava uno schema standardizzato?</label>
                <input
                  type="text"
                  value={why4}
                  onChange={(e) => setWhy4(e.target.value)}
                  placeholder="Es. L'Istruzione Operativa interna non è stata aggiornata dopo la riorganizzazione..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-primary mb-1">5. Perché non è stata aggiornata? (Causa Radice Sistemica)</label>
                <input
                  type="text"
                  value={why5}
                  onChange={(e) => setWhy5(e.target.value)}
                  placeholder="Es. Non è previsto un flusso periodico di revisione documentale guidato dal referente di qualità..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 4 di 4</span>
              <h3 className="text-xl font-bold">Report RCA & Azione Correttiva Sistemica</h3>
              <p className="text-sm text-muted-foreground">Sintesi dell'indagine condotta per: <strong>{category}</strong></p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/50 border border-border space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Problema iniziale:</span>
                <p className="text-sm font-medium text-foreground">{problem}</p>
              </div>

              <div className="space-y-1 border-t border-border pt-3">
                <span className="text-xs font-semibold uppercase text-primary">Causa Radice Individuata (5° Perché):</span>
                <p className="text-sm font-semibold text-foreground bg-primary/5 p-3 rounded-xl border border-primary/20">
                  {why5 || why4 || why3 || "Analisi approfondita completata."}
                </p>
              </div>

              <div className="space-y-2 border-t border-border pt-3">
                <label className="block text-sm font-medium text-foreground">Definisci l'azione correttiva prioritaria:</label>
                <textarea
                  value={correctiveAction}
                  onChange={(e) => setCorrectiveAction(e.target.value)}
                  rows={2}
                  placeholder="Es. Revisione e formalizzazione immediata della procedura di passaggio consegne e istituzione di un audit trimestrale..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}