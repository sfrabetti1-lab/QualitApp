import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import JSZip from 'jszip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const INCLUDED_DIRS = ['app', 'components', 'lib', 'public', 'hooks', 'styles']
const INCLUDED_FILES = [
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
  'tsconfig.json',
  'next.config.mjs',
  'postcss.config.mjs',
  'components.json',
  'next-env.d.ts',
]
const EXCLUDED_NAMES = new Set(['node_modules', '.next', '.git', '.vercel', '.DS_Store'])

const README = `# QualitApp

Strumenti Operativi per la Semplificazione e Governance Documentale in Sanità.
Basato sull'opera "Scrivere la Qualità in Sanità" di Simone Frabetti.

## Avvio locale

\`\`\`bash
pnpm install
pnpm dev
\`\`\`

Apri http://localhost:3000
`

async function exists(p: string) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function addDirectory(zip: JSZip, root: string, relative: string) {
  const absolute = path.join(root, relative)
  if (!(await exists(absolute))) return
  const entries = await readdir(absolute, { withFileTypes: true })
  for (const entry of entries) {
    if (EXCLUDED_NAMES.has(entry.name) || entry.name.startsWith('.env')) continue
    const entryRelative = path.posix.join(relative, entry.name)
    if (entry.isDirectory()) {
      await addDirectory(zip, root, entryRelative)
    } else if (entry.isFile()) {
      zip.file(entryRelative, await readFile(path.join(root, entryRelative)))
    }
  }
}

export async function GET() {
  try {
    const root = process.cwd()
    const zip = new JSZip()
    const folder = zip.folder('qualitapp')!

    for (const dir of INCLUDED_DIRS) {
      await addDirectory(folder, root, dir)
    }
    for (const file of INCLUDED_FILES) {
      const absolute = path.join(root, file)
      if (await exists(absolute)) folder.file(file, await readFile(absolute))
    }
    folder.file('README.md', README)

    const content = await zip.generateAsync({
      type: 'uint8array',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })

    return new Response(content as BodyInit, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="qualitapp.zip"',
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return Response.json({ error: 'Impossibile generare il pacchetto ZIP.' }, { status: 500 })
  }
}
