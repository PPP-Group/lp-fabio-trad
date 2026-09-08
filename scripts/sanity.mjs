/**
 * A ligação com o Sanity: endereço do projeto e como perguntar.
 *
 * Fica separado porque agora são duas consultas diferentes — as matérias e o
 * material de apoio — e as duas falam com o mesmo projeto. Sem isto, o
 * endereço estaria escrito em dois lugares e um dia um deles mudaria sozinho.
 */

export const PROJETO = 'mcpf4hd5'
export const DATASET = 'production'
export const VERSAO_API = 'v2021-10-21'

/** O CDN de onde vêm os arquivos enviados pelo painel. */
export const CDN = `https://cdn.sanity.io/`

/**
 * Roda uma consulta GROQ. Lança se não deu — quem chama decide o que fazer,
 * porque as respostas certas são diferentes: o build segue com o arquivo de
 * antes, o servidor mantém o que já tem na memória.
 */
export async function consultar(groq, { timeout = 20000 } = {}) {
  const url =
    `https://${PROJETO}.api.sanity.io/${VERSAO_API}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(groq)}`

  const resposta = await fetch(url, { signal: AbortSignal.timeout(timeout) })
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status} ${resposta.statusText}`)

  const corpo = await resposta.json()
  if (!('result' in corpo)) throw new Error('resposta sem `result`')

  return corpo.result
}

/**
 * Confere que um endereço de arquivo é mesmo do CDN do Sanity.
 *
 * Isto não é formalidade. O servidor busca este endereço e devolve o conteúdo
 * para quem pediu; se aceitasse qualquer URL, viraria um proxy aberto — quem
 * conseguisse gravar um valor no painel faria o nosso servidor buscar coisa em
 * qualquer lugar, inclusive na rede interna da VPS, e ler a resposta.
 */
export function urlDoCdn(valor) {
  if (typeof valor !== 'string') return null
  try {
    const u = new URL(valor.trim())
    if (u.protocol !== 'https:') return null
    if (u.host !== 'cdn.sanity.io') return null
    // Só deste projeto e deste dataset.
    if (!u.pathname.includes(`/${PROJETO}/${DATASET}/`)) return null
    return u.href
  } catch {
    return null
  }
}
