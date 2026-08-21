import { useId, useState } from 'react'
import { molduras } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { useRevelar } from '../../lib/useRevelar'
import { Cartaz } from './Cartaz'
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
            {molduras.foto.vazio}
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
          <span className="moldura__acao">{molduras.foto.acao} →</span>
        </span>
      </a>
    </li>
  )
}

function PainelFoto() {
  return (
    <>
      <p className="molduras-secao__texto">{molduras.foto.texto}</p>

      <ul className="molduras-secao__lista">
        {molduras.foto.itens.map((m) => (
          <Moldura key={m.url} item={m} />
        ))}
      </ul>

      <p className="molduras-secao__nota">{molduras.foto.nota}</p>
    </>
  )
}

/**
 * As duas peças que o eleitor leva embora, numa seção só.
 *
 * A troca entre elas é sempre no clique — nada gira sozinho, porque um
 * carrossel automático levaria embora a peça que a pessoa estava usando no
 * meio do caminho (o cartaz, ainda por cima, guarda o nome que ela digitou).
 * Por isso as duas ficam montadas o tempo todo e o que muda é qual aparece:
 * sair da aba do cartaz e voltar não apaga nada.
 */
export function Molduras() {
  const [aba, setAba] = useState(molduras.abas[0].id)
  const base = useId()

  return (
    <section id={molduras.id} className="secao molduras-secao">
      <div className="envelope">
        <Cabecalho
          rotulo={molduras.rotulo}
          titulo={molduras.titulo}
          chamada={molduras.chamada}
          semente={63}
        />

        <div className="abas" role="tablist" aria-label={molduras.titulo}>
          {molduras.abas.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              id={`${base}-aba-${a.id}`}
              className="abas__botao"
              aria-selected={aba === a.id}
              aria-controls={`${base}-painel-${a.id}`}
              data-ativa={aba === a.id ? 'sim' : 'nao'}
              onClick={() => setAba(a.id)}
            >
              {a.rotulo}
            </button>
          ))}
        </div>

        {molduras.abas.map((a) => (
          <div
            key={a.id}
            role="tabpanel"
            id={`${base}-painel-${a.id}`}
            aria-labelledby={`${base}-aba-${a.id}`}
            className="abas__painel"
            hidden={aba !== a.id}
          >
            {a.id === 'foto' ? <PainelFoto /> : <Cartaz />}
          </div>
        ))}
      </div>
    </section>
  )
}
