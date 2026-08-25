/**
 * Compila o painel do Sanity para dentro de `dist/studio/`.
 *
 * É o que faz o painel morar em `nossodominio.com/studio` em vez de num
 * endereço separado — o editor entra pelo mesmo domínio do site, e não
 * precisamos publicar nada no Sanity para hospedar.
 *
 * Falha aqui **não derruba o deploy**: o painel é ferramenta interna, o site
 * é o produto. Se não compilar, `/studio` simplesmente não existe naquele
 * deploy e a landing page sobe normal.
 *
 *     node scripts/painel.mjs
 */
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RAIZ = path.join(__dirname, '..')
const STUDIO = path.join(RAIZ, 'studio')
// O `sanity build` ignora `--output-path` nesta versão e escreve sempre em
// `studio/dist`. Em vez de depender de uma flag que não se comporta como
// promete, compilamos no padrão dele e copiamos para o lugar certo.
const ORIGEM = path.join(STUDIO, 'dist')
const DESTINO = path.join(RAIZ, 'dist', 'studio')

function desistir(motivo) {
  console.warn(`[painel] ${motivo}`)
  console.warn('[painel] seguindo sem /studio neste deploy — o site sobe normal.')
  process.exitCode = 0
}

if (!fs.existsSync(path.join(STUDIO, 'node_modules'))) {
  desistir('studio/node_modules não existe (rode `cd studio && npm install`).')
} else {
  const r = spawnSync('npm', ['run', 'build'], {
    cwd: STUDIO,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })

  if (r.status !== 0) {
    desistir('o painel não compilou.')
  } else if (!fs.existsSync(path.join(ORIGEM, 'index.html'))) {
    desistir(`o build terminou mas não achei ${path.relative(RAIZ, ORIGEM)}/index.html.`)
  } else {
    try {
      fs.rmSync(DESTINO, { recursive: true, force: true })
      fs.cpSync(ORIGEM, DESTINO, { recursive: true })
      console.log('[painel] painel compilado e copiado para dist/studio/')
    } catch (erro) {
      desistir(`não deu para copiar o painel: ${erro.message}`)
    }
  }
  process.exitCode = 0
}
