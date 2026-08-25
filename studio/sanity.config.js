import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { materia } from './schemas/materia'

/**
 * O painel onde a campanha publica as matérias.
 *
 * O site não fala com o Sanity em tempo de execução: quem busca aqui é o
 * script de build (`scripts/materias.mjs`), e o resultado vai assado dentro
 * do bundle. Publicar aqui dispara o webhook que manda o Easypanel recompilar.
 */
export default defineConfig({
  name: 'default',
  title: 'Fábio Trad 13 — Matérias',

  projectId: 'mcpf4hd5',
  dataset: 'production',

  // O painel é servido pelo nosso próprio domínio, em /studio. Sem isto ele
  // é compilado achando que mora na raiz e pede `/static/...`, que cai no
  // index.html do site — e o navegador recusa com erro de MIME.
  basePath: '/studio',

  plugins: [structureTool()],

  schema: {
    types: [materia],
  },
})
