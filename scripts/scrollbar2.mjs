import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu', '--hide-scrollbars=false'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 800 })
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
const html = await p.evaluate(() => getComputedStyle(document.documentElement).scrollbarWidth)
console.log('scrollbar-width (html):', html)
await b.close()
