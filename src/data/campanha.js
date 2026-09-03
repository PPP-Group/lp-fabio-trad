/**
 * Todo o texto aprovado da página, num arquivo só.
 *
 * Origem: IDV/Estrutura_Landing_Page_Fabio_Trad.docx. Os textos são os do
 * documento, sem reescrita. O que ainda precisa vir da campanha está marcado
 * com A_CONFIRMAR e listado no README.
 */

// Gerado por `scripts/materias.mjs` a partir do Sanity, antes de cada build.
import itensDeMaterias from './materias.json'

export const A_CONFIRMAR = 'a confirmar com a campanha'

export const candidato = {
  nome: 'Fábio Trad',
  cargo: 'Governador',
  vice: 'Dona Gilda',
  numero: '13',
  estado: 'Mato Grosso do Sul',
  ano: '2026',
  slogan: 'Coragem pra sonhar.',
  coligacao: 'Coligação Por um MS do Povo',
  federacao: 'Coligação Por um MS do Povo · Federação Brasil da Esperança (PT · PV · PCdoB) · PSB · PDT',
}

/**
 * O endereço da campanha. Hoje **não aparece em lugar nenhum do site**: os
 * dois botões que abriam o programa de e-mail (o formulário de recado e o
 * convite de voluntariado) saíram a pedido da campanha, e o contato passou a
 * ser só pelas redes sociais.
 *
 * Fica registrado aqui pra não se perder — quando houver de novo um canal de
 * contato na página, é daqui que ele sai.
 */
export const contato = {
  email: `contato@fabiotrad13.com.br (${A_CONFIRMAR})`,
}

// Instagram, TikTok e Facebook. O YouTube saiu a pedido da campanha — quando
// voltar, é só devolver a linha aqui (o ícone continua em Icones.jsx).
export const redes = [
  { nome: 'Instagram', url: 'https://www.instagram.com/fabiotrad', icone: 'instagram' },
  { nome: 'Facebook', url: 'https://www.facebook.com/fabiotrad', icone: 'facebook' },
  { nome: 'TikTok', url: 'https://www.tiktok.com/@fabio.trad', icone: 'tiktok' },
]

export const secoes = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'propostas', rotulo: 'Propostas' },
  { id: 'jogo', rotulo: 'Jogo' },
  { id: 'conquistas', rotulo: 'Conquistas' },
  { id: 'participe', rotulo: 'Participe' },
]

export const hero = {
  chamada: ['Coragem', 'pra sonhar'],
  // do "Quem sou eu": é a voz dele, por isso vai na serifada
  apoio: 'Aprendi sobre coragem dentro de casa.',
  numero: 'na urna, para governador',
  // As duas ações são âncoras: o vídeo de apresentação tem seção própria
  // (ver `apresentacao`), e o botão daqui leva até ela.
  acoes: [
    { texto: 'Conheça as propostas', tipo: 'ancora', destino: 'propostas' },
    { texto: 'Assista à apresentação', tipo: 'ancora', destino: 'apresentacao' },
  ],
}

export const sobre = {
  rotulo: 'Sobre',
  titulo: 'Quem sou eu',
  depoimento: [
    'Sou Fábio Trad, advogado, professor de Direito e ex-presidente da OAB de ' +
      'Mato Grosso do Sul. Fui deputado federal por três mandatos, sempre com a ' +
      'mesma régua: defender as pessoas, cumprir a lei e não baixar a cabeça pra pressão.',
    'Aprendi sobre coragem dentro de casa. Meu pai foi perseguido pela ditadura e não ' +
      'se calou. É essa coragem que me trouxe até aqui, e é ela que ofereço a Mato ' +
      'Grosso do Sul: coragem pra sonhar e pra fazer diferente pelo nosso povo.',
  ],
  assinatura: 'Fábio Trad',
}

export const trajetoria = {
  titulo: 'Trajetória',
  marcos: [
    {
      quando: 'Formação',
      o_que: 'Advogado e professor de Direito Penal. Presidente da OAB-MS (2007–2009).',
    },
    {
      quando: '2011 a 2023',
      o_que:
        'Deputado federal, entre os mais votados do estado, ' +
        'com atuação técnica de referência nacional.',
    },
    {
      quando: 'No Congresso',
      o_que:
        'Presidiu a Comissão do Novo Código de Processo Civil, que modernizou a ' +
        'Justiça brasileira.',
    },
    {
      quando: 'Defesa das mulheres',
      o_que:
        'Ajudou a criar a lei que transformou o feminicídio em crime independente ' +
        '(Lei nº 14.994/2024).',
    },
    {
      quando: '2026',
      o_que:
        'Filiado ao PT e candidato a governador pela coligação Por um MS do Povo, ' +
        'ao lado da vice, Dona Gilda.',
    },
  ],
}

// `formato` decide o lugar de cada foto no mosaico, numa grade de 4 colunas
// (2 no celular): 'panorama' ocupa a fileira inteira, 'deitada' ocupa duas
// colunas e 'em-pe' ocupa uma. A ordem é o que faz a grade fechar sem buraco —
// 4 + (1+1+2) + (2+2) — então mexer nela pede refazer a conta.
export const galeria = {
  titulo: 'Na rua, com a nossa gente',
  fotos: [
    {
      arquivo: 'comicio.webp',
      legenda: 'Plenária de campanha, com a militância',
      formato: 'panorama',
      largura: 1600,
      altura: 1066,
    },
    {
      arquivo: 'caminhada.webp',
      legenda: 'Caminhada pelas ruas',
      formato: 'em-pe',
      largura: 1000,
      altura: 1500,
    },
    {
      arquivo: 'festa.webp',
      legenda: 'Abraço na festa',
      formato: 'em-pe',
      largura: 1000,
      altura: 1500,
    },
    {
      arquivo: 'multidao.webp',
      legenda: 'Abraço no meio da multidão',
      formato: 'deitada',
      largura: 1400,
      altura: 933,
    },
    {
      arquivo: 'selfie.webp',
      legenda: 'Uma foto pra guardar',
      formato: 'deitada',
      largura: 1400,
      altura: 933,
    },
    {
      arquivo: 'abraco.webp',
      legenda: 'Abraço na rua',
      formato: 'deitada',
      largura: 1080,
      altura: 720,
    },
  ],
}

/**
 * O vídeo de apresentação, na seção própria dentro do "Sobre".
 *
 * É o único vídeo do site: entrou no lugar dos dois posts que ficavam aqui
 * ("Nas redes"), a pedido da campanha. O botão do herói aponta pra cá.
 *
 * Nada é pedido ao Instagram antes do clique: o que aparece de saída é a capa
 * servida do próprio domínio, e só depois do play o iframe da rede é criado.
 */
export const apresentacao = {
  id: 'apresentacao',
  rotulo: 'Apresentação',
  titulo: 'Esse Fábio Trad sou eu',
  chamada: 'Um minuto pra você saber quem é o candidato, na voz dele mesmo.',
  acao: 'Assistir agora',
  rede: 'Instagram',
  icone: 'instagram',
  legenda:
    'Sou advogado, professor, pai de família e sul-mato-grossense com orgulho! ' +
    'Representei o nosso estado por três mandatos como deputado federal, tendo ' +
    'sido reconhecido como o melhor parlamentar do Brasil em 2020.\n\n' +
    'Pautei a minha vida inteira pela defesa dos direitos das pessoas. Agora, ' +
    'quero continuar essa caminhada no Governo de MS! Com muita coragem para ' +
    'sonhar e determinação para fazer acontecer! Vamos juntos, meu MS querido.',
  capa: 'video-apresentacao.jpg',
  largura: 640,
  altura: 1137,
  url: 'https://www.instagram.com/p/DcGTfCgvAXz/',
  incorporar: 'https://www.instagram.com/p/DcGTfCgvAXz/embed/',
  proporcao: 0.56,
}

export const gilda = {
  rotulo: 'A vice',
  nome: 'Dona Gilda',
  papel: 'Fundadora do PT em Mato Grosso do Sul',
  texto:
    'Dona Gilda ajudou a erguer o Partido dos Trabalhadores em Mato Grosso do Sul ' +
    'e caminha com o Fábio na chapa como vice-governadora.',
}

export const apoios = {
  titulo: 'Quem caminha junto',
  texto:
    'Lideranças, apoiadores e militância de todas as regiões do estado — ' +
    'da capital à fronteira.',
}

export const propostas = {
  rotulo: 'Propostas',
  titulo: 'Nossas propostas',
  chamada: 'Os 13 eixos que vão construir um MS mais justo',
  // O documento oficial da campanha, o mesmo registrado na Justiça Eleitoral
  // (ver README, item 9). Não é gerado a partir dos eixos abaixo: os eixos são
  // o resumo que a campanha manda para o carrossel, o PDF é a peça completa.
  planoPdf: '/assets/plano-de-governo-fabio-trad.pdf',
  planoPdfRotulo: 'Baixe o plano de governo inteiro',
  // Os 13 eixos, na redação e na ordem que a campanha mandou em
  // "CARROSSEL PROPOSTAS FABIO". Ordem é decisão deles, não nossa.
  eixos: [
    {
      eixo: 'Saúde sem fila e perto de casa',
      texto:
        'Ampliar o acesso regionalizado a consultas e exames, zerar a fila de ' +
        'cirurgias e assumir a gestão pública dos hospitais regionais.',
    },
    {
      eixo: 'Segurança que protege sua família',
      texto:
        'Recompor o efetivo das forças de segurança, convocar policiais já ' +
        'aprovados e treinados e integrar as forças no combate aos crimes de ' +
        'fronteira.',
    },
    {
      eixo: 'Mulher protegida',
      texto:
        'Ampliar as delegacias de atendimento à mulher para todas as regiões, ' +
        'com funcionamento 24 horas, e criar o Batalhão de Choque Maria da Penha.',
    },
    {
      eixo: 'Educação de verdade',
      texto:
        'Ampliar o ensino em tempo integral, equiparar a remuneração de ' +
        'professores concursados e contratados e aproximar a formação ' +
        'profissional das demandas regionais.',
    },
    {
      eixo: 'Infraestrutura e logística',
      texto:
        'Buscar a duplicação das BRs 163 e 262, fortalecer o Corredor ' +
        'Bioceânico, reativar ferrovias e utilizar recursos do FUNDERSUL na ' +
        'recuperação de estradas, pontes e vias municipais.',
    },
    {
      eixo: 'Gestão responsável e menos imposto para quem precisa',
      texto:
        'Reduzir a tributação sobre a cesta básica e o diesel e adotar uma ' +
        'gestão baseada em eficiência, transparência e participação popular.',
    },
    {
      eixo: 'Assistência social',
      texto:
        'Ampliar as políticas de assistência social e a parceria com programas ' +
        'do governo federal.',
    },
    {
      eixo: 'Mais e melhores empregos',
      texto:
        'Qualificar trabalhadores para as novas indústrias e conectar ' +
        'profissionais às oportunidades por meio do programa Conecta MS.',
    },
    {
      eixo: 'Agricultura familiar',
      texto:
        'Ampliar crédito, assistência técnica, agroindústria e comercialização, ' +
        'além de melhorar infraestrutura, transporte escolar e educação no campo.',
    },
    {
      eixo: 'Habitação',
      texto:
        'Ampliar a moradia popular em parceria com o governo federal, com ' +
        'crédito, aquisição de terrenos e incentivos tributários, priorizando ' +
        'áreas próximas a serviços públicos.',
    },
    {
      eixo: 'Cultura',
      texto:
        'Destinar 1,5% do orçamento à cultura, conforme a meta do Sistema ' +
        'Nacional de Cultura, e criar uma rede estadual de equipamentos culturais.',
    },
    {
      eixo: 'Esporte para todos',
      texto:
        'Implementar o Sistema Estadual do Esporte e incentivar sua criação nos ' +
        'municípios, ampliando o acesso ao esporte e à promoção da saúde.',
    },
    {
      eixo: 'Meio ambiente',
      texto:
        'Reforçar a fiscalização dos três biomas, utilizar tecnologia para ' +
        'monitorar o desmatamento e prevenir queimadas e respeitar os ' +
        'conhecimentos e práticas de comunidades ribeirinhas, indígenas e ' +
        'quilombolas.',
    },
  ],
  compromisso: {
    titulo: 'Meus compromissos com você',
    texto:
      'Governar de cabeça erguida, com coragem pra encarar o que estava errado e ' +
      'vontade de fazer diferente, ao lado do povo e no time do Lula em Mato Grosso do Sul.',
  },
}

/**
 * A seção onde o eleitor leva alguma coisa embora, logo abaixo das propostas.
 *
 * São duas peças com a mesma função — pôr a cara do eleitor junto da campanha —
 * então dividem uma seção só, em abas: a moldura de perfil (hospedada fora) e o cartaz (desenhado aqui, no canvas do próprio navegador).
 * A troca é no clique; nada gira sozinho.
 */
export const molduras = {
  id: 'molduras',
  rotulo: 'Apoie',
  titulo: 'Personalize sua foto e faça seu cartaz',
  chamada: 'Duas formas de levar a campanha pro seu perfil. Escolha por onde começar.',
  abas: [
    { id: 'foto', rotulo: 'Personalize sua foto' },
    { id: 'cartaz', rotulo: 'Faça o seu cartaz' },
  ],
  foto: {
    texto: 'Escolha uma moldura, suba a sua foto e leve pro seu perfil.',
    vazio: 'Sua foto aqui',
    acao: 'Usar esta moldura',
    nota:
      'As molduras ficam no Apoio.top: é pra lá que a sua foto vai quando você ' +
      'escolhe uma. Neste site nada é enviado nem guardado.',
    itens: [
      { nome: 'Fábio Trad Emoji', arquivo: 'moldura-emoji.png', url: 'https://apoio.top/q/fabioegilda13' },
      { nome: 'Somos Fábio Trad 13', arquivo: 'moldura-pt13.png', url: 'https://apoio.top/q/coragemprasonhar' },
      {
        nome: 'Sou fechado com Fábio Trad',
        arquivo: 'moldura-fechado.png',
        url: 'https://apoio.top/q/fabiotrad13',
      },
    ],
  },
  cartaz: {
    texto:
      'Escolha a bandeira que te move, escreva seu nome e leve o cartaz pro seu ' +
      'story, pro seu perfil, pra onde você quiser.',
    bandeiras: ['Saúde', 'Educação', 'Segurança', 'Emprego', 'Infraestrutura', 'Direitos'],
  },
}

/**
 * O jingle da campanha, na seção logo abaixo das molduras.
 *
 * O arquivo é servido do próprio domínio — nada de YouTube nem de player de
 * terceiro. Fica com `preload="none"` e um pôster por cima: quem só passa
 * rolando não baixa os 12 MB do vídeo; só quem aperta o play é que puxa.
 *
 * O original tem 160 MB em 4K, acima do que o GitHub aceita por arquivo.
 * O que está aqui é a versão de web (1280x640, ~1,1 Mbps); o master fica de
 * fora do repositório pelo `.gitignore`.
 */
export const jingle = {
  id: 'jingle',
  rotulo: 'Jingle',
  titulo: 'Veja o nosso jingle',
  chamada: 'A música da campanha, com a nossa gente.',
  acao: 'Tocar o jingle',
  arquivo: 'jingle.mp4',
  capa: 'jingle-capa.jpg',
  largura: 1280,
  altura: 640,
}

/**
 * As matérias sobre o candidato, na seção logo depois das Conquistas.
 *
 * **Esta lista não se escreve mais à mão.** Ela vem de `materias.json`, que o
 * `scripts/materias.mjs` gera buscando no Sanity antes de cada build. Quem
 * publica é a campanha, pelo painel; o site só lê o resultado já assado no
 * bundle e **nunca fala com o Sanity em tempo de execução**.
 *
 * Mexer no JSON à mão não adianta: o próximo build sobrescreve. Para trocar o
 * conteúdo, é no painel.
 */
export const materias = {
  id: 'materias',
  rotulo: 'Na imprensa',
  titulo: 'Últimas notícias',
  // sem chamada: o título já basta, e o Cabecalho não desenha a linha quando
  // ela não vem
  emBreve: 'Em breve',
  acao: 'Ler a matéria',
  itens: itensDeMaterias,
}

export const conquistas = {
  rotulo: 'Conquistas',
  titulo: 'O que já está feito',
  chamada: 'Realizações registradas em lei, em placar de votação e em prêmio recebido.',
  realizacoes: [
    'Presidiu a Comissão do Novo Código de Processo Civil, que virou lei e modernizou ' +
      'a Justiça brasileira.',
    'Ajudou a criar a lei que transformou o feminicídio em crime independente, com penas ' +
      'mais duras e mais proteção às mulheres.',
    'Relator da PEC da Prisão em 2ª Instância e presidente da Frente Parlamentar em ' +
      'Defesa da Advocacia.',
    'Manteve presença próxima de 100% nas votações e figurou entre os deputados mais ' +
      'econômicos da bancada de MS.',
  ],
  numeros: {
    titulo: 'Excelência na vida política',
    itens: [
      { valor: '1º', o_que: 'Melhor deputado federal do Brasil em 2020 (júri Congresso em Foco)' },
      { valor: '3', o_que: 'mandatos como deputado federal (2011–2023)' },
      { valor: '6 anos', o_que: 'entre as “100 Cabeças do Congresso” (DIAP)' },
      { valor: '32', o_que: 'comissões e grupos de trabalho na Câmara' },
      { valor: '~100%', o_que: 'de presença nas votações do Plenário' },
      { valor: '1', o_que: 'das leis que ajudou a criar contra o feminicídio no país' },
    ],
  },
  reconhecimentos: {
    titulo: 'Reconhecimentos',
    itens: [
      {
        de: 'Prêmio Congresso em Foco',
        o_que:
          'Melhor deputado federal do Brasil em 2020 pelo júri especializado; ' +
          'premiado em cinco edições.',
      },
      {
        de: 'DIAP',
        o_que: 'Entre os 100 parlamentares mais influentes do país por seis anos seguidos.',
      },
      {
        de: 'OAB',
        o_que:
          'Medalha Raymundo Faoro (2021), pela OAB nacional, pelos serviços prestados ' +
          'à advocacia.',
      },
      {
        de: 'Índice Legisla Brasil (2022)',
        o_que: 'Deputado federal mais bem avaliado de MS em produtividade e fiscalização.',
      },
    ],
  },
}

// O que morava aqui saiu por decisão da campanha, um de cada vez: o formulário
// de recado, depois o bloco de voluntário. O cartaz mudou de casa e agora
// divide a seção `molduras` com a moldura de perfil, em abas. Sobraram o
// convite e as redes.
export const participe = {
  rotulo: 'Participe',
  titulo: 'Vamos juntos',
  chamada: 'Vem com a gente nessa caminhada.',
}

export const rodape = {
  cnpj: '68.456.244/0001-17',
  // O texto oficial da campanha, na íntegra e sem quebra: é a identificação
  // legal da propaganda, e traz também o aviso de uso de IA.
  legal:
    'PROPAGANDA ELEITORAL - Coligação POR UM MS DO POVO (Federação Brasil da ' +
    'Esperança: PT, PV, PCdoB), PSB, PDT | CNPJ: 68.456.244/0001-17 | ' +
    'Contém recursos de Inteligência Artificial.',
  // Continua junto: é exigência da própria Lei nº 9.504/97, não substituída
  // pelo texto acima.
  aviso:
    'Propaganda eleitoral gratuita, na forma da Lei nº 9.504/97. ' +
    'É proibida a veiculação de propaganda que deprecie a condição de mulher ' +
    'ou estimule sua discriminação.',
  assinatura: 'Coragem pra sonhar. Fábio Trad 13 · Governador · Mato Grosso do Sul',
}
