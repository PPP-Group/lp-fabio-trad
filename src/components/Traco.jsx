import { useMemo } from 'react'
import { useRevelar } from '../lib/useRevelar'
import '../styles/traco.css'

/**
 * O traço.
 *
 * A identidade diz que "os traços aplicados no número representam movimento"
 * (IDV, p. 5). No papel esse movimento está parado. Aqui ele é riscado: a
 * hachura é desenhada quando entra na tela — da esquerda para a direita, ou de
 * cima para baixo quando serve de trilho.
 *
 * O sorteio é preso a uma semente, então o mesmo traço sai igual em todo
 * render: nada pisca entre um repinte e outro.
 */

const FAIXA = 30

function sorteio(semente) {
  let s = semente >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

function riscos({ semente, comprimento, densidade }) {
  const proximo = sorteio(semente)
  const passo = comprimento / densidade
  const inclinacao = FAIXA * 0.62
  const linhas = []
  for (let i = 0; i < densidade; i += 1) {
    const base = i * passo + (proximo() - 0.5) * passo * 1.6
    linhas.push({
      a: base - proximo() * 5,
      b: base + inclinacao + proximo() * 5,
      opacidade: (0.55 + proximo() * 0.45).toFixed(2),
    })
  }
  return linhas
}

export function Traco({
  semente = 7,
  comprimento = 340,
  densidade = 58,
  espessura = 2.1,
  vertical = false,
  className = '',
  style,
}) {
  const [alvo, visivel] = useRevelar({ fracao: vertical ? 0.02 : 0.4 })
  const linhas = useMemo(
    () => riscos({ semente, comprimento, densidade }),
    [semente, comprimento, densidade],
  )

  const eixoLongo = comprimento + FAIXA * 0.62
  const viewBox = vertical
    ? `-6 0 ${FAIXA + 12} ${eixoLongo}`
    : `0 -6 ${eixoLongo} ${FAIXA + 12}`

  return (
    <span
      ref={alvo}
      className={`traco ${vertical ? 'traco--vertical' : ''} ${className}`}
      data-riscado={visivel ? 'sim' : 'nao'}
      style={style}
      aria-hidden="true"
    >
      {/* o trilho vertical estica para o tamanho da lista; o traço deitado
          guarda o ângulo da hachura da identidade */}
      <svg viewBox={viewBox} role="presentation" preserveAspectRatio={vertical ? 'none' : undefined}>
        {linhas.map(({ a, b, opacidade }, i) =>
          vertical ? (
            <line
              key={i}
              x1={-2}
              y1={a.toFixed(1)}
              x2={FAIXA + 2}
              y2={b.toFixed(1)}
              stroke="currentColor"
              strokeWidth={espessura}
              opacity={opacidade}
            />
          ) : (
            <line
              key={i}
              x1={a.toFixed(1)}
              y1={-2}
              x2={b.toFixed(1)}
              y2={FAIXA + 2}
              stroke="currentColor"
              strokeWidth={espessura}
              opacity={opacidade}
            />
          ),
        )}
      </svg>
    </span>
  )
}
