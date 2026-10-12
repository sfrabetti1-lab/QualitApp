import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ServiceWorkerRegister } from '@/components/qualitapp/sw-register'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'QualitApp - Strumenti Operativi per la Semplificazione e Governance Documentale in Sanità',
  description:
    'Bivio decisionale, checklist di redazione, Raccomandazioni Ministeriali e calcolatore +10%: strumenti operativi basati su "Scrivere la Qualità in Sanità" di Simone Frabetti.',
  applicationName: 'QualitApp',
  authors: [{ name: 'Simone Frabetti' }],
  generator: 'v0.app',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'QualitApp',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0f5c63',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased flex flex-col min-h-screen">
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer con Note Legali e Paternità d'Opera */}
        <footer className="w-full border-t border-border/60 bg-card py-6 text-center text-xs text-muted-foreground mt-auto">
          <div className="max-w-7xl mx-auto px-4 space-y-1.5">
            <p>
              <strong className="text-foreground">QualitApp</strong> — Strumenti Operativi per la Semplificazione e Governance Documentale in Sanità.
            </p>
            <p>
              Basato sull'opera &ldquo;Scrivere la Qualità in Sanità&rdquo; di <strong className="text-foreground">Simone Frabetti</strong>.
            </p>
            <p className="text-muted-foreground/80 pt-1">
              Copyright &copy; 2026 Simone Frabetti. Tutti i diritti riservati. Uso esclusivo non profit per strutture sanitarie e pubbliche (Vedi licenza nel repository).
            </p>
          </div>
        </footer>

        <ServiceWorkerRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}