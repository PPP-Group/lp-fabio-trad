import { videos } from '../../data/campanha'
import { Estrela } from '../Estrela'
import '../../styles/redes.css'

export function Redes() {
  return (
    <div className="envelope redes">
      <div className="redes__cabeca">
        <h3 className="redes__titulo">{videos.titulo}</h3>
        <p className="redes__chamada">{videos.chamada}</p>
      </div>

      <ul className="redes__programas">
        {videos.programas.map((p) => (
          <li key={p.nome}>
            <a href={p.url} target="_blank" rel="noreferrer">
              <span className="redes__onde">
                <Estrela tamanho="0.7em" />
                {p.onde}
              </span>
              <span className="redes__nome">{p.nome}</span>
              <span className="redes__o-que">{p.o_que}</span>
              <span className="redes__ir" aria-hidden="true">
                Assistir →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
