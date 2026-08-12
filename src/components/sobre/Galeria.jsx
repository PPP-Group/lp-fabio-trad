import { useCallback, useEffect, useState } from 'react'
import { galeria } from '../../data/campanha'
import '../../styles/galeria.css'

export function Galeria() {
  const [aberta, setAberta] = useState(null)
  const foto = aberta === null ? null : galeria.fotos[aberta]

  const fechar = useCallback(() => setAberta(null), [])
  const andar = useCallback(
    (passo) =>
      setAberta((i) => (i === null ? null : (i + passo + galeria.fotos.length) % galeria.fotos.length)),
    [],
  )

  useEffect(() => {
    if (aberta === null) return
    const aoTeclar = (e) => {
      if (e.key === 'Escape') fechar()
      if (e.key === 'ArrowRight') andar(1)
      if (e.key === 'ArrowLeft') andar(-1)
    }
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberta, fechar, andar])

  return (
    <div className="envelope galeria">
      <h3 className="galeria__titulo">{galeria.titulo}</h3>

      <ul className="galeria__grade">
        {galeria.fotos.map((f, i) => (
          <li key={f.arquivo} className="galeria__item">
            <button type="button" onClick={() => setAberta(i)}>
              <img
                src={`/assets/${f.arquivo}`}
                alt={f.legenda}
                width={f.largura}
                height={f.altura}
                loading="lazy"
              />
              <span className="galeria__legenda">{f.legenda}</span>
            </button>
          </li>
        ))}
      </ul>

      {foto && (
        <div className="lupa" role="dialog" aria-modal="true" aria-label={foto.legenda}>
          <button type="button" className="lupa__fundo" onClick={fechar} tabIndex={-1} aria-hidden="true" />
          <figure className="lupa__quadro">
            <img src={`/assets/${foto.arquivo}`} alt={foto.legenda} width={foto.largura} height={foto.altura} />
            <figcaption>{foto.legenda}</figcaption>
          </figure>
          <button type="button" className="lupa__anterior" onClick={() => andar(-1)}>
            <span className="so-leitor">Foto anterior</span>
            <span aria-hidden="true">‹</span>
          </button>
          <button type="button" className="lupa__proxima" onClick={() => andar(1)}>
            <span className="so-leitor">Próxima foto</span>
            <span aria-hidden="true">›</span>
          </button>
          <button type="button" className="lupa__fechar" onClick={fechar} autoFocus>
            <span className="so-leitor">Fechar</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </div>
  )
}
