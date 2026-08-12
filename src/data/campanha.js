/**
 * Todo o texto aprovado da página, num arquivo só.
 *
 * Origem: IDV/Estrutura_Landing_Page_Fabio_Trad.docx. Os textos são os do
 * documento, sem reescrita. O que ainda precisa vir da campanha está marcado
 * com A_CONFIRMAR e listado no README.
 */

export const A_CONFIRMAR = 'a confirmar com a campanha'

export const candidato = {
  nome: 'Fábio Trad',
  cargo: 'Governador',
  vice: 'Dona Gilda',
  numero: '13',
  estado: 'Mato Grosso do Sul',
  ano: '2026',
  slogan: 'Coragem pra sonhar.',
  federacao: 'Federação Brasil da Esperança (PT · PCdoB · PV)',
}

export const contato = {
  // Formato internacional, só dígitos. Trocar pelo número oficial da campanha.
  whatsapp: '5567000000000',
  whatsappRecado: 'Olá! Vim pelo site e quero falar com o Fábio Trad.',
  email: `contato@fabiotrad13.com.br (${A_CONFIRMAR})`,
}

// Instagram, TikTok e YouTube conferidos no oEmbed/perfil das próprias redes.
// O Facebook é o único que segue por confirmar.
export const redes = [
  { nome: 'Instagram', url: 'https://www.instagram.com/fabiotrad', icone: 'instagram' },
  { nome: 'Facebook', url: 'https://www.facebook.com/fabiotrad', icone: 'facebook' },
  { nome: 'YouTube', url: 'https://www.youtube.com/@fabiortrad', icone: 'youtube' },
  { nome: 'TikTok', url: 'https://www.tiktok.com/@fabio.trad', icone: 'tiktok' },
]

export const secoes = [
  { id: 'inicio', rotulo: 'Início' },
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'propostas', rotulo: 'Propostas' },
  { id: 'conquistas', rotulo: 'Conquistas' },
  { id: 'participe', rotulo: 'Participe' },
]

export const hero = {
  chamada: ['Coragem', 'pra sonhar'],
  // do "Quem sou eu": é a voz dele, por isso vai na serifada
  apoio: 'Aprendi coragem dentro de casa.',
  numero: 'na urna, para governador',
  acoes: [
    { texto: 'Fale comigo no WhatsApp', tipo: 'whatsapp' },
    { texto: 'Conheça as propostas', tipo: 'ancora', destino: 'propostas' },
  ],
}

export const sobre = {
  rotulo: 'Sobre',
  titulo: 'Quem sou eu',
  depoimento: [
    'Sou Fábio Trad, advogado, professor de Direito e ex-presidente da OAB de ' +
      'Mato Grosso do Sul. Fui deputado federal por três mandatos, sempre com a ' +
      'mesma régua: defender as pessoas, cumprir a lei e não baixar a cabeça pra pressão.',
    'Aprendi coragem dentro de casa. Meu pai foi preso pela ditadura e não se calou. ' +
      'É essa coragem que me trouxe até aqui, e é ela que ofereço a Mato Grosso do Sul: ' +
      'coragem pra sonhar e pra fazer diferente pela nossa gente.',
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
        'Deputado federal, o mais votado ou entre os mais votados do estado, ' +
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
        'Foi coautor da lei que tornou o feminicídio crime autônomo no Brasil ' +
        '(Lei 13.104/2015).',
    },
    {
      quando: '2026',
      o_que:
        'Filiado ao PT e candidato a governador pela Federação Brasil da Esperança, ' +
        'ao lado da vice Dona Gilda.',
    },
  ],
}

// `formato` decide o lugar de cada foto no mosaico: 'deitada' ocupa duas
// colunas, 'em-pe' ocupa uma. A ordem alterna as duas para a grade fechar
// sem buraco.
export const galeria = {
  titulo: 'Na rua, com a nossa gente',
  fotos: [
    {
      arquivo: 'comicio.webp',
      legenda: 'Plenária de campanha, com a militância',
      formato: 'deitada',
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
      arquivo: 'chapeu.webp',
      legenda: 'Abraço de chapéu',
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
      arquivo: 'festa.webp',
      legenda: 'Abraço na festa',
      formato: 'em-pe',
      largura: 1000,
      altura: 1500,
    },
    {
      arquivo: 'escuta.webp',
      legenda: 'Sentado, escutando',
      formato: 'em-pe',
      largura: 1000,
      altura: 1500,
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

export const videos = {
  titulo: 'Nas redes',
  chamada: 'O que a campanha publicou e mais gente assistiu. Toque para ver aqui mesmo.',
  posts: [
    {
      rede: 'Instagram',
      icone: 'instagram',
      titulo: 'Antes de tudo, apaixonado por Mato Grosso do Sul',
      legenda:
        'Marido, pai, advogado, ex-deputado e, agora, pré-candidato a governador. ' +
        'Sim, eu sou tudo isso, mas, antes de tudo, sou um apaixonado por Mato Grosso ' +
        'do Sul. E me dói ver como o nosso estado está abandonado e sucateado.\n\n' +
        'Por isso, te convido a caminhar comigo para construir um MS do povo e para ' +
        'o povo! Bora nessa jornada?',
      capa: 'video-instagram.webp',
      largura: 480,
      altura: 853,
      url: 'https://www.instagram.com/reel/DY42Lt8hSif/',
      incorporar: 'https://www.instagram.com/reel/DY42Lt8hSif/embed/',
      proporcao: 0.56,
    },
    {
      rede: 'TikTok',
      icone: 'tiktok',
      titulo: 'Do lado certo da história: o lado das pessoas',
      legenda:
        'É uma honra poder lutar com quem está do lado certo da história: o lado ' +
        'das pessoas! Vamos juntos transformar o governo do nosso estado com a ' +
        'coragem que o Mato Grosso do Sul precisa.',
      capa: 'video-tiktok.webp',
      largura: 720,
      altura: 1280,
      url: 'https://www.tiktok.com/@fabio.trad/video/7668661972568657159',
      incorporar: 'https://www.tiktok.com/embed/v2/7668661972568657159',
      proporcao: 0.56,
    },
  ],
  canal: {
    rede: 'YouTube',
    icone: 'youtube',
    titulo: 'O canal no YouTube',
    texto: 'É onde ficam as entrevistas e os vídeos longos, do começo ao fim.',
    acao: 'Abrir o canal',
    url: 'https://www.youtube.com/@fabiortrad',
  },
}

export const gilda = {
  rotulo: 'A vice',
  nome: 'Dona Gilda',
  papel: 'Fundadora histórica do PT em Mato Grosso do Sul',
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
  titulo: 'Bandeiras de campanha',
  chamada: 'Do Programa de Governo 2026, em seis frentes.',
  eixos: [
    {
      eixo: 'Saúde',
      texto:
        'Acabar com a fila e a espera. Mais médicos, mais remédio e atendimento perto ' +
        'de quem mora no interior, pra ninguém precisar viajar até a capital pra ser cuidado.',
    },
    {
      eixo: 'Educação',
      texto:
        'Escola em tempo integral, professor valorizado e escola reformada e climatizada. ' +
        'Fortalecer a UEMS pra segurar o jovem no estado.',
    },
    {
      eixo: 'Segurança',
      texto:
        'Presença firme do Estado na fronteira — Ponta Porã, Corumbá, Porto Murtinho — ' +
        'contra o tráfico. Polícia valorizada e combate ao feminicídio como prioridade.',
    },
    {
      eixo: 'Emprego e renda',
      texto:
        'Trabalho que paga o suficiente pra família viver com dignidade, pra ninguém ' +
        'ter que sair de Mato Grosso do Sul atrás de oportunidade.',
    },
    {
      eixo: 'Infraestrutura',
      texto:
        'Estrada sem buraco e transporte público que funciona, na capital e no interior. ' +
        'Planejamento que leva desenvolvimento pra todas as regiões.',
    },
    {
      eixo: 'Direitos e cuidado com a gente',
      texto:
        'Combate à fome, apoio às famílias, direitos das mulheres e proteção de quem ' +
        'mais precisa. Um estado que cuida bem da sua terra — e também da sua gente.',
    },
  ],
  compromisso: {
    titulo: 'Meus compromissos com você',
    texto:
      'Governar de cabeça erguida, com coragem pra encarar o que estava errado e ' +
      'vontade de fazer diferente, ao lado do povo e no time do Lula em Mato Grosso do Sul.',
  },
}

export const conquistas = {
  rotulo: 'Conquistas',
  titulo: 'O que já está feito',
  chamada: 'Realizações registradas em lei, em placar de votação e em prêmio recebido.',
  realizacoes: [
    'Presidiu a Comissão do Novo Código de Processo Civil, que virou lei e modernizou ' +
      'a Justiça brasileira.',
    'Foi coautor da lei que tornou o feminicídio crime autônomo no país, com penas mais ' +
      'duras e mais proteção às mulheres.',
    'Relator da PEC da Prisão em 2ª Instância e presidente da Frente Parlamentar em ' +
      'Defesa da Advocacia.',
    'Manteve presença próxima de 100% nas votações e figurou entre os deputados mais ' +
      'econômicos da bancada de MS.',
  ],
  numeros: {
    titulo: 'Números que falam por si',
    itens: [
      { valor: '1º', o_que: 'Melhor deputado federal do Brasil em 2020 (júri Congresso em Foco)' },
      { valor: '3', o_que: 'mandatos como deputado federal (2011–2023)' },
      { valor: '6 anos', o_que: 'entre as “100 Cabeças do Congresso” (DIAP)' },
      { valor: '32', o_que: 'comissões e grupos de trabalho na Câmara' },
      { valor: '~100%', o_que: 'de presença nas votações do Plenário' },
      { valor: '1', o_que: 'das leis que ajudou a criar contra o feminicídio no Brasil' },
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

export const participe = {
  rotulo: 'Participe',
  titulo: 'Vamos juntos',
  chamada: 'Some com a gente nessa caminhada.',
  formulario: {
    titulo: 'Fale direto comigo',
    texto: 'Escreva seu recado. A equipe lê e responde.',
    envio: 'Enviar recado',
  },
  voluntario: {
    titulo: 'Seja voluntário',
    texto: 'Vamos juntos. Some com a gente nessa caminhada.',
    acao: 'Quero ser voluntário',
  },
  cartaz: {
    titulo: 'Faça o seu cartaz',
    texto:
      'Escolha a bandeira que te move, escreva seu nome e leve o cartaz pro seu ' +
      'WhatsApp, pro seu story, pro seu perfil.',
    bandeiras: [
      'Saúde',
      'Educação',
      'Segurança',
      'Emprego',
      'Infraestrutura',
      'Direitos',
    ],
  },
}

export const rodape = {
  // Preencher com os dados oficiais antes de publicar.
  cnpj: `00.000.000/0001-00 (${A_CONFIRMAR})`,
  aviso:
    'Propaganda eleitoral gratuita, na forma da Lei nº 9.504/97. ' +
    'É proibida a veiculação de propaganda que deprecie a condição de mulher ' +
    'ou estimule sua discriminação.',
  assinatura: 'Coragem pra sonhar. · Fábio Trad 13 · Governador · Mato Grosso do Sul',
}
