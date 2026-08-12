import '../styles/estrela.css'

export const ESTRELA_PATH =
  'M12 1.6 14.9 9.1 22.9 9.4 16.6 14.3 18.9 22 12 17.5 5.1 22 7.4 14.3 1.1 9.4 9.1 9.1Z'

/** A estrela do PT, um dos cinco componentes da identidade (IDV, p. 8). */
export function Estrela({ tamanho = '1em', className = '' }) {
  return (
    <svg
      className={`estrela ${className}`}
      viewBox="0 0 24 24"
      width={tamanho}
      height={tamanho}
      aria-hidden="true"
      focusable="false"
    >
      <path d={ESTRELA_PATH} fill="currentColor" />
    </svg>
  )
}

/**
 * A faixa de estrelas que fecha as peças impressas. Aqui ela anda — devagar,
 * e só se o leitor não pediu menos movimento.
 *
 * `cor` pinta as estrelas, `fundo` pinta a tira atrás delas. Sem `cor`, as
 * estrelas herdam o currentColor de quem colocou a faixa.
 */
export function FaixaEstrelas({ className = '', altura = 22, cor, fundo }) {
  return (
    <div
      className={`faixa ${className}`}
      style={{
        '--faixa-altura': `${altura}px`,
        ...(cor ? { '--faixa-cor': cor } : null),
        ...(fundo ? { '--faixa-fundo': fundo } : null),
      }}
      aria-hidden="true"
    >
      <div className="faixa__estrelas" />
    </div>
  )
}
