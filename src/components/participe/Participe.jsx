import { useState } from 'react'
import { linkEmail, participe, redes } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { ICONES } from '../Icones'
import { Cartaz } from './Cartaz'
import '../../styles/participe.css'

/**
 * O recado vai por e-mail: não há servidor no meio, então nada é guardado
 * aqui. O `mailto:` abre o programa de e-mail do próprio leitor com a
 * mensagem montada, e é ele quem aperta o enviar.
 */
function abrirEmail(assunto, corpo) {
  window.location.href = linkEmail(assunto, corpo)
}

function Recado() {
  const [nome, setNome] = useState('')
  const [cidade, setCidade] = useState('')
  const [recado, setRecado] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    abrirEmail(
      `Recado de ${nome}, de ${cidade}`,
      `Olá, Fábio! Sou ${nome}, de ${cidade}.\n\n${recado}`,
    )
  }

  return (
    <form className="recado" onSubmit={enviar}>
      <h3 className="recado__titulo">{participe.formulario.titulo}</h3>
      <p className="recado__texto">{participe.formulario.texto}</p>

      <label className="campo">
        <span>Seu nome</span>
        <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} />
      </label>

      <label className="campo">
        <span>Sua cidade</span>
        <input type="text" required value={cidade} onChange={(e) => setCidade(e.target.value)} />
      </label>

      <label className="campo">
        <span>Seu recado</span>
        <textarea rows={4} required value={recado} onChange={(e) => setRecado(e.target.value)} />
      </label>

      <button type="submit" className="botao botao--amarelo">
        {participe.formulario.envio}
      </button>
      <p className="recado__nota">{participe.formulario.nota}</p>
    </form>
  )
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
          <Recado />

          <div className="participe__lado">
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
      </div>

      <div className="envelope">
        <Cartaz />
      </div>
    </section>
  )
}
