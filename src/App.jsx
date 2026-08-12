import { Nav } from './components/Nav'
import { Hero } from './components/hero/Hero'
import { Sobre } from './components/sobre/Sobre'
import { Propostas } from './components/propostas/Propostas'
import { Conquistas } from './components/conquistas/Conquistas'
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
        <Conquistas />
        <Participe />
      </main>
      <Rodape />
    </>
  )
}
