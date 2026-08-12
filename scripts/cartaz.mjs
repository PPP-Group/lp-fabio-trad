/* Salva o cartaz gerado, no tamanho real, para conferência. */
import puppeteer from 'puppeteer-core'
import { writeFileSync, mkdirSync } from 'node:fs'

const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
mkdirSync('shots', { recursive: true })
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 1000 })
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 1500))
await p.evaluate(() => {
  const i = document.querySelector('.cartaz input[type=text]')
  const set = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
  set.call(i, 'Maria do Bairro')
  i.dispatchEvent(new Event('input', { bubbles: true }))
})
await new Promise((r) => setTimeout(r, 1200))
const dados = await p.evaluate(() => document.querySelector('.cartaz canvas').toDataURL('image/png'))
writeFileSync('shots/cartaz.png', Buffer.from(dados.split(',')[1], 'base64'))
console.log('shots/cartaz.png')
await b.close()
