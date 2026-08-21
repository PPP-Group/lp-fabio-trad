import { useState } from 'react'
import { apresentacao } from '../../data/campanha'
import { ICONES } from '../Icones'
import '../../styles/apresentacao.css'

/**
 * A seção do vídeo de apresentação — o único vídeo do site.
 *
 * Enquanto ninguém clica, o que existe na página é a capa, servida do próprio
 * domínio: nenhum pedido sai daqui pro Instagram. O iframe só é criado depois
 * do play, e aí sim a rede entra. É o mesmo trato que valia pros dois posts
 * que ficavam neste lugar antes.
 */
export function Apresentacao() {
  const [tocando, setTocando] = useState(false)
  const Icone = ICONES[apresentacao.icone]
  const rotulo = `${apresentacao.rede}: ${apresentacao.titulo}`

  return (
    <div className="envelope apresentacao" id={apresentacao.id}>
      <div className="apresentacao__cabeca">
        <p className="rotulo apresentacao__rotulo">{apresentacao.rotulo}</p>
        <h3 className="apresentacao__titulo">{apresentacao.titulo}</h3>
        <p className="apresentacao__chamada">{apresentacao.chamada}</p>
      </div>

      <div className="apresentacao__corpo">
        <div className="apresentacao__quadro" style={{ '--proporcao': apresentacao.proporcao }}>
          {tocando ? (
            <iframe
              src={apresentacao.incorporar}
              title={rotulo}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              scrolling="no"
            />
          ) : (
            <button
              type="button"
              className="apresentacao__play"
              onClick={() => setTocando(true)}
              aria-label={`Assistir: ${apresentacao.titulo}`}
            >
              <img
                className="apresentacao__capa"
                src={`/assets/${apresentacao.capa}`}
                alt=""
                width={apresentacao.largura}
                height={apresentacao.altura}
              />
              <span className="apresentacao__rede">
                <Icone />
                {apresentacao.rede}
              </span>
              <span className="apresentacao__disco" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
                  <path d="M8 5.5v13l11-6.5L8 5.5Z" />
                </svg>
              </span>
              <span className="apresentacao__assistir">{apresentacao.acao}</span>
            </button>
          )}
        </div>

        <div className="apresentacao__ficha">
          <p className="apresentacao__legenda">{apresentacao.legenda}</p>
          <a
            className="botao botao--carvao"
            href={apresentacao.url}
            target="_blank"
            rel="noreferrer"
          >
            <Icone />
            Ver no {apresentacao.rede}
          </a>
        </div>
      </div>
    </div>
  )
}
