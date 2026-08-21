import { useCallback, useEffect, useRef, useState } from 'react'
import { candidato, molduras } from '../../data/campanha'
import '../../styles/cartaz.css'

/**
 * Seu cartaz da coragem.
 *
 * A identidade foi feita para "criar centenas de peças diferentes mantendo
 * unidade visual" (IDV, p. 8). Aqui quem faz a peça é o eleitor: escolhe a
 * bandeira, escreve o nome e sai com um cartaz da campanha pronto pra mandar
 * pra quem quiser ou pôr no story.
 *
 * Desenha tudo no canvas, no navegador. Nada é enviado a lugar nenhum.
 */

const L = 1080
const A = 1350
const CAMPANHA = '"Archivo Variable", Archivo, sans-serif'
const VOZ = '"Source Serif 4 Variable", Georgia, serif'

function estrela(ctx, x, y, raio) {
  ctx.beginPath()
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? raio : raio * 0.42
    const a = (Math.PI / 5) * i - Math.PI / 2
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(a) * r, y + Math.sin(a) * r)
  }
  ctx.closePath()
  ctx.fill()
}

function faixaDeEstrelas(ctx, y, raio, cor) {
  ctx.fillStyle = cor
  const passo = raio * 3.4
  for (let x = passo / 2; x < L + passo; x += passo) estrela(ctx, x, y, raio)
}

/** O traço da identidade, riscado no cartaz logo abaixo da bandeira. */
function hachura(ctx, x, y, largura, altura, cor) {
  ctx.save()
  ctx.strokeStyle = cor
  ctx.lineWidth = 3
  const passo = largura / 26
  for (let i = 0; i < 26; i += 1) {
    const base = x + i * passo
    ctx.globalAlpha = 0.35 + (i % 5) * 0.12
    ctx.beginPath()
    ctx.moveTo(base, y)
    ctx.lineTo(base + altura * 0.62, y + altura)
    ctx.stroke()
  }
  ctx.restore()
}

/** Escreve em caixa alta, esticando/encolhendo para caber na largura pedida. */
function tituloCabendo(ctx, texto, x, y, largura, tamanho, cor) {
  ctx.fillStyle = cor
  let corpo = tamanho
  ctx.font = `900 ${corpo}px ${CAMPANHA}`
  while (ctx.measureText(texto).width > largura && corpo > 20) {
    corpo -= 4
    ctx.font = `900 ${corpo}px ${CAMPANHA}`
  }
  ctx.fillText(texto, x, y)
  return corpo
}

function carregar(src) {
  return new Promise((ok, erro) => {
    const im = new Image()
    im.onload = () => ok(im)
    im.onerror = erro
    im.src = src
  })
}

async function desenhar(canvas, { nome, bandeira }) {
  const ctx = canvas.getContext('2d')
  canvas.width = L
  canvas.height = A

  const fundo = ctx.createLinearGradient(0, A, L, 0)
  fundo.addColorStop(0, '#8f1040')
  fundo.addColorStop(0.35, '#ab144c')
  fundo.addColorStop(1, '#f31f29')
  ctx.fillStyle = fundo
  ctx.fillRect(0, 0, L, A)

  const [mapa, numero] = await Promise.all([
    carregar('/assets/mapa-coragem-branco.webp'),
    carregar('/assets/13-amarelo-so.webp'),
  ])

  // o mapa do estado preenchido de CORAGEM, na metade de baixo
  ctx.save()
  ctx.globalAlpha = 0.1
  const larguraMapa = 820
  ctx.drawImage(mapa, L - larguraMapa + 150, 330, larguraMapa, (larguraMapa * mapa.height) / mapa.width)
  ctx.restore()

  // a barra de baixo, onde fica a assinatura
  const barra = ctx.createLinearGradient(0, A - 400, 0, A)
  barra.addColorStop(0, 'rgba(48, 2, 20, 0)')
  barra.addColorStop(1, 'rgba(48, 2, 20, 0.82)')
  ctx.fillStyle = barra
  ctx.fillRect(0, A - 400, L, 400)

  faixaDeEstrelas(ctx, 34, 15, 'rgba(255,255,255,0.5)')
  faixaDeEstrelas(ctx, A - 34, 15, 'rgba(255,255,255,0.5)')

  const margem = 88

  // chapéu
  ctx.font = `700 26px ${CAMPANHA}`
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.letterSpacing = '6px'
  ctx.fillText('MEU SONHO PRA MATO GROSSO DO SUL', margem + 36, 214)
  ctx.letterSpacing = '0px'
  ctx.fillStyle = '#ecc927'
  estrela(ctx, margem + 13, 206, 16)

  // a bandeira escolhida
  const palavras = bandeira.toUpperCase().split(' ')
  let base = 400
  for (const [i, palavra] of palavras.entries()) {
    const corpo = tituloCabendo(ctx, palavra, margem, base, L - margem * 2, 172, '#ecc927')
    if (i < palavras.length - 1) base += corpo * 0.94
  }

  hachura(ctx, margem, base + 46, 330, 46, '#ffffff')

  // a frase e a assinatura de quem fez
  ctx.font = `600 42px ${CAMPANHA}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText('É por isso que eu vou de', margem, base + 236)
  ctx.font = `900 60px ${CAMPANHA}`
  ctx.fillText('FÁBIO TRAD 13.', margem, base + 302)

  if (nome.trim()) {
    ctx.font = `italic 400 40px ${VOZ}`
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.fillText(`— ${nome.trim()}`, margem, base + 380)
  }

  // assinatura da campanha, no rodapé
  const pe = A - 132
  ctx.font = `700 22px ${CAMPANHA}`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.letterSpacing = '8px'
  ctx.fillText('GOVERNADOR', margem, pe - 52)
  ctx.letterSpacing = '0px'
  ctx.font = `900 62px ${CAMPANHA}`
  ctx.fillStyle = '#ffffff'
  ctx.fillText('FÁBIO TRAD', margem, pe + 6)
  ctx.font = `500 22px ${CAMPANHA}`
  ctx.fillText('VICE', margem, pe + 44)
  ctx.font = `900 29px ${CAMPANHA}`
  ctx.fillText('DONA GILDA', margem + 62, pe + 44)

  const alturaNumero = 156
  const larguraNumero = (numero.width / numero.height) * alturaNumero
  ctx.drawImage(numero, L - margem - larguraNumero, pe - 100, larguraNumero, alturaNumero)
}

export function Cartaz() {
  const canvas = useRef(null)
  const [nome, setNome] = useState('')
  const [bandeira, setBandeira] = useState(molduras.cartaz.bandeiras[0])
  const [podeCompartilhar, setPodeCompartilhar] = useState(false)

  useEffect(() => {
    setPodeCompartilhar(typeof navigator !== 'undefined' && Boolean(navigator.canShare))
  }, [])

  useEffect(() => {
    let vivo = true
    const pintar = async () => {
      await document.fonts.load(`900 168px ${CAMPANHA}`)
      await document.fonts.load(`italic 400 40px ${VOZ}`)
      if (vivo && canvas.current) await desenhar(canvas.current, { nome, bandeira })
    }
    pintar()
    return () => {
      vivo = false
    }
  }, [nome, bandeira])

  const arquivo = useCallback(
    () =>
      new Promise((ok) =>
        canvas.current.toBlob(
          (b) => ok(new File([b], `cartaz-fabio-trad-13.png`, { type: 'image/png' })),
          'image/png',
        ),
      ),
    [],
  )

  const baixar = useCallback(async () => {
    const f = await arquivo()
    const url = URL.createObjectURL(f)
    const a = document.createElement('a')
    a.href = url
    a.download = f.name
    a.click()
    URL.revokeObjectURL(url)
  }, [arquivo])

  const compartilhar = useCallback(async () => {
    const f = await arquivo()
    const dados = {
      files: [f],
      title: `${candidato.nome} ${candidato.numero}`,
      text: `Meu sonho pra Mato Grosso do Sul é ${bandeira.toLowerCase()}. Coragem pra sonhar — Fábio Trad 13.`,
    }
    if (navigator.canShare?.(dados)) await navigator.share(dados)
    else await baixar()
  }, [arquivo, bandeira, baixar])

  return (
    <div className="cartaz">
      <div className="cartaz__controles">
        <p className="cartaz__texto">{molduras.cartaz.texto}</p>

        <fieldset className="cartaz__bandeiras">
          <legend>Qual bandeira te move?</legend>
          <div>
            {molduras.cartaz.bandeiras.map((b) => (
              <label key={b} className="cartaz__opcao" data-marcada={b === bandeira ? 'sim' : 'nao'}>
                <input
                  type="radio"
                  name="bandeira"
                  value={b}
                  checked={b === bandeira}
                  onChange={() => setBandeira(b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="campo">
          <span>Seu nome</span>
          <input
            type="text"
            value={nome}
            maxLength={26}
            placeholder="Como você quer assinar"
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

        <div className="cartaz__acoes">
          <button type="button" className="botao botao--vermelho" onClick={baixar}>
            Baixar o cartaz
          </button>
          {podeCompartilhar && (
            <button type="button" className="botao botao--vazado" onClick={compartilhar}>
              Compartilhar
            </button>
          )}
        </div>
      </div>

      <figure className="cartaz__previa">
        <canvas ref={canvas} width={L} height={A} role="img" aria-label={`Cartaz com a bandeira ${bandeira}`} />
        <figcaption>Prévia do seu cartaz</figcaption>
      </figure>
    </div>
  )
}
