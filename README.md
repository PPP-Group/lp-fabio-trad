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
> remota, analytics ou API de terceiros **em tempo de execução** — as fontes são
> servidas do próprio domínio e as imagens saem dos arquivos de arte. A única
> conversa com serviço externo acontece no build, quando o `scripts/materias.mjs`
> busca as matérias no Sanity e as assa no bundle; a página do eleitor recebe o
> resultado pronto e não pede nada a ninguém. Publicar é decisão da campanha; o
> que está versionado é só o site compilável.

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
| Capa do vídeo                  | oEmbed do Instagram, baixada por `scripts/videos.py`                |
| Jingle e logo do jogo          | arquivos da campanha, recodificados para a web (ver item 9)         |
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

O momento interativo é **o cartaz** (`src/components/molduras/Cartaz.jsx`). A
apresentação promete uma identidade capaz de "criar centenas de peças diferentes
mantendo unidade visual" — aqui quem faz a peça é o eleitor: escolhe a bandeira,
escreve o nome e leva um cartaz da campanha pronto para o story ou para o
perfil. É desenhado em canvas no próprio navegador, com as marcas reais; nada
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
studio/              o painel do Sanity (pacote separado, veja abaixo)
scripts/
  assets.py          refaz public/assets/ a partir de IDV/
  materias.mjs       busca as matérias no Sanity antes de cada build
  videos.py          baixa a capa do vídeo de apresentação, para servir daqui
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

## As matérias vêm de um painel, não do código

As "Últimas notícias" são a única parte da página que a campanha edita sozinha.
Quem publica é o Sanity, num painel próprio; o site continua estático.

**O site nunca fala com o Sanity.** A busca acontece no build, não no navegador
do eleitor:

```
campanha publica no painel
  -> Sanity dispara o webhook
  -> Easypanel recompila
  -> `npm run build` roda `scripts/materias.mjs`, que busca e grava
     `src/data/materias.json`
  -> o Vite assa o JSON dentro do bundle
```

Leva uns dois minutos entre publicar e aparecer. Em troca, a página do eleitor
não faz nenhum pedido a terceiro, o HTML já vem com as matérias dentro, e o
site funciona igual se o Sanity estiver fora do ar.

### O que o script garante

`scripts/materias.mjs` existe para duas coisas, e as duas foram testadas:

1. **O build não quebra por causa do Sanity.** API fora do ar, resposta torta,
   erro inesperado — o script avisa, mantém o `materias.json` anterior e sai
   com sucesso. O site sobe com as matérias de antes em vez de não subir.
2. **O que vem de fora é conferido antes de entrar.** Quem escreve agora é a
   campanha: item sem campo obrigatório é descartado, e endereço que não seja
   `http`/`https` é barrado — um `javascript:` colado sem querer viraria brecha
   de segurança na página.

`src/data/materias.json` é versionado de propósito: é ele que segura o site
quando a busca falha. Editar à mão não adianta, o próximo build sobrescreve.

### O painel

Mora em `studio/`, com `package.json` próprio — as dependências dele não se
misturam com as do site, e o `npm audit` dele não diz nada sobre o site.

```bash
cd studio && npm install
npm run dev      # painel local, http://localhost:3333
npm run deploy   # publica em <nome>.sanity.studio, de graça
```

Para dar acesso a alguém: painel do Sanity -> **Members** -> convidar por
e-mail. Quem entra vê só o formulário das matérias.

### O webhook

No Sanity, em **API -> Webhooks**, apontando para a URL de deploy do Easypanel:

| Campo | Valor |
| ----- | ----- |
| URL | a de deploy do Easypanel |
| Dataset | `production` |
| Trigger on | Create, Update, Delete |
| Filter | `_type == "materia"` |
| HTTP method | `POST` |

O *filter* importa: sem ele, qualquer rascunho salvo dispara um deploy.

---

## Antes de publicar

Tudo o que ainda depende da campanha está marcado com `A_CONFIRMAR` em
`src/data/campanha.js`.

1. **O site não tem mais canal de contato direto.** Os três que existiam saíram
   a pedido da campanha, um de cada vez: o WhatsApp, depois o formulário
   "Fale direto comigo", e por último o bloco "Seja voluntário". Hoje o
   Participe é o convite mais as redes sociais, e é por elas que o eleitor
   fala com a campanha. `contato.email` segue registrado em
   `src/data/campanha.js` (ainda por confirmar) só para não se perder — nada
   na página o exibe. Para devolver um canal, é dali que ele sai.
2. **Redes sociais.** Instagram (`fabiotrad`) e TikTok (`fabio.trad`) foram
   conferidos no ar; falta confirmar o Facebook. O **YouTube saiu** a pedido da
   campanha: basta devolver a linha em `redes` para ele voltar ao rodapé e ao
   Participe (o ícone continua em `Icones.jsx`).
3. **Depoimentos.** A estrutura pede depoimentos de apoiadores e da militância
   em "Quem caminha junto" (`apoios`). Hoje há só a linha de apresentação — os
   depoimentos entram assim que a campanha aprovar.
4. **Vídeos.** Dois, e nenhum deles carrega nada antes do clique no play.
   O de **apresentação** (`apresentacao`) tem seção própria dentro do "Sobre" e
   é o destino do segundo botão do herói; vem do Instagram, e o que a página
   traz de saída é só a capa servida daqui. Para trocá-lo, mude a URL e rode
   `python scripts/videos.py` para baixar a capa nova (o script pede Python e
   Pillow; sem eles, dá para puxar a miniatura pelo mesmo endpoint oEmbed em
   Node). O **jingle** (`jingle`) é arquivo nosso, servido do próprio domínio,
   com `preload="none"` atrás do pôster — ver o item 9.
5. **Fotos.** A galeria tem seis fotos do carretel da produção, mais o retrato
   do "Quem sou eu" — "chapeu" e "escuta" saíram a pedido da campanha. **As
   legendas não aparecem na tela**, mas seguem em `galeria`
   (`src/data/campanha.js`) porque são o texto alternativo das imagens: sem
   elas, quem usa leitor de tela ficaria com fotos mudas, e nada apareceria se
   a imagem não carregasse. A lista de origem está em `CARRETEL_GALERIA`
   (`scripts/assets.py`).

   **A ordem da grade é o que fecha o mosaico sem buraco.** Em quatro colunas
   (duas no celular), `panorama` ocupa a fileira inteira, `deitada` ocupa duas
   colunas e `em-pe` ocupa uma — hoje a conta é 4 + (1+1+2) + (2+2). Tirar ou
   acrescentar foto pede refazer essa soma, senão sobra vão branco no fim.
6. **Molduras e cartaz.** A seção `molduras` junta as duas peças que o eleitor
   leva embora, em abas que trocam no clique: as três molduras de perfil
   (hospedadas no Apoio.top — quem recebe a foto e devolve o resultado é o
   site deles) e o cartaz, desenhado aqui no canvas do navegador. Os dois
   painéis ficam montados o tempo todo, então sair da aba do cartaz e voltar
   não apaga o nome já digitado.
7. **Últimas notícias — quem edita é a campanha, pelo painel.** A lista não
   está mais no código: vem do Sanity, via `scripts/materias.mjs` (ver a seção
   "As matérias vêm de um painel"). Falta ligar duas pontas: publicar o painel
   com `cd studio && npm run deploy`, e criar o webhook no Sanity apontando
   para a URL de deploy do Easypanel. Sem o webhook, publicar não recompila
   nada — as matérias só aparecem no deploy seguinte.
8. **Domínio e og:image.** As URLs absolutas de `index.html` (canonical, og:url,
   og:image), o `public/robots.txt` e o `public/sitemap.xml` apontam para
   `https://fabiotrad13.com.br/`. Se o domínio final for outro, troque nos três.
9. **Plano de governo em PDF.** `public/assets/plano-de-governo-fabio-trad.pdf`
   é o documento oficial da campanha: 85 páginas, o mesmo registrado na Justiça
   Eleitoral. **Pesa 28,7 MB** — tentamos recomprimir e não encolhe nada, são 91
   gradientes e transparências do design, então quem baixar no celular puxa
   isso mesmo. Se algum dia vier uma versão mais leve, é só trocar o arquivo
   mantendo o nome. Para desativar o botão, `propostas.planoPdf = null` — ele
   volta sozinho a mostrar "em breve".
10. **Jingle.** `public/assets/jingle.mp4` é a versão de web do arquivo que a
   campanha entregou: o original tem **160 MB em 4K**, acima do limite de
   100 MB por arquivo do GitHub, então não dá para versioná-lo. O que está no
   repositório é o mesmo vídeo em 1280x640 e ~1,1 Mbps — **12 MB**, com o
   texto legal já queimado na imagem pela própria campanha. O master fica na
   raiz do projeto e é barrado pelo `.gitignore`. Para refazer a conversão:

   ```bash
   npm install --no-save ffmpeg-static
   node -e "console.log(require('ffmpeg-static'))"   # caminho do binário
   ```

   e então `ffmpeg -i <master> -vf scale=1280:640 -c:v libx264 -crf 28 -c:a
   aac -b:a 112k -movflags +faststart public/assets/jingle.mp4`. A capa sai de
   um quadro do próprio vídeo (`-ss 12 -frames:v 1`).
11. **Texto legal.** `rodape.legal` traz a identificação oficial da propaganda:
   coligação, partidos, CNPJ e o aviso de uso de IA. Logo abaixo segue
   `rodape.aviso`, que é a exigência da própria Lei nº 9.504/97 — os dois
   convivem de propósito, um não substitui o outro.

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
