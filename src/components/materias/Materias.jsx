import { useEffect, useState } from 'react'
import { materias } from '../../data/campanha'
import { Cabecalho } from '../Cabecalho'
import { useRevelar } from '../../lib/useRevelar'
import '../../styles/materias.css'

/**
 * Um cartão de matéria.
 *
 * Enquanto a `url` for `null` o cartão fica desativado, marcado como "em
 * breve": o espaço já está reservado e diagramado, mas ninguém clica em nada
 * e nenhuma manchete é inventada.
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

/**
 * A lista das matérias, em duas etapas.
 *
 * Começa com a lista que veio assada no bundle — assim a seção aparece no
 * primeiro quadro, sem buraco e sem espera. Logo depois pergunta ao **nosso
 * servidor** qual é a lista corrente e se corrige se algo mudou desde o
 * último deploy. Quem publica no painel vê a matéria no ar em poucos minutos,
 * sem ninguém apertar botão nenhum.
 *
 * O endereço é do nosso próprio domínio, e isso é o ponto: o eleitor que abre
 * esta página não fala com o Sanity nem com ninguém de fora. Quem faz essa
 * conversa é o servidor, longe do navegador dele.
 *
 * Se a resposta não vier, ou vier torta, fica valendo a lista do bundle. O
 * caminho de falha aqui não é uma seção vazia — é a página de antes.
 */
export function Materias() {
  const [itens, setItens] = useState(materias.itens)

  useEffect(() => {
    let vivo = true

    fetch('/api/materias')
      .then((r) => (r.ok ? r.json() : null))
      .then((corpo) => {
        // `ok: false` é o servidor dizendo que ainda não falou com o Sanity.
        // Nesse caso a lista do bundle é a melhor informação que existe.
        if (!vivo || !corpo?.ok || !Array.isArray(corpo.itens)) return
        setItens(corpo.itens)
      })
      .catch(() => {
        // Em desenvolvimento esta rota não existe (o Vite serve o index.html
        // e o JSON não abre). Silêncio é a resposta certa: a lista do bundle
        // já está na tela.
      })

    return () => {
      vivo = false
    }
  }, [])

  if (!itens.length) return null

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
          {/*
            A chave vem do `id` do Sanity, nunca da URL. Já veio da URL uma
            vez: uma matéria de teste foi criada com o link de outra, as duas
            chaves ficaram iguais, e o React perdeu a conta de qual cartão era
            qual — a matéria apagada continuou na tela porque ele não
            conseguiu removê-la. A posição só entra como último recurso, para
            listas gravadas antes de o `id` existir.
          */}
          {itens.map((m, i) => (
            <Materia key={m.id || `pos-${i}`} item={m} indice={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
