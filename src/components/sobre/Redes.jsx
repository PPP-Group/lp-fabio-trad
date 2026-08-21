import { useState } from 'react'
import { videos } from '../../data/campanha'
import { ICONES } from '../Icones'
import { Modal } from '../Modal'
import '../../styles/redes.css'

function Cartao({ post, aoAbrir }) {
  const Icone = ICONES[post.icone]
  return (
    <li className="video">
      <button type="button" className="video__botao" onClick={aoAbrir}>
        <img
          className="video__capa"
          src={`/assets/${post.capa}`}
          alt=""
          width={post.largura}
          height={post.altura}
          loading="lazy"
        />
        <span className="video__rede">
          <Icone />
          {post.rede}
        </span>
        <span className="video__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
            <path d="M8 5.5v13l11-6.5L8 5.5Z" />
          </svg>
        </span>
        <span className="video__titulo">{post.titulo}</span>
        <span className="video__assistir">Assistir</span>
      </button>
    </li>
  )
}

export function Redes() {
  const [aberto, setAberto] = useState(null)
  const post = aberto === null ? null : videos.posts[aberto]
  const IconePost = post ? ICONES[post.icone] : null

  return (
    <div className="envelope redes">
      <div className="redes__cabeca">
        <h3 className="redes__titulo">{videos.titulo}</h3>
        <p className="redes__chamada">{videos.chamada}</p>
      </div>

      <ul className="redes__lista">
        {videos.posts.map((p, i) => (
          <Cartao key={p.url} post={p} aoAbrir={() => setAberto(i)} />
        ))}
      </ul>

      <Modal
        aberto={post !== null}
        aoFechar={() => setAberto(null)}
        rotulo={post ? `${post.rede}: ${post.titulo}` : ''}
        className="modal--video"
      >
        {post && (
          <div className="tocador">
            <div className="tocador__quadro" style={{ '--proporcao': post.proporcao }}>
              <iframe
                src={post.incorporar}
                title={`${post.rede}: ${post.titulo}`}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                scrolling="no"
              />
            </div>

            <div className="tocador__ficha">
              <p className="tocador__rede">
                <IconePost />
                {post.rede}
              </p>
              <h4 className="tocador__titulo">{post.titulo}</h4>
              <p className="tocador__legenda">{post.legenda}</p>
              <a className="botao botao--amarelo" href={post.url} target="_blank" rel="noreferrer">
                <IconePost />
                Ver no {post.rede}
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
