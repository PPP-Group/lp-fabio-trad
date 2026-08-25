/**
 * Busca as matérias no Sanity e grava em `src/data/materias.json`.
 *
 * Roda antes do `vite build` (ver o script `build` no package.json). O que ele
 * grava é a **lista de partida**: o que a página mostra no primeiro quadro,
 * antes de qualquer requisição. Segundos depois o `server.js` entrega a lista
 * corrente e a página se corrige sozinha se algo mudou desde o último deploy.
 *
 * Foi assim que este script perdeu o posto de fonte da verdade, e por um bom
 * motivo. Enquanto ele era a única fonte, publicar no painel não mudava nada:
 * o Docker via o código-fonte igual, reaproveitava a imagem inteira, o deploy
 * terminava em um segundo sem construir nada e a matéria nova nunca chegava
 * ao ar. O que ele grava aqui continua valendo — só não decide mais sozinho.
 *
 * Uma regra segue de pé: **o build não pode quebrar por causa do Sanity.** Se
 * a API estiver fora do ar, o arquivo de antes é mantido e o deploy segue.
 *
 *     node scripts/materias.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buscarMaterias } from './materias-comum.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SAIDA = path.join(__dirname, '..', 'src', 'data', 'materias.json')

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

async function main() {
  let boas
  let descartadas

  try {
    ;({ boas, descartadas } = await buscarMaterias())
  } catch (erro) {
    const tinha = fs.existsSync(SAIDA)
    console.warn(`[materias] não deu para buscar no Sanity: ${erro.message}`)
    console.warn(
      tinha
        ? '[materias] seguindo com o arquivo anterior — o servidor corrige a lista assim que subir.'
        : '[materias] não há arquivo anterior; gravando lista vazia (o servidor preenche depois).',
    )
    if (!tinha) gravar([])
    return
  }

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
