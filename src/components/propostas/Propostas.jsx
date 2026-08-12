import { propostas } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { Traco } from '../Traco'
import { FaixaEstrelas } from '../Estrela'
import { useRevelar } from '../../lib/useRevelar'
import '../../styles/propostas.css'

function Bandeira({ eixo, texto, semente }) {
  const [alvo, visivel] = useRevelar({ fracao: 0.2 })
  return (
    <li className="bandeira revelar" ref={alvo} data-visivel={visivel ? 'sim' : 'nao'}>
      <h3 className="bandeira__eixo">{eixo}</h3>
      <Traco className="bandeira__traco" semente={semente} comprimento={110} densidade={16} />
      <p className="bandeira__texto">{texto}</p>
    </li>
  )
}

export function Propostas() {
  return (
    <section id="propostas" className="secao propostas">
      <div className="propostas__mapa" aria-hidden="true" />

      <div className="envelope propostas__corpo">
        <Cabecalho
          className="cabecalho--claro"
          rotulo={propostas.rotulo}
          titulo={propostas.titulo}
          chamada={propostas.chamada}
          semente={31}
        />

        <ul className="propostas__lista">
          {propostas.eixos.map((e, i) => (
            <Bandeira key={e.eixo} eixo={e.eixo} texto={e.texto} semente={40 + i * 7} />
          ))}
        </ul>
      </div>

      <div className="compromisso">
        <FaixaEstrelas altura={18} cor="rgba(255,255,255,0.4)" />
        <div className="envelope compromisso__corpo">
          <h3 className="compromisso__titulo">{propostas.compromisso.titulo}</h3>
          <p className="compromisso__texto">{propostas.compromisso.texto}</p>
        </div>
        <FaixaEstrelas altura={18} cor="rgba(255,255,255,0.4)" />
      </div>
    </section>
  )
}
