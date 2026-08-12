import { useCallback, useEffect, useRef } from 'react'
import '../styles/modal.css'

const FOCAVEIS =
  'a[href], button:not([disabled]), iframe, input, textarea, select, [tabindex]:not([tabindex="-1"])'

/**
 * A caixa que abre por cima da página — a lupa da galeria e o vídeo das redes
 * usam a mesma. Fecha no Esc e no clique do fundo, prende o Tab enquanto está
 * aberta e devolve o foco para o botão que a abriu.
 */
export function Modal({ aberto, aoFechar, rotulo, className = '', children }) {
  const caixa = useRef(null)
  const quemAbriu = useRef(null)

  const aoTeclar = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        aoFechar()
        return
      }
      if (e.key !== 'Tab' || !caixa.current) return
      const paradas = [...caixa.current.querySelectorAll(FOCAVEIS)]
      if (!paradas.length) return
      const primeira = paradas[0]
      const ultima = paradas[paradas.length - 1]
      if (e.shiftKey && document.activeElement === primeira) {
        e.preventDefault()
        ultima.focus()
      } else if (!e.shiftKey && document.activeElement === ultima) {
        e.preventDefault()
        primeira.focus()
      }
    },
    [aoFechar],
  )

  useEffect(() => {
    if (!aberto) return
    quemAbriu.current = document.activeElement
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
      quemAbriu.current?.focus?.()
    }
  }, [aberto, aoTeclar])

  if (!aberto) return null

  return (
    <div className={`modal ${className}`} role="dialog" aria-modal="true" aria-label={rotulo}>
      <button type="button" className="modal__fundo" onClick={aoFechar} tabIndex={-1} aria-hidden="true" />
      <div className="modal__caixa" ref={caixa}>
        <button type="button" className="modal__fechar" onClick={aoFechar} autoFocus>
          <span className="so-leitor">Fechar</span>
          <span aria-hidden="true">×</span>
        </button>
        {children}
      </div>
    </div>
  )
}
