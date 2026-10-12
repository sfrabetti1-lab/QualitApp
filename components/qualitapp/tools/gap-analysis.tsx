'use client'

import { useState } from 'react'
import { Modal } from '../modal'
import { ClipboardCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, AlertOctagon, Download } from 'lucide-react'

interface GapAnalysisModalProps {
  open: boolean
  onClose: () => void
}

export function GapAnalysisModal({ open, onClose }: GapAnalysisModalProps) {
  const [step, setStep] = useState(1)
  const [processName, setProcessName] = useState('')
  const [q1, setQ1] = useState<number>(1)
  const [q2, setQ2] = useState<number>(1)
  const [q3, setQ3] = useState<number>(1)
  const [notes, setNotes] = useState('')

  const totalScore = q1 + q2 + q3
  const percentage = Math.round((totalScore / 6) * 100)

  const handleClose = () => {
    setStep(1)
    setProcessName('')
    setQ1(1)
    setQ2(1)
    setQ3(1)
    setNotes('')
    onClose()
  }

  const scaricaReport = () => {
    const reportContent = `==================================================
 REPORT GAP ANALYSIS DI PROCESSO
 (QualitApp - Governance e Risk Management)
==================================================

PROCESSO / AMBITO ANALIZZATO:
${processName || 'Non specificato'}

DIMENSIONI VALUTATE (Punteggio 0-2 per area):
- 1. Risorse, Ruoli e Responsabilità: ${q1}/2
- 2. Procedurizzazione e Documentazione: ${q2}/2
- 3. Monitoraggio, Indicatori e Audit: ${q3}/2

INDICE DI CONFORMITÀ COMPLESSIVO:
- Punteggio Totale: ${totalScore} / 6 (${percentage}%)
- Stato: ${percentage >= 80 ? 'Conforme / Ottimale' : percentage >= 50 ? 'Gap Moderato' : 'Gap Critico'}

RACCOMANDAZIONE DI MIGLIORAMENTO:
${
  percentage >= 80
    ? 'Il processo è solido e ben strutturato. Mantenere attivi i controlli periodici e gli audit di monitoraggio.'
    : percentage >= 50
    ? "È necessario colmare i vuoti documentali e formalizzare le procedure operative standard per allineare l'attività agli standard di qualità."
    : 'Situazione critica: priorità assoluta alla definizione dei ruoli, alla stesura della documentazione formale e all’attivazione di barriere di controllo.'
}

${notes ? `NOTE DI CONTESTO:\n${notes}` : ''}

--------------------------------------------------
Documento generato a memento per l'Unità Operativa.
Conforme ai principi di "Scrivere la Qualità in Sanità".
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Report_GapAnalysis_${(processName || 'processo').replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Gap Analysis Avanzata di Processo"
      subtitle="Autovalutazione multidimensionale per la qualità e l'accreditamento"
      icon={ClipboardCheck}
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
              disabled={step === 1 && !processName.trim()}
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
              <h3 className="text-xl font-bold">Cosa desideri analizzare?</h3>
              <p className="text-sm text-muted-foreground">
                Specifica il contesto, il percorso clinico o il processo organizzativo oggetto dell'autovalutazione a 360°.
              </p>
            </div>
            <div className="pt-2">
              <label className="block text-sm font-medium mb-2">Titolo o Nome del Processo / Ambito:</label>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="Es. Gestione carrelli d'emergenza, PDTA Stroke, Accreditamento..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 2 di 4</span>
              <h3 className="text-xl font-bold">Organizzazione e Documentazione</h3>
              <p className="text-sm text-muted-foreground">Analisi per: <strong className="text-foreground">{processName}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">1. Risorse, Ruoli e Responsabilità:</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { val: 2, label: 'Definiti e formalizzati', desc: 'Ruoli chiari, referenti nominati e risorse adeguate.' },
                  { val: 1, label: 'Parziali / Informali', desc: 'Presenti in via di prassi ma senza assegnazioni formali.' },
                  { val: 0, label: 'Carenti / Assenti', desc: 'Vacanza di ruoli o totale assenza di assegnazione.' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setQ1(item.val)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      q1 === item.val ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-semibold">2. Procedurizzazione (Procedure, IO, Modulistica):</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { val: 2, label: 'Standard documentato', desc: 'Esistono procedure scritte, condivise e regolarmente aggiornate.' },
                  { val: 1, label: 'Documentazione parziale', desc: 'Bozze o documenti obsoleti / incompleti rispetto alla pratica.' },
                  { val: 0, label: 'Nessun documento', desc: 'Attività svolta senza alcuna traccia procedurale formale.' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setQ2(item.val)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      q2 === item.val ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 3 di 4</span>
              <h3 className="text-xl font-bold">Monitoraggio e Azioni</h3>
              <p className="text-sm text-muted-foreground">Verifica dei sistemi di controllo e audit interni.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">3. Monitoraggio, Indicatori e Audit:</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { val: 2, label: 'Attivo e strutturato', desc: 'Indicatori monitorati periodicamente e audit di verifica regolari.' },
                  { val: 1, label: 'Saltuario', desc: 'Controlli sporadici o legati solo alle emergenze.' },
                  { val: 0, label: 'Assente', desc: 'Nessuna attività di misurazione o verifica della qualità.' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setQ3(item.val)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      q3 === item.val ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium mb-1">Note e osservazioni di contesto (opzionale):</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Annotazioni su criticità specifiche..."
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 4 di 4</span>
              <h3 className="text-xl font-bold">Report di Conformità & Piano d'Azione</h3>
              <p className="text-sm text-muted-foreground">Risultato dell'autovalutazione per: <strong>{processName}</strong></p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/50 border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Indice di Conformità:</span>
                  <div className="text-2xl font-extrabold">{percentage}% <span className="text-xs font-normal text-muted-foreground">({totalScore}/6 punti)</span></div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  percentage >= 80 ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                  percentage >= 50 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                  'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                }`}>
                  {percentage >= 80 ? <CheckCircle2 className="size-4" /> : percentage >= 50 ? <AlertTriangle className="size-4" /> : <AlertOctagon className="size-4" />}
                  {percentage >= 80 ? 'Conforme / Ottimale' : percentage >= 50 ? 'Gap Moderato' : 'Gap Critico'}
                </div>
              </div>

              <div className="text-sm space-y-2">
                <p className="font-medium text-foreground">Raccomandazione di miglioramento:</p>
                <p className="text-muted-foreground">
                  {percentage >= 80
                    ? "Il processo è solido e ben strutturato. Mantenere attivi i controlli periodici e gli audit di monitoraggio."
                    : percentage >= 50
                    ? "È necessario colmare i vuoti documentali e formalizzare le procedure operative standard per allineare l'attività agli standard di qualità."
                    : "Situazione critica: priorità assoluta alla definizione dei ruoli, alla stesura della documentazione formale e all'attivazione di barriere di controllo."}
                </p>
                {notes && (
                  <div className="mt-2 text-xs bg-background p-3 rounded-xl border border-border">
                    <span className="font-semibold">Note registrate:</span> {notes}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}