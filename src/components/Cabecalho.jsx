import { Traco } from './Traco'
import '../styles/cabecalho.css'

/**
 * A abertura de cada seção: rótulo, o traço riscado por baixo dele, título.
 * O rótulo é o nome da seção no menu — é assim que o leitor sabe onde está.
 */
export function Cabecalho({ rotulo, titulo, chamada, semente = 3, className = '' }) {
  return (
    <header className={`cabecalho ${className}`}>
      <p className="rotulo cabecalho__rotulo">{rotulo}</p>
      <Traco className="traco--curto cabecalho__traco" semente={semente} comprimento={150} densidade={22} />
      <h2 className="cabecalho__titulo">{titulo}</h2>
      {chamada && <p className="cabecalho__chamada">{chamada}</p>}
    </header>
  )
}
