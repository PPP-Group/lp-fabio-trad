/**
 * Uma matéria de imprensa sobre o candidato.
 *
 * Os quatro campos são exatamente os que o cartão da seção "Últimas notícias"
 * mostra — nada aqui é decorativo. Todos são obrigatórios: um cartão sem
 * veículo ou sem data fica pela metade na página, e sem link não leva a lugar
 * nenhum.
 */
export const materia = {
  name: 'materia',
  title: 'Matéria',
  type: 'document',
  fields: [
    {
      name: 'titulo',
      title: 'Título da matéria',
      type: 'string',
      description: 'Copie o título como está publicado no site do veículo.',
      validation: (regra) => regra.required().max(160).error('O título é obrigatório.'),
    },
    {
      name: 'veiculo',
      title: 'Veículo',
      type: 'string',
      description: 'O nome do jornal ou site. Ex.: O Jacaré, Campo Grande News.',
      validation: (regra) => regra.required().max(60).error('O veículo é obrigatório.'),
    },
    {
      name: 'data',
      title: 'Data da publicação',
      type: 'date',
      options: { dateFormat: 'DD/MM/YYYY' },
      validation: (regra) => regra.required().error('A data é obrigatória.'),
    },
    {
      name: 'url',
      title: 'Link da matéria',
      type: 'url',
      description: 'O endereço completo, começando com https://',
      // Só http e https. Sem isto, um endereço `javascript:` colado sem
      // querer viraria brecha de segurança no site.
      validation: (regra) =>
        regra
          .required()
          .uri({ scheme: ['http', 'https'] })
          .error('Informe um endereço começando com http:// ou https://'),
    },
  ],

  // A lista já abre com a mais recente em cima, que é a ordem em que elas
  // aparecem no site.
  orderings: [
    {
      title: 'Mais recentes primeiro',
      name: 'dataDesc',
      by: [{ field: 'data', direction: 'desc' }],
    },
  ],

  preview: {
    select: { title: 'titulo', veiculo: 'veiculo', data: 'data' },
    prepare({ title, veiculo, data }) {
      const dia = data ? data.split('-').reverse().join('/') : 'sem data'
      return { title: title || 'Sem título', subtitle: `${veiculo || 'sem veículo'} · ${dia}` }
    },
  },
}
