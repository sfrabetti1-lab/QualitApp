'use client'

import { useState } from 'react'
import { Modal } from '../modal'
import { ShieldCheck, ArrowRight, ArrowLeft, AlertTriangle, Download } from 'lucide-react'

interface RiskRegisterModalProps {
  open: boolean
  onClose: () => void
}

export function RiskRegisterModal({ open, onClose }: RiskRegisterModalProps) {
  const [step, setStep] = useState(1)
  const [riskDescription, setRiskDescription] = useState('')
  const [impactArea, setImpactArea] = useState('Sicurezza del Paziente')
  const [status, setStatus] = useState<'Aperto' | 'In gestione' | 'Monitorato'>('Aperto')

  const handleClose = () => {
    setStep(1)
    setRiskDescription('')
    setImpactArea('Sicurezza del Paziente')
    setStatus('Aperto')
    onClose()
  }

  const scaricaReport = () => {
    const reportContent = `==================================================
 SCHEDA CENSIMENTO REGISTRO RISCHI
 (QualitApp - Governance e Risk Management)
==================================================

AMBITO DI IMPATTO:
${impactArea}

STATO ATTUALE:
${status}

DESCRIZIONE DELLA CRITICITÀ / RISCHIO:
${riskDescription || 'Non specificato'}

--------------------------------------------------
Documento generato a memento per l'Unità Operativa.
Conforme ai principi di "Scrivere la Qualità in Sanità".
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Registro_Rischio_${(impactArea || 'criticità').replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Registro Rischi di Reparto"
      subtitle="Cruscotto operativo per il monitoraggio e la tracciabilità delle criticità"
      icon={ShieldCheck}
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

          {step < 3 ? (
            <button
              type="button"
              disabled={step === 1 && !riskDescription.trim()}
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
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 1 di 3</span>
              <h3 className="text-xl font-bold">Censimento della criticità o rischio</h3>
              <p className="text-sm text-muted-foreground">
                Inserisci la descrizione sintetica del rischio emerso in reparto o da un'analisi precedente.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Descrizione del Rischio:</label>
                <textarea
                  value={riskDescription}
                  onChange={(e) => setRiskDescription(e.target.value)}
                  rows={3}
                  placeholder="Es. Possibile disallineamento nella presa in carico dei pazienti fragili nei giorni festivi..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ambito di impatto:</label>
                <select
                  value={impactArea}
                  onChange={(e) => setImpactArea(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Sicurezza del Paziente">Sicurezza del Paziente / Clinico</option>
                  <option value="Organizzativo / Logistico">Organizzativo / Logistico</option>
                  <option value="Documentale / Accreditamento">Documentale / Accreditamento</option>
                  <option value="Formazione / Competenze">Formazione / Competenze</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 2 di 3</span>
              <h3 className="text-xl font-bold">Stato di presa in carico</h3>
              <p className="text-sm text-muted-foreground">Definisci lo stato attuale di gestione del rischio individuato.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2">
              {[
                { id: 'Aperto', title: 'Rischio Aperto / Da trattare', desc: 'Identificato di recente, necessita di pianificazione delle barriere.' },
                { id: 'In gestione', title: 'In corso di mitigazione', desc: 'Azioni correttive avviate ma non ancora verificate.' },
                { id: 'Monitorato', title: 'Sotto controllo / Monitorato', desc: 'Barriere efficaci attive, si procede a controlli periodici.' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id as any)}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                    status === item.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-border'
                  }`}
                >
                  <AlertTriangle className={`size-5 mt-0.5 shrink-0 ${status === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <div className="font-semibold text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 3 di 3</span>
              <h3 className="text-xl font-bold">Scheda di Registrazione del Rischio</h3>
              <p className="text-sm text-muted-foreground">Riepilogo inserito a cruscotto.</p>
            </div>

            <div className="p-5 rounded-2xl bg-muted/50 border border-border space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs uppercase font-semibold text-muted-foreground">Ambito: {impactArea}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  status === 'Aperto' ? 'bg-rose-500/10 text-rose-600' :
                  status === 'In gestione' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'
                }`}>
                  Stato: {status}
                </span>
              </div>

              <div className="text-sm space-y-2">
                <p className="font-medium text-foreground">Dettaglio criticità:</p>
                <p className="text-muted-foreground bg-background p-3 rounded-xl border border-border">
                  {riskDescription}
                </p>
                <p className="text-xs text-muted-foreground pt-1">
                  💡 <em>Il rischio è stato registrato nel cruscotto di reparto. Procedere con l'aggiornamento periodico in sede di riesame della direzione.</em>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}