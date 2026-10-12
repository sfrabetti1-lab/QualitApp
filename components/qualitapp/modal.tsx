'use client'

import { useEffect, useId, useRef } from 'react'
import { X, type LucideIcon } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: LucideIcon
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'md' | 'lg'
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className={`m-0 mt-auto h-[90dvh] max-h-[96dvh] w-full max-w-none flex-col overflow-hidden rounded-t-3xl bg-card p-0 text-card-foreground shadow-2xl backdrop:bg-foreground/40 backdrop:backdrop-blur-sm open:flex sm:m-auto sm:h-auto sm:max-h-[88dvh] sm:rounded-3xl ${
        size === 'lg' ? 'sm:max-w-3xl' : 'sm:max-w-2xl'
      }`}
    >
      <header className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6 shrink-0">
        {Icon && (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="text-lg font-semibold leading-tight text-balance">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">Chiudi</span>
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">{children}</div>
      
      {footer && (
        <footer className="border-t border-border bg-muted/50 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 shrink-0">
          {footer}
        </footer>
      )}
    </dialog>
  )
}