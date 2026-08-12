import { useEffect, useRef, useState } from 'react'

/**
 * Marca o elemento como visível na primeira vez que ele entra na tela.
 * Uma vez só: nada volta a sumir quando o leitor rola de volta.
 */
export function useRevelar({ margem = '0px 0px -12% 0px', fracao = 0.15 } = {}) {
  const alvo = useRef(null)
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const no = alvo.current
    if (!no || visivel) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisivel(true)
      return
    }
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisivel(true)
          observador.disconnect()
        }
      },
      { rootMargin: margem, threshold: fracao },
    )
    observador.observe(no)
    return () => observador.disconnect()
  }, [margem, fracao, visivel])

  return [alvo, visivel]
}
