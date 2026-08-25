/**
 * A busca das matérias no Sanity, num lugar só.
 *
 * Dois programas precisam dela e por motivos diferentes: o `scripts/materias.mjs`
 * roda antes do build e assa a lista dentro do bundle, e o `server.js` refaz a
 * busca de tempos em tempos com o site já no ar.
 *
 * Está aqui em vez de duplicado nos dois porque o que este módulo faz não é
 * só buscar — é **conferir**. Quem escreve agora é a campanha, não nós, e uma
 * segunda cópia dessas regras seria uma cópia livre para divergir da primeira.
 * O dia em que uma delas ficasse mais frouxa que a outra, a frouxa é que
 * decidiria o que entra na página.
 */

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
export function dataBR(iso) {
  if (typeof iso !== 'string') return null
  const partes = iso.slice(0, 10).split('-')
  if (partes.length !== 3) return null
  const [ano, mes, dia] = partes
  return `${dia}/${mes}/${ano}`
}

/**
 * Só http e https entram. Endereço torto é descartado, não corrigido.
 *
 * Isto não é preciosismo: este valor vai virar o `href` de um link na página.
 * Um `javascript:` colado sem querer no painel viraria execução de código no
 * navegador de quem clicasse.
 */
export function urlSegura(valor) {
  if (typeof valor !== 'string') return null
  try {
    const u = new URL(valor.trim())
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}

/** Separa o que pode ir para a página do que não pode, com o motivo. */
export function limpar(bruto) {
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

/**
 * Busca e confere. Lança se não deu — quem chama decide o que fazer com isso,
 * porque os dois lados têm respostas diferentes: o build segue com a lista de
 * antes, o servidor mantém a que já tem na memória.
 */
export async function buscarMaterias({ timeout = 20000 } = {}) {
  const url =
    `https://${PROJETO}.api.sanity.io/${VERSAO_API}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(CONSULTA)}`

  const resposta = await fetch(url, { signal: AbortSignal.timeout(timeout) })
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ${resposta.statusText}`)

  const corpo = await resposta.json()
  if (!Array.isArray(corpo.result)) throw new Error('resposta sem `result`')

  return limpar(corpo.result)
}
