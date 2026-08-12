/* Gera a imagem de compartilhamento (og:image) a partir do próprio herói.
   Uso: node scripts/og.mjs  — precisa do npm run dev no ar. */
import puppeteer from 'puppeteer-core'

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
await p.evaluate(() => {
  document.querySelector('.nav').style.display = 'none'
  document.querySelector('.hero').style.paddingTop = '3rem'
})
await new Promise((r) => setTimeout(r, 1200))
await p.screenshot({ path: 'public/assets/og.jpg', type: 'jpeg', quality: 86 })
console.log('public/assets/og.jpg')
await b.close()
