import { candidato } from '../data/campanha'
import { Estrela } from './Estrela'
import '../styles/marca.css'

/**
 * A assinatura da campanha: cargo, nome, vice.
 *
 * "O olhar encontra o nome. Depois identifica o cargo. Em seguida memoriza o
 * número." (IDV, p. 11)
 *
 * O art. 36, § 4º da Lei nº 9.504/97 exige o nome do vice em tamanho não
 * inferior a 30% do nome do titular. A arte impressa usa 46,8% (21,8 mm sobre
 * 46,6 mm, IDV p. 17) e é essa proporção que está em --proporcao-vice.
 */
export function Marca({ tamanho = '1rem', className = '', comNumero = false }) {
  return (
    <div className={`marca ${className}`} style={{ '--marca-base': tamanho }}>
      <div className="marca__texto">
        <p className="marca__cargo">
          <Estrela tamanho="0.72em" />
          <span>{candidato.cargo}</span>
          <Estrela tamanho="0.72em" />
        </p>
        <p className="marca__nome">{candidato.nome}</p>
        <p className="marca__vice">
          <span className="marca__vice-rotulo">Vice</span>
          <span className="marca__vice-nome">{candidato.vice}</span>
        </p>
      </div>
      {comNumero && <p className="marca__numero">{candidato.numero}</p>}
    </div>
  )
}
