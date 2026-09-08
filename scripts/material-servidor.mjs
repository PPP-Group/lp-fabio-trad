/**
 * Guarda os arquivos do material de apoio em disco e monta o ZIP de tudo.
 *
 * O servidor busca cada arquivo no CDN do Sanity **uma vez** e guarda uma cópia
 * local; a partir daí quem baixa é servido por nós. É o que mantém a promessa
 * do site de pé — o navegador do eleitor não fala com terceiro nenhum, nem para
 * ver as miniaturas da seção — e de quebra tira do Sanity a banda de todo mundo
 * que baixar.
 *
 * O cache é descartável de propósito: fica na pasta temporária do sistema e
 * some quando o contêiner reinicia. Perder é barato (basta buscar de novo),
 * e assim um arquivo trocado no painel não fica preso numa cópia velha.
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import zlib from 'node:zlib'

const PASTA = path.join(os.tmpdir(), 'material-fabio13')

// Um teto para o que aceitamos guardar. O material são imagens de rede social;
// se algo chegar muito acima disso, é engano de quem enviou, e vale falhar
// alto em vez de encher o disco da VPS em silêncio.
const LIMITE_POR_ARQUIVO = 64 * 1024 * 1024

/** O nome do arquivo em cache. Deriva do id do asset, que já é único. */
function caminhoDe(id, sufixo) {
  const chave = crypto.createHash('sha256').update(`${id}|${sufixo}`).digest('hex').slice(0, 32)
  return path.join(PASTA, `${chave}.bin`)
}

/**
 * Devolve o caminho local do arquivo, baixando na primeira vez.
 *
 * Grava num nome temporário e só depois renomeia. Sem isso, dois pedidos ao
 * mesmo tempo — ou um contêiner morto no meio do download — deixariam no cache
 * um arquivo pela metade, e ele seria servido como se estivesse inteiro.
 */
export async function emCache(item, { sufixo = '', transformacao = '' } = {}) {
  const destino = caminhoDe(item.id, sufixo)
  if (fs.existsSync(destino)) return destino

  const resposta = await fetch(item.url + transformacao, {
    signal: AbortSignal.timeout(30000),
  })
  if (!resposta.ok) {
    throw new Error(`CDN respondeu ${resposta.status} para ${item.nomeArquivo}`)
  }

  const dados = Buffer.from(await resposta.arrayBuffer())
  if (dados.length > LIMITE_POR_ARQUIVO) {
    throw new Error(`${item.nomeArquivo} passa do limite de ${LIMITE_POR_ARQUIVO} bytes`)
  }

  fs.mkdirSync(PASTA, { recursive: true })
  const temporario = `${destino}.${process.pid}.${Date.now()}.parcial`
  fs.writeFileSync(temporario, dados)
  fs.renameSync(temporario, destino)

  return destino
}

// -- ZIP ---------------------------------------------------------------------
//
// Guardado sem compressão (método 0). Não é preguiça: o material são PNG e JPEG,
// que já estão comprimidos — passar deflate neles gastaria CPU da VPS para
// economizar quase nada. Assim o ZIP é só um envelope, e sai rápido.

// Uma data fixa, para o mesmo conteúdo gerar sempre o mesmo arquivo.
const DATA_DOS = ((2026 - 1980) << 9) | (1 << 5) | 1
const HORA_DOS = 12 << 11

function cabecalhoLocal(nome, crc, tamanho) {
  const nomeBytes = Buffer.from(nome, 'utf8')
  const b = Buffer.alloc(30)
  b.writeUInt32LE(0x04034b50, 0)
  b.writeUInt16LE(20, 4) // versão necessária
  b.writeUInt16LE(0x0800, 6) // bit 11: o nome está em UTF-8
  b.writeUInt16LE(0, 8) // método: guardado
  b.writeUInt16LE(HORA_DOS, 10)
  b.writeUInt16LE(DATA_DOS, 12)
  b.writeUInt32LE(crc, 14)
  b.writeUInt32LE(tamanho, 18) // comprimido
  b.writeUInt32LE(tamanho, 22) // original
  b.writeUInt16LE(nomeBytes.length, 26)
  b.writeUInt16LE(0, 28)
  return Buffer.concat([b, nomeBytes])
}

function entradaCentral(nome, crc, tamanho, deslocamento) {
  const nomeBytes = Buffer.from(nome, 'utf8')
  const b = Buffer.alloc(46)
  b.writeUInt32LE(0x02014b50, 0)
  b.writeUInt16LE(20, 4)
  b.writeUInt16LE(20, 6)
  b.writeUInt16LE(0x0800, 8)
  b.writeUInt16LE(0, 10)
  b.writeUInt16LE(HORA_DOS, 12)
  b.writeUInt16LE(DATA_DOS, 14)
  b.writeUInt32LE(crc, 16)
  b.writeUInt32LE(tamanho, 20)
  b.writeUInt32LE(tamanho, 24)
  b.writeUInt16LE(nomeBytes.length, 28)
  b.writeUInt16LE(0, 30) // extra
  b.writeUInt16LE(0, 32) // comentário
  b.writeUInt16LE(0, 34) // disco
  b.writeUInt16LE(0, 36) // atributos internos
  b.writeUInt32LE(0, 38) // atributos externos
  b.writeUInt32LE(deslocamento, 42)
  return Buffer.concat([b, nomeBytes])
}

function fecho(quantas, tamanhoCentral, inicioCentral) {
  const b = Buffer.alloc(22)
  b.writeUInt32LE(0x06054b50, 0)
  b.writeUInt16LE(0, 4)
  b.writeUInt16LE(0, 6)
  b.writeUInt16LE(quantas, 8)
  b.writeUInt16LE(quantas, 10)
  b.writeUInt32LE(tamanhoCentral, 12)
  b.writeUInt32LE(inicioCentral, 16)
  b.writeUInt16LE(0, 20)
  return b
}

/**
 * Nomes únicos dentro do ZIP.
 *
 * Dois arquivos com o mesmo nome dentro de um ZIP é coisa que alguns
 * descompactadores resolvem sobrescrevendo um com o outro — a pessoa baixaria
 * dez peças e abriria oito. E nome repetido é provável aqui: quem exporta de um
 * editor sai com "card.png", "card (1).png" ou coisa pior.
 */
function nomesUnicos(itens) {
  const vistos = new Map()
  return itens.map((item) => {
    const nome = item.nomeArquivo
    if (!vistos.has(nome)) {
      vistos.set(nome, 1)
      return nome
    }
    const n = vistos.get(nome) + 1
    vistos.set(nome, n)
    const ponto = nome.lastIndexOf('.')
    return ponto > 0
      ? `${nome.slice(0, ponto)}-${n}${nome.slice(ponto)}`
      : `${nome}-${n}`
  })
}

/**
 * Monta o ZIP de todos os arquivos e escreve na resposta.
 *
 * Escreve peça por peça em vez de montar tudo na memória: dez imagens cabem,
 * mas o dia em que a campanha subir um vídeo, montar inteiro antes de enviar
 * seria o dia em que o servidor cai por falta de memória.
 */
export async function escreverZip(itens, res) {
  const nomes = nomesUnicos(itens)
  const central = []
  let deslocamento = 0

  for (let i = 0; i < itens.length; i++) {
    const caminho = await emCache(itens[i])
    const dados = fs.readFileSync(caminho)
    const crc = zlib.crc32(dados)
    const nome = nomes[i]

    const cabecalho = cabecalhoLocal(nome, crc, dados.length)
    res.write(cabecalho)
    res.write(dados)

    central.push(entradaCentral(nome, crc, dados.length, deslocamento))
    deslocamento += cabecalho.length + dados.length
  }

  const diretorio = Buffer.concat(central)
  res.write(diretorio)
  res.write(fecho(itens.length, diretorio.length, deslocamento))
  res.end()
}
