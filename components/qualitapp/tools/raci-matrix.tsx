'use client'

import { useState } from 'react'
import { Modal } from '../modal'
import { Users, ArrowRight, ArrowLeft, Download, CheckCircle2, HelpCircle } from 'lucide-react'

interface RacimodalProps {
  open: boolean
  onClose: () => void
}

export function RaciModal({ open, onClose }: RacimodalProps) {
  const [step, setStep] = useState(1)
  const [processTitle, setProcessTitle] = useState('')
  const [actorName, setActorName] = useState('')
  
  // Domande del Wizard decisionale
  const [q1, setQ1] = useState<boolean | null>(null) // Esegue materialmente l'azione?
  const [q2, setQ2] = useState<boolean | null>(null) // Ha l'autorità decisionale/firma finale?
  const [q3, setQ3] = useState<boolean | null>(null) // È una figura di consulenza/specialistica?

  const handleClose = () => {
    setStep(1)
    setProcessTitle('')
    setActorName('')
    setQ1(null)
    setQ2(null)
    setQ3(null)
    onClose()
  }

  // Calcolo automatico del RACI in base alle risposte del wizard
  const calculateRaci = (): 'R' | 'A' | 'C' | 'I' => {
    if (q2) return 'A'
    if (q1) return 'R'
    if (q3) return 'C'
    return 'I'
  }

  const computedRole = calculateRaci()

  const scaricaReport = () => {
    const reportContent = `==================================================
 WIZARD MATRICE RACI - SUPPORTO ALLA GOVERNANCE
 (QualitApp - Gestione dei Processi Sanitari)
==================================================

FASE / ATTIVITÀ ESAMINATA:
${processTitle || 'Non specificato'}

FIGURA PROFESSIONALE / RUOLO:
${actorName || 'Non specificato'}

PROFILO RACI CONSIGLIATO DAL SISTEMA:
- Ruolo assegnato: ${computedRole} (${
      computedRole === 'R' ? 'Responsible - Esecutore' :
      computedRole === 'A' ? 'Accountable - Decisore / Responsabile Finale' :
      computedRole === 'C' ? 'Consulted - Consulente / Supporto Specialistico' :
      'I - Informed - Informato'
    })

MOTIVAZIONE STRATEGICA E ORGANIZZATIVA:
${
  computedRole === 'R' ? 'Il profilo esegue materialmente l\'azione clinica o procedurale. È tenuto a seguire rigorosamente le istruzioni operative e a registrare le evidenze.' :
  computedRole === 'A' ? 'Il profilo detiene l\'autorità decisionale e la responsabilità ultima del processo. A lui spetta l\'approvazione formale e la validazione del percorso.' :
  computedRole === 'C' ? 'Il profilo possiede competenze specialistiche e viene interpellato preventivamente per esprimere pareri o validare scelte tecniche.' :
  'Il profilo non interviene direttamente ma deve essere formalmente notificato sull\'esito o sullo stato dell\'attività.'
}

--------------------------------------------------
Report generato tramite il modulo interattivo QualitApp.
`

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Wizard_RACI_${(processTitle || 'processo').replace(/[^a-zA-Z0-9]/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Wizard Assistito - Matrice RACI"
      subtitle="Strumento guidato per l'analisi e l'attribuzione corretta delle responsabilità clinico-organizzative"
      icon={Users}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-border bg-background hover:bg-muted transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" /> Indietro
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              disabled={
                (step === 1 && (!processTitle.trim() || !actorName.trim())) ||
                (step === 2 && (q1 === null || q2 === null || q3 === null))
              }
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              Avanti <ArrowRight className="size-4" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={scaricaReport}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
              >
                <Download className="size-4 text-primary" /> Scarica Report (.txt)
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
              >
                Termina e Chiudi
              </button>
            </div>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Passo 1: Informazioni iniziali */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 1 di 3</span>
              <h3 className="text-xl font-bold">Definizione dell'attività e del ruolo</h3>
              <p className="text-sm text-muted-foreground">
                Specifica l'azione o la fase del percorso assistenziale che vuoi analizzare e la figura professionale di riferimento.
              </p>
            </div>
            
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-sm font-medium mb-1">Azione o Fase di Processo:</label>
                <input
                  type="text"
                  value={processTitle}
                  onChange={(e) => setProcessTitle(e.target.value)}
                  placeholder="Es. Valutazione del rischio clinico all'ingresso, Consegna terapia..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Figura Professionale / Ruolo da valutare:</label>
                <input
                  type="text"
                  value={actorName}
                  onChange={(e) => setActorName(e.target.value)}
                  placeholder="Es. Infermiere Coordinatore, Medico di Guardia, OSS..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
        )}

        {/* Passo 2: Domande guida del Wizard */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 2 di 3</span>
              <h3 className="text-xl font-bold">Analisi guidata delle responsabilità</h3>
              <p className="text-sm text-muted-foreground">
                Rispondi alle domande per determinare il corretto coinvolgimento di <strong className="text-foreground">{actorName}</strong> nell'attività <strong className="text-foreground">{processTitle}</strong>.
              </p>
            </div>

            <div className="space-y-4 pt-1">
              {/* Domanda 1 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-start gap-2.5 text-sm font-medium">
                  <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>1. Questa figura esegue <strong>materialmente e operativamente</strong> l'azione sul campo?</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-7">
                  <button
                    type="button"
                    onClick={() => setQ1(true)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${q1 === true ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    Sì
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ1(false)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${q1 === false ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Domanda 2 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-start gap-2.5 text-sm font-medium">
                  <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>2. Ha l'<strong>autorità decisionale finale</strong>, la firma o la responsabilità ultima di validazione?</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-7">
                  <button
                    type="button"
                    onClick={() => setQ2(true)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${q2 === true ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    Sì
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ2(false)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${q2 === false ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Domanda 3 */}
              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-start gap-2.5 text-sm font-medium">
                  <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                  <span>3. Interviene fornendo <strong>pareri specialistici, consulenze o supporto tecnico</strong> preventivo?</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pl-7">
                  <button
                    type="button"
                    onClick={() => setQ3(true)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${q3 === true ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    Sì
                  </button>
                  <button
                    type="button"
                    onClick={() => setQ3(false)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${q3 === false ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Passo 3: Risultato del Wizard */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Passo 3 di 3</span>
              <h3 className="text-xl font-bold">Esito dell'Analisi Guidata RACI</h3>
              <p className="text-sm text-muted-foreground">Profilo elaborato per l'azione: <strong>{processTitle}</strong></p>
            </div>

            <div className="p-6 rounded-2xl bg-muted/40 border border-border space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <div className="text-xs text-muted-foreground">Figura valutata:</div>
                  <div className="font-bold text-base text-foreground">{actorName}</div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-primary-foreground shadow-xs">
                  <CheckCircle2 className="size-5" />
                  <span className="font-black text-sm tracking-wide">
                    {computedRole === 'R' && 'R - Responsible'}
                    {computedRole === 'A' && 'A - Accountable'}
                    {computedRole === 'C' && 'C - Consulted'}
                    {computedRole === 'I' && 'I - Informed'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground">💡 Motivazione Organizzativa:</p>
                <p className="leading-relaxed bg-background p-4 rounded-xl border border-border">
                  {computedRole === 'R' && `Poiché ${actorName} esegue materialmente l'azione, il sistema assegna il profilo Responsible (R). Questa figura porta a termine il compito operativo e compila le registrazioni di qualità previste.`}
                  {computedRole === 'A' && `Poiché ${actorName} detiene l'autorità decisionale, il sistema assegna il profilo Accountable (A). A questa figura spetta la responsabilità ultima e la validazione formale del processo.`}
                  {computedRole === 'C' && `Poiché ${actorName} interviene con competenze specialistiche, il sistema assegna il profilo Consulted (C). È necessario interpellarlo preventivamente prima della chiusura della procedura.`}
                  {computedRole === 'I' && `Poiché ${actorName} non esegue né decide direttamente l'azione, il sistema assegna il profilo Informed (I). Deve semplicemente ricevere notifica dell'avvenuto svolgimento a titolo informativo.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}