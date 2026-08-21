import { molduras } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { useRevelar } from '../../lib/useRevelar'
import '../../styles/molduras.css'

/**
 * Uma moldura, com o preview por cima do vazio onde entra a foto.
 *
 * O `<img>` é a moldura de verdade — PNG com o miolo transparente. Atrás dele
 * fica só um fundo neutro com o rótulo "sua foto aqui", então o que o leitor
 * vê é exatamente o que vai receber: a arte da campanha em volta, e o buraco
 * esperando o rosto dele.
 */
function Moldura({ item }) {
  const [alvo, visivel] = useRevelar({ fracao: 0.15 })

  return (
    <li className="moldura revelar" ref={alvo} data-visivel={visivel ? 'sim' : 'nao'}>
      <a className="moldura__link" href={item.url} target="_blank" rel="noreferrer">
        <span className="moldura__palco">
          <span className="moldura__vazio" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor">
              <path d="M12 12.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 1.6c-3.1 0-6.2 1.6-6.2 3.4V20h12.4v-2.5c0-1.8-3.1-3.4-6.2-3.4Z" />
            </svg>
            {molduras.vazio}
          </span>
          <img
            className="moldura__arte"
            src={`/assets/${item.arquivo}`}
            alt={`Moldura "${item.nome}"`}
            width="720"
            height="720"
            loading="lazy"
          />
        </span>

        <span className="moldura__ficha">
          <span className="moldura__nome">{item.nome}</span>
          <span className="moldura__acao">{molduras.acao} →</span>
        </span>
      </a>
    </li>
  )
}

export function Molduras() {
  return (
    <section id="molduras" className="secao molduras-secao">
      <div className="envelope">
        <Cabecalho
          rotulo={molduras.rotulo}
          titulo={molduras.titulo}
          chamada={molduras.chamada}
          semente={63}
        />

        <ul className="molduras-secao__lista">
          {molduras.itens.map((m) => (
            <Moldura key={m.url} item={m} />
          ))}
        </ul>

        <p className="molduras-secao__nota">{molduras.nota}</p>
      </div>
    </section>
  )
}
