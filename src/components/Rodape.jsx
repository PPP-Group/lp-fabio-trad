import { candidato, redes, rodape, secoes } from '../data/campanha'
import { FaixaEstrelas } from './Estrela'
import { Marca } from './Marca'
import { ICONES } from './Icones'
import '../styles/rodape.css'

export function Rodape() {
  return (
    <footer id="rodape" className="rodape">
      <FaixaEstrelas altura={18} cor="var(--amarelo)" />

      <div className="envelope rodape__corpo">
        <div className="rodape__assinatura">
          <Marca tamanho="clamp(1.5rem, 3.4vw, 2.4rem)" />
          <img
            className="rodape__numero"
            src="/assets/13-amarelo-so.webp"
            alt={`Número ${candidato.numero}`}
            width="800"
            height="620"
            loading="lazy"
          />
        </div>

        <nav className="rodape__mapa" aria-label="Seções da página, no rodapé">
          {secoes.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              {s.rotulo}
            </a>
          ))}
        </nav>

        <ul className="rodape__redes">
          {redes.map((r) => {
            const Icone = ICONES[r.icone]
            return (
              <li key={r.nome}>
                <a href={r.url} target="_blank" rel="noreferrer" aria-label={r.nome}>
                  <Icone />
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="envelope rodape__legal">
        <p className="rodape__federacao">{candidato.federacao}</p>
        <p>CNPJ da campanha: {rodape.cnpj}</p>
        <p>{rodape.aviso}</p>
        <p className="rodape__grito">{rodape.assinatura}</p>
      </div>
    </footer>
  )
}
