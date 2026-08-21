import { useEffect, useState } from 'react'
import { candidato, hero } from '../../data/campanha'
import { FaixaEstrelas } from '../Estrela'
import { Marca } from '../Marca'
import '../../styles/hero.css'

export function Hero() {
  const [entrou, setEntrou] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntrou(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const [proposta, video] = hero.acoes

  return (
    <section id="inicio" className="hero" data-entrou={entrou ? 'sim' : 'nao'}>
      <div className="hero__fundo" aria-hidden="true">
        <img className="hero__mapa" src="/assets/mapa-coragem-branco.webp" alt="" width="1100" height="1102" />
      </div>

      <img
        className="hero__retrato"
        src="/assets/fabio-recorte.webp"
        alt={`${candidato.nome}, candidato a ${candidato.cargo.toLowerCase()} de ${candidato.estado}`}
        width="1400"
        height="1227"
        fetchpriority="high"
      />

      <div className="hero__conteudo envelope">
        <Marca className="hero__marca" tamanho="clamp(1.15rem, 2.3vw, 1.8rem)" />

        <h1 className="hero__grito">
          <span>{hero.chamada[0]}</span>
          <span className="hero__grito-2">
            <em>pra</em> <span className="hero__sonhar">sonhar</span>
          </span>
        </h1>

        <p className="hero__apoio">{hero.apoio}</p>

        <p className="hero__urna">
          <img
            src="/assets/13-amarelo-so.webp"
            alt={candidato.numero}
            width="800"
            height="620"
          />
          <span>{hero.numero}</span>
        </p>

        <div className="hero__acoes">
          <a className="botao botao--amarelo" href={`#${proposta.destino}`}>
            {proposta.texto}
          </a>
          {/* leva pra seção do vídeo, mais abaixo — o play fica lá */}
          <a className="botao botao--vazado hero__ver-video" href={`#${video.destino}`}>
            <span className="hero__play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
                <path d="M8 5.5v13l11-6.5L8 5.5Z" />
              </svg>
            </span>
            {video.texto}
          </a>
        </div>
      </div>

      <FaixaEstrelas
        className="hero__faixa"
        altura={20}
        cor="rgba(255,255,255,0.5)"
      />
    </section>
  )
}
