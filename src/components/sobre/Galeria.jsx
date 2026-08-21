import { useCallback, useEffect, useState } from 'react'
import { galeria } from '../../data/campanha'
import { Modal } from '../Modal'
import '../../styles/galeria.css'

export function Galeria() {
  const [aberta, setAberta] = useState(null)
  const foto = aberta === null ? null : galeria.fotos[aberta]

  const fechar = useCallback(() => setAberta(null), [])
  const andar = useCallback(
    (passo) =>
      setAberta((i) =>
        i === null ? null : (i + passo + galeria.fotos.length) % galeria.fotos.length,
      ),
    [],
  )

  useEffect(() => {
    if (aberta === null) return
    const aoTeclar = (e) => {
      if (e.key === 'ArrowRight') andar(1)
      if (e.key === 'ArrowLeft') andar(-1)
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberta, andar])

  return (
    <div className="envelope galeria">
      <h3 className="galeria__titulo">{galeria.titulo}</h3>

      <ul className="galeria__grade">
        {galeria.fotos.map((f, i) => (
          <li key={f.arquivo} className="galeria__item" data-formato={f.formato}>
            {/* A legenda sai da tela a pedido da campanha, mas continua no
                `alt`: sem ela, quem usa leitor de tela ficaria com oito
                imagens mudas — e é ela que aparece se a foto não carregar. */}
            <button type="button" onClick={() => setAberta(i)}>
              <img
                src={`/assets/${f.arquivo}`}
                alt={f.legenda}
                width={f.largura}
                height={f.altura}
                loading="lazy"
              />
              <span className="so-leitor">Ampliar: {f.legenda}</span>
            </button>
          </li>
        ))}
      </ul>

      <Modal
        aberto={foto !== null}
        aoFechar={fechar}
        rotulo={foto ? foto.legenda : ''}
        className="modal--foto"
      >
        {foto && (
          <>
            <figure className="lupa__quadro">
              <img
                src={`/assets/${foto.arquivo}`}
                alt={foto.legenda}
                width={foto.largura}
                height={foto.altura}
              />
              <figcaption>
                <span className="so-leitor">{foto.legenda}</span>
                <span className="lupa__conta">
                  {aberta + 1} de {galeria.fotos.length}
                </span>
              </figcaption>
            </figure>
            <button type="button" className="lupa__anterior" onClick={() => andar(-1)}>
              <span className="so-leitor">Foto anterior</span>
              <span aria-hidden="true">‹</span>
            </button>
            <button type="button" className="lupa__proxima" onClick={() => andar(1)}>
              <span className="so-leitor">Próxima foto</span>
              <span aria-hidden="true">›</span>
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}
