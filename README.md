# Fábio Trad 13 — landing page

Página única de campanha para o governo de Mato Grosso do Sul, 2026.
Navegação por âncoras: Início · Sobre · Propostas · Jogo · Conquistas · Participe.

```bash
npm install
npm run dev      # http://localhost:5179
npm run build    # gera dist/
npm run preview  # serve dist/ em http://localhost:4179
```

> **Material sigiloso.** O pacote em `IDV/` é da campanha e não foi enviado a
> nenhum serviço externo. Ele está no `.gitignore` e no `.dockerignore`: não vai
> para o repositório nem para a imagem de deploy. Nada aqui usa CDN, fonte
> remota, analytics ou API de terceiros — as fontes são servidas do próprio
> domínio e as imagens saem dos arquivos de arte. Publicar é decisão da
> campanha; o que está versionado é só o site compilável.

---

## De onde veio cada coisa

Nada foi inventado nem redesenhado.

| No site                        | Origem                                                              |
| ------------------------------ | ------------------------------------------------------------------- |
| Todo o texto                   | `IDV/Estrutura_Landing_Page_Fabio_Trad.docx`                        |
| Paleta e degradê               | `Apresentação Final - Campanha Fábio.pdf`, p. 4                     |
| Marcas F13, 13, mapa, estrela  | `08.GCs animados/OBJETOS/Elementos Fábio Trad.ai`                   |
| Recortes de Fábio e Dona Gilda | `06. Base Impressos/01. Fábio-Gilda/Para-Choque 30x10.ai`           |
| Fotos das peças                | camadas de `07. Base PSDs/Peças Vertical.psd`                       |
| Fotos da galeria e o retrato   | `IDV/FOTOS-…/FOTOS/` — o carretel da produção                       |
| Capas dos vídeos               | oEmbed do Instagram e do TikTok, baixadas por `scripts/videos.py`   |
| Regra do nome do vice          | p. 17 do PDF — art. 36, § 4º da Lei nº 9.504/97                     |

`scripts/assets.py` refaz `public/assets/` a partir desses arquivos. Ele abre o
`.ai` como PDF, apaga o retângulo de sangria que cada página desenha por baixo
das marcas e rasteriza o que sobra em alfa limpo; as fotos saem das camadas do
`.psd` e os recortes vêm com a máscara que já estava no vetor.

```bash
python scripts/assets.py
```

### Cores

Em `src/styles/tokens.css`.

| Nome              | Hex       | Onde entra                              |
| ----------------- | --------- | --------------------------------------- |
| Vermelho          | `#f31f29` | a cor dominante, painéis e traço        |
| Vinho             | `#ab144c` | profundidade e começo do degradê        |
| Amarelo           | `#ecc927` | o número, a palavra que fica, os botões |
| Carvão            | `#1d1d1b` | menu, rodapé e as faixas de contraste   |

**Dois desvios, e o motivo de cada um.**

1. O amarelo sobre o vermelho puro dá 2,57:1 — reprova até para texto grande.
   Por isso o degradê dos painéis ganhou uma parada mais funda na ponta
   esquerda (`#8f1040`), que é onde o texto fica. Ali o amarelo passa de 4,8:1 e
   o branco de 7:1. A dupla vinho→vermelho da identidade continua valendo no
   resto da área.
2. Branco sobre `#f31f29` dá 4,17:1, logo abaixo do mínimo de 4,5:1 para texto
   corrido. Onde um botão vermelho carrega texto branco o site usa
   `--vermelho-fundo` (`#d4141d`, 5,36:1). O vermelho puro segue valendo para
   preenchimento, traço e título grande.

### Tipografia

Duas famílias, com papéis separados — e é essa separação que organiza a leitura:

- **Archivo** (variável, peso 100–900 e largura 62–125%) é **o que grita e o que
  rotula**: assinatura, títulos, rótulos, botões, números. Uma família só cobre
  do rótulo condensado ao grito largo, que é exatamente como a identidade
  impressa se comporta.
- **Source Serif 4** é **o que se lê**: todo texto corrido da página. Quando o
  texto é dele em primeira pessoa — a linha do herói, o "Quem sou eu" — a
  serifada aparece maior e, no herói, em itálico.

A regra prática: se está em caixa alta e pesado, é a campanha falando com a
rua; se está em serifada, é para sentar e ler.

As duas são servidas do próprio domínio (`@fontsource-variable`, ~150 KB
somando os subconjuntos latinos).

---

## A ideia

A identidade diz que "os traços aplicados no número representam movimento"
(p. 5). No papel esse movimento está congelado. Na tela ele é **riscado**: a
hachura é desenhada da esquerda para a direita quando entra na tela, e serve de
trilho vertical na linha do tempo. É o `<Traco>` (`src/components/Traco.jsx`), o
elemento que costura a página inteira. O sorteio das linhas é preso a uma
semente, então o mesmo traço sai igual em todo render.

O momento interativo é **o cartaz** (`src/components/participe/Cartaz.jsx`). A
apresentação promete uma identidade capaz de "criar centenas de peças diferentes
mantendo unidade visual" — aqui quem faz a peça é o eleitor: escolhe a bandeira,
escreve o nome e leva um cartaz da campanha pronto para o WhatsApp ou para o
story. É desenhado em canvas no próprio navegador, com as marcas reais; nada
sai do aparelho de quem usou.

O que o site acrescenta ao impresso, e nada além disso: o traço que se escreve,
as faixas de estrelas que andam devagar, e o cartaz que o eleitor leva embora.

---

## Estrutura

```
public/assets/       marcas, recortes e fotos já enxugados para a web
src/
  components/        um diretório por seção
  data/campanha.js   todo o texto aprovado, num arquivo só
  lib/               hooks: revelar, seção ativa
  styles/            tokens, base e uma folha por seção
server.js            servidor de produção: serve dist/ na porta 3000
nixpacks.toml        como o Easypanel compila e sobe o site
Dockerfile           alternativa: compila com o Vite e serve dist/ no nginx
nginx.conf           tipos MIME, cache e o fallback de página única
scripts/
  assets.py          refaz public/assets/ a partir de IDV/
  videos.py          baixa as capas dos vídeos das redes, para servir daqui
  shots.mjs          capturas seção a seção, para revisão
  tudo.mjs           a página inteira numa imagem
  cartaz.mjs         salva o cartaz gerado em tamanho real
  og.mjs             gera a imagem de compartilhamento a partir do herói
  console.mjs        erros de console e sanidade do DOM
  elemento.mjs       captura de um seletor específico
```

Para revisar, com o `npm run dev` no ar:

```bash
node scripts/shots.mjs shots 1440x900
```

---

## Antes de publicar

Tudo o que ainda depende da campanha está marcado com `A_CONFIRMAR` em
`src/data/campanha.js`.

1. **WhatsApp — desligado por enquanto.** O número oficial ainda não chegou, e
   `contato.whatsappAtivo` está em `false`. Nesse estado a página não emite
   nenhum link `wa.me`: o botão do menu, o do herói, o envio do formulário e o
   convite de voluntariado aparecem desativados, com "em breve", e no herói
   quem assume a ação principal é "Conheça as propostas". Para religar, basta
   preencher `contato.whatsapp` e virar a chave para `true` — não há nada a
   mudar nos componentes, que consultam todos a função `linkZap`.
2. **Redes sociais.** Instagram (`fabiotrad`), TikTok (`fabio.trad`) e YouTube
   (`@fabiortrad`) foram conferidos no ar. Falta confirmar só o Facebook.
3. **Depoimentos.** A estrutura pede depoimentos de apoiadores e da militância
   em "Quem caminha junto" (`apoios`). Hoje há só a linha de apresentação — os
   depoimentos entram assim que a campanha aprovar.
4. **Vídeos.** O post mais visto do Instagram e o do TikTok estão incorporados:
   o cartão mostra a capa, e o vídeo só é carregado da rede depois do clique —
   antes disso a página não faz nenhum pedido ao Instagram ou ao TikTok. O
   YouTube entra como cartão do canal, porque ainda não há vídeo da campanha
   lá. Quando houver, e quando outro post passar esses em visualizações, troque
   `videos.posts` em `src/data/campanha.js` e rode `python scripts/videos.py`
   para baixar a capa nova.
5. **Fotos.** A galeria tem oito fotos do carretel da produção, mais o retrato
   do "Quem sou eu". Os arquivos e as legendas estão em `galeria`
   (`src/data/campanha.js`); a lista de origem, em `CARRETEL_GALERIA`
   (`scripts/assets.py`).
6. **Formulário.** "Fale direto comigo" e "Seja voluntário" abrem o WhatsApp com
   a mensagem já escrita, sem servidor no meio — quando o número estiver ligado
   (ver o item 1). Se a campanha quiser os contatos num CRM, o ponto de troca é
   a função `abrirZap` em `src/components/participe/Participe.jsx`.
7. **Domínio e og:image.** As URLs absolutas de `index.html` (canonical, og:url,
   og:image), o `public/robots.txt` e o `public/sitemap.xml` apontam para
   `https://fabiotrad13.com.br/`. Se o domínio final for outro, troque nos três.
   A imagem `/assets/og.jpg` é uma captura do próprio herói — `node scripts/og.mjs`
   refaz.

---

## Deploy (Easypanel / VPS Hostinger)

O Vite compila para `dist/` e o `server.js` (Node puro, sem dependências
externas) serve os arquivos em produção. Nada de banco ou variável de ambiente.

**No Easypanel use Nixpacks** (o padrão) com porta **3000**.

| Campo no Easypanel | Valor               |
| ------------------ | ------------------- |
| Build              | Nixpacks (padrão)   |
| Porta do container | `3000`              |
| Domínio            | `fabiotrad13.com.br` (HTTPS/Let's Encrypt ligado) |

O `nixpacks.toml` na raiz já configura tudo automaticamente:
- `NIXPACKS_SPA_CADDY = 'false'` — desliga o Caddy interno do Nixpacks
- `npm run build` na fase de build
- `node server.js` no start

### Por que a tela branca acontecia (e o que foi corrigido)

**Causa 1 — Caddy sem saber onde estava o `dist/`**

O Nixpacks, sem o `nixpacks.toml`, ativava o Caddy interno como servidor.
O Caddy lia a variável `$NIXPACKS_SPA_OUTPUT_DIR`, que o Easypanel não passa
para o runtime do container. Sem ela, o Caddy servia a raiz do código-fonte
(`/app`) em vez de `dist/`. O navegador recebia o `index.html` de
desenvolvimento (que aponta para `/src/main.jsx`) e rejeitava com erro de MIME.

**Causa 2 — `puppeteer-core` inflando o build com Chromium**

O Nixpacks detecta o nome `puppeteer` nas devDependencies e baixa Chromium
completo + centenas de MB de libs gráficas (GTK, X11, ALSA). O `puppeteer-core`
era usado só em scripts locais de captura de tela e foi removido do
`package.json`. Build passou de vários minutos para ~15 segundos.

**Causa 3 — Porta 80 exige root**

Portas abaixo de 1024 são privilegiadas no Linux. O container Nixpacks roda
sem root e qualquer tentativa de escutar na porta 80 resulta em
`EACCES: permission denied`. O `server.js` escuta na porta **3000**
(ou em `process.env.PORT` se o Easypanel injetar outra).

### Depois de cada deploy

- `https://fabiotrad13.com.br/healthz` tem que responder `ok`.
- No console do navegador, nenhum erro; na aba Network, o `index-*.js` com
  `Content-Type: application/javascript`.
- Se a tela ainda vier branca, olhe o log do Easypanel: a linha
  `Aplicação rodando na porta 3000` tem que aparecer no final.

---

## Acessibilidade

O eleitorado vai dos 16 aos 90, e a página foi feita para os dois extremos.

- Texto corrido a partir de 17 px, entrelinha 1,55 e medida de 46 a 52
  caracteres. Abaixo disso só as notas de rodapé e o aviso legal.
- Todo par de cor usado em texto passa no AA da WCAG 2.1 (ver os dois desvios
  documentados acima).
- Foco visível em amarelo, com deslocamento, em tudo que recebe teclado.
- `prefers-reduced-motion` desliga as faixas que andam, o traço que se escreve
  e as entradas de rolagem — o conteúdo aparece inteiro, parado.
- A lupa da galeria anda por seta e fecha no `Esc`; o menu do celular fecha no
  `Esc`.
- Alvos de toque a partir de 44 px; no celular os botões do herói ocupam a
  largura toda.
