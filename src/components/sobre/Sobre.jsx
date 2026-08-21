import { sobre, trajetoria } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { Traco } from '../Traco'
import { useRevelar } from '../../lib/useRevelar'
import { Galeria } from './Galeria'
import { Apresentacao } from './Apresentacao'
import { Chapa } from './Chapa'
import '../../styles/sobre.css'

function Marco({ marco, indice }) {
  const [alvo, visivel] = useRevelar({ fracao: 0.25 })
  return (
    <li className="marco revelar" ref={alvo} data-visivel={visivel ? 'sim' : 'nao'}>
      <p className="marco__quando">{marco.quando}</p>
      <p className="marco__o-que">{marco.o_que}</p>
      <span className="marco__ponto" aria-hidden="true" data-primeiro={indice === 0 ? 'sim' : 'nao'} />
    </li>
  )
}

export function Sobre() {
  return (
    <section id="sobre" className="secao sobre">
      <div className="envelope">
        <Cabecalho rotulo="Sobre" titulo={sobre.titulo} semente={11} />

        <div className="sobre__conversa">
          <div className="sobre__fala">
            {sobre.depoimento.map((paragrafo, i) => (
              <p key={i} className="sobre__paragrafo">
                {paragrafo}
              </p>
            ))}
            <p className="sobre__assinatura">
              <Traco className="sobre__risco" semente={23} comprimento={170} densidade={26} />
              {sobre.assinatura}
            </p>
          </div>

          <figure className="sobre__figura">
            <img
              src="/assets/retrato.webp"
              alt="Fábio Trad cumprimentando apoiadores num encontro de campanha"
              width="1000"
              height="1500"
              loading="lazy"
            />
          </figure>
        </div>
      </div>

      <div className="envelope sobre__regua">
        <div className="regua__cabeca">
          <h3 className="regua__titulo">{trajetoria.titulo}</h3>
        </div>

        <div className="regua__corpo">
          <div className="regua__trilho" aria-hidden="true">
            <Traco vertical semente={5} comprimento={900} densidade={130} espessura={1.5} />
          </div>
          <ol className="regua__lista">
            {trajetoria.marcos.map((marco, i) => (
              <Marco key={marco.quando} marco={marco} indice={i} />
            ))}
          </ol>
        </div>
      </div>

      <Galeria />
      <Apresentacao />
      <Chapa />
    </section>
  )
}
