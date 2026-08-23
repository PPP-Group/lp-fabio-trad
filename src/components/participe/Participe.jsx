import { participe, redes } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { ICONES } from '../Icones'
import '../../styles/participe.css'

/**
 * O convite final. Depois que o formulário de recado e o bloco de voluntário
 * saíram, quem carrega a seção são as redes: é por elas que a campanha fala
 * com quem chegou até aqui.
 */
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
    </section>
  )
}
