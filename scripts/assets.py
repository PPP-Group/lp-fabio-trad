"""Extrai os recursos do site a partir do pacote da campanha em IDV/.

Nada aqui é redesenhado: todas as marcas saem do vetor original e todas as fotos
saem das camadas dos arquivos de arte. Rode com o pacote descompactado no lugar:

    python scripts/assets.py

Saída: public/assets/
"""
import io
import os
import re
import sys

import numpy as np
import pymupdf
from PIL import Image
from psd_tools import PSDImage

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IDV = os.path.join(RAIZ, 'IDV', '01. IDV Campanha-20260811T212447Z-1-003', '01. IDV Campanha')
SAIDA = os.path.join(RAIZ, 'public', 'assets')

ELEMENTOS = os.path.join(IDV, '08.GCs animados', 'OBJETOS', 'Elementos Fábio Trad.ai')
PARA_CHOQUE = os.path.join(IDV, '06. Base Impressos', '01. Fábio-Gilda', 'Para-Choque 30x10.ai')
PECAS = os.path.join(IDV, '07. Base PSDs', 'Peças Vertical.psd')

# As páginas do "Elementos" começam pintando um retângulo de sangria inteiro.
# Trocar o par de operadores por um caminho vazio deixa as marcas em alfa limpo.
SANGRIA = b'0 0 1920 1080 re\nf\n'


def elementos_sem_fundo():
    doc = pymupdf.open(ELEMENTOS)
    for pagina in doc:
        for xref in pagina.get_contents():
            fluxo = doc.xref_stream(xref)
            if SANGRIA in fluxo:
                doc.update_stream(xref, fluxo.replace(SANGRIA, b'n\n'))
    return doc


def colunas(im, folga, largura_minima=60):
    """Divide um render transparente nas marcas que ele contém, da esquerda para a direita."""
    alfa = np.array(im.getchannel('A'))
    ocupado = (alfa > 8).any(axis=0)
    trechos, inicio = [], None
    for x, ligado in enumerate(ocupado):
        if ligado and inicio is None:
            inicio = x
        elif not ligado and inicio is not None:
            trechos.append([inicio, x])
            inicio = None
    if inicio is not None:
        trechos.append([inicio, len(ocupado)])
    juntos = []
    for t in trechos:
        if juntos and t[0] - juntos[-1][1] < folga:
            juntos[-1][1] = t[1]
        else:
            juntos.append(t)
    return [tuple(t) for t in juntos if t[1] - t[0] >= largura_minima]


# página (1 a 10) -> (folga entre marcas, nomes da esquerda para a direita)
# Só sai daqui o que o site usa: o hachurado é caro de comprimir e cada marca é
# gravada na largura em que de fato aparece na tela, em dobro, e não maior.
# `None` pula a marca daquela posição.
MARCAS = {
    3: (400, ['f13-branco']),
    4: (180, ['mapa-coragem', None]),
    10: (300, ['13-branco', None, '13-amarelo']),
}
LARGURAS = {
    'f13-branco': 900,
    'mapa-coragem': 1100,
    '13-branco': 700,
    '13-amarelo': 800,
}
# Nenhum destes vai para o disco: o 13 branco só existe para virar favicon, o
# mapa vermelho só para virar a versão branca, e do 13 amarelo o site usa apenas
# o algarismo sem a linha "CORAGEM ★".
SO_NA_MEMORIA = {'13-branco', 'mapa-coragem', '13-amarelo'}


def salvar_png(im, nome, largura_maxima=None):
    if largura_maxima and im.width > largura_maxima:
        altura = round(im.height * largura_maxima / im.width)
        im = im.resize((largura_maxima, altura), Image.LANCZOS)
    caminho = os.path.join(SAIDA, nome)
    im.save(caminho, optimize=True)
    print(f'  {nome} {im.size} {os.path.getsize(caminho) // 1024} KB')


def salvar_webp(im, nome, largura_maxima=None, qualidade=82):
    if largura_maxima and im.width > largura_maxima:
        altura = round(im.height * largura_maxima / im.width)
        im = im.resize((largura_maxima, altura), Image.LANCZOS)
    caminho = os.path.join(SAIDA, nome)
    im.save(caminho, quality=qualidade, method=6)
    print(f'  {nome} {im.size} {os.path.getsize(caminho) // 1024} KB')


def so_o_numero(im):
    """Corta o '13' acima da linha vazia que o separa do 'CORAGEM ★'."""
    alfa = np.array(im.getchannel('A'))
    vazias = np.flatnonzero(~(alfa > 8).any(axis=1))
    if not len(vazias):
        return im
    corte = int(vazias[len(vazias) // 2])
    recorte = im.crop((0, 0, im.width, corte))
    return recorte.crop(recorte.getbbox())


def pintar_de_branco(im):
    """Mantém o alfa e troca a cor por branco — usado para as versões sobre vermelho."""
    saida = Image.new('RGBA', im.size, (255, 255, 255, 0))
    saida.putalpha(im.getchannel('A'))
    return saida


def marcas():
    """Grava as marcas usadas pelo site e devolve as que outros passos precisam."""
    print('marcas')
    guardadas = {}
    doc = elementos_sem_fundo()
    for numero, (folga, nomes) in MARCAS.items():
        pagina = doc[numero - 1]
        pix = pagina.get_pixmap(dpi=200, alpha=True)
        im = Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGBA')
        for i, (x0, x1) in enumerate(colunas(im, folga)):
            nome = nomes[i] if i < len(nomes) else None
            if nome is None:
                continue
            tile = im.crop((x0, 0, x1, im.height))
            tile = tile.crop(tile.getbbox())
            guardadas[nome] = tile
            if nome not in SO_NA_MEMORIA:
                salvar_webp(tile, f'{nome}.webp', largura_maxima=LARGURAS[nome], qualidade=86)
            if nome == '13-amarelo':
                # a arte traz "CORAGEM ★" abaixo do número; o site usa o
                # algarismo sozinho, que sai num segundo arquivo
                salvar_webp(so_o_numero(tile), f'{nome}-so.webp',
                            largura_maxima=LARGURAS[nome], qualidade=86)
            if nome == 'mapa-coragem':
                salvar_webp(pintar_de_branco(tile), 'mapa-coragem-branco.webp',
                            largura_maxima=LARGURAS[nome], qualidade=86)
    return guardadas


def contorno_do_mapa():
    """O contorno de Mato Grosso do Sul, em svg, para herdar a cor por currentColor."""
    print('contorno do mapa')
    doc = pymupdf.open(ELEMENTOS)
    svg = doc[6].get_svg_image(text_as_path=True)
    caminhos = re.findall(r'<path transform="([^"]+)" d="([^"]+)" fill="#fd0d03"/>', svg)
    if not caminhos:
        print('  contorno não encontrado — pulando')
        return
    transform, d = caminhos[0]
    saida = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" '
        'width="1920" height="1080" aria-hidden="true">\n'
        f'<path transform="{transform}" d="{d}" fill="currentColor"/>\n</svg>\n'
    )
    caminho = os.path.join(SAIDA, 'mapa-ms.svg')
    open(caminho, 'w', encoding='utf-8').write(saida)
    print(f'  mapa-ms.svg {os.path.getsize(caminho) // 1024} KB')


def recortes():
    """Fábio e Dona Gilda recortados, com o alfa que veio junto da arte."""
    print('recortes')
    doc = pymupdf.open(PARA_CHOQUE)
    # x47 e x54 são o mesmo Fábio em alta; a Dona Gilda em melhor
    # resolução no pacote é a x53
    nomes = {47: 'fabio-recorte', 53: 'gilda-recorte'}
    vistos = set()
    for pagina in doc:
        for imagem in pagina.get_images(full=True):
            xref, smask = imagem[0], imagem[1]
            if xref in vistos or xref not in nomes:
                continue
            vistos.add(xref)
            base = Image.open(io.BytesIO(doc.extract_image(xref)['image'])).convert('RGB')
            if smask:
                m = pymupdf.Pixmap(doc, smask)
                if m.n > 1:
                    m = pymupdf.Pixmap(pymupdf.csGRAY, m)
                alfa = Image.frombytes('L', (m.width, m.height), m.samples)
                if alfa.size != base.size:
                    alfa = alfa.resize(base.size, Image.LANCZOS)
                base = base.convert('RGBA')
                base.putalpha(alfa)
            base = base.crop(base.getbbox())
            salvar_webp(base, f'{nomes[xref]}.webp', largura_maxima=1400, qualidade=88)


CAMADAS = [
    ('Card 1', '103A4684 copiar', 'comicio', 1600),
    ('Card 4', 'FOTO', 'fabio-microfone', 1100),
]
# Frações (esquerda, topo, direita, base) da área aproveitável de cada foto.
# O recorte do microfone veio com franjas vermelhas do fundo em volta — estas
# frações tiram o grosso delas, e o resto some contra o painel vermelho em que a
# foto é montada. A foto do palco veio com um retângulo branco na ponta
# esquerda, sobra do enquadramento do objeto inteligente.
CORTES = {
    'fabio-microfone': (0.24, 0.0, 0.84, 0.99),
    'palco': (0.216, 0.0, 1.0, 1.0),
}
# A camada '103A4644 (1).jpg' e a cópia dela são a mesma foto; fica só a cópia.
SUB_CAMADAS = [
    ('103A4644 (1).jpg copiar', 'palco', 1200),
    ('103A4810', 'abraco', 1200),
]


def cortar(im, nome):
    if nome not in CORTES:
        return im
    e, c, d, b = CORTES[nome]
    return im.crop((int(im.width * e), int(im.height * c),
                    int(im.width * d), int(im.height * b)))


def fotos():
    """Fotos de campanha achatadas a partir das camadas das peças verticais."""
    print('fotos')
    psd = PSDImage.open(PECAS)
    for prancheta in psd:
        for camada in prancheta:
            for arte, alvo, nome, largura in CAMADAS:
                if prancheta.name == arte and camada.name == alvo:
                    salvar_webp(cortar(camada.composite(), nome), f'{nome}.webp',
                                largura_maxima=largura)
            if camada.name == 'FOTOS FUNDO' and camada.is_group():
                for sub in camada:
                    for alvo, nome, largura in SUB_CAMADAS:
                        if sub.name == alvo:
                            im = cortar(sub.composite().convert('RGB'), nome)
                            salvar_webp(im, f'{nome}.webp', largura_maxima=largura)


def favicon(marca):
    """O 13 branco sobre o vermelho da campanha, para a aba do navegador."""
    print('favicon')
    for lado in (32, 180):
        fundo = Image.new('RGBA', (lado, lado), (243, 31, 41, 255))
        margem = round(lado * 0.15)
        alvo = lado - margem * 2
        m = marca.copy()
        m.thumbnail((alvo, alvo), Image.LANCZOS)
        fundo.paste(m, ((lado - m.width) // 2, (lado - m.height) // 2), m)
        nome = 'favicon.png' if lado == 32 else 'icone-180.png'
        salvar_png(fundo, nome)


if __name__ == '__main__':
    if not os.path.isdir(IDV):
        sys.exit(f'pacote da campanha não encontrado em {IDV}')
    os.makedirs(SAIDA, exist_ok=True)
    guardadas = marcas()
    contorno_do_mapa()
    recortes()
    fotos()
    favicon(guardadas['13-branco'])
