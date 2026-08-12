import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] })
const p = await b.newPage()
p.on('console', (m) => console.log('[' + m.type() + ']', m.text()))
p.on('pageerror', (e) => console.log('[erro]', e.message))
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 2000))
console.log('cartaz existe:', await p.evaluate(() => Boolean(document.querySelector('.cartaz'))))
console.log('inputs:', await p.evaluate(() => [...document.querySelectorAll('.cartaz input')].map((i) => i.type)))
await b.close()
