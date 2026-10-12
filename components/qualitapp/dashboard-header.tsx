export function DashboardHeader() {
  return (
    <header className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary-foreground/5"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 right-24 size-56 rounded-full bg-primary-foreground/5"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-5 pb-10 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 sm:pb-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-10 items-center justify-center overflow-hidden rounded-xl bg-primary-foreground border border-primary-foreground/20 shadow-xs">
              <img 
                src="/logo-app.png" 
                alt="QualitApp Logo" 
                width="40"
                height="40"
                className="object-cover"
              />
            </span>
            <span className="rounded-full border border-primary-foreground/30 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
              Strumenti Operativi
            </span>
          </div>

          <span className="rounded-full bg-primary-foreground/10 border border-primary-foreground/20 px-3 py-1 text-[11px] font-medium text-primary-foreground/90">
            Marchio Depositato UIBM n. 302026000175252
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">QualitApp</h1>
            <span className="text-lg font-extrabold text-primary-foreground/80 bg-primary-foreground/10 px-2 py-0.5 rounded-md">
              TM
            </span>
          </div>
          <p className="mt-2 max-w-xl text-lg text-primary-foreground/85 text-pretty">
            Semplificazione e Governance Documentale in Sanità
          </p>
          <p className="mt-3 text-sm text-primary-foreground/65">
            Basato su &ldquo;Scrivere la Qualità in Sanità&rdquo; di Simone Frabetti
          </p>
        </div>
      </div>
    </header>
  )
}