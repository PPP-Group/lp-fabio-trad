/**
 * Texto do jogo — separado de `data/campanha.js` porque não vem do documento
 * oficial da campanha (esse é só o texto aprovado, ver o comentário lá).
 * Aqui é conteúdo de produto, escrito pra essa seção.
 */

export const jogo = {
  rotulo: 'Bônus',
  titulo: 'Desvie se conseguir',
  chamada:
    'Um jogo rápido pra sentir na pele o que é dirigir em Mato Grosso do Sul hoje. ' +
    'Escolha quem vai dirigir e siga o quanto der por uma estrada que já está esburacada.',
  instrucoesTeclado: 'O carro anda sozinho. Você só desvia: ← →',
  instrucoesToque: 'No celular, use os botões abaixo ou incline o aparelho.',
  // A arte de título do jogo, que abre a tela de início. É ela que dá nome à
  // brincadeira dentro do quadro; o `titulo` acima é o da seção, fora dele.
  logo: {
    arquivo: 'jogo-logo.png',
    alt: 'Tente andar em MS — com Fábio Trad e Dona Gilda',
    largura: 440,
    altura: 496,
  },
  rotuloSelecao: 'Escolha quem dirige',
  botaoEscolher: 'Escolher',
  botaoEscolhido: 'Escolhido',
  botaoPartida: 'Dar partida',
  botaoTrocarPiloto: 'Trocar de piloto',
  botaoTentarDeNovo: 'Tentar de novo',
  entrandoTexto: 'está entrando no carro…',
  fasesRotulo: {
    tranquilo: 'Tranquilo',
    esburacado: 'Esburacado',
    critico: 'Crítico',
    impossivel: 'Impossível',
  },
  // O fim é sempre o mesmo, pouco importa se você caiu no primeiro buraco ou
  // no trecho que ninguém passa: é aí que o jogo diz a que veio.
  fim: {
    titulo: 'Está impossível andar em Mato Grosso do Sul.',
    texto:
      'Buraco atrás de buraco, e quanto mais longe você vai, pior fica: chega um ponto em ' +
      'que não passa ninguém. É por isso que a proposta de infraestrutura da campanha é ' +
      'direta: estrada sem buraco de verdade, e transporte público que funciona, na capital ' +
      'e no interior.',
    ctaProposta: 'Ver a proposta de infraestrutura',
  },
  recorde: {
    rotulo: 'Seu recorde',
    novo: 'Novo recorde!',
    unidade: 'm',
  },
  pausa: {
    titulo: 'Pausado',
    retomar: 'Continuar',
    sair: 'Encerrar corrida',
  },
}
