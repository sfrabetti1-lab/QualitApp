export type DocType = 'PDTA' | 'PROCEDURA' | 'IO' | 'MODULO'

export interface DocTypeInfo {
  id: DocType
  sigla: string
  nome: string
  definizione: string[]
  quesito: string
  esempio: string
  esempioDettaglio: string
}

export const DOC_TYPES: Record<DocType, DocTypeInfo> = {
  PDTA: {
    id: 'PDTA',
    sigla: 'PDTA',
    nome: 'Percorso Diagnostico Terapeutico Assistenziale',
    definizione: [
      'Gestione multidisciplinare di una patologia specifica.',
      'Coinvolge più UU.OO. e differenti figure (Medico, Infermiere, Fisioterapista, Assistente Sociale).',
      'Definisce le tappe cronologiche e i tempi del percorso.',
    ],
    quesito:
      'Cosa succede al paziente dal momento in cui entra nella struttura a quando viene dimesso?',
    esempio: 'PDTA dello Scompenso Cardiaco',
    esempioDettaglio: "Mappatura e gestione dell'intero percorso integrato del paziente.",
  },
  PROCEDURA: {
    id: 'PROCEDURA',
    sigla: 'PA / PO',
    nome: 'Procedura',
    definizione: [
      'Descrive un processo aziendale stabilendo chi fa cosa, quando e perché.',
      "Focus sull'organizzazione e sui flussi autorizzativi.",
    ],
    quesito:
      'Chi è il responsabile di questa attività? Quali sono i passaggi autorizzativi?',
    esempio: "Procedura per l'identificazione certa del paziente",
    esempioDettaglio: 'Definizione degli obblighi, ruoli e responsabilità del braccialetto.',
  },
  IO: {
    id: 'IO',
    sigla: 'IO',
    nome: 'Istruzione Operativa',
    definizione: [
      'Dettaglio esecutivo massimo.',
      "Descrive come si esegue tecnicamente un'attività professionale.",
      'Rivolta direttamente all\'operatore "sul campo".',
    ],
    quesito: 'Come si esegue, tecnicamente, questa specifica manovra professionale?',
    esempio: 'Istruzione Operativa per il posizionamento del CVC',
    esempioDettaglio: "Preparazione dei materiali, antisepsi e tecnica d'inserzione.",
  },
  MODULO: {
    id: 'MODULO',
    sigla: 'MOD',
    nome: 'Modulo',
    definizione: [
      'Strumento di registrazione formale.',
      'Foglio o schermata digitale con campi da compilare.',
      'Rappresenta la traccia legale e clinica.',
    ],
    quesito:
      "L'azione è stata eseguita davvero? Esiste una traccia legale o un dato verificabile?",
    esempio: 'Consenso Informato / Checklist di Sala Operatoria',
    esempioDettaglio: 'Modulo registrazione temperature frigo farmaci.',
  },
}

export const REDAZIONE_TIPS: Record<DocType, string[]> = {
  PDTA: [
    'La struttura formale è definita dai format regionali o aziendali vigenti.',
    'Identificare chiaramente i passaggi di responsabilità tra unità operative.',
    "Usare una terminologia univoca e orientata all'azione.",
    'Costruire sequenze logiche che evitino zone d\'ombra organizzative (Accesso, Diagnosi, Trattamento).',
  ],
  PROCEDURA: [
    'Sezioni: Titolo, Scopo, Campo di applicazione, Abbreviazioni e definizioni.',
    'Responsabilità tramite matrice (R = Responsabile, C = Coinvolto, I = Informato).',
    'Fasi del processo con Diagramma di Flusso al posto di lunghe descrizioni.',
    'Indicatori di Struttura, Processo ed Esito con target a "Realismo Progressivo" (+10%).',
    'Registrazioni (tipologia e luogo di archiviazione) e Riferimenti normativi.',
  ],
  IO: [
    'Stessa intestazione della Procedura (Titolo, Scopo, Campo, Definizioni, Responsabilità).',
    "Elenco dei materiali: l'esposizione inizia tassativamente da ciò che occorre.",
    'Sequenza cronologica numerata (1, 2, 3...) per azzerare i margini di errore.',
    'Alert di sicurezza in grassetto o box (es. ATTENZIONE: non rincappucciare l\'ago).',
  ],
  MODULO: [
    'Autocompilazione: caselle da barrare (check-box) più che spazi bianchi da scrivere.',
    'Identificabilità: in alto a destra codice modulo (es. MOD_01_QUAL) e revisione.',
    'Deve sempre essere "figlio" di una Procedura o di un\'Istruzione Operativa.',
  ],
}

export interface BivioOption {
  id: string
  label: string
  descrizione: string
  esempio: string
}

export interface BivioLevel {
  livello: 1 | 2 | 3
  titolo: string
  domanda: string
  options: [BivioOption, BivioOption]
}

export const BIVIO_LEVELS: Record<1 | 2 | 3, BivioLevel> = {
  1: {
    livello: 1,
    titolo: 'Distinzione di Scopo',
    domanda: 'Il problema riguarda UNA figura o PIÙ figure / servizi?',
    options: [
      {
        id: 'piu',
        label: 'Più figure / servizi',
        descrizione: 'Percorso integrato tra più reparti o discipline.',
        esempio: 'Pronto Soccorso + Radiologia + Chirurgia per la gestione di una patologia.',
      },
      {
        id: 'una',
        label: 'Una figura / singola U.O.',
        descrizione:
          "Processo organizzativo o clinico perimetrato all'interno del singolo reparto.",
        esempio: 'Gestione della consegna tra turni.',
      },
    ],
  },
  2: {
    livello: 2,
    titolo: 'Dubbio Operativo',
    domanda: 'Il dubbio è sul "CHI FA COSA" o sul "COME SI FA"?',
    options: [
      {
        id: 'chi',
        label: 'Chi fa cosa',
        descrizione: 'Dubbio organizzativo: incertezza su ruoli e responsabilità.',
        esempio:
          '"Chi deve chiamare il tecnico in caso di guasto al ventilatore: l\'infermiere o il coordinatore?"',
      },
      {
        id: 'come',
        label: 'Come si fa',
        descrizione: "Dubbio tecnico: incertezza sull'esecuzione di una manovra.",
        esempio:
          '"Quale antisettico usare per la medicazione del PICC e quanti minuti deve agire?"',
      },
    ],
  },
  3: {
    livello: 3,
    titolo: "Traccia dell'Azione",
    domanda: "Devo lasciare una traccia legale o clinica dell'avvenuta azione?",
    options: [
      {
        id: 'si',
        label: 'Sì',
        descrizione: 'Necessità di attestazione formale, riscontro clinico o tracciabilità.',
        esempio: '"Ho controllato le scadenze dei farmaci dell\'armadio."',
      },
      {
        id: 'no',
        label: 'No',
        descrizione:
          "L'azione non richiede registrazione formale o è già disciplinata dal testo normativo principale.",
        esempio: "Attenersi alla Procedura o all'IO esistente.",
      },
    ],
  },
}

export interface ChecklistArea {
  id: string
  numero: number
  titolo: string
  descrizione: string
  items: { id: string; label: string }[]
}

export const CHECKLIST_AREAS: ChecklistArea[] = [
  {
    id: 'identificazione',
    numero: 1,
    titolo: 'Identificazione e Formato',
    descrizione: 'Elementi che rendono il documento riconoscibile e verificabile.',
    items: [
      { id: 'id-1', label: 'Intestazione istituzionale presente' },
      { id: 'id-2', label: 'Titolo chiaro, univoco e descrittivo del processo' },
      { id: 'id-3', label: 'Codice documento (es. PA_INF_01, IO_CHIR_05)' },
      { id: 'id-4', label: 'Stato di revisione (Edizione / Revisione)' },
      { id: 'id-5', label: "Data d'emissione" },
      { id: 'id-6', label: 'Sommario (per testi superiori a 3 pagine)' },
    ],
  },
  {
    id: 'linguaggio',
    numero: 2,
    titolo: 'Linguaggio e Stile',
    descrizione: 'Un testo chiaro riduce il carico cognitivo dell\'operatore.',
    items: [
      {
        id: 'li-1',
        label: 'Verbi all\'indicativo (es. "l\'infermiere fa" anziché "si dovrebbe fare")',
      },
      { id: 'li-2', label: 'Soggetti espliciti (evitato il "si" impersonale)' },
      { id: 'li-3', label: 'Lessico tecnico standard' },
      { id: 'li-4', label: 'Acronimi spiegati nella sezione dedicata' },
    ],
  },
  {
    id: 'contenuto',
    numero: 3,
    titolo: 'Contenuto e Struttura',
    descrizione: 'Logica, sequenza e sicurezza del contenuto.',
    items: [
      { id: 'co-1', label: 'Scopo esplicitato' },
      { id: 'co-2', label: "Campo d'applicazione esplicitato" },
      { id: 'co-3', label: 'Diagrammi di flusso per i processi complessi' },
      { id: 'co-4', label: 'Rispetto della sequenza cronologica' },
      { id: 'co-5', label: 'Alert per la sicurezza inseriti nei punti critici' },
    ],
  },
  {
    id: 'tracciabilita',
    numero: 4,
    titolo: 'Tracciabilità',
    descrizione: 'Coerenza tra testo, moduli e archiviazione.',
    items: [
      { id: 'tr-1', label: 'Coerenza tra i moduli citati nel testo e la modulistica allegata' },
      { id: 'tr-2', label: 'Istruzioni chiare sui tempi di archiviazione' },
      { id: 'tr-3', label: 'Istruzioni chiare sui luoghi di archiviazione' },
    ],
  },
  {
    id: 'revisione',
    numero: 5,
    titolo: 'Revisione e Fattibilità (Reality Check)',
    descrizione: 'Le azioni richieste devono essere realmente eseguibili.',
    items: [
      {
        id: 're-1',
        label: 'Fattibilità verificata con le risorse tecnologiche effettivamente disponibili',
      },
      {
        id: 're-2',
        label: 'Fattibilità verificata con il personale effettivamente disponibile',
      },
      {
        id: 're-3',
        label: 'Lettura di prova affidata a un operatore che lavora "sul campo"',
      },
    ],
  },
]

export type RmArea = 'farmaci' | 'clinico' | 'sicurezza' | 'manutenzione'

export const RM_AREA_LABELS: Record<RmArea, string> = {
  farmaci: 'Farmaci & Logistica',
  clinico: 'Clinico-Assistenziale',
  sicurezza: 'Sicurezza & Rischio',
  manutenzione: 'Manutenzione & Qualità',
}

export interface Raccomandazione {
  numero: number
  titolo: string
  breve: string
  aziendale: string
  unitaOperativa: string[]
  area: RmArea
}

export const RACCOMANDAZIONI: Raccomandazione[] = [
  {
    numero: 1,
    titolo: 'Soluzioni concentrate di Potassio (KCl) e altre soluzioni concentrate',
    breve: 'Potassio (KCl)',
    aziendale:
      'Protocollo Farmacia per la dispensazione e diluizione delle soluzioni elettrolitiche concentrate.',
    unitaOperativa: [
      'Istruzione Operativa gestione e stoccaggio farmaci ad alto rischio in reparto',
      'Modulo doppia firma somministrazione',
    ],
    area: 'farmaci',
  },
  {
    numero: 2,
    titolo: 'Ritenzione di garze, strumenti o altro materiale nel sito chirurgico',
    breve: 'Surgical Safety',
    aziendale: 'Procedura aziendale "Surgical Safety Checklist".',
    unitaOperativa: [
      'Istruzione Operativa per il conteggio di garze, strumenti e taglienti in blocco operatorio',
      'Registro intraoperatorio dei controlli',
    ],
    area: 'sicurezza',
  },
  {
    numero: 3,
    titolo: 'Corretta identificazione dei pazienti, del sito chirurgico e della procedura',
    breve: 'Identificazione paziente',
    aziendale:
      'Procedura aziendale "Corretta identificazione del paziente, del sito e della procedura".',
    unitaOperativa: [
      'Procedura di Time-Out pre-procedurale',
      'Istruzione Operativa utilizzo braccialetto identificativo',
    ],
    area: 'clinico',
  },
  {
    numero: 4,
    titolo: 'Prevenzione del suicidio di paziente in ospedale',
    breve: 'Rischio suicidario',
    aziendale:
      'Procedura aziendale per la prevenzione del rischio suicidario e gestione del paziente a rischio.',
    unitaOperativa: ['Check-list bonifica e controllo ambienti di degenza psichiatrica/acuta'],
    area: 'sicurezza',
  },
  {
    numero: 5,
    titolo: 'Reazione trasfusionale da incompatibilità AB0',
    breve: 'Incompatibilità AB0',
    aziendale:
      'Procedura aziendale di Emovigilanza e tracciabilità del sangue ed emocomponenti.',
    unitaOperativa: [
      'Istruzione Operativa per il controllo pre-trasfusionale al letto del paziente (Bands/Barcode)',
      'Modulo segnalazione reazioni avverse (SHOT)',
    ],
    area: 'clinico',
  },
  {
    numero: 6,
    titolo: 'Morte materna correlata al travaglio e/o parto',
    breve: 'Percorso nascita',
    aziendale: 'Percorso Nascita Aziendale (PNA).',
    unitaOperativa: [
      'Procedura per la gestione delle emergenze ostetriche (emorragia post-partum, distocia)',
      'Istruzione Operativa monitoraggio cardiotocografico (CTG)',
    ],
    area: 'clinico',
  },
  {
    numero: 7,
    titolo: 'Morte, coma o grave danno derivati da errori in terapia farmacologica',
    breve: 'Errori in terapia',
    aziendale:
      'Procedura per la gestione del processo del farmaco tramite Cartella Clinica Elettronica (CCE); Linea guida aziendale sulla riconciliazione terapeutica.',
    unitaOperativa: ['Istruzione Operativa segnalazione incidenti/near miss'],
    area: 'farmaci',
  },
  {
    numero: 8,
    titolo: 'Atti di violenza a danno degli operatori sanitari',
    breve: 'Violenza sugli operatori',
    aziendale:
      'Procedura aziendale per la prevenzione e gestione degli episodi di violenza contro gli operatori.',
    unitaOperativa: [
      'Protocollo di attivazione security/forze dell\'ordine',
      'Linea guida supporto psicologico "seconda vittima"',
    ],
    area: 'sicurezza',
  },
  {
    numero: 9,
    titolo: 'Eventi avversi conseguenti a malfunzionamento di dispositivi medici',
    breve: 'Dispositivi medici',
    aziendale:
      'Procedura aziendale di Dispositivovigilanza (segnalazione eventi avversi da DM).',
    unitaOperativa: [
      'Istruzione Operativa per la manutenzione e verifica periodica (Ingegneria Clinica)',
      'Registro apparecchiature elettromedicali',
    ],
    area: 'manutenzione',
  },
  {
    numero: 10,
    titolo: 'Osteonecrosi della mascella/mandibola da bifosfonati',
    breve: 'Bifosfonati',
    aziendale:
      'Protocollo multidisciplinare preventivo per pazienti candidati a trattamento con bifosfonati (Oncologia, Odontoiatria, Maxillo-Facciale).',
    unitaOperativa: ['Istruzione Operativa igiene orale mirata'],
    area: 'clinico',
  },
  {
    numero: 11,
    titolo: 'Morte o grave danno da malfunzionamento del sistema di trasporto intra/extra',
    breve: 'Trasporto paziente',
    aziendale:
      'Procedura operativa per il trasporto intraospedaliero ed extraospedaliero del paziente critico.',
    unitaOperativa: [
      'Check-list verifica attrezzature carrello di emergenza/trasporto',
      'Procedura passaggio di consegne (SBAR)',
    ],
    area: 'sicurezza',
  },
  {
    numero: 12,
    titolo: 'Errori in terapia con farmaci Look-alike/sound-alike (LASA)',
    breve: 'Farmaci LASA',
    aziendale:
      'Procedura aziendale gestione farmaci Look-Alike/Sound-Alike (LASA); Elenco aggiornato LASA aziendale.',
    unitaOperativa: [
      'Istruzione Operativa stoccaggio separato e alert visivi in armadi farmaci di reparto',
    ],
    area: 'farmaci',
  },
  {
    numero: 13,
    titolo: 'Prevenzione e gestione della caduta del paziente nelle strutture sanitarie',
    breve: 'Cadute',
    aziendale:
      'Procedura valutazione multidimensionale del rischio di caduta (Morse Scale / Conley Scale in CCE).',
    unitaOperativa: [
      'Istruzione Operativa applicazione presidi antisdrucciolo e contenimento',
      'Procedura gestione post-caduta',
    ],
    area: 'sicurezza',
  },
  {
    numero: 14,
    titolo: 'Errori in terapia con farmaci antineoplastici',
    breve: 'Antineoplastici',
    aziendale:
      'Procedura aziendale prescrizione, validazione e somministrazione farmaci antineoplastici.',
    unitaOperativa: [
      'Istruzione Operativa UFA (Unità Farmaci Manipolati)',
      'Procedura gestione stravaso chemioterapici',
    ],
    area: 'farmaci',
  },
  {
    numero: 15,
    titolo: 'Non corretta attribuzione del codice triage (Centrale 118 e Pronto Soccorso)',
    breve: 'Triage',
    aziendale: 'Procedura Triage Intraospedaliero (Pronto Soccorso) e Linee guida Centrale 118.',
    unitaOperativa: [
      'Protocollo di gestione dei flussi e sovraffollamento in PS',
      'Audit clinici periodici di triage',
    ],
    area: 'clinico',
  },
  {
    numero: 16,
    titolo: 'Morte o disabilità permanente in neonato sano >2500g non congenita',
    breve: 'Neonato sano',
    aziendale: 'Protocollo sorveglianza fetale avanzata in travaglio di parto.',
    unitaOperativa: [
      'Procedura rianimazione neonatale in sala parto',
      'Modulo audit neonatale e reportistica',
    ],
    area: 'clinico',
  },
  {
    numero: 17,
    titolo: 'Riconciliazione della terapia farmacologica',
    breve: 'Riconciliazione terapia',
    aziendale:
      'Procedura aziendale riconciliazione della terapia farmacologica in ammissione, trasferimento e dimissione.',
    unitaOperativa: ['Istruzione Operativa riconciliazione in CCE'],
    area: 'farmaci',
  },
  {
    numero: 18,
    titolo: "Errori in terapia conseguenti all'uso di abbreviazioni, acronimi e sigle",
    breve: 'Abbreviazioni e sigle',
    aziendale:
      'Linea guida compilazione cartella clinica e documentazione sanitaria; Elenco aziendale di acronimi, sigle e abbreviazioni validati e vietati.',
    unitaOperativa: [
      "Applicazione dei criteri di stesura e rispetto delle linee guida all'interno dell'Unità Operativa",
    ],
    area: 'clinico',
  },
]

export interface MacroAreaDoc {
  titolo: string
  strumento: string
  descrizione: string
  focus: string
}

export interface MacroArea {
  id: 'governance' | 'clinico' | 'farmaci'
  titolo: string
  sottotitolo: string
  obiettivoGovernance: string
  obiettivo: string
  documenti: MacroAreaDoc[]
  rmCollegate: number[]
  scomposizione?: { livello: string; testo: string }[]
}

export const MACRO_AREE: MacroArea[] = [
  {
    id: 'governance',
    titolo: 'Governance & Organizzazione',
    sottotitolo: 'Organigramma, Carta dei Servizi, Piano di Addestramento',
    obiettivoGovernance: 'Definire responsabilità, ruoli e offerta assistenziale',
    obiettivo:
      "Comprende i documenti direzionali volti a definire l'offerta assistenziale e le responsabilità interne. È il prerequisito strutturale per governare le emergenze e la formazione del personale.",
    documenti: [
      {
        titolo: 'Organigramma e Funzionigramma',
        strumento: 'Documento direzionale',
        descrizione:
          'Definizione dei ruoli apicali, medici, infermieristici e tecnici. Nomina dei referenti (Qualità, Rischio Clinico, Sicurezza).',
        focus: 'Mappatura delle responsabilità apicali, mediche e infermieristiche',
      },
      {
        titolo: 'Carta dei Servizi',
        strumento: 'Documento direzionale',
        descrizione:
          'Elenco aggiornato delle prestazioni, orari di visita, modalità di prenotazione e accoglienza.',
        focus: 'Elenco prestazioni, orari e modalità di accesso',
      },
      {
        titolo: 'Piano di Addestramento',
        strumento: 'Registrazione',
        descrizione:
          "Documentazione che attesti l'avvenuto addestramento del personale sulle attrezzature specifiche del reparto.",
        focus: "Tracciabilità dell'addestramento sulle tecnologie di reparto",
      },
    ],
    rmCollegate: [],
  },
  {
    id: 'clinico',
    titolo: 'Clinico-Assistenziale',
    sottotitolo: 'Cartella Clinica, Consenso Informato, Identificazione Paziente, SBAR',
    obiettivoGovernance: 'Garantire l\'uniformità delle cure e la tracciabilità clinica',
    obiettivo:
      "Finalizzata a garantire l'uniformità e la sicurezza delle cure. In quest'area la tassonomia documentale si incrocia con la RM 3 (Corretta identificazione dei pazienti): non è sufficiente un unico documento, ma occorre una scomposizione gerarchica.",
    documenti: [
      {
        titolo: 'Cartella Clinica (Gestione Documentazione Sanitaria)',
        strumento: 'Istruzione Operativa',
        descrizione:
          'Istruzioni per la corretta compilazione della Cartella Clinica/Ambulatoriale (firma, data, leggibilità, divieto di correttori).',
        focus: 'Tracciabilità formale (firma, data, divieto di correttori)',
      },
      {
        titolo: 'Consenso Informato',
        strumento: 'Procedura + Modulo',
        descrizione: 'Modalità di somministrazione, raccolta e archiviazione del consenso.',
        focus: 'Modalità di somministrazione e archiviazione del consenso',
      },
      {
        titolo: 'Identificazione Paziente',
        strumento: 'Protocollo / Istruzione Operativa',
        descrizione:
          'Protocollo per l\'utilizzo del braccialetto identificativo o check-point pre-procedura per prevenire scambi di persona.',
        focus: 'Utilizzo braccialetto identificativo e check-point pre-procedurali',
      },
      {
        titolo: 'Continuità Assistenziale (SBAR)',
        strumento: 'Modulo',
        descrizione:
          'Modulistica per le dimissioni protette e il passaggio di consegne (metodo SBAR o simili).',
        focus: 'Passaggio di consegne strutturato e dimissioni protette',
      },
    ],
    rmCollegate: [3, 5, 18],
    scomposizione: [
      { livello: 'Procedura aziendale', testo: 'Definisce le responsabilità.' },
      { livello: 'Protocollo', testo: 'Time-Out pre-procedurale.' },
      {
        livello: 'Istruzione Operativa',
        testo: 'Posizionamento del braccialetto identificativo.',
      },
    ],
  },
  {
    id: 'farmaci',
    titolo: 'Gestione Farmaci & Logistica',
    sottotitolo: 'Armadio Farmaci, LASA, Scadenze FIFO/FEFO, Temperature',
    obiettivoGovernance: "Prevenire l'errore terapeutico e ottimizzare le risorse",
    obiettivo:
      "Orientata alla prevenzione dell'errore terapeutico. Questa macro-area assorbe la maggior parte degli sforzi normativi, rispondendo a direttive critiche come la RM 1, la RM 7, la RM 12 e la RM 14.",
    documenti: [
      {
        titolo: 'Armadio Farmaceutico',
        strumento: 'Procedura',
        descrizione:
          'Regole per l\'approvvigionamento, lo stoccaggio e la separazione dei farmaci (attenzione specifica ai farmaci LASA e stupefacenti).',
        focus: 'Separazione e alert visivi per farmaci LASA e Stupefacenti',
      },
      {
        titolo: 'Farmaci LASA',
        strumento: 'Istruzione Operativa',
        descrizione:
          'Stoccaggio separato e alert visivi negli armadi farmaci di reparto (RM 12).',
        focus: 'Prevenzione degli scambi Look-Alike/Sound-Alike',
      },
      {
        titolo: 'Gestione Scadenze (FIFO/FEFO)',
        strumento: 'Procedura + Modulo',
        descrizione:
          'Sistema di controllo periodico delle scadenze e rotazione dei prodotti.',
        focus: 'Rotazione sistematica dei prodotti e controllo scadenze',
      },
      {
        titolo: 'Monitoraggio Temperature',
        strumento: 'Modulo (Registro)',
        descrizione:
          'Registri per il controllo quotidiano dei frigoriferi per farmaci e vaccini (catena del freddo).',
        focus: 'Registrazione quotidiana temperature frigo (catena del freddo)',
      },
      {
        titolo: 'Tracciabilità Dispositivi Medici',
        strumento: 'Procedura',
        descrizione:
          'Registrazione dei lotti (es. protesi, dispositivi impiantabili) nella cartella del paziente.',
        focus: 'Tracciabilità dei lotti impiantati',
      },
      {
        titolo: 'Gas Medicali',
        strumento: 'Istruzione Operativa',
        descrizione:
          'Regole di stoccaggio bombole (segregazione pieno/vuoto) e sicurezza d\'uso.',
        focus: 'Segregazione pieno/vuoto e sicurezza d\'uso',
      },
    ],
    rmCollegate: [1, 7, 12, 14],
    scomposizione: [
      {
        livello: 'Procedura',
        testo: "Stabilisce le regole di gestione dell'armadio farmaceutico.",
      },
      {
        livello: 'Istruzione Operativa',
        testo: 'Disciplina lo stoccaggio separato con alert visivi.',
      },
      {
        livello: 'Modulo',
        testo: 'Garantisce la tracciabilità (es. registro della doppia firma).',
      },
    ],
  },
]
