/**
 * Gera public/assets/plano-de-governo-fabio-trad.pdf a partir dos mesmos
 * 13 eixos que aparecem em Propostas (`src/data/campanha.js`). Uma fonte só
 * de verdade: mudou um eixo no site, roda este script e o PDF acompanha.
 *
 *   npm install --no-save pdf-lib
 *   node scripts/plano.mjs
 */
import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { candidato, propostas } from '../src/data/campanha.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SAIDA = path.join(__dirname, '..', 'public', 'assets', 'plano-de-governo-fabio-trad.pdf')

// Paleta da campanha (src/styles/tokens.css)
const VERMELHO = rgb(0xf3 / 255, 0x1f / 255, 0x29 / 255)
const VINHO = rgb(0xab / 255, 0x14 / 255, 0x4c / 255)
const AMARELO = rgb(0xec / 255, 0xc9 / 255, 0x27 / 255)
const CARVAO = rgb(0x1d / 255, 0x1d / 255, 0x1b / 255)
const BRANCO = rgb(1, 1, 1)
const CINZA = rgb(0.35, 0.35, 0.35)
const CINZA_CLARO = rgb(0.55, 0.55, 0.55)

function envolverTexto(texto, fonte, tamanho, largMax) {
  const palavras = texto.split(' ')
  const linhas = []
  let linha = ''
  for (const palavra of palavras) {
    const teste = linha ? `${linha} ${palavra}` : palavra
    if (fonte.widthOfTextAtSize(teste, tamanho) > largMax && linha) {
      linhas.push(linha)
      linha = palavra
    } else {
      linha = teste
    }
  }
  if (linha) linhas.push(linha)
  return linhas
}

async function main() {
  const doc = await PDFDocument.create()
  doc.setTitle(`Programa de Governo ${candidato.ano} — ${candidato.nome} ${candidato.numero}`)
  doc.setAuthor(`${candidato.nome} ${candidato.numero} — ${candidato.cargo} de ${candidato.estado}`)
  doc.setSubject(`Os ${propostas.eixos.length} eixos do Programa de Governo ${candidato.ano}`)
  doc.setCreator('fabiotrad13.com.br')
  doc.setProducer('fabiotrad13.com.br')

  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const negrito = await doc.embedFont(StandardFonts.HelveticaBold)

  const [LARG, ALT] = PageSizes.A4
  const MARGEM = 64
  const largTexto = LARG - MARGEM * 2

  // ---------- capa ----------
  const [nome1, nome2 = ''] = candidato.nome.split(' ')
  const capa = doc.addPage([LARG, ALT])
  capa.drawRectangle({ x: 0, y: 0, width: LARG, height: ALT, color: VINHO })
  capa.drawRectangle({ x: 0, y: ALT * 0.35, width: LARG, height: ALT * 0.65, color: VERMELHO })

  capa.drawText('PROGRAMA DE GOVERNO', { x: MARGEM, y: ALT - 150, size: 15, font: negrito, color: AMARELO })
  capa.drawText(candidato.ano, { x: MARGEM, y: ALT - 175, size: 15, font: negrito, color: AMARELO })

  capa.drawText(nome1, { x: MARGEM, y: ALT - 260, size: 56, font: negrito, color: BRANCO })
  if (nome2) capa.drawText(nome2, { x: MARGEM, y: ALT - 320, size: 56, font: negrito, color: BRANCO })
  capa.drawText(candidato.numero, { x: MARGEM, y: ALT - 390, size: 40, font: negrito, color: AMARELO })
  capa.drawText(`Candidato a ${candidato.cargo} de ${candidato.estado}`, {
    x: MARGEM,
    y: ALT - 420,
    size: 13,
    font: regular,
    color: BRANCO,
  })

  capa.drawLine({
    start: { x: MARGEM, y: 170 },
    end: { x: LARG - MARGEM, y: 170 },
    thickness: 1,
    color: rgb(1, 1, 1),
    opacity: 0.35,
  })
  capa.drawText(`Os ${propostas.eixos.length} eixos que organizam este plano de governo,`, {
    x: MARGEM,
    y: 145,
    size: 12,
    font: regular,
    color: BRANCO,
  })
  capa.drawText('lado a lado com o compromisso de cada um deles.', {
    x: MARGEM,
    y: 128,
    size: 12,
    font: regular,
    color: BRANCO,
  })
  capa.drawText(`"${candidato.slogan}"`, { x: MARGEM, y: 70, size: 13, font: negrito, color: AMARELO })

  // ---------- páginas de eixos ----------
  let pagina = doc.addPage([LARG, ALT])
  let y = ALT - MARGEM

  function cabecalhoPagina(p) {
    p.drawRectangle({ x: 0, y: ALT - 10, width: LARG, height: 10, color: VERMELHO })
    p.drawText(`${candidato.nome.toUpperCase()} ${candidato.numero} · PROGRAMA DE GOVERNO ${candidato.ano}`, {
      x: MARGEM,
      y: ALT - 34,
      size: 9,
      font: negrito,
      color: CINZA_CLARO,
    })
  }

  function rodapePagina(p, numero) {
    p.drawLine({
      start: { x: MARGEM, y: 46 },
      end: { x: LARG - MARGEM, y: 46 },
      thickness: 0.75,
      color: rgb(0.85, 0.85, 0.85),
    })
    p.drawText('fabiotrad13.com.br', { x: MARGEM, y: 30, size: 9, font: regular, color: CINZA_CLARO })
    const txtPag = String(numero)
    const largPag = negrito.widthOfTextAtSize(txtPag, 9)
    p.drawText(txtPag, { x: LARG - MARGEM - largPag, y: 30, size: 9, font: negrito, color: CINZA_CLARO })
  }

  cabecalhoPagina(pagina)
  let numeroPagina = 2
  rodapePagina(pagina, numeroPagina)

  y -= 20
  pagina.drawText('Os 13 eixos', { x: MARGEM, y, size: 26, font: negrito, color: CARVAO })
  y -= 26
  pagina.drawText('do Programa de Governo', { x: MARGEM, y, size: 26, font: negrito, color: CARVAO })
  y -= 44

  propostas.eixos.forEach((item, indice) => {
    const numero = String(indice + 1).padStart(2, '0')
    const linhasTexto = envolverTexto(item.texto, regular, 11.5, largTexto - 6)
    const alturaBloco = 34 + linhasTexto.length * 16 + 22

    if (y - alturaBloco < 70) {
      pagina = doc.addPage([LARG, ALT])
      numeroPagina += 1
      cabecalhoPagina(pagina)
      rodapePagina(pagina, numeroPagina)
      y = ALT - MARGEM - 10
    }

    pagina.drawText(numero, { x: MARGEM, y: y - 22, size: 26, font: negrito, color: AMARELO })
    pagina.drawRectangle({ x: MARGEM + 40, y: y - 26, width: 3, height: 26, color: VERMELHO })
    pagina.drawText(item.eixo, { x: MARGEM + 56, y: y - 18, size: 15.5, font: negrito, color: CARVAO })

    y -= 34
    for (const linha of linhasTexto) {
      pagina.drawText(linha, { x: MARGEM + 56, y, size: 11.5, font: regular, color: CINZA })
      y -= 16
    }
    y -= 22
  })

  // ---------- página final: compromisso ----------
  const final = doc.addPage([LARG, ALT])
  final.drawRectangle({ x: 0, y: 0, width: LARG, height: ALT, color: CARVAO })
  const [linha1Titulo, ...restoTitulo] = propostas.compromisso.titulo.toUpperCase().split(' COM ')
  final.drawText(linha1Titulo, { x: MARGEM, y: ALT / 2 + 70, size: 24, font: negrito, color: AMARELO })
  if (restoTitulo.length) {
    final.drawText(`COM ${restoTitulo.join(' COM ')}`, {
      x: MARGEM,
      y: ALT / 2 + 40,
      size: 24,
      font: negrito,
      color: AMARELO,
    })
  }

  const linhasCompromisso = envolverTexto(propostas.compromisso.texto, regular, 14, largTexto - 40)
  let yc = ALT / 2 - 10
  for (const linha of linhasCompromisso) {
    final.drawText(linha, { x: MARGEM, y: yc, size: 14, font: regular, color: BRANCO })
    yc -= 22
  }

  final.drawText(`${candidato.nome} ${candidato.numero} · ${candidato.cargo} · ${candidato.estado}`, {
    x: MARGEM,
    y: 60,
    size: 11,
    font: negrito,
    color: rgb(0.75, 0.75, 0.75),
  })
  final.drawText('fabiotrad13.com.br', { x: MARGEM, y: 42, size: 11, font: regular, color: rgb(0.6, 0.6, 0.6) })

  fs.mkdirSync(path.dirname(SAIDA), { recursive: true })
  const bytes = await doc.save()
  fs.writeFileSync(SAIDA, bytes)
  console.log('gerado:', SAIDA, `(${bytes.length} bytes, ${doc.getPageCount()} páginas)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
