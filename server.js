import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'

const PORT = Number(process.env.PORT) || 3000
const DIST_DIR = path.resolve('dist')

const MIME_TYPES = {
  '.html':  'text/html; charset=utf-8',
  '.js':    'application/javascript; charset=utf-8',
  '.mjs':   'application/javascript; charset=utf-8',
  '.css':   'text/css; charset=utf-8',
  '.json':  'application/json; charset=utf-8',
  '.png':   'image/png',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.webp':  'image/webp',
  '.svg':   'image/svg+xml',
  '.ico':   'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff':  'font/woff',
  '.ttf':   'font/ttf',
  '.txt':   'text/plain; charset=utf-8',
}

const server = http.createServer((req, res) => {
  // Healthcheck para o Easypanel
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end('ok')
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0])

  // O painel do Sanity é compilado com os caminhos dos próprios arquivos
  // fixos em `/static/...`, na raiz — não há opção de mudar isso no build.
  // Como o site usa `/assets/` e nunca `/static/`, essa rota fica dedicada a
  // ele: pedido em /static/ é servido de dentro de dist/studio/.
  const doPainel = urlPath.startsWith('/static/')
  let filePath = doPainel
    ? path.join(DIST_DIR, 'studio', urlPath)
    : path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath)

  // Previne directory traversal
  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403)
    return res.end('Forbidden')
  }

  // Fallback SPA. São duas aplicações aqui dentro, e cada uma tem o seu
  // ponto de entrada: o site na raiz e o painel das matérias em /studio.
  // Sem separar, uma rota interna do painel cairia no index.html do site e o
  // editor veria a landing page no lugar do formulário.
  const noStudio = urlPath === '/studio' || urlPath.startsWith('/studio/')
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // Arquivo do painel que não existe é 404 de verdade: cair no index.html
    // aqui devolveria HTML no lugar de um módulo JavaScript, e o navegador
    // recusaria por MIME — o erro é bem mais difícil de ler que um 404.
    if (doPainel) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
      return res.end('Not found')
    }
    const entrada = noStudio
      ? path.join(DIST_DIR, 'studio', 'index.html')
      : path.join(DIST_DIR, 'index.html')
    // Se o painel não foi compilado, a rota /studio não existe — melhor cair
    // no site do que servir um 404 cru.
    filePath = fs.existsSync(entrada) ? entrada : path.join(DIST_DIR, 'index.html')
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'
  const isHtml = ext === '.html'
  // Os dois têm nome com hash: os do site em /assets/, os do painel em
  // /static/. Podem ser guardados para sempre porque o nome muda quando o
  // conteúdo muda.
  const isHashedAsset = urlPath.startsWith('/assets/') || urlPath.startsWith('/static/')

  const headers = {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
  }

  if (isHashedAsset) {
    headers['Cache-Control'] = 'public, max-age=31536000, immutable'
  } else if (isHtml) {
    headers['Cache-Control'] = 'no-cache'
  } else {
    headers['Cache-Control'] = 'public, max-age=604800'
  }

  const raw = fs.createReadStream(filePath)
  const acceptEncoding = req.headers['accept-encoding'] || ''

  if (acceptEncoding.includes('gzip')) {
    headers['Content-Encoding'] = 'gzip'
    res.writeHead(200, headers)
    raw.pipe(zlib.createGzip()).pipe(res)
  } else {
    res.writeHead(200, headers)
    raw.pipe(res)
  }
})

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplicação rodando na porta ${PORT}`)
})
