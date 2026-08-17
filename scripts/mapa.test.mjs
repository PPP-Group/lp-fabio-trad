/**
 * Confere as promessas do mapa do jogo, sem navegador:
 *
 *  1. o começo da pista é limpo;
 *  2. no meio ainda existe passagem;
 *  3. no trecho final NÃO existe passagem nenhuma — pra qualquer posição do
 *     carro, algum buraco pega. É essa a afirmação que o final do jogo faz.
 *
 * Rodar com:  node scripts/mapa.test.mjs
 */

import {
  DIST_IMPOSSIVEL,
  DIST_SEM_SAIDA,
  FAIXA_DIRIGIVEL,
  TRECHO_LIMPO,
  colide,
  linhaDeBuracos,
  nomeFase,
} from '../src/components/jogo/mapa.js'

const PASSO_VARREDURA = 0.25

/** Posições do carro que escapam de todos os buracos dessa leva. */
function saidas(linha) {
  const livres = []
  for (let x = FAIXA_DIRIGIVEL.min; x <= FAIXA_DIRIGIVEL.max; x += PASSO_VARREDURA) {
    if (!linha.some((b) => colide(b, x))) livres.push(x)
  }
  return livres
}

let falhas = 0
const ok = (cond, msg) => {
  console.log(`${cond ? '  ok  ' : ' FALHA'}  ${msg}`)
  if (!cond) falhas++
}

console.log('\n1) largada limpa')
{
  let buracos = 0
  for (let oy = 0; oy < TRECHO_LIMPO; oy += 10) buracos += linhaDeBuracos(oy).length
  ok(buracos === 0, `nenhum buraco antes de ${TRECHO_LIMPO}px (achei ${buracos})`)
}

console.log('\n2) trecho do meio ainda tem passagem')
{
  let semSaida = 0
  const amostras = 400
  for (let i = 0; i < amostras; i++) {
    const oy = 1500 + Math.random() * (DIST_IMPOSSIVEL - 2000)
    const linha = linhaDeBuracos(oy)
    if (linha.length && saidas(linha).length === 0) semSaida++
  }
  ok(semSaida === 0, `${amostras} levas sorteadas, ${semSaida} sem saída (esperado 0)`)
}

console.log('\n3) trecho final é intransitável')
{
  let comSaida = 0
  const amostras = 600
  let exemplo = null
  for (let i = 0; i < amostras; i++) {
    const oy = DIST_SEM_SAIDA + Math.random() * 3000
    const linha = linhaDeBuracos(oy)
    const livres = saidas(linha)
    if (livres.length > 0) {
      comSaida++
      if (!exemplo) exemplo = { oy: Math.round(oy), buracos: linha.length, brechas: livres.length }
    }
  }
  ok(
    comSaida === 0,
    `${amostras} levas sorteadas depois de ${DIST_SEM_SAIDA}px, ${comSaida} com brecha` +
      (exemplo ? ` — ex.: ${JSON.stringify(exemplo)}` : ''),
  )
}

console.log('\n4) as fases seguem na ordem certa')
{
  ok(nomeFase(100) === 'tranquilo', 'início é "tranquilo"')
  ok(nomeFase(DIST_IMPOSSIVEL * 0.5) === 'esburacado', 'metade é "esburacado"')
  ok(nomeFase(DIST_IMPOSSIVEL * 0.85) === 'critico', '85% é "crítico"')
  ok(nomeFase(DIST_IMPOSSIVEL + 500) === 'impossivel', 'depois do marco é "impossível"')
}

console.log(falhas === 0 ? '\nTudo certo.\n' : `\n${falhas} falha(s).\n`)
process.exit(falhas === 0 ? 0 : 1)
