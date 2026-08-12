import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 900 })
await p.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 800))
console.log(await p.evaluate(() => {
  const t = document.querySelector('.sobre__risco')
  if (!t) return 'sem .sobre__risco'
  const svg = t.querySelector('svg')
  const r = svg.getBoundingClientRect()
  return { w: r.width, h: r.height, clip: getComputedStyle(svg).clipPath, linhas: svg.children.length }
}))
await b.close()
