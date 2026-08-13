/**
 * Motor do jogo "Desvie se conseguir" — 2D visto de cima, no espírito dos
 * jogos de carro de NES. Canvas puro, sem dependências.
 *
 * A ideia central: **a pista já existe**. O mapa é sorteado muito antes de
 * entrar em cena (ver `ADIANTE`), então nenhum buraco "nasce" na borda da
 * tela — ele já estava lá, gravado no mapa, e só apareceu porque o carro
 * andou até ele. Quanto mais longe no mapa, mais esburacado o trecho: lá na
 * frente a pista está tão destruída que não sobra brecha nenhuma pra passar.
 *
 * Sistema de coordenadas:
 *   `oy` = posição no mapa (cresce pra frente, em pixels de mundo)
 *   `carroMundo` = onde o carro está no mapa
 *   tela: `y = CARRO_Y - (oy - carroMundo)` — o que está à frente fica em cima
 *
 * Como a pista é feita fica em `mapa.js`; aqui é só o desenho e o jogo.
 */

import {
  A,
  BURACOS,
  CARRO_L,
  FAIXA_DIRIGIVEL,
  L,
  PISTA_D,
  PISTA_L,
  PISTA_X,
  colide,
  dificuldadeEm,
  linhaDeBuracos,
  nomeFase,
  passoEntreLinhas,
} from './mapa'

// ---------- Pilotos ----------
export const PILOTOS = {
  fabio: {
    id: 'fabio',
    nome: 'Fábio Trad',
    papel: 'Candidato a Governador',
    foto: '/assets/fabio-recorte.webp',
    carro: '#e02030',
    carroEscuro: '#a01020',
    carroClaro: '#f8586c',
  },
  gilda: {
    id: 'gilda',
    nome: 'Dona Gilda',
    papel: 'Candidata a Vice-Governadora',
    foto: '/assets/gilda-recorte.webp',
    carro: '#b02058',
    carroEscuro: '#7c1038',
    carroClaro: '#e05888',
  },
}

// ---------- Desenho ----------
const CARRO_Y = 188 // altura fixa do carro na tela
const CARRO_A = 36

// Quanto de mapa fica pronto à frente da câmera. É bem mais do que cabe na
// tela: quando um buraco aparece, ele já existia há uns 15 segundos.
const ADIANTE = 1500

// folga suficiente pra quase todo mundo chegar no trecho intransitável, que é
// onde o jogo quer chegar
export const VIDAS_INICIAIS = 4

// ---------- Paleta, no tom chapado de 8 bits ----------
const COR = {
  gramaEscura: '#2c7a20',
  grama: '#3c9c28',
  gramaClara: '#54b83c',
  terra: '#8c6c3c',
  asfalto: '#585868',
  asfaltoAlt: '#4c4c5c',
  remendo: '#3c3c4c',
  faixa: '#f8f8f8',
  faixaCentro: '#f8d878',
  buracoBorda: '#3a2c1c',
  buracoMeio: '#1c1410',
  buracoFundo: '#0c0808',
  vidro: '#5088c8',
  vidroClaro: '#88bce8',
  pneu: '#181818',
  contorno: '#101018',
  farol: '#f8e878',
  lanterna: '#f85038',
  telhado: '#b04828',
  parede: '#e8d0a0',
  porta: '#7c5424',
  tronco: '#7c5424',
  copaEscura: '#1c6c18',
  copa: '#2c9424',
  copaClara: '#4cb83c',
  placaFundo: '#d81828',
  placaTexto: '#f8d878',
  poste: '#909098',
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const lerp = (a, b, t) => a + (b - a) * t

const CACHE_IMG = {}
function carregarImagem(src) {
  if (!CACHE_IMG[src]) {
    const img = new Image()
    img.src = src
    CACHE_IMG[src] = img
  }
  return CACHE_IMG[src]
}

// ---------- Sprites em pixel art ----------
// Cada caractere é um pixel. O mapa de cores vem junto no desenho.

// Fusca visto de cima, 11 x 18
const SPRITE_CARRO = [
  '...OOOOO...',
  '..OOBBBOO..',
  '.OOBBBBBOO.',
  '.OBFFBFFBO.',
  '.OBBBBBBBO.',
  'OTOBGGGBOTO',
  'OTOGGGGGOTO',
  '.OBGGGGGBO.',
  '.OBBBBBBBO.',
  '.OBBcccBBO.',
  '.OBBcccBBO.',
  '.OBBBBBBBO.',
  '.OBGGGGGBO.',
  'OTOGGGGGOTO',
  'OTOBGGGBOTO',
  '.OBLLBLLBO.',
  '.OOBBBBBOO.',
  '...OOOOO...',
]

const ARVORE = [
  '..ccc..',
  '.cCCCc.',
  'cCCCCCc',
  'cCCeCCc',
  'cCCCCCc',
  '.cCCCc.',
  '..eTe..',
  '...T...',
  '...T...',
  '..TTT..',
]

const ARBUSTO = ['.ccc.', 'cCCCc', 'cCeCc', '.CCC.']

const PLACA = ['PPPPPP', 'PAAAAP', 'PAAAAP', 'PPPPPP', '..TT..', '..TT..', '..TT..']

const CASA = [
  '...RRRRR...',
  '..RRRRRRR..',
  '.RRRRRRRRR.',
  'RRRRRRRRRRR',
  '.WWWWWWWWW.',
  '.WGGWWWGGW.',
  '.WGGWWWGGW.',
  '.WWWDDDWWW.',
  '.WWWDDDWWW.',
  '.WWWDDDWWW.',
]

const POSTE = ['.p.', '.p.', '.p.', '.p.', 'ppp']

// ---------- Áudio ----------
function criarAudio() {
  let ctx = null
  let motorOsc = null
  let motorGain = null
  let mudo = false

  function ctxPronto() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    return ctx
  }

  function blip({ freq = 440, dur = 0.12, tipo = 'square', ganho = 0.08, queda = true } = {}) {
    if (mudo) return
    const c = ctxPronto()
    if (!c) return
    const osc = c.createOscillator()
    osc.type = tipo
    const g = c.createGain()
    g.gain.value = 0
    osc.frequency.value = freq
    osc.connect(g).connect(c.destination)
    const t = c.currentTime
    g.gain.linearRampToValueAtTime(ganho, t + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur)
    if (queda) osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * 0.45), t + dur)
    osc.start(t)
    osc.stop(t + dur + 0.03)
  }

  return {
    ligarMotor() {
      if (mudo) return
      const c = ctxPronto()
      if (!c || motorOsc) return
      motorOsc = c.createOscillator()
      motorOsc.type = 'triangle'
      const filtro = c.createBiquadFilter()
      filtro.type = 'lowpass'
      filtro.frequency.value = 260
      motorGain = c.createGain()
      motorGain.gain.value = 0
      motorOsc.connect(filtro).connect(motorGain).connect(c.destination)
      motorOsc.frequency.value = 62
      motorOsc.start()
    },
    atualizarMotor(velNorm) {
      if (!motorOsc || !ctx) return
      motorOsc.frequency.setTargetAtTime(62 + velNorm * 46, ctx.currentTime, 0.12)
      motorGain.gain.setTargetAtTime(mudo ? 0 : 0.016 + velNorm * 0.016, ctx.currentTime, 0.2)
    },
    desligarMotor() {
      if (motorOsc) {
        try {
          motorOsc.stop()
        } catch {
          /* já parado */
        }
        motorOsc.disconnect()
        motorOsc = null
      }
      motorGain = null
    },
    batida: () => blip({ freq: 96, dur: 0.2, tipo: 'square', ganho: 0.16 }),
    clique: () => blip({ freq: 660, dur: 0.05, ganho: 0.06, queda: false }),
    fim: () => {
      blip({ freq: 400, dur: 0.16, ganho: 0.12 })
      setTimeout(() => blip({ freq: 300, dur: 0.18, ganho: 0.12 }), 150)
      setTimeout(() => blip({ freq: 190, dur: 0.36, ganho: 0.13 }), 320)
    },
    definirMudo(v) {
      mudo = v
      if (v) this.desligarMotor()
    },
    suspender() {
      if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {})
    },
    retomar() {
      if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {})
    },
    destruir() {
      this.desligarMotor()
      if (ctx) ctx.close().catch(() => {})
      ctx = null
    },
  }
}

// ---------- Motor ----------
export function criarMotor(canvas, opts = {}) {
  const ctx = canvas.getContext('2d')
  canvas.width = L
  canvas.height = A
  ctx.imageSmoothingEnabled = false

  const refs = opts.refs || {}
  const onFim = opts.onFim || (() => {})
  const onFase = opts.onFase || (() => {})

  const reduzMovimento =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const audio = criarAudio()
  let pilotoAtual = PILOTOS.fabio
  const imagensPiloto = {}
  Object.values(PILOTOS).forEach((p) => {
    imagensPiloto[p.id] = carregarImagem(p.foto)
  })

  const teclas = { esquerda: false, direita: false, cima: false, baixo: false }

  // --- estado ---
  let carroMundo = 0
  let carroX = L / 2
  let carroVX = 0
  let velocidade = 0
  let vidas = 3
  let tempoJogo = 0
  let animT = 0
  let flashTimer = 0
  let shakeTimer = 0
  let invulneravelAte = 0
  let faseAtual = ''

  // --- mapa (sorteado muito antes de ser visto) ---
  let buracos = []
  let enfeites = []
  let remendos = []
  let buracosAte = 0
  let enfeitesAte = 0
  let remendosAte = 0

  let rodando = false
  let pausado = false
  let rafId = null
  let tPrev = 0

  // ---------- geração do mapa ----------
  // As regras da pista ficam em `mapa.js`, que é testado por fora em
  // `scripts/mapa.test.mjs`. Aqui só se pede o próximo pedaço.
  function garantirBuracos(ateY) {
    while (buracosAte < ateY) {
      buracosAte += passoEntreLinhas(buracosAte)
      buracos.push(...linhaDeBuracos(buracosAte))
    }
  }

  function garantirEnfeites(ateY) {
    const TIPOS = ['arvore', 'arvore', 'arbusto', 'arbusto', 'casa', 'placa', 'poste']
    while (enfeitesAte < ateY) {
      enfeitesAte += 26 + Math.random() * 40
      const lado = Math.random() < 0.5 ? -1 : 1
      const tipo = TIPOS[(Math.random() * TIPOS.length) | 0]
      // fora da pista: à esquerda de PISTA_X ou à direita de PISTA_D
      const margem = 4 + Math.random() * 22
      const x = lado < 0 ? PISTA_X - margem : PISTA_D + margem
      enfeites.push({ oy: enfeitesAte, x, tipo, escala: tipo === 'casa' ? 2 : Math.random() < 0.5 ? 2 : 3 })
    }
  }

  function garantirRemendos(ateY) {
    while (remendosAte < ateY) {
      remendosAte += 40 + Math.random() * 90
      const larg = 14 + Math.random() * 40
      const alt = 6 + Math.random() * 14
      const x = PISTA_X + 4 + Math.random() * (PISTA_L - larg - 8)
      remendos.push({ oy: remendosAte, x, larg, alt })
    }
  }

  function garantirMapa(ateY) {
    garantirBuracos(ateY)
    garantirEnfeites(ateY)
    garantirRemendos(ateY)
  }

  function limparMapaAtras(limite) {
    if (buracos.length > 400) buracos = buracos.filter((b) => b.oy > limite)
    if (enfeites.length > 300) enfeites = enfeites.filter((e) => e.oy > limite)
    if (remendos.length > 200) remendos = remendos.filter((r) => r.oy > limite)
  }

  function reiniciarEstado() {
    carroMundo = 0
    carroX = L / 2
    carroVX = 0
    velocidade = 0
    vidas = VIDAS_INICIAIS
    tempoJogo = 0
    animT = 0
    flashTimer = 0
    shakeTimer = 0
    invulneravelAte = 0
    faseAtual = ''
    buracos = []
    enfeites = []
    remendos = []
    buracosAte = 0
    enfeitesAte = 0
    remendosAte = 0
    // o mapa inteiro do começo já nasce pronto, bem além do que dá pra ver
    garantirMapa(ADIANTE * 2)
    atualizarHud()
  }

  function atualizarHud() {
    if (refs.distEl?.current) refs.distEl.current.textContent = Math.floor(carroMundo / 10)
    if (refs.vidasEl?.current) {
      refs.vidasEl.current.textContent =
        '♥'.repeat(Math.max(0, vidas)) + '·'.repeat(Math.max(0, VIDAS_INICIAIS - vidas))
    }
  }

  // ---------- atualização ----------
  function atualizar(dt) {
    animT += dt
    tempoJogo += dt

    const fase = nomeFase(carroMundo)
    if (fase !== faseAtual) {
      faseAtual = fase
      onFase(fase)
    }

    // andar é automático — o jogador só precisa desviar
    const cruzeiro = lerp(66, 118, clamp(carroMundo / 6000, 0, 1))
    const alvo = teclas.baixo ? cruzeiro * 0.6 : teclas.cima ? cruzeiro * 1.22 : cruzeiro
    velocidade += (alvo - velocidade) * Math.min(1, dt * 2.4)

    carroMundo += velocidade * dt
    garantirMapa(carroMundo + ADIANTE)
    limparMapaAtras(carroMundo - 200)

    // direção suave: acelera e desacelera de leve, sem travar
    const acelLateral = 620
    const atrito = 8.5
    if (teclas.esquerda) carroVX -= acelLateral * dt
    if (teclas.direita) carroVX += acelLateral * dt
    if (!teclas.esquerda && !teclas.direita) carroVX -= carroVX * Math.min(1, atrito * dt)
    carroVX = clamp(carroVX, -132, 132)
    carroX += carroVX * dt

    // os limites são os mesmos que o teste do mapa varre — se o carro pudesse
    // sair daqui, o trecho "sem saída" teria saída
    if (carroX < FAIXA_DIRIGIVEL.min) {
      carroX = FAIXA_DIRIGIVEL.min
      carroVX *= -0.2
    }
    if (carroX > FAIXA_DIRIGIVEL.max) {
      carroX = FAIXA_DIRIGIVEL.max
      carroVX *= -0.2
    }

    // colisão perdoadora — a regra é a mesma que `mapa.js` usa pra provar que
    // o trecho final não tem saída
    if (tempoJogo >= invulneravelAte) {
      const frente = carroMundo + 12
      const tras = carroMundo - 10
      for (const b of buracos) {
        if (b.batido) continue
        if (b.oy > frente || b.oy < tras) continue
        if (colide(b, carroX)) {
          b.batido = true
          bateuBuraco()
          break
        }
      }
    }

    if (flashTimer > 0) flashTimer -= dt
    if (shakeTimer > 0) shakeTimer -= dt

    audio.atualizarMotor(clamp(velocidade / 118, 0, 1))
    atualizarHud()
  }

  function bateuBuraco() {
    vidas -= 1
    velocidade *= 0.5
    flashTimer = 0.22
    shakeTimer = reduzMovimento ? 0.08 : 0.26
    invulneravelAte = tempoJogo + 0.9
    audio.batida()
    if (navigator.vibrate) navigator.vibrate(reduzMovimento ? 25 : [30, 25, 45])
    atualizarHud()
    if (vidas <= 0) fimDeJogo()
  }

  function fimDeJogo() {
    rodando = false
    audio.desligarMotor()
    audio.fim()
    onFim({ distancia: Math.floor(carroMundo / 10) })
  }

  // ---------- desenho ----------
  function telaY(oy) {
    return CARRO_Y - (oy - carroMundo)
  }

  function desenharSprite(mapa, cores, cx, baseY, escala) {
    const larg = mapa[0].length * escala
    const alt = mapa.length * escala
    const x0 = Math.round(cx - larg / 2)
    const y0 = Math.round(baseY - alt)
    for (let r = 0; r < mapa.length; r++) {
      const linha = mapa[r]
      for (let c = 0; c < linha.length; c++) {
        const cor = cores[linha[c]]
        if (!cor) continue
        ctx.fillStyle = cor
        ctx.fillRect(x0 + c * escala, y0 + r * escala, escala, escala)
      }
    }
  }

  function desenharGrama() {
    ctx.fillStyle = COR.grama
    ctx.fillRect(0, 0, L, A)

    // touceiras: dependem só da posição no mapa, então "andam" junto com ele
    const passo = 16
    const inicio = Math.floor((carroMundo - CARRO_Y) / passo) * passo
    for (let oy = inicio; oy < carroMundo + A; oy += passo) {
      const y = Math.round(telaY(oy))
      if (y < -8 || y > A) continue
      const semente = Math.abs(Math.floor(oy / passo) * 2654435761) % 997
      for (let i = 0; i < 5; i++) {
        const s = (semente + i * 131) % 997
        const x = (s * 7) % L
        if (x > PISTA_X - 14 && x < PISTA_D + 14) continue
        ctx.fillStyle = s % 3 === 0 ? COR.gramaClara : COR.gramaEscura
        ctx.fillRect(x, y + (s % 5), 3, 2)
      }
    }
  }

  function desenharPista() {
    // acostamento de terra
    ctx.fillStyle = COR.terra
    ctx.fillRect(PISTA_X - 7, 0, 7, A)
    ctx.fillRect(PISTA_D, 0, 7, A)

    // asfalto, em faixas alternadas pra dar sensação de movimento
    const passo = 24
    const inicio = Math.floor((carroMundo - CARRO_Y) / passo) * passo
    for (let oy = inicio; oy < carroMundo + A; oy += passo) {
      const y = Math.round(telaY(oy))
      const par = Math.floor(oy / passo) % 2 === 0
      ctx.fillStyle = par ? COR.asfalto : COR.asfaltoAlt
      ctx.fillRect(PISTA_X, y - passo, PISTA_L, passo + 1)
    }

    // remendos de asfalto — também fazem parte do mapa
    for (const r of remendos) {
      const y = telaY(r.oy)
      if (y < -30 || y > A + 30) continue
      ctx.fillStyle = COR.remendo
      ctx.fillRect(Math.round(r.x), Math.round(y), Math.round(r.larg), Math.round(r.alt))
    }

    // faixas das bordas
    ctx.fillStyle = COR.faixa
    ctx.fillRect(PISTA_X, 0, 3, A)
    ctx.fillRect(PISTA_D - 3, 0, 3, A)

    // faixa central tracejada
    const ciclo = 32
    const meio = PISTA_X + PISTA_L / 2 - 1
    const base = Math.floor((carroMundo - CARRO_Y) / ciclo) * ciclo
    for (let oy = base; oy < carroMundo + A; oy += ciclo) {
      const y = Math.round(telaY(oy))
      ctx.fillStyle = COR.faixaCentro
      ctx.fillRect(meio, y - 18, 3, 18)
    }
  }

  function desenharBuracos() {
    const cores = { '#': COR.buracoFundo, o: COR.buracoBorda }
    for (const b of buracos) {
      const y = telaY(b.oy)
      if (y < -40 || y > A + 40) continue
      const molde = BURACOS[b.tipo]
      const escala = Math.max(2, Math.round(molde.larg / molde.mapa[0].length))
      const alt = molde.mapa.length * escala
      // sombra rasa em volta, pro buraco não parecer um adesivo colado
      ctx.fillStyle = 'rgba(0,0,0,0.16)'
      ctx.fillRect(Math.round(b.x - molde.larg / 2) - 1, Math.round(y - alt / 2) + 2, molde.larg + 2, alt)
      desenharSprite(molde.mapa, { ...cores, o: COR.buracoBorda }, b.x, y + alt / 2, escala)
      // miolo mais escuro, dando profundidade
      desenharSprite(
        molde.mapa.map((linha) => linha.replace(/o/g, '.')),
        { '#': COR.buracoMeio },
        b.x,
        y + alt / 2 - 1,
        escala,
      )
    }
  }

  function desenharEnfeites() {
    for (const e of enfeites) {
      const y = telaY(e.oy)
      if (y < -60 || y > A + 40) continue
      if (e.tipo === 'arvore') {
        desenharSprite(ARVORE, { c: COR.copaClara, C: COR.copa, e: COR.copaEscura, T: COR.tronco }, e.x, y, e.escala)
      } else if (e.tipo === 'arbusto') {
        desenharSprite(ARBUSTO, { c: COR.copaClara, C: COR.copa, e: COR.copaEscura }, e.x, y, e.escala)
      } else if (e.tipo === 'placa') {
        desenharSprite(PLACA, { P: COR.placaFundo, A: COR.placaTexto, T: COR.tronco }, e.x, y, 2)
      } else if (e.tipo === 'poste') {
        desenharSprite(POSTE, { p: COR.poste }, e.x, y, 2)
      } else {
        desenharSprite(
          CASA,
          { R: COR.telhado, W: COR.parede, G: COR.vidro, D: COR.porta },
          e.x,
          y,
          e.escala,
        )
      }
    }
  }

  function desenharAdesivoPiloto(cx, cy, raio) {
    const img = imagensPiloto[pilotoAtual.id]
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, raio, 0, Math.PI * 2)
    ctx.clip()
    if (img && img.complete && img.naturalWidth > 0) {
      const lado = Math.min(img.naturalWidth, img.naturalHeight * 0.8)
      const sx = (img.naturalWidth - lado) / 2
      const sy = img.naturalHeight * 0.03
      ctx.drawImage(img, sx, sy, lado, lado, cx - raio, cy - raio, raio * 2, raio * 2)
    } else {
      ctx.fillStyle = COR.placaTexto
      ctx.fillRect(cx - raio, cy - raio, raio * 2, raio * 2)
    }
    ctx.restore()
    ctx.strokeStyle = COR.faixa
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, raio, 0, Math.PI * 2)
    ctx.stroke()
  }

  function desenharCarro() {
    const piscando = tempoJogo < invulneravelAte && Math.floor(tempoJogo * 12) % 2 === 0
    if (piscando) return

    const p = pilotoAtual
    const x = Math.round(carroX)
    const y = CARRO_Y + Math.round(Math.sin(animT * 16) * (velocidade > 20 ? 1 : 0))

    ctx.fillStyle = 'rgba(0,0,0,0.22)'
    ctx.fillRect(x - CARRO_L / 2 + 1, y - CARRO_A / 2 + 3, CARRO_L, CARRO_A)

    desenharSprite(
      SPRITE_CARRO,
      {
        O: COR.contorno,
        B: p.carro,
        c: p.carroEscuro,
        G: COR.vidro,
        T: COR.pneu,
        F: COR.farol,
        L: COR.lanterna,
      },
      x,
      y + CARRO_A / 2,
      2,
    )

    // o adesivo de campanha no teto — é o carro de quem você escolheu
    desenharAdesivoPiloto(x, y, 7)
  }

  function desenhar() {
    let sx = 0
    let sy = 0
    if (shakeTimer > 0) {
      const forca = reduzMovimento ? 1 : 3
      sx = Math.round((Math.random() * 2 - 1) * forca)
      sy = Math.round((Math.random() * 2 - 1) * forca)
    }
    ctx.save()
    ctx.translate(sx, sy)

    desenharGrama()
    desenharPista()
    desenharBuracos()
    desenharEnfeites()
    desenharCarro()

    ctx.restore()

    const { t, alem } = dificuldadeEm(carroMundo)
    if (alem > 0) {
      ctx.fillStyle = `rgba(200,24,40,${0.05 + alem * 0.12})`
      ctx.fillRect(0, 0, L, A)
    } else if (t > 0.8) {
      ctx.fillStyle = `rgba(200,24,40,${((t - 0.8) / 0.2) * 0.05})`
      ctx.fillRect(0, 0, L, A)
    }

    if (flashTimer > 0) {
      ctx.fillStyle = `rgba(248,248,248,${(flashTimer / 0.22) * (reduzMovimento ? 0.18 : 0.32)})`
      ctx.fillRect(0, 0, L, A)
    }
  }

  // ---------- loop ----------
  function loop(t) {
    rafId = requestAnimationFrame(loop)
    if (!rodando || pausado) {
      desenhar()
      return
    }
    let dt = (t - tPrev) / 1000
    tPrev = t
    dt = Math.min(dt, 0.05)
    atualizar(dt)
    desenhar()
  }

  // O tamanho na tela é responsabilidade do CSS: o quadro já tem a mesma
  // proporção do canvas (256x240) e o canvas ocupa 100% dele. Sem cálculo em
  // JS aqui — nada pra dessincronizar quando o layout muda.

  // ---------- controles ----------
  function aoTeclaBaixo(e) {
    if (!rodando || pausado) return
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') teclas.esquerda = true
    if (e.code === 'ArrowRight' || e.code === 'KeyD') teclas.direita = true
    if (e.code === 'ArrowUp' || e.code === 'KeyW') teclas.cima = true
    if (e.code === 'ArrowDown' || e.code === 'KeyS') teclas.baixo = true
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault()
  }
  function aoTeclaCima(e) {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') teclas.esquerda = false
    if (e.code === 'ArrowRight' || e.code === 'KeyD') teclas.direita = false
    if (e.code === 'ArrowUp' || e.code === 'KeyW') teclas.cima = false
    if (e.code === 'ArrowDown' || e.code === 'KeyS') teclas.baixo = false
  }
  window.addEventListener('keydown', aoTeclaBaixo)
  window.addEventListener('keyup', aoTeclaCima)

  function aoInclinar(e) {
    if (e.gamma == null || !rodando || pausado) return
    teclas.esquerda = e.gamma < -6
    teclas.direita = e.gamma > 6
  }

  const motor = {
    definirPiloto(id) {
      pilotoAtual = PILOTOS[id] || PILOTOS.fabio
    },
    definirTecla(nome, valor) {
      if (!rodando || pausado) return
      teclas[nome] = valor
    },
    iniciar() {
      reiniciarEstado()
      rodando = true
      pausado = false
      tPrev = performance.now()
      audio.retomar()
      audio.ligarMotor()
    },
    pausar() {
      if (!rodando) return
      pausado = true
      teclas.esquerda = teclas.direita = teclas.cima = teclas.baixo = false
      audio.suspender()
    },
    retomar() {
      if (!rodando) return
      pausado = false
      tPrev = performance.now()
      audio.retomar()
    },
    definirMudo(v) {
      audio.definirMudo(v)
    },
    async ativarInclinacao() {
      const DOE = window.DeviceOrientationEvent
      if (!DOE) return false
      if (typeof DOE.requestPermission === 'function') {
        try {
          if ((await DOE.requestPermission()) !== 'granted') return false
        } catch {
          return false
        }
      }
      window.addEventListener('deviceorientation', aoInclinar)
      return true
    },
    desligarInclinacao() {
      window.removeEventListener('deviceorientation', aoInclinar)
    },
    tocarClique() {
      audio.clique()
    },
    destruir() {
      rodando = false
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', aoTeclaBaixo)
      window.removeEventListener('keyup', aoTeclaCima)
      window.removeEventListener('deviceorientation', aoInclinar)
      audio.destruir()
    },
  }

  // desenha uma pista parada já na abertura, pra tela não ficar vazia
  reiniciarEstado()
  rafId = requestAnimationFrame(loop)
  desenhar()

  return motor
}
