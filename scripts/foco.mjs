/* Percorre a página com Tab e confere se cada parada tem foco visível. */
import puppeteer from 'puppeteer-core'
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--disable-gpu'] })
const p = await b.newPage()
await p.setViewport({ width: 1280, height: 900 })
await p.goto('http://localhost:5179', { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 600))
const vistos = []
for (let i = 0; i < 45; i += 1) {
  await p.keyboard.press('Tab')
  const info = await p.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return null
    const e = getComputedStyle(el)
    return {
      tag: el.tagName.toLowerCase(),
      rotulo: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 34),
      contorno: `${e.outlineStyle} ${e.outlineWidth} ${e.outlineColor}`,
    }
  })
  if (info) vistos.push(info)
}
const semFoco = vistos.filter((v) => v.contorno.startsWith('none'))
console.log('paradas:', vistos.length, '| sem contorno visível:', semFoco.length)
for (const v of semFoco) console.log('  ✗', v.tag, JSON.stringify(v.rotulo))
console.log('exemplo:', JSON.stringify(vistos[3]))
await b.close()
