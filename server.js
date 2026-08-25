import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { buscarMaterias } from './scripts/materias-comum.mjs'

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

// ---------------------------------------------------------------------------
// As matérias
//
// Quem fala com o Sanity é este servidor — nunca o navegador do eleitor. É a
// propriedade que o site vinha mantendo desde o começo e que não se abre mão
// aqui: quem abre a página não dispara uma única requisição para terceiros,
// não é rastreado por ninguém, e o Sanity não fica sabendo quem visitou o
// site de um candidato.
//
// Esta busca existe porque a anterior, feita na hora do build, não funcionava:
// publicar no painel não muda o código-fonte, o Docker reaproveitava a imagem
// inteira, o deploy terminava em um segundo sem construir nada e a matéria
// nova nunca chegava ao ar.
// ---------------------------------------------------------------------------

const INTERVALO_MATERIAS = 2 * 60 * 1000

// `null` quer dizer "ainda não consegui falar com o Sanity nenhuma vez" — que
// é diferente de "consegui e não há matéria nenhuma". A página trata os dois
// casos de forma oposta, então a diferença não pode se perder aqui.
let materiasEmMemoria = null
let materiasAtualizadasEm = null

async function atualizarMaterias() {
  try {
    const { boas, descartadas } = await buscarMaterias({ timeout: 15000 })
    for (const motivo of descartadas) console.warn(`[materias] descartada: ${motivo}`)
    materiasEmMemoria = boas
    materiasAtualizadasEm = new Date().toISOString()
    console.log(`[materias] ${boas.length} matéria(s) em memória`)
  } catch (erro) {
    // A lista de antes continua valendo. Um tropeço de rede não pode esvaziar
    // a seção de uma página que já estava correta.
    console.warn(`[materias] não deu para atualizar: ${erro.message}`)
  }
}

const server = http.createServer((req, res) => {
  // Healthcheck para o Easypanel
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return res.end('ok')
  }

  const urlPath = decodeURIComponent(req.url.split('?')[0])

  // A lista corrente, para a página se corrigir sem esperar deploy nenhum.
  //
  // O `ok: false` é a parte que importa: enquanto nunca tivermos conseguido
  // falar com o Sanity, a página deve ficar com a lista que veio no bundle.
  // Devolver uma lista vazia aqui seria pior do que não responder — apagaria
  // da tela matérias que estão corretas.
  if (urlPath === '/api/materias') {
    const corpo = materiasEmMemoria
      ? { ok: true, itens: materiasEmMemoria, atualizadoEm: materiasAtualizadasEm }
      : { ok: false }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      'X-Content-Type-Options': 'nosniff',
    })
    return res.end(JSON.stringify(corpo))
  }

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

  // A primeira busca sai junto com o servidor, mas sem segurá-lo: o site
  // precisa atender já, com a lista que veio no bundle, mesmo que o Sanity
  // demore ou esteja fora do ar.
  atualizarMaterias()
  const relogio = setInterval(atualizarMaterias, INTERVALO_MATERIAS)
  // Sem isto, este relógio sozinho seguraria o processo de pé para sempre.
  relogio.unref()
})
