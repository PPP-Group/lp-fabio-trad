import { materias } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { useRevelar } from '../../lib/useRevelar'
import '../../styles/materias.css'

/**
 * Um cartão de matéria.
 *
 * Enquanto a `url` for `null` o cartão fica desativado, marcado como "em
 * breve": o espaço já está reservado e diagramado, mas ninguém clica em nada
 * e nenhuma manchete é inventada. Quando a matéria chegar, preencher os campos
 * em `materias.itens` liga o cartão sozinho.
 */
function Materia({ item, indice }) {
  const [alvo, visivel] = useRevelar({ fracao: 0.15 })
  const pronta = Boolean(item.url)

  const miolo = (
    <>
      <span className="materia__topo">
        <span className="materia__veiculo">{item.veiculo || materias.emBreve}</span>
        {item.data && <span className="materia__data">{item.data}</span>}
      </span>

      <span className="materia__titulo">
        {item.titulo || `Matéria ${indice + 1} — a publicar`}
      </span>

      <span className="materia__acao">{pronta ? `${materias.acao} →` : materias.emBreve}</span>
    </>
  )

  return (
    <li className="materia revelar" ref={alvo} data-visivel={visivel ? 'sim' : 'nao'}>
      {pronta ? (
        <a className="materia__cartao" href={item.url} target="_blank" rel="noreferrer">
          {miolo}
        </a>
      ) : (
        <span className="materia__cartao" data-inativo="sim" aria-disabled="true">
          {miolo}
        </span>
      )}
    </li>
  )
}

export function Materias() {
  if (!materias.itens.length) return null

  return (
    <section id={materias.id} className="secao materias">
      <div className="envelope">
        <Cabecalho
          rotulo={materias.rotulo}
          titulo={materias.titulo}
          chamada={materias.chamada}
          semente={87}
        />

        <ul className="materias__lista">
          {materias.itens.map((m, i) => (
            <Materia key={m.url || `vazia-${i}`} item={m} indice={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
