/**
 * A busca do material de apoio no Sanity.
 *
 * Devolve só o que o site precisa saber sobre cada arquivo: como chamá-lo, de
 * onde buscá-lo e quanto ele pesa. Quem entrega o arquivo ao visitante é o
 * `server.js` — o endereço do CDN não sai daqui para o navegador de ninguém.
 *
 * Como nas matérias, o que vem de fora é conferido antes de entrar. Aqui a
 * conferência importa mais: destes valores sai uma URL que o **nosso servidor**
 * vai buscar, então um endereço torto não seria um link quebrado na página,
 * seria o servidor buscando o que mandarem.
 */

import { consultar, urlDoCdn } from './sanity.mjs'

// Um documento só, de id fixo — é uma pasta, não uma coleção. A ordem dos
// arquivos é a que o editor deixou no painel.
const CONSULTA = `*[_id == "materialApoio"][0].arquivos[]{
  "titulo": titulo,
  "id": asset->_id,
  "url": asset->url,
  "nome": asset->originalFilename,
  "tipo": asset->mimeType,
  "tamanho": asset->size
}`

/** "arquivo.png" a partir do id do asset, quando o original não veio. */
function nomeDeReserva(id, tipo) {
  const ext = typeof tipo === 'string' && tipo.includes('/') ? tipo.split('/')[1] : 'bin'
  return `${String(id || 'arquivo').replace(/^image-/, '').slice(0, 24)}.${ext}`
}

/**
 * Tira do nome tudo que não pode ir para um cabeçalho de download nem para
 * dentro de um ZIP: barras, caracteres de controle, aspas.
 *
 * O nome vem do arquivo que o editor enviou, então é texto de fora. Sem esta
 * limpeza, um nome com barra viraria pasta dentro do ZIP, e um com aspas ou
 * quebra de linha quebraria o cabeçalho `Content-Disposition`.
 */
export function nomeSeguro(bruto, reserva) {
  // Os caracteres de controle saem por código, e não por expressão regular,
  // porque uma classe de regex com eles dentro só se escreve com bytes
  // invisíveis no fonte ou com uma pilha de escapes — as duas formas são
  // fáceis de estragar sem ninguém enxergar na revisão.
  const semControle = [...String(bruto || '')]
    .filter((c) => {
      const codigo = c.charCodeAt(0)
      return codigo > 31 && codigo !== 127
    })
    .join('')

  const limpo = semControle
    .replace(/[\\/]/g, '-')
    .replace(/["']/g, '')
    .trim()

  return limpo && limpo !== '.' && limpo !== '..' ? limpo.slice(0, 120) : reserva
}

/** Separa o que pode ser servido do que não pode, com o motivo. */
export function limpar(bruto) {
  const boas = []
  const descartados = []

  for (const item of Array.isArray(bruto) ? bruto : []) {
    const id = typeof item?.id === 'string' && item.id ? item.id : null
    const url = urlDoCdn(item?.url)

    if (!id || !url) {
      descartados.push(
        `${item?.titulo || item?.nome || '(sem nome)'} — ` +
          (!id ? 'sem identificador' : 'endereço fora do CDN do Sanity'),
      )
      continue
    }

    const nomeArquivo = nomeSeguro(item?.nome, nomeDeReserva(id, item?.tipo))
    const titulo = nomeSeguro(item?.titulo, '') || nomeArquivo

    boas.push({
      id,
      titulo,
      nomeArquivo,
      tipo: typeof item?.tipo === 'string' ? item.tipo : 'application/octet-stream',
      tamanho: Number.isFinite(item?.tamanho) ? item.tamanho : null,
      // Fica só no servidor: é daqui que ele busca o arquivo uma vez.
      url,
    })
  }

  return { boas, descartados }
}

export async function buscarMaterial({ timeout = 20000 } = {}) {
  const bruto = await consultar(CONSULTA, { timeout })
  // Lista vazia e documento inexistente são a mesma coisa aqui: nenhum
  // arquivo publicado, e a aba não aparece.
  return limpar(bruto ?? [])
}
