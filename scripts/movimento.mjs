/* Confere que o traço é riscado de verdade quando o movimento está ligado. */
import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 900 })
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
const antes = await p.evaluate(() => {
  const t = document.querySelector('#propostas .bandeira__traco')
  return t.dataset.riscado
})
await p.evaluate(() => document.getElementById('propostas').scrollIntoView())
await new Promise((r) => setTimeout(r, 1400))
const depois = await p.evaluate(() => {
  const t = document.querySelector('#propostas .bandeira__traco')
  const trilho = document.querySelector('.regua__trilho .traco')
  return { bandeira: t.dataset.riscado, trilho: trilho.dataset.riscado }
})
console.log('antes de rolar:', antes, '| depois:', JSON.stringify(depois))
await p.screenshot({ path: 'shots/movimento.png' })
await b.close()
