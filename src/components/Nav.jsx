import { useEffect, useState } from 'react'
import { candidato, contato, linkZap, secoes } from '../data/campanha'
import { useSecaoAtiva } from '../lib/useSecaoAtiva'
import { FaixaEstrelas } from './Estrela'
import { IconeWhatsapp } from './Icones'
import '../styles/nav.css'

const IDS = secoes.map((s) => s.id)

export function Nav() {
  const ativa = useSecaoAtiva(IDS)
  const [rolou, setRolou] = useState(false)
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 40)
    aoRolar()
    window.addEventListener('scroll', aoRolar, { passive: true })
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  useEffect(() => {
    if (!aberto) return
    const aoTeclar = (e) => e.key === 'Escape' && setAberto(false)
    document.addEventListener('keydown', aoTeclar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = ''
    }
  }, [aberto])

  const zap = linkZap()

  return (
    <header className="nav" data-rolou={rolou ? 'sim' : 'nao'}>
      <FaixaEstrelas altura={16} cor="var(--amarelo)" fundo="var(--carvao)" />

      <div className="nav__barra">
        <a className="nav__marca" href="#inicio" aria-label={`${candidato.nome}, ${candidato.numero}`}>
          <img src="/assets/f13-branco.webp" alt="" width="900" height="465" />
        </a>

        <nav className="nav__itens" aria-label="Seções da página">
          {secoes.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="nav__item"
              data-ativa={ativa === s.id ? 'sim' : 'nao'}
              aria-current={ativa === s.id ? 'true' : undefined}
            >
              {s.rotulo}
            </a>
          ))}
        </nav>

        {zap ? (
          <a className="nav__zap" href={zap} target="_blank" rel="noreferrer">
            <IconeWhatsapp />
            <span>WhatsApp</span>
          </a>
        ) : (
          <span className="nav__zap" data-inativo="sim" aria-disabled="true">
            <IconeWhatsapp />
            <span>{contato.whatsappEmBreve}</span>
          </span>
        )}

        <button
          type="button"
          className="nav__botao"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          aria-controls="menu-celular"
        >
          <span className="so-leitor">{aberto ? 'Fechar menu' : 'Abrir menu'}</span>
          <span className="nav__hamburguer" data-aberto={aberto ? 'sim' : 'nao'} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      <div id="menu-celular" className="nav__gaveta" data-aberto={aberto ? 'sim' : 'nao'} hidden={!aberto}>
        <nav aria-label="Seções da página, no celular">
          {secoes.map((s) => (
            <a key={s.id} href={`#${s.id}`} onClick={() => setAberto(false)}>
              <span>{s.rotulo}</span>
              <span className="nav__gaveta-marca" aria-hidden="true">
                {ativa === s.id ? '—' : ''}
              </span>
            </a>
          ))}
        </nav>
        {zap ? (
          <a className="nav__gaveta-zap" href={zap} target="_blank" rel="noreferrer">
            <IconeWhatsapp />
            Fale comigo no WhatsApp
          </a>
        ) : (
          <span className="nav__gaveta-zap" data-inativo="sim" aria-disabled="true">
            <IconeWhatsapp />
            WhatsApp em breve
          </span>
        )}
      </div>
    </header>
  )
}
