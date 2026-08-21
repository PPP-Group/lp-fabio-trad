import { useRef, useState } from 'react'
import { jingle } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import '../../styles/jingle.css'

/**
 * O jingle da campanha.
 *
 * O vídeo é servido do próprio domínio — nada de YouTube nem player de
 * terceiro, então ninguém é rastreado por passar aqui. O `<video>` nasce com
 * `preload="none"` e escondido atrás do pôster: quem só rola a página não
 * baixa os 12 MB. O play troca a capa pelo vídeo e manda tocar.
 */
export function Jingle() {
  const [tocando, setTocando] = useState(false)
  const video = useRef(null)

  const tocar = () => {
    setTocando(true)
    // o <video> já está no DOM, só escondido — dá pra mandar tocar na hora
    const el = video.current
    if (el) {
      el.play().catch(() => {
        /* se o navegador barrar o autoplay, o controle nativo resolve */
      })
    }
  }

  return (
    <section id={jingle.id} className="secao jingle">
      <div className="envelope">
        <Cabecalho
          className="cabecalho--claro"
          rotulo={jingle.rotulo}
          titulo={jingle.titulo}
          chamada={jingle.chamada}
          semente={71}
        />

        <div className="jingle__quadro" data-tocando={tocando ? 'sim' : 'nao'}>
          <video
            ref={video}
            className="jingle__video"
            src={`/assets/${jingle.arquivo}`}
            poster={`/assets/${jingle.capa}`}
            width={jingle.largura}
            height={jingle.altura}
            preload="none"
            controls={tocando}
            playsInline
          />

          {!tocando && (
            <button type="button" className="jingle__play" onClick={tocar}>
              <img
                className="jingle__capa"
                src={`/assets/${jingle.capa}`}
                alt=""
                width={jingle.largura}
                height={jingle.altura}
                loading="lazy"
              />
              <span className="jingle__disco" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                </svg>
              </span>
              <span className="jingle__acao">{jingle.acao}</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
