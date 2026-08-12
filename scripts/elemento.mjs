import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const seletor = process.argv[2]
const saida = process.argv[3] ?? 'shots/elemento.png'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--hide-scrollbars', '--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: Number(process.argv[4] ?? 1280), height: 900 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 900))
const el = await p.$(seletor)
await el.scrollIntoView()
await new Promise((r) => setTimeout(r, 700))
await el.screenshot({ path: saida })
console.log(saida)
await b.close()
