/**
 * O material de apoio que a campanha distribui pelo site.
 *
 * É um documento só, com uma lista de arquivos dentro — e não um documento por
 * arquivo, como as matérias. A diferença importa para quem usa: assim o editor
 * arrasta as dez imagens de uma vez para dentro da lista, reordena arrastando e
 * remove clicando. Um documento por arquivo obrigaria a criar dez registros na
 * mão, um a um.
 *
 * Quem serve esses arquivos ao visitante é o nosso servidor, nunca o CDN do
 * Sanity direto (ver `server.js`). Isso é proposital: as miniaturas apareceriam
 * para todo mundo que passasse pela seção, e seriam requisições silenciosas a
 * um terceiro feitas por quem nem baixou nada.
 */
export const materialApoio = {
  name: 'materialApoio',
  title: 'Material de apoio',
  type: 'document',

  fields: [
    {
      name: 'arquivos',
      title: 'Arquivos',
      description:
        'Arraste as imagens para cá. A ordem daqui é a ordem que aparece no site — ' +
        'arraste para reordenar. Para tirar uma do ar, remova daqui e publique.',
      type: 'array',
      of: [
        {
          type: 'image',
          // Sem hotspot: estas peças são baixadas inteiras, não recortadas.
          options: { hotspot: false, storeOriginalFilename: true },
          fields: [
            {
              name: 'titulo',
              title: 'Nome que aparece no site',
              type: 'string',
              description:
                'Opcional. Se ficar vazio, o site mostra o nome do arquivo enviado.',
            },
          ],
        },
      ],
    },
  ],

  preview: {
    select: { arquivos: 'arquivos' },
    prepare({ arquivos }) {
      const quantos = Array.isArray(arquivos) ? arquivos.length : 0
      return {
        title: 'Material de apoio',
        subtitle:
          quantos === 0
            ? 'Nenhum arquivo ainda'
            : `${quantos} arquivo${quantos > 1 ? 's' : ''} no ar`,
      }
    },
  },
}
