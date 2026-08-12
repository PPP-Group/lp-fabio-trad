import { conquistas } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { Traco } from '../Traco'
import { useRevelar } from '../../lib/useRevelar'
import '../../styles/conquistas.css'

function Numero({ valor, o_que, semente }) {
  const [alvo, visivel] = useRevelar({ fracao: 0.3 })
  return (
    <li className="numero revelar" ref={alvo} data-visivel={visivel ? 'sim' : 'nao'}>
      <p className="numero__valor">{valor}</p>
      <Traco className="numero__traco" semente={semente} comprimento={110} densidade={16} />
      <p className="numero__o-que">{o_que}</p>
    </li>
  )
}

export function Conquistas() {
  return (
    <section id="conquistas" className="secao conquistas">
      <div className="envelope">
        <Cabecalho
          rotulo={conquistas.rotulo}
          titulo={conquistas.titulo}
          chamada={conquistas.chamada}
          semente={17}
        />

        <div className="conquistas__grade">
          <ul className="feitos">
            {conquistas.realizacoes.map((r) => (
              <li key={r} className="feito">
                <span className="feito__marca" aria-hidden="true" />
                <p>{r}</p>
              </li>
            ))}
          </ul>

          <div className="premios">
            <h3 className="premios__titulo">{conquistas.reconhecimentos.titulo}</h3>
            <dl className="premios__lista">
              {conquistas.reconhecimentos.itens.map((r) => (
                <div key={r.de} className="premio">
                  <dt>{r.de}</dt>
                  <dd>{r.o_que}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="placar">
        <div className="envelope">
          <h3 className="placar__titulo">{conquistas.numeros.titulo}</h3>
          <ul className="placar__lista">
            {conquistas.numeros.itens.map((n, i) => (
              <Numero key={n.valor + n.o_que} valor={n.valor} o_que={n.o_que} semente={60 + i * 5} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
