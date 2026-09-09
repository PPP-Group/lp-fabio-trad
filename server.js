import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { buscarMaterias } from './scripts/materias-comum.mjs'
import { buscarMaterial } from './scripts/material-comum.mjs'
import { comoAnexo, emCache, escreverZip } from './scripts/material-servidor.mjs'

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

// O material de apoio segue o mesmo relógio das matérias. A lista guardada aqui
// é também a lista de permissão dos downloads: o visitante pede um arquivo pelo
// id, e só é servido se esse id estiver nesta lista, que veio do Sanity. Não há
// como pedir um endereço arbitrário e fazer o servidor buscá-lo.
let materialEmMemoria = null

async function atualizarMaterial() {
  try {
    const { boas, descartados } = await buscarMaterial({ timeout: 15000 })
    for (const motivo of descartados) console.warn(`[material] descartado: ${motivo}`)
    materialEmMemoria = boas
    console.log(`[material] ${boas.length} arquivo(s) em memória`)
  } catch (erro) {
    console.warn(`[material] não deu para atualizar: ${erro.message}`)
  }
}

/** O que a página pode saber de cada arquivo — sem o endereço do CDN. */
function fichaPublica(item) {
  return {
    id: item.id,
    titulo: item.titulo,
    nomeArquivo: item.nomeArquivo,
    tipo: item.tipo,
    tamanho: item.tamanho,
  }
}

// O tipo declarado do arquivo vem do Sanity, e o painel só aceita imagem — mas
// é ele que vira o `Content-Type` de algo servido do nosso domínio. Um dia em
// que o esquema afrouxar, um arquivo HTML servido como HTML aqui seria script
// rodando no nosso endereço. Fora desta lista, o navegador recebe "bytes".
const TIPOS_CONHECIDOS = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
])

function erroSimples(res, codigo, texto) {
  res.writeHead(codigo, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end(texto)
}

/**
 * Serve um arquivo do material: a miniatura, o original ou o ZIP de tudo.
 *
 * O visitante pede pelo id, nunca por endereço. O id precisa estar na lista que
 * veio do Sanity — é isso que impede alguém de escolher o que o nosso servidor
 * vai buscar.
 */
async function servirMaterial(resto, res) {
  if (!materialEmMemoria) return erroSimples(res, 503, 'Material ainda não carregado')

  try {
    if (resto === 'tudo.zip') {
      if (!materialEmMemoria.length) return erroSimples(res, 404, 'Não há material publicado')
      res.writeHead(200, {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="material-de-apoio-fabio-trad-13.zip"',
        // Sem cache: o conteúdo muda quando a campanha publica.
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      })
      return await escreverZip(materialEmMemoria, res)
    }

    const ehMiniatura = resto.startsWith('miniatura/')
    const cru = ehMiniatura ? resto.slice('miniatura/'.length) : resto.replace(/^arquivo\//, '')
    const item = materialEmMemoria.find((m) => m.id === decodeURIComponent(cru))
    if (!item) return erroSimples(res, 404, 'Arquivo não encontrado')

    const caminho = ehMiniatura
      ? await emCache(item, { sufixo: 'miniatura', transformacao: '?w=560&fm=webp&q=72' })
      : await emCache(item)

    const cabecalhos = {
      'Content-Type': ehMiniatura
        ? 'image/webp'
        : TIPOS_CONHECIDOS.has(item.tipo)
          ? item.tipo
          : 'application/octet-stream',
      'Content-Length': fs.statSync(caminho).size,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff',
    }
    // O original é para baixar, não para abrir na aba.
    if (!ehMiniatura) {
      cabecalhos['Content-Disposition'] = comoAnexo(item.nomeArquivo)
    }

    res.writeHead(200, cabecalhos)
    fs.createReadStream(caminho).pipe(res)
  } catch (erro) {
    console.warn(`[material] falhou ao servir "${resto}": ${erro.message}`)
    // Se o ZIP já começou a sair, não há como voltar atrás e mandar um código
    // de erro — o jeito é cortar, e o descompactador acusa arquivo incompleto.
    if (res.headersSent) res.end()
    else erroSimples(res, 502, 'Não deu para buscar o arquivo agora')
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

  // A lista do material de apoio. Vai sem o endereço do CDN: o navegador não
  // precisa dele, e é justamente não entregá-lo que impede a página de puxar
  // arquivo de fora do nosso domínio.
  if (urlPath === '/api/material') {
    const corpo = materialEmMemoria
      ? { ok: true, itens: materialEmMemoria.map(fichaPublica) }
      : { ok: false }
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      'X-Content-Type-Options': 'nosniff',
    })
    return res.end(JSON.stringify(corpo))
  }

  if (urlPath.startsWith('/api/material/')) {
    return servirMaterial(urlPath.slice('/api/material/'.length), res)
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
  const atualizarTudo = () => {
    atualizarMaterias()
    atualizarMaterial()
  }

  atualizarTudo()
  const relogio = setInterval(atualizarTudo, INTERVALO_MATERIAS)
  // Sem isto, este relógio sozinho seguraria o processo de pé para sempre.
  relogio.unref()
})
