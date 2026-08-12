/* Página inteira, de uma vez, para revisão. node scripts/tudo.mjs [largura] */
import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const largura = Number(process.argv[2] ?? 1280)
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: largura, height: 900, deviceScaleFactor: 1 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 60))
  }
  window.scrollTo(0, 0)
})
await new Promise((r) => setTimeout(r, 800))
await p.screenshot({ path: `shots/tudo-${largura}.png`, fullPage: true })
console.log(`shots/tudo-${largura}.png`)
await b.close()
