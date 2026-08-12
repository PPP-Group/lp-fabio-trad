import { apoios, gilda } from '../../data/campanha'
import { FaixaEstrelas } from '../Estrela'
import '../../styles/chapa.css'

/** A vice e quem caminha junto. */
export function Chapa() {
  return (
    <div className="chapa">
      <FaixaEstrelas altura={18} cor="rgba(255,255,255,0.45)" />

      <div className="envelope chapa__corpo">
        <figure className="chapa__figura">
          <img
            src="/assets/gilda-recorte.webp"
            alt="Dona Gilda, candidata a vice-governadora"
            width="899"
            height="779"
            loading="lazy"
          />
        </figure>

        <div className="chapa__texto">
          <p className="rotulo chapa__rotulo">{gilda.rotulo}</p>
          <h3 className="chapa__nome">{gilda.nome}</h3>
          <p className="chapa__papel">{gilda.papel}</p>
          <p className="chapa__fala">{gilda.texto}</p>

          <div className="chapa__apoios">
            <h4>{apoios.titulo}</h4>
            <p>{apoios.texto}</p>
          </div>
        </div>
      </div>

      <FaixaEstrelas altura={18} cor="rgba(255,255,255,0.45)" />
    </div>
  )
}
