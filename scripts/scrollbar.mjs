import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 800 })
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await p.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 600))
await p.screenshot({ path: 'shots/scrollbar-viewport.png' })
await p.evaluate(() => window.scrollTo(0, 3000))
await new Promise((r) => setTimeout(r, 400))
await p.screenshot({ path: 'shots/scrollbar-viewport-2.png' })
await b.close()
