import { molduras } from '../../data/campanha'
import { useRevelar } from '../../lib/useRevelar'

/** 245760 -> "240 KB". Só para a pessoa saber o que vai puxar. */
function tamanhoLegivel(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`
}

/**
 * Uma peça do material, com a miniatura e o botão de baixar.
 *
 * Tanto a miniatura quanto o arquivo vêm do nosso próprio endereço, e não do
 * CDN de onde a campanha subiu. A diferença aparece justamente aqui: a
 * miniatura carrega para todo mundo que passa pela aba, e se ela viesse de
 * fora, quem só olhou já teria sido visto por um terceiro.
 */
function Peca({ item }) {
  const [alvo, visivel] = useRevelar({ fracao: 0.15 })
  const peso = tamanhoLegivel(item.tamanho)

  return (
    <li className="material revelar" ref={alvo} data-visivel={visivel ? 'sim' : 'nao'}>
      <a
        className="material__cartao"
        href={`/api/material/arquivo/${encodeURIComponent(item.id)}`}
        download={item.nomeArquivo}
      >
        <span className="material__palco">
          <img
            className="material__arte"
            src={`/api/material/miniatura/${encodeURIComponent(item.id)}`}
            alt={item.titulo}
            loading="lazy"
          />
        </span>

        <span className="material__ficha">
          <span className="material__nome">{item.titulo}</span>
          <span className="material__acao">
            {molduras.material.acao}
            {peso ? ` · ${peso}` : ''} ↓
          </span>
        </span>
      </a>
    </li>
  )
}

export function MaterialApoio({ itens }) {
  return (
    <>
      <p className="molduras-secao__texto">{molduras.material.texto}</p>

      <p className="material__tudo">
        <a className="botao botao--vazado" href="/api/material/tudo.zip" download>
          {molduras.material.acaoTudo} ↓
        </a>
      </p>

      <ul className="material__lista">
        {itens.map((item) => (
          <Peca key={item.id} item={item} />
        ))}
      </ul>
    </>
  )
}
