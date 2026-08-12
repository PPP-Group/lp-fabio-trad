/* Capturas para revisão de design. Usa o Chrome já instalado; nada é baixado.
 *
 * Uso:  node scripts/shots.mjs [pasta] [larguraxaltura] [#ancora]
 * Ex.:  node scripts/shots.mjs shots 1440x900
 *       node scripts/shots.mjs shots 390x844 propostas
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'
import { join } from 'node:path'

const SAIDA = process.argv[2] ?? 'shots'
const [LARGURA, ALTURA] = (process.argv[3] ?? '1440x900').split('x').map(Number)
const SO_ESSA = process.argv[4] ?? null
const URL = process.env.URL_ALVO ?? 'http://localhost:5179'
const CHROME =
  process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'

const SECOES = ['inicio', 'sobre', 'propostas', 'conquistas', 'participe', 'rodape']
const espera = (ms) => new Promise((r) => setTimeout(r, ms))

mkdirSync(SAIDA, { recursive: true })

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu', '--force-color-profile=srgb'],
})

const pagina = await navegador.newPage()
await pagina.setViewport({ width: LARGURA, height: ALTURA, deviceScaleFactor: 1 })
await pagina.goto(URL, { waitUntil: 'networkidle0' })
await pagina.evaluate(() => document.fonts.ready)
await espera(900)

const alvos = SO_ESSA ? [SO_ESSA] : SECOES
const sufixo = `${LARGURA}x${ALTURA}`

for (const id of alvos) {
  const existe = await pagina.evaluate((i) => Boolean(document.getElementById(i)), id)
  if (!existe) continue
  await pagina.evaluate((i) => {
    const no = document.getElementById(i)
    window.scrollTo({ top: no.offsetTop - 70, behavior: 'instant' })
  }, id)
  await espera(1200)
  const arquivo = join(SAIDA, `${id}-${sufixo}.png`)
  await pagina.screenshot({ path: arquivo })
  console.log(arquivo)
}

await navegador.close()
