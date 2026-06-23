#!/usr/bin/env python3
"""Convert GIF to animated WebP."""
from PIL import Image
import os

path = 'assets/gif/thiet-ke-bao-bi-truyen-thong-lucky-brand-1-8c274acf41.gif'
out = os.path.splitext(path)[0] + '.webp'

img = Image.open(path)
frames = []
try:
    while True:
        frames.append(img.copy().convert('RGBA'))
        img.seek(img.tell() + 1)
except EOFError:
    pass

duration = img.info.get('duration', 100)
frames[0].save(out, 'webp', save_all=True, append_images=frames[1:],
               duration=duration, loop=0, quality=85, method=6)

old = os.path.getsize(path)
new = os.path.getsize(out)
print(f'{path}  {old//1024}KB -> {new//1024}KB  (-{100*(1-new/old):.0f}%)')
