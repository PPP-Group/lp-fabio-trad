import { Nav } from './components/Nav'
import { Hero } from './components/hero/Hero'
import { Sobre } from './components/sobre/Sobre'
import { Propostas } from './components/propostas/Propostas'
import { Molduras } from './components/molduras/Molduras'
import { Jingle } from './components/jingle/Jingle'
import { Jogo } from './components/jogo/Jogo'
import { Conquistas } from './components/conquistas/Conquistas'
import { Materias } from './components/materias/Materias'
import { Participe } from './components/participe/Participe'
import { Rodape } from './components/Rodape'

export function App() {
  return (
    <>
      <a className="pular" href="#sobre">
        Pular para o conteúdo
      </a>
      <Nav />
      <main>
        <Hero />
        <Sobre />
        <Propostas />
        <Molduras />
        <Jingle />
        {/* Seção-bônus, de propósito fora de `secoes` (data/campanha.js): não entra na nav. */}
        <Jogo />
        <Conquistas />
        <Materias />
        <Participe />
      </main>
      <Rodape />
    </>
  )
}
