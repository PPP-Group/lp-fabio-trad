/**
 * O mapa da estrada — só dados e sorteio, sem nada de canvas.
 *
 * Fica separado do motor de propósito: a pista é um fato do mundo, existe
 * antes de ser desenhada e antes de ser vista. Assim também dá pra conferir
 * por fora que o trecho final é mesmo intransitável (ver `scripts/mapa.test.mjs`).
 *
 * `oy` é a posição ao longo do mapa, em pixels, crescendo pra frente.
 */

// ---------- medidas da pista ----------
export const L = 256
export const A = 240
export const PISTA_X = 52
export const PISTA_L = 152
export const PISTA_D = PISTA_X + PISTA_L
export const CARRO_L = 22

// ---------- marcos de dificuldade ----------
// Recalibrados pra a partida inteira caber no minuto (ver TEMPO_MAXIMO no
// motor): com a velocidade de cruzeiro daqui, o trecho sem saída chega por
// volta dos 45-50s de jogo pra maioria, o corte duro de 60s pega o resto.
export const DIST_IMPOSSIVEL = 5200 // daqui pra frente a pista começa a fechar
export const DIST_SEM_SAIDA = 6900 // daqui pra frente não sobra brecha nenhuma
export const TRECHO_LIMPO = 220 // largada sem buraco, só o tempo de pegar o jeito

// Folga da colisão: a caixa é menor que o desenho dos dois lados, então
// raspar na beirada não conta como cair no buraco.
const FOLGA_CARRO = 5
const FOLGA_BURACO = 3

/** Feitios de buraco. `#` é a boca, `o` é a borda esfarelada. */
export const BURACOS = [
  {
    larg: 22,
    mapa: ['.oooooo...', 'oo####oo..', 'o######oo.', 'o#######o.', '.o#####oo.', '..oooooo..'],
  },
  {
    larg: 32,
    mapa: [
      '..oooooooo..',
      '.oo######ooo',
      'oo########oo',
      'o##########o',
      'o##########o',
      '.oo######oo.',
      '..oooooooo..',
    ],
  },
  {
    larg: 44,
    mapa: [
      '...oooooooooo...',
      '.ooo########ooo.',
      'oo############oo',
      'o##############o',
      'o##############o',
      'oo############oo',
      '.oo##########oo.',
      '..oooooooooo....',
    ],
  },
]

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const lerp = (a, b, t) => a + (b - a) * t

/** Até onde o centro do carro consegue ir, de encostado a encostado. */
export const FAIXA_DIRIGIVEL = {
  min: PISTA_X + CARRO_L / 2 - 3,
  max: PISTA_D - CARRO_L / 2 + 3,
}

/**
 * A que distância do centro de um buraco o carro ainda cai nele.
 * É daqui que saem tanto a colisão quanto o desenho do trecho intransitável —
 * uma definição só, pra não haver como as duas discordarem.
 */
export function alcanceDe(tipo) {
  return CARRO_L / 2 - FOLGA_CARRO + (BURACOS[tipo].larg / 2 - FOLGA_BURACO)
}

/** A regra de colisão, uma só, usada pelo motor e pelo teste. */
export function colide(buraco, carroX) {
  return Math.abs(buraco.x - carroX) < alcanceDe(buraco.tipo)
}

export function dificuldadeEm(oy) {
  const t = clamp(oy / DIST_IMPOSSIVEL, 0, 1)
  const alem =
    oy > DIST_IMPOSSIVEL ? clamp((oy - DIST_IMPOSSIVEL) / (DIST_SEM_SAIDA - DIST_IMPOSSIVEL), 0, 1) : 0
  return { t, alem }
}

function tipoPorLargura(alvo) {
  let melhor = 0
  for (let i = 1; i < BURACOS.length; i++) {
    if (Math.abs(BURACOS[i].larg - alvo) < Math.abs(BURACOS[melhor].larg - alvo)) melhor = i
  }
  return melhor
}

/** Buracos soltos, com bastante asfalto bom em volta. */
export function buracosSoltos(oy, quantos) {
  const saida = []
  for (let i = 0; i < quantos; i++) {
    const tipo = (Math.random() * BURACOS.length) | 0
    const meia = BURACOS[tipo].larg / 2
    const x = PISTA_X + meia + 4 + Math.random() * (PISTA_L - meia * 2 - 8)
    saida.push({ oy: oy + (Math.random() * 16 - 8), x, tipo })
  }
  return saida
}

/**
 * A pista fechada de ponta a ponta, sem passagem.
 *
 * Os buracos são colocados pelo *alcance* de cada um, não pelo desenho: cada
 * um começa a pegar um pouco antes de o anterior parar de pegar. Por
 * construção não sobra nenhuma posição de carro entre `FAIXA_DIRIGIVEL.min` e
 * `.max` que escape de todos — é isso que o fim do jogo afirma, e o que
 * `scripts/mapa.test.mjs` confere.
 */
function faixaFechada(oy) {
  const SOBREPOR = 2
  const saida = []
  let cobreAte = FAIXA_DIRIGIVEL.min - 1
  while (cobreAte < FAIXA_DIRIGIVEL.max) {
    const tipo = tipoPorLargura(22 + Math.random() * 22)
    const alcance = alcanceDe(tipo)
    const centro = cobreAte - SOBREPOR + alcance
    saida.push({ oy: oy + (Math.random() * 12 - 6), x: centro, tipo })
    cobreAte = centro + alcance
  }
  return saida
}

/**
 * Uma faixa de buracos atravessando a pista, deixando uma passagem de asfalto
 * bom de `brecha` pixels no meio. Com `brecha <= 0` não sobra passagem.
 */
export function faixaComBrecha(oy, brecha) {
  if (brecha <= 0) return faixaFechada(oy)

  const esq = PISTA_X + 3
  const dir = PISTA_D - 3
  const centroBrecha = esq + brecha / 2 + Math.random() * Math.max(0, dir - esq - brecha)

  const saida = []
  let x = esq
  while (x < dir) {
    const tipo = tipoPorLargura(22 + Math.random() * 22)
    const larg = BURACOS[tipo].larg
    const centro = x + larg / 2
    const naPassagem = Math.abs(centro - centroBrecha) < brecha / 2 + larg / 2
    if (!naPassagem && centro < dir) saida.push({ oy: oy + (Math.random() * 12 - 6), x: centro, tipo })
    x += larg + 2 + Math.random() * 4
  }
  return saida
}

/** Quanto anda até a próxima leva de buracos. */
export function passoEntreLinhas(oy) {
  const { t, alem } = dificuldadeEm(oy)
  const base = lerp(172, 88, t) * (alem > 0 ? lerp(1, 0.6, alem) : 1)
  return base * (0.82 + Math.random() * 0.36)
}

/** O que a pista tem nessa altura do mapa. */
export function linhaDeBuracos(oy) {
  if (oy < TRECHO_LIMPO) return []
  const { t, alem } = dificuldadeEm(oy)
  if (alem > 0) return faixaComBrecha(oy, lerp(49, -5, alem))
  if (t > 0.72) return faixaComBrecha(oy, lerp(92, 65, (t - 0.72) / 0.28))
  if (t > 0.44) {
    return Math.random() < 0.55 ? faixaComBrecha(oy, lerp(119, 95, (t - 0.44) / 0.28)) : buracosSoltos(oy, 2)
  }
  if (t > 0.18) return buracosSoltos(oy, Math.random() < 0.4 ? 2 : 1)
  return Math.random() < 0.75 ? buracosSoltos(oy, 1) : []
}

export function nomeFase(oy) {
  const { t, alem } = dificuldadeEm(oy)
  if (alem > 0) return 'impossivel'
  if (t > 0.72) return 'critico'
  if (t > 0.35) return 'esburacado'
  return 'tranquilo'
}
