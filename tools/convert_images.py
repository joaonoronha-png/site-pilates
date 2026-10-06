#!/usr/bin/env python3
"""Gera versões AVIF + WebP responsivas (480 px e tamanho original, máx. 1080 px).

Uso: python3 tools/convert_images.py <pasta-de-originais> assets/media/img
Depois, atualize assets/media/images.json com a saída impressa (largura, altura,
tamanhos e cor média usada como fundo enquanto a imagem carrega).
"""
import json
import os
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
meta = {}
for f in sorted(os.listdir(src)):
    im = Image.open(os.path.join(src, f)).convert('RGB')
    base = os.path.splitext(f)[0]
    w0, h0 = im.size
    widths = sorted(set([w for w in (480, 800) if w < w0] + [min(w0, 1080)]))
    for w in widths:
        r = im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
        r.save(f'{out}/{base}-{w}.webp', 'WEBP', quality=74, method=6)
        r.save(f'{out}/{base}-{w}.avif', 'AVIF', quality=55, speed=5)
    c = im.resize((1, 1), Image.BOX).getpixel((0, 0))
    meta[base] = {'w': w0, 'h': h0, 'widths': widths, 'color': '#%02x%02x%02x' % c}
print(json.dumps(meta, indent=1))
