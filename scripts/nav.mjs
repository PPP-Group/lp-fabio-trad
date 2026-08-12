/* Confere que a barra não muda de altura ao rolar e que a assinatura recua. */
import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 900 })
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
const medir = () => p.evaluate(() => ({
  barra: Math.round(document.querySelector('.nav__barra').getBoundingClientRect().height),
  marca: Math.round(document.querySelector('.nav__marca img').getBoundingClientRect().height),
  rolou: document.querySelector('.nav').dataset.rolou,
}))
console.log('topo   ', JSON.stringify(await medir()))
await p.evaluate(() => window.scrollTo(0, 1400))
await new Promise((r) => setTimeout(r, 800))
console.log('rolado ', JSON.stringify(await medir()))
await (await p.$('.nav')).screenshot({ path: 'shots/nav-rolado.png' })
await b.close()
