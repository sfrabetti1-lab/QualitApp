export const dynamic = 'force-static'

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QualitApp - Strumenti Operativi per la Governance Documentale in Sanità',
    short_name: 'QualitApp',
    description:
      'Strumenti operativi per la semplificazione e la governance documentale in sanità.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f5f8f8',
    theme_color: '#0f5c63',
    lang: 'it',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}