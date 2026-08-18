import { useState } from 'react'
import { contato, linkZap, participe, redes } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { ICONES, IconeWhatsapp } from '../Icones'
import { Cartaz } from './Cartaz'
import '../../styles/participe.css'

/** O recado vai pelo WhatsApp da campanha: não há servidor no meio. */
function abrirZap(texto) {
  const url = linkZap(texto)
  if (!url) return
  window.open(url, '_blank', 'noopener')
}

function Recado() {
  const [nome, setNome] = useState('')
  const [cidade, setCidade] = useState('')
  const [recado, setRecado] = useState('')

  const enviar = (e) => {
    e.preventDefault()
    abrirZap(`Olá, Fábio! Sou ${nome}, de ${cidade}.\n\n${recado}`)
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

      <button
        type="submit"
        className="botao botao--amarelo"
        disabled={!contato.whatsappAtivo}
        data-inativo={contato.whatsappAtivo ? undefined : 'sim'}
      >
        <IconeWhatsapp />
        {contato.whatsappAtivo
          ? participe.formulario.envio
          : `WhatsApp ${contato.whatsappEmBreve.toLowerCase()}`}
      </button>
      <p className="recado__nota">
        {contato.whatsappAtivo
          ? 'Abre o WhatsApp com o recado já escrito. Você confere antes de mandar.'
          : 'O WhatsApp da campanha entra no ar em breve. Por enquanto, fale com a gente pelas redes aqui do lado.'}
      </p>
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
                disabled={!contato.whatsappAtivo}
                data-inativo={contato.whatsappAtivo ? undefined : 'sim'}
                onClick={() =>
                  abrirZap('Olá! Quero ser voluntário e ajudar na campanha do Fábio Trad 13.')
                }
              >
                {contato.whatsappAtivo
                  ? participe.voluntario.acao
                  : `${participe.voluntario.acao} · ${contato.whatsappEmBreve.toLowerCase()}`}
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
