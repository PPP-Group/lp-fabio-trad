/**
 * Busca as matérias no Sanity e grava em `src/data/materias.json`.
 *
 * Roda antes do `vite build` (ver o script `build` no package.json), então o
 * que o eleitor recebe é HTML com as matérias já dentro: **o site nunca fala
 * com o Sanity em tempo de execução**. Quem publica no painel dispara o
 * webhook, o Easypanel recompila, e a matéria nova entra no bundle.
 *
 * Duas regras que este script existe para garantir:
 *
 * 1. **O build não pode quebrar por causa do Sanity.** Se a API estiver fora
 *    do ar, o arquivo de antes é mantido e o deploy segue com as matérias
 *    anteriores — melhor do que derrubar o site inteiro por causa de uma
 *    lista de links.
 * 2. **O que vem de fora é conferido antes de entrar.** Quem escreve agora é
 *    a campanha, não nós: item sem campo obrigatório é descartado, e endereço
 *    que não seja http/https é barrado (um `javascript:` colado sem querer
 *    viraria brecha de segurança na página).
 *
 *     node scripts/materias.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SAIDA = path.join(__dirname, '..', 'src', 'data', 'materias.json')

const PROJETO = 'mcpf4hd5'
const DATASET = 'production'
const VERSAO_API = 'v2021-10-21'

// Ordenadas da mais recente para a mais antiga — é a ordem em que aparecem.
const CONSULTA = `*[_type == "materia"] | order(data desc) {
  "titulo": titulo,
  "veiculo": veiculo,
  "data": data,
  "url": url
}`

/** "2026-08-24" -> "24/08/2026". O Sanity guarda ISO; a página mostra BR. */
function dataBR(iso) {
  if (typeof iso !== 'string') return null
  const partes = iso.slice(0, 10).split('-')
  if (partes.length !== 3) return null
  const [ano, mes, dia] = partes
  return `${dia}/${mes}/${ano}`
}

/** Só http e https entram. Endereço torto é descartado, não corrigido. */
function urlSegura(valor) {
  if (typeof valor !== 'string') return null
  try {
    const u = new URL(valor.trim())
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}

/**
 * Grava o arquivo sem nunca deixar uma exceção escapar.
 *
 * É o único ponto do script que escreve em disco, e ele engole o próprio erro
 * de propósito: se nem gravar der certo, o build ainda assim segue com o que
 * já estava lá. Uma lista de links não pode derrubar um deploy.
 */
function gravar(lista) {
  try {
    fs.mkdirSync(path.dirname(SAIDA), { recursive: true })
    fs.writeFileSync(SAIDA, `${JSON.stringify(lista, null, 2)}\n`)
    return true
  } catch (erro) {
    console.warn(`[materias] não deu para gravar ${SAIDA}: ${erro.message}`)
    return false
  }
}

function limpar(bruto) {
  const boas = []
  const descartadas = []

  for (const item of bruto) {
    const titulo = typeof item?.titulo === 'string' ? item.titulo.trim() : ''
    const veiculo = typeof item?.veiculo === 'string' ? item.veiculo.trim() : ''
    const data = dataBR(item?.data)
    const url = urlSegura(item?.url)

    const faltando = []
    if (!titulo) faltando.push('título')
    if (!veiculo) faltando.push('veículo')
    if (!data) faltando.push('data')
    if (!url) faltando.push('link válido (http/https)')

    if (faltando.length) {
      descartadas.push(`${titulo || '(sem título)'} — falta ${faltando.join(', ')}`)
      continue
    }
    boas.push({ titulo, veiculo, data, url })
  }

  return { boas, descartadas }
}

async function main() {
  const url =
    `https://${PROJETO}.api.sanity.io/${VERSAO_API}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(CONSULTA)}`

  let bruto
  try {
    const resposta = await fetch(url, { signal: AbortSignal.timeout(20000) })
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ${resposta.statusText}`)
    const corpo = await resposta.json()
    if (!Array.isArray(corpo.result)) throw new Error('resposta sem `result`')
    bruto = corpo.result
  } catch (erro) {
    // Regra 1: o deploy não cai por causa disto.
    const tinha = fs.existsSync(SAIDA)
    console.warn(`[materias] não deu para buscar no Sanity: ${erro.message}`)
    console.warn(
      tinha
        ? '[materias] seguindo com o arquivo anterior — o site sobe com as matérias de antes.'
        : '[materias] não há arquivo anterior; gravando lista vazia (a seção some da página).',
    )
    if (!tinha) gravar([])
    return
  }

  const { boas, descartadas } = limpar(bruto)

  for (const motivo of descartadas) console.warn(`[materias] descartada: ${motivo}`)

  gravar(boas)

  console.log(
    `[materias] ${boas.length} matéria(s) gravada(s) em src/data/materias.json` +
      (descartadas.length ? ` (${descartadas.length} descartada(s))` : ''),
  )
}

main()
  .catch((erro) => {
    // Nem um erro inesperado aqui derruba o build.
    console.warn(`[materias] erro inesperado: ${erro.message}`)
    if (!fs.existsSync(SAIDA)) gravar([])
  })
  .finally(() => {
    // Explícito: aconteça o que acontecer, este script sai com sucesso. Quem
    // decide se o deploy vale é o `vite build`, não a busca das matérias.
    process.exitCode = 0
  })
