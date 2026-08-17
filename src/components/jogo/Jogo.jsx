import { useEffect, useRef, useState } from 'react'
import { Cabecalho } from '../Cabecalho'
import { jogo } from './conteudo'
import { PILOTOS, VIDAS_INICIAIS, criarMotor } from './motor'
import '../../styles/jogo.css'

const CHAVE_RECORDE = 'fabiotrad13:jogo:recorde'
const CHAVE_MUDO = 'fabiotrad13:jogo:mudo'

function lerNumero(chave) {
  try {
    return Number(localStorage.getItem(chave)) || 0
  } catch {
    return 0
  }
}
function lerBooleano(chave) {
  try {
    return localStorage.getItem(chave) === '1'
  } catch {
    return false
  }
}
function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, String(valor))
  } catch {
    /* modo privado do navegador — sem recorde salvo, sem problema */
  }
}

/** Ícones pequenos, desenhados na hora — só os que esse jogo usa. */
function Icone({ nome }) {
  const comum = { width: '1.15em', height: '1.15em', viewBox: '0 0 24 24', 'aria-hidden': 'true', focusable: 'false' }
  if (nome === 'pausa')
    return (
      <svg {...comum} fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
    )
  if (nome === 'play')
    return (
      <svg {...comum} fill="currentColor">
        <polygon points="7,4 20,12 7,20" />
      </svg>
    )
  if (nome === 'som')
    return (
      <svg {...comum} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="3,9 3,15 8,15 13,20 13,4 8,9" fill="currentColor" stroke="none" />
        <path d="M16 9a4 4 0 010 6" />
        <path d="M18.5 6.5a8 8 0 010 11" />
      </svg>
    )
  if (nome === 'mudo')
    return (
      <svg {...comum} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polygon points="3,9 3,15 8,15 13,20 13,4 8,9" fill="currentColor" stroke="none" />
        <path d="M16 9l5 6M21 9l-5 6" />
      </svg>
    )
  if (nome === 'expandir')
    return (
      <svg {...comum} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
      </svg>
    )
  if (nome === 'encolher')
    return (
      <svg {...comum} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 4v5H4M15 4v5h5M20 20v-5h-5M4 20v-5h5" />
      </svg>
    )
  if (nome === 'inclinar')
    return (
      <svg {...comum} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2" transform="rotate(-14 12 12)" />
      </svg>
    )
  return null
}

export function Jogo() {
  const canvasRef = useRef(null)
  const quadroRef = useRef(null)
  const distRef = useRef(null)
  const vidasRef = useRef(null)
  const motorRef = useRef(null)
  const aoFimRef = useRef(() => {})
  const recordeRef = useRef(0)
  const timeoutEntrandoRef = useRef(null)

  const [estagio, setEstagio] = useState('selecao') // selecao | entrando | jogando | pausado | fim
  const [pilotoId, setPilotoId] = useState('fabio')
  const [fase, setFase] = useState('tranquilo')
  const [mudo, setMudo] = useState(() => lerBooleano(CHAVE_MUDO))
  const [recorde, setRecorde] = useState(() => lerNumero(CHAVE_RECORDE))
  const [resultado, setResultado] = useState(null)
  const [telaCheia, setTelaCheia] = useState(false)
  const [inclinacaoAtiva, setInclinacaoAtiva] = useState(false)

  const suportaInclinacao = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window
  const suportaTelaCheia = typeof document !== 'undefined' && !!document.documentElement.requestFullscreen

  recordeRef.current = recorde

  function aoFimDeJogo({ distancia }) {
    const bateuRecorde = distancia > recordeRef.current
    if (bateuRecorde) {
      salvar(CHAVE_RECORDE, distancia)
      setRecorde(distancia)
    }
    setResultado({ distancia, novoRecorde: bateuRecorde })
    setEstagio('fim')
  }
  aoFimRef.current = aoFimDeJogo

  // o motor é criado uma vez só; callbacks passam por refs pra nunca ficar com estado velho
  useEffect(() => {
    if (!canvasRef.current) return undefined
    const motor = criarMotor(canvasRef.current, {
      refs: { distEl: distRef, vidasEl: vidasRef },
      onFim: (info) => aoFimRef.current(info),
      onFase: (f) => setFase(f),
    })
    motor.definirMudo(lerBooleano(CHAVE_MUDO))
    motorRef.current = motor
    return () => {
      motor.destruir()
      motorRef.current = null
    }
  }, [])

  useEffect(() => () => clearTimeout(timeoutEntrandoRef.current), [])

  useEffect(() => {
    function aoMudarTelaCheia() {
      setTelaCheia(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', aoMudarTelaCheia)
    return () => document.removeEventListener('fullscreenchange', aoMudarTelaCheia)
  }, [])

  useEffect(() => {
    function aoTeclar(e) {
      if ((e.code === 'Escape' || e.code === 'KeyP') && (estagio === 'jogando' || estagio === 'pausado')) {
        e.preventDefault()
        alternarPausa()
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estagio])

  function escolherPiloto(id) {
    setPilotoId(id)
    motorRef.current?.tocarClique()
  }

  function iniciarPartida() {
    motorRef.current?.definirPiloto(pilotoId)
    motorRef.current?.tocarClique()
    setEstagio('entrando')
    clearTimeout(timeoutEntrandoRef.current)
    timeoutEntrandoRef.current = setTimeout(() => {
      setEstagio('jogando')
      motorRef.current?.iniciar()
    }, 900)
  }

  function tentarDeNovo() {
    setResultado(null)
    setEstagio('entrando')
    clearTimeout(timeoutEntrandoRef.current)
    timeoutEntrandoRef.current = setTimeout(() => {
      setEstagio('jogando')
      motorRef.current?.iniciar()
    }, 500)
  }

  function trocarPiloto() {
    setResultado(null)
    setEstagio('selecao')
  }

  function alternarPausa() {
    setEstagio((atual) => {
      if (atual === 'jogando') {
        motorRef.current?.pausar()
        return 'pausado'
      }
      if (atual === 'pausado') {
        motorRef.current?.retomar()
        return 'jogando'
      }
      return atual
    })
  }

  function alternarMudo() {
    setMudo((v) => {
      const novo = !v
      motorRef.current?.definirMudo(novo)
      salvar(CHAVE_MUDO, novo ? '1' : '0')
      return novo
    })
  }

  function alternarTelaCheia() {
    const el = quadroRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.().catch(() => {})
  }

  async function alternarInclinacao() {
    if (inclinacaoAtiva) {
      motorRef.current?.desligarInclinacao()
      setInclinacaoAtiva(false)
      return
    }
    const ok = await motorRef.current?.ativarInclinacao()
    setInclinacaoAtiva(!!ok)
  }

  function segurar(nome) {
    return {
      onPointerDown: (e) => {
        e.preventDefault()
        motorRef.current?.definirTecla(nome, true)
      },
      onPointerUp: () => motorRef.current?.definirTecla(nome, false),
      onPointerLeave: () => motorRef.current?.definirTecla(nome, false),
      onPointerCancel: () => motorRef.current?.definirTecla(nome, false),
    }
  }

  const emJogo = estagio === 'jogando' || estagio === 'pausado'
  const piloto = PILOTOS[pilotoId]

  return (
    <section id="jogo" className="secao jogo">
      <div className="jogo__mapa" aria-hidden="true" />

      <div className="envelope jogo__corpo">
        <Cabecalho
          className="cabecalho--claro"
          rotulo={jogo.rotulo}
          titulo={jogo.titulo}
          chamada={jogo.chamada}
          semente={53}
        />

        <div className="jogo__quadro" ref={quadroRef} data-tela-cheia={telaCheia ? 'sim' : 'nao'}>
          <canvas
            ref={canvasRef}
            className="jogo__tela"
            aria-hidden="true"
          />

          <div className="jogo__hud" data-ativo={emJogo ? 'sim' : 'nao'}>
            <span className="jogo__hud-distancia">
              <span className="so-leitor">Distância percorrida: </span>
              <strong ref={distRef}>0</strong> m
            </span>
            <span className="jogo__hud-fase" data-fase={fase}>
              {jogo.fasesRotulo[fase]}
            </span>
            <span className="jogo__hud-vidas" ref={vidasRef} aria-label="Vidas restantes">
              {'♥'.repeat(VIDAS_INICIAIS)}
            </span>
          </div>

          <div className="jogo__ferramentas" data-ativo={emJogo ? 'sim' : 'nao'}>
            <button type="button" onClick={alternarPausa} aria-label={estagio === 'pausado' ? 'Continuar' : 'Pausar'}>
              <Icone nome={estagio === 'pausado' ? 'play' : 'pausa'} />
            </button>
            <button type="button" onClick={alternarMudo} aria-pressed={mudo} aria-label={mudo ? 'Ativar som' : 'Silenciar'}>
              <Icone nome={mudo ? 'mudo' : 'som'} />
            </button>
            {suportaInclinacao && (
              <button
                type="button"
                onClick={alternarInclinacao}
                aria-pressed={inclinacaoAtiva}
                aria-label="Dirigir inclinando o celular"
              >
                <Icone nome="inclinar" />
              </button>
            )}
            {suportaTelaCheia && (
              <button
                type="button"
                onClick={alternarTelaCheia}
                aria-label={telaCheia ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                <Icone nome={telaCheia ? 'encolher' : 'expandir'} />
              </button>
            )}
          </div>

          {estagio === 'selecao' && (
            <div className="jogo__tela-flutuante jogo__selecao">
              <p className="rotulo jogo__selecao-rotulo">{jogo.rotuloSelecao}</p>

              <ul className="jogo__pilotos">
                {Object.values(PILOTOS).map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className="jogo__piloto"
                      data-selecionado={pilotoId === p.id ? 'sim' : 'nao'}
                      onClick={() => escolherPiloto(p.id)}
                      aria-pressed={pilotoId === p.id}
                    >
                      <img src={p.foto} alt="" width="899" height="779" loading="lazy" />
                      <span className="jogo__piloto-texto">
                        <span className="jogo__piloto-nome">{p.nome}</span>
                        <span className="jogo__piloto-papel">{p.papel}</span>
                      </span>
                      <span className="jogo__piloto-marca" aria-hidden="true">
                        {pilotoId === p.id ? jogo.botaoEscolhido : jogo.botaoEscolher}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <p className="jogo__instrucoes">
                {jogo.instrucoesTeclado}
                <br />
                {jogo.instrucoesToque}
              </p>

              {recorde > 0 && (
                <p className="jogo__recorde">
                  {jogo.recorde.rotulo}: <strong>{recorde}</strong> {jogo.recorde.unidade}
                </p>
              )}

              <button type="button" className="botao botao--amarelo jogo__botao-partida" onClick={iniciarPartida}>
                {jogo.botaoPartida}
              </button>
            </div>
          )}

          {estagio === 'entrando' && (
            <div className="jogo__tela-flutuante jogo__entrando" aria-live="polite">
              <img src={piloto.foto} alt="" width="899" height="779" className="jogo__entrando-foto" />
              <p>
                <strong>{piloto.nome}</strong> {jogo.entrandoTexto}
              </p>
            </div>
          )}

          {estagio === 'pausado' && (
            <div className="jogo__tela-flutuante jogo__pausa">
              <h3>{jogo.pausa.titulo}</h3>
              <div className="jogo__fim-acoes">
                <button type="button" className="botao botao--amarelo" onClick={alternarPausa}>
                  {jogo.pausa.retomar}
                </button>
                <button type="button" className="botao botao--carvao" onClick={trocarPiloto}>
                  {jogo.pausa.sair}
                </button>
              </div>
            </div>
          )}

          {estagio === 'fim' && resultado && (
            <div className="jogo__tela-flutuante jogo__fim" role="alert">
              <h3>{jogo.fim.titulo}</h3>
              <p className="jogo__fim-distancia">
                {resultado.distancia} {jogo.recorde.unidade}
              </p>
              {resultado.novoRecorde && <p className="jogo__recorde-novo">{jogo.recorde.novo}</p>}
              <p className="jogo__fim-texto">{jogo.fim.texto}</p>

              <div className="jogo__fim-acoes">
                <button type="button" className="botao botao--amarelo" onClick={tentarDeNovo}>
                  {jogo.botaoTentarDeNovo}
                </button>
                <a className="botao botao--vermelho" href="#propostas">
                  {jogo.fim.ctaProposta}
                </a>
                <button type="button" className="jogo__botao-secundario" onClick={trocarPiloto}>
                  {jogo.botaoTrocarPiloto}
                </button>
              </div>
            </div>
          )}

          {estagio === 'jogando' && (
            <div className="jogo__toque">
              <button type="button" className="jogo__toque-btn" aria-label="Virar à esquerda" {...segurar('esquerda')}>
                ‹
              </button>
              <button
                type="button"
                className="jogo__toque-btn jogo__toque-btn--freio"
                aria-label="Frear"
                {...segurar('baixo')}
              >
                ▾
              </button>
              <button type="button" className="jogo__toque-btn" aria-label="Virar à direita" {...segurar('direita')}>
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
