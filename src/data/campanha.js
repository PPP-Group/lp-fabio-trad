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
  coligacao: 'Coligação Por um MS do Povo',
  federacao: 'Coligação Por um MS do Povo · Federação Brasil da Esperança (PT · PV · PCdoB) · PSB · PDT',
}

export const contato = {
  // O canal de contato do site é o e-mail. O formulário do Participe monta a
  // mensagem e abre o programa de e-mail do próprio leitor — não há servidor
  // no meio, nada fica guardado aqui; quem recebe é a caixa da campanha.
  email: `contato@fabiotrad13.com.br (${A_CONFIRMAR})`,
}

/**
 * Só o endereço, sem a marca de A_CONFIRMAR que o texto acima carrega.
 * O `mailto:` não aceita os parênteses, então quem monta o link passa por aqui.
 */
export function enderecoEmail() {
  return contato.email.replace(/\s*\(.*\)\s*$/, '').trim()
}

/** Abre o programa de e-mail do leitor com o recado já escrito. */
export function linkEmail(assunto, corpo) {
  return `mailto:${enderecoEmail()}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`
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
  acoes: [
    { texto: 'Conheça as propostas', tipo: 'ancora', destino: 'propostas' },
  ],
  // O vídeo de apresentação. Fica no herói, mas nada é pedido ao Instagram
  // antes do clique: o cartão mostra a capa servida daqui e só o modal abre
  // o iframe da rede.
  video: {
    rede: 'Instagram',
    icone: 'instagram',
    acao: 'Assista à apresentação',
    titulo: 'Esse Fábio Trad sou eu!',
    legenda:
      'Sou advogado, professor, pai de família e sul-mato-grossense com orgulho! ' +
      'Representei o nosso estado por três mandatos como deputado federal, tendo ' +
      'sido reconhecido como o melhor parlamentar do Brasil.\n\n' +
      'Pautei a minha vida inteira pela defesa dos direitos das pessoas. Agora, ' +
      'quero continuar esta caminhada no Governo de MS! Com muita coragem para ' +
      'sonhar e determinação para fazer acontecer! Vamos juntos, meu MS querido.',
    capa: 'video-apresentacao.jpg',
    largura: 640,
    altura: 1137,
    url: 'https://www.instagram.com/p/DcGTfCgvAXz/',
    incorporar: 'https://www.instagram.com/p/DcGTfCgvAXz/embed/',
    proporcao: 0.56,
  },
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
        'Ajudou a criar a lei que transformou o feminicídio em crime independente ' +
        '(Lei 13.104/2015).',
    },
    {
      quando: '2026',
      o_que:
        'Filiado ao PT e candidato a governador pela coligação Por um MS do Povo, ' +
        'ao lado da vice, Dona Gilda.',
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
  // O cartão do canal do YouTube saiu junto com o YouTube das redes, a pedido
  // da campanha. Se voltar, o componente Redes.jsx precisa do bloco `canal`.
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
  titulo: 'Nossas propostas',
  chamada: 'Os 13 eixos do Programa de Governo 2026.',
  // Gerado a partir dos 13 eixos abaixo (ver README, item 8). Se a campanha
  // mandar uma versão própria em PDF, é só trocar o arquivo em
  // public/assets/ mantendo esse mesmo nome — ou apontar pra outro caminho.
  planoPdf: '/assets/plano-de-governo-fabio-trad.pdf',
  planoPdfRotulo: 'Baixe o plano de governo inteiro',
  eixos: [
    {
      eixo: 'Gestão Participativa',
      texto:
        'Governar com transparência total, acabando com o isolamento do interior e ' +
        'trazendo o cidadão para o centro das decisões do Estado.',
    },
    {
      eixo: 'Crescimento Sustentável',
      texto:
        'Diversificar a economia e aproveitar a Rota Bioceânica para levar indústrias, ' +
        'inovação e riqueza para todas as regiões de MS.',
    },
    {
      eixo: 'Incentivo Justo',
      texto:
        'Acabar com privilégios fiscais sem retorno e exigir que empresas beneficiadas ' +
        'gerem empregos formais e salários melhores.',
    },
    {
      eixo: 'Saúde Regionalizada',
      texto:
        "Acabar com as viagens de madrugada e 'carretas da saúde', assumindo a gestão " +
        'pública dos hospitais e levando atendimento especialista ao interior.',
    },
    {
      eixo: 'Segurança Protegida',
      texto:
        'Combatendo o crime com inteligência e tecnologia na fronteira, reforçando a ' +
        'patrulha nas escolas e tolerância zero ao feminicídio.',
    },
    {
      eixo: 'Trabalho Digno',
      texto:
        'Gerar empregos de qualidade com apoio aos pequenos negócios, programa Primeiro ' +
        'Emprego para jovens e apoio às mulheres empreendedoras.',
    },
    {
      eixo: 'Educação Valorizada',
      texto:
        'Fim da injustiça salarial entre professores contratados e concursados, ' +
        'conectando nossas escolas ao futuro da ciência e da tecnologia.',
    },
    {
      eixo: 'Infraestrutura Planejada',
      texto:
        'Duplicar rodovias estratégicas, recuperar pontes e estradas rurais e integrar ' +
        'ferrovias sem endividar o futuro do Estado.',
    },
    {
      eixo: 'Cultura Viva',
      texto:
        'Democratizar os recursos da cultura e do esporte no interior e nas periferias, ' +
        'resgatando as grandes Temporadas Populares para as famílias.',
    },
    {
      eixo: 'Estado Cuidador',
      texto:
        'Proteger os mais vulneráveis com restaurantes populares, combate firme à fome, ' +
        'à intolerância e garantia de direitos para todos.',
    },
    {
      eixo: 'Campo Forte',
      texto:
        'Fortalecer a agricultura familiar e os assentamentos com assistência técnica, ' +
        'crédito, estradas para escoamento e incentivo às agroindústrias.',
    },
    {
      eixo: 'Ambiente Protegido',
      texto:
        'Proteger o Pantanal e a Serra da Bodoquena contra queimadas e degradação, ' +
        'tornando o Estado referência em economia verde e bioinsumos.',
    },
    {
      eixo: 'Turismo Sustentável',
      texto:
        'Estruturar novos polos turísticos no interior, capacitar profissionais locais ' +
        'e promover nossas belezas naturais para o Brasil e o mundo.',
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
 * As molduras de perfil, na seção logo abaixo das propostas.
 *
 * O arquivo de cada uma é a moldura de verdade, baixada do Twibbonize: PNG de
 * fundo transparente, com o miolo vazado onde entra a foto de quem usa. Por
 * isso o preview mostra a moldura por cima de um fundo neutro — é exatamente
 * o que o eleitor vê, com o buraco esperando a foto dele.
 *
 * Quem recebe a foto e devolve o resultado é o Twibbonize. Aqui nada é
 * processado, e nenhum pedido sai do site antes do clique.
 */
export const molduras = {
  rotulo: 'Apoie',
  titulo: 'Personalize sua foto',
  chamada: 'Escolha uma moldura, suba a sua foto e leve pro seu perfil.',
  vazio: 'Sua foto aqui',
  acao: 'Usar esta moldura',
  nota:
    'As molduras ficam no Twibbonize: é pra lá que a sua foto vai quando você ' +
    'escolhe uma. Neste site nada é enviado nem guardado.',
  itens: [
    { nome: 'Fábio Trad Emoji', arquivo: 'moldura-emoji.png', url: 'https://twb.nz/fabiotrademoji' },
    { nome: 'Somos Fábio Trad 13', arquivo: 'moldura-pt13.png', url: 'https://twb.nz/fabiotradpt13' },
    {
      nome: 'Sou fechado com Fábio Trad',
      arquivo: 'moldura-fechado.png',
      url: 'https://twb.nz/fechadocomfabiotrad',
    },
  ],
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
    titulo: 'Números que falam por si',
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

export const participe = {
  rotulo: 'Participe',
  titulo: 'Vamos juntos',
  chamada: 'Some com a gente nessa caminhada.',
  formulario: {
    titulo: 'Fale direto comigo',
    texto: 'Escreva seu recado. A equipe lê e responde.',
    envio: 'Enviar recado',
    nota: 'Abre o seu programa de e-mail com o recado já escrito. Você confere antes de mandar.',
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
      'story, pro seu perfil, pra onde você quiser.',
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
  assinatura: 'Coragem pra sonhar. · Fábio Trad 13 · Governador · Mato Grosso do Sul',
}
