'use client'

import { useState } from 'react'
import { Modal } from '../modal'
import { ShieldAlert, ArrowRight, ArrowLeft, AlertOctagon, AlertTriangle, CheckCircle2, Download } from 'lucide-react'

interface FmeaModalProps {
  open: boolean
  onClose: () => void
}

export function FmeaModal({ open, onClose }: FmeaModalProps) {
  const [step, setStep] = useState(1)
  const [processName, setProcessName] = useState('')
  const [failureMode, setFailureMode] = useState('')
  const [severity, setSeverity] = useState<number>(2)
  const [probability, setProbability] = useState<number>(2)
  const [detectability, setDetectability] = useState<number>(2)

  const ipr = severity * probability * detectability

  const handleClose = () => {
    setStep(1)
    setProcessName('')
    setFailureMode('')
    setSeverity(2)
    setProbability(2)
    setDetectability(2)
    onClose()
  }

  const scaricaReport = () => {
    const reportContent = `==================================================
 REPORT FMEA SANITARIA DI PROCESSO
 (QualitApp - Governance e Risk Management)
==================================================

PROCESSO ESAMINATO:
${processName || 'Non specificato'}

MODO DI GUASTO / ERRORE POTENZIALE:
${failureMode || 'Non specificato'}

PARAMETRI DI VALUTAZIONE (Scala 1-3):
- Severità (S): ${severity}
- Probabilità (P): ${probability}
- Rilevabilità (D): ${detectability}

INDICE DI PRIORITÀ DI RISCHIO (IPR = S x P x D):
- Valore IPR: ${ipr} / 27
- Livello di Rischio: ${ipr >= 12 ? 'Rischio Alto' : ipr >= 6 ? 'Rischio Moderato' : 'Rischio Controllato'}

BARRIERE DI SICUREZZA RACCOMANDATE:
${
  ipr >= 12
    ? 'Richiesto intervento urgente: introdurre barriere tecnologiche o doppie firme obbligatorie, formalizzando immediatamente una nuova Procedura di reparto.'
    : ipr >= 6
    ? "Si consiglia di inserire un momento di controllo aggiuntivo (check intermedio) e aggiornare l'Istruzione Operativa di riferimento."
    : 'Il processo presenta barriere adeguate. Mantenere la sorveglianza periodica e la formazione del personale.'
}

--------------------------------------------------
Documento generato a memento per l'Unità Operativa.
Conforme ai principi di "Scrivere la Qualità in Sanità".
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Report_FMEA_${(processName || 'processo').replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="FMEA Sanitaria di Processo"
      subtitle="Analisi dei modi e degli effetti del guasto per la prevenzione del rischio clinico"
      icon={ShieldAlert}
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
              disabled={(step === 1 && (!processName.trim() || !failureMode.trim()))}
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
              <h3 className="text-xl font-bold">Definizione del processo critico</h3>
              <p className="text-sm text-muted-foreground">
                Specifica quale attività o procedura intendi analizzare a 360 gradi e quale potenziale criticità o errore potresti riscontrare.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Processo o Attività esaminata:</label>
                <input
                  type="text"
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  placeholder="Es. Somministrazione terapia oncologica, Passaggio consegne..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Potenziale modo di guasto / Errore:</label>
                <input
                  type="text"
                  value={failureMode}
                  onChange={(e) => setFailureMode(e.target.value)}
                  placeholder="Es. Scambio di farmaco tra due pazienti, Omissione di controllo..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 2 di 4</span>
              <h3 className="text-xl font-bold">Severità e Probabilità</h3>
              <p className="text-sm text-muted-foreground">Valuta l'impatto clinico e la frequenza stimata dell'evento.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold">Severità (S) - Impatto sul paziente:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 1, label: 'Lieve / Basso', desc: 'Danno minimo o nullo' },
                  { val: 2, label: 'Moderato', desc: 'Danno temporaneo' },
                  { val: 3, label: 'Critico / Grave', desc: 'Danno permanente o fatale' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setSeverity(item.val)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      severity === item.val ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="block text-sm font-semibold">Probabilità (P) - Frequenza di accadimento:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 1, label: 'Raro', desc: 'Molto infrequente' },
                  { val: 2, label: 'Possibile', desc: 'Occasionale' },
                  { val: 3, label: 'Frequente', desc: 'Accade regolarmente' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setProbability(item.val)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      probability === item.val ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                    }`}
                  >
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</div>
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
              <h3 className="text-xl font-bold">Rilevabilità dell'errore</h3>
              <p className="text-sm text-muted-foreground">Quanto è difficile accorgersi dell'errore prima che colpisca il paziente?</p>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-3">
                {[
                  { val: 1, label: 'Facilmente rilevabile', desc: 'I controlli attuali intercettano quasi sempre l’errore in tempo.' },
                  { val: 2, label: 'Moderatamente rilevabile', desc: 'I controlli possono intercettare l’errore solo in parte.' },
                  { val: 3, label: 'Difficilmente rilevabile / Invisibile', desc: 'L’errore passa inosservato fino al verificarsi dell’evento avverso.' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDetectability(item.val)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      detectability === item.val ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
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

        {step === 4 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 4 di 4</span>
              <h3 className="text-xl font-bold">Matrice di Rischio e Raccomandazioni</h3>
              <p className="text-sm text-muted-foreground">Analisi per: <strong>{processName}</strong></p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/50 border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Indice di Priorità (IPR):</span>
                  <div className="text-2xl font-extrabold">{ipr} <span className="text-xs font-normal text-muted-foreground">(su 27 max)</span></div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                  ipr >= 12 ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                  ipr >= 6 ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                  'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                }`}>
                  {ipr >= 12 ? <AlertOctagon className="size-4" /> : ipr >= 6 ? <AlertTriangle className="size-4" /> : <CheckCircle2 className="size-4" />}
                  {ipr >= 12 ? 'Rischio Alto' : ipr >= 6 ? 'Rischio Moderato' : 'Rischio Controllato'}
                </div>
              </div>

              <div className="text-sm space-y-2">
                <p className="font-medium text-foreground">Barriere di sicurezza raccomandate:</p>
                <p className="text-muted-foreground">
                  {ipr >= 12
                    ? "Richiesto intervento urgente: introdurre barriere tecnologiche o doppie firme obbligatorie, formalizzando immediatamente una nuova Procedura di reparto."
                    : ipr >= 6
                    ? "Si consiglia di inserire un momento di controllo aggiuntivo (check intermedio) e aggiornare l'Istruzione Operativa di riferimento."
                    : "Il processo presenta barriere adeguate. Mantenere la sorveglianza periodica e la formazione del personale."}
                </p>
                <div className="mt-2 text-xs bg-background p-3 rounded-xl border border-border">
                  <span className="font-semibold">Criticità analizzata:</span> {failureMode}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}