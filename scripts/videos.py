"""Baixa a capa dos vídeos das redes e grava em public/assets/.

A página não carrega nada do Instagram nem do TikTok até alguém clicar: o cartão
mostra uma capa servida do próprio domínio e só o modal abre o iframe da rede.
Para isso a capa precisa estar aqui — e as URLs que o oEmbed devolve são
assinadas e expiram em horas, então não dá para apontar direto para elas.

    python scripts/videos.py

Além de gravar as capas, imprime o texto da postagem que veio do oEmbed, para
conferir contra o que está em src/data/campanha.js.
"""
import io
import json
import os
import sys
import urllib.parse
import urllib.request

from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA = os.path.join(RAIZ, 'public', 'assets')

NAVEGADOR = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
)

# nome do arquivo -> endpoint oEmbed da rede
VIDEOS = [
    (
        'video-instagram',
        'https://www.instagram.com/api/v1/oembed/?url='
        + urllib.parse.quote('https://www.instagram.com/reel/DY42Lt8hSif/', safe=''),
    ),
    (
        'video-tiktok',
        'https://www.tiktok.com/oembed?url='
        + urllib.parse.quote(
            'https://www.tiktok.com/@fabio.trad/video/7668661972568657159', safe=''
        ),
    ),
]


def buscar(url):
    pedido = urllib.request.Request(url, headers={'User-Agent': NAVEGADOR})
    with urllib.request.urlopen(pedido, timeout=30) as resposta:
        return resposta.read()


def capa(nome, endpoint, largura_maxima=720):
    dados = json.loads(buscar(endpoint))
    print(f'\n{nome}')
    print('  autor: ', dados.get('author_name'), dados.get('author_url'))
    print('  texto: ', (dados.get('title') or '').replace('\n', ' ')[:160])

    origem = dados.get('thumbnail_url')
    if not origem:
        print('  sem capa no oEmbed — pulando')
        return
    im = Image.open(io.BytesIO(buscar(origem))).convert('RGB')
    if im.width > largura_maxima:
        im = im.resize(
            (largura_maxima, round(im.height * largura_maxima / im.width)), Image.LANCZOS
        )
    caminho = os.path.join(SAIDA, f'{nome}.webp')
    im.save(caminho, quality=82, method=6)
    print(f'  {nome}.webp {im.size} {os.path.getsize(caminho) // 1024} KB')


if __name__ == '__main__':
    os.makedirs(SAIDA, exist_ok=True)
    for nome, endpoint in VIDEOS:
        try:
            capa(nome, endpoint)
        except Exception as erro:  # a rede pode estar fora, ou o post ter saído do ar
            print(f'\n{nome}\n  falhou: {erro}', file=sys.stderr)
