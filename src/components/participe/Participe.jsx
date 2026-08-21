import { linkEmail, participe, redes } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { ICONES } from '../Icones'
import '../../styles/participe.css'

/**
 * O contato vai por e-mail: não há servidor no meio, então nada é guardado
 * aqui. O `mailto:` abre o programa de e-mail do próprio leitor com a
 * mensagem montada, e é ele quem aperta o enviar.
 */
function abrirEmail(assunto, corpo) {
  window.location.href = linkEmail(assunto, corpo)
}

export function Participe() {
  return (
    <section id="participe" className="secao participe">
      <div className="envelope">
        <Cabecalho
          className="cabecalho--claro"
          rotulo={participe.rotulo}
          titulo={participe.titulo}
          chamada={participe.chamada}
          semente={47}
        />

        <div className="participe__grade">
          <div className="voluntario">
            <h3>{participe.voluntario.titulo}</h3>
            <p>{participe.voluntario.texto}</p>
            <button
              type="button"
              className="botao botao--carvao"
              onClick={() =>
                abrirEmail(
                  'Quero ser voluntário',
                  'Olá! Quero ser voluntário e ajudar na campanha do Fábio Trad 13.',
                )
              }
            >
              {participe.voluntario.acao}
            </button>
          </div>

          <div className="redes-sociais">
            <h3>Nas redes</h3>
            <ul>
              {redes.map((r) => {
                const Icone = ICONES[r.icone]
                return (
                  <li key={r.nome}>
                    <a href={r.url} target="_blank" rel="noreferrer">
                      <Icone />
                      <span>{r.nome}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
