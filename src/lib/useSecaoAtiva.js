import { useEffect, useState } from 'react'

/** Devolve o id da seção que está ocupando a faixa de leitura da tela. */
export function useSecaoAtiva(ids) {
  const [ativa, setAtiva] = useState(ids[0])

  useEffect(() => {
    const nos = ids.map((id) => document.getElementById(id)).filter(Boolean)
    if (!nos.length || typeof IntersectionObserver === 'undefined') return

    const visiveis = new Map()
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) visiveis.set(e.target.id, e.intersectionRatio)
        let melhor = null
        let maior = 0
        for (const [id, razao] of visiveis) {
          if (razao > maior) {
            maior = razao
            melhor = id
          }
        }
        if (melhor && maior > 0) setAtiva(melhor)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.02, 0.15, 0.4, 0.8] },
    )
    nos.forEach((no) => observador.observe(no))
    return () => observador.disconnect()
  }, [ids])

  return ativa
}
