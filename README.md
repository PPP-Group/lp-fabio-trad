# Fábio Trad 13 — landing page

Página única de campanha para o governo de Mato Grosso do Sul, 2026.
Navegação por âncoras: Início · Sobre · Propostas · Conquistas · Participe.

```bash
npm install
npm run dev      # http://localhost:5179
npm run build    # gera dist/
npm run preview  # serve dist/ em http://localhost:4179
```

> **Material sigiloso.** O pacote em `IDV/` é da campanha e não foi enviado a
> nenhum serviço externo. Nada aqui usa CDN, fonte remota, analytics ou API de
> terceiros: as fontes são servidas do próprio domínio e as imagens saem dos
> arquivos de arte. O site também nunca foi publicado — subir para um domínio é
> decisão da campanha.

---

## De onde veio cada coisa

Nada foi inventado nem redesenhado.

| No site                        | Origem                                                              |
| ------------------------------ | ------------------------------------------------------------------- |
| Todo o texto                   | `IDV/Estrutura_Landing_Page_Fabio_Trad.docx`                        |
| Paleta e degradê               | `Apresentação Final - Campanha Fábio.pdf`, p. 4                     |
| Marcas F13, 13, mapa, estrela  | `08.GCs animados/OBJETOS/Elementos Fábio Trad.ai`                   |
| Recortes de Fábio e Dona Gilda | `06. Base Impressos/01. Fábio-Gilda/Para-Choque 30x10.ai`           |
| Fotos de campanha              | camadas de `07. Base PSDs/Peças Vertical.psd`                       |
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
scripts/
  assets.py          refaz public/assets/ a partir de IDV/
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

1. **WhatsApp.** `contato.whatsapp` está como `5567000000000`. É o número que
   move a página inteira: o botão do menu, o botão do herói, o formulário e o
   convite de voluntariado abrem conversa com ele.
2. **Redes sociais.** As quatro URLs em `redes` foram montadas a partir do nome
   do candidato — o pacote da identidade não traz nenhum @. Confira uma a uma.
3. **CNPJ da campanha.** `rodape.cnpj` está zerado. O aviso legal do rodapé já
   está no texto da Lei nº 9.504/97; confirme com o jurídico se a campanha usa
   outra redação.
4. **Depoimentos.** A estrutura pede depoimentos de apoiadores e da militância
   em "Quem caminha junto" (`apoios`). Hoje há só a linha de apresentação — os
   depoimentos entram assim que a campanha aprovar.
5. **Vídeos.** A estrutura pede conteúdo incorporado de Instagram, YouTube e
   TikTok. Como não veio nenhum link, "Tereré com Fábio" e "Café com Dona Gilda"
   estão como cartões que levam ao perfil. Para embutir de verdade, troque os
   cartões em `src/components/sobre/Redes.jsx`.
6. **Fotos.** As cinco em uso saíram das camadas dos `.psd`; duas delas são de
   um mesmo ensaio. Vale trocar por material da produção quando chegar — os
   arquivos e as legendas estão em `galeria` (`src/data/campanha.js`).
7. **Formulário.** "Fale direto comigo" e "Seja voluntário" abrem o WhatsApp com
   a mensagem já escrita, sem servidor no meio. Se a campanha quiser os contatos
   num CRM, o ponto de troca é a função `abrirZap` em
   `src/components/participe/Participe.jsx`.
8. **Domínio e og:image.** `index.html` aponta para `/assets/og.jpg`, que é uma
   captura do próprio herói (`node scripts/og.mjs` refaz). Ajuste as URLs
   absolutas quando o domínio estiver definido.

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
