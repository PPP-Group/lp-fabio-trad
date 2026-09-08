import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { materia } from './schemas/materia'
import { materialApoio } from './schemas/materialApoio'

/**
 * O painel onde a campanha publica as matérias e o material de apoio.
 *
 * O site não fala com o Sanity em tempo de execução pelo navegador de ninguém:
 * quem busca é o nosso servidor, de dois em dois minutos, e é ele quem entrega
 * tudo ao visitante — inclusive os arquivos. Publicar aqui aparece no site em
 * poucos minutos, sem deploy.
 */
export default defineConfig({
  name: 'default',
  title: 'Fábio Trad 13 — Painel',

  projectId: 'mcpf4hd5',
  dataset: 'production',

  // O painel é servido pelo nosso próprio domínio, em /studio. Sem isto ele
  // é compilado achando que mora na raiz e pede `/static/...`, que cai no
  // index.html do site — e o navegador recusa com erro de MIME.
  basePath: '/studio',

  plugins: [
    structureTool({
      // O material de apoio é uma pasta só, não uma coleção. Sem esta estrutura
      // o painel ofereceria um botão de "criar novo" e o editor acabaria com
      // dois documentos de material — o site leria um e ele estaria editando o
      // outro, sem nada na tela explicando por quê.
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.documentTypeListItem('materia').title('Matérias'),
            S.divider(),
            S.listItem()
              .title('Material de apoio')
              .id('materialApoio')
              .child(
                S.document().schemaType('materialApoio').documentId('materialApoio'),
              ),
          ]),
    }),
  ],

  schema: {
    types: [materia, materialApoio],
  },
})
