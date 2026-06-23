#!/usr/bin/env python3
"""Convert all images used in index.html to WebP format."""
from PIL import Image
import os

IMAGES = [
    'assets/images/cover-1-16x9-new.jpg',
    'assets/images/cover-3-16x9-new.jpg',
    'assets/DIVIDER/DIVIDER-01.png',
    'assets/DIVIDER/DIVIDER-02.png',
    'assets/chuong-1/Đình (2).jpg',
    'assets/chuong-1/nguoi-vo-ben-song.png',
    'assets/chuong-1/dan-lang-dinh-ban.png',
    'assets/chuong-1/Đền 1.jpg',
    'assets/chuong-2/minh họa bánh.png',
    'assets/chuong-2/NGHỆ NHÂN NGUYỄN ĐÌNH MINH.JPG',
    'assets/background-remover/ladong.png',
    'assets/background-remover/dua.png',
    'assets/background-remover/duong.png',
    'assets/background-remover/dau.png',
    'assets/background-remover/danhdanh.png',
]

total_old = total_new = 0
ok = fail = 0

for path in IMAGES:
    out = os.path.splitext(path)[0] + '.webp'
    try:
        img = Image.open(path)
        mode = 'RGBA' if img.mode in ('RGBA', 'LA', 'P') or path.endswith('.png') else 'RGB'
        if img.mode in ('P', 'LA'):
            img = img.convert('RGBA')
        elif mode == 'RGB':
            img = img.convert('RGB')
        img.save(out, 'webp', quality=85, method=6)
        old_sz = os.path.getsize(path)
        new_sz = os.path.getsize(out)
        total_old += old_sz
        total_new += new_sz
        pct = 100 * (1 - new_sz / old_sz)
        print(f'OK  {path}  {old_sz//1024}KB -> {new_sz//1024}KB  (-{pct:.0f}%)')
        ok += 1
    except Exception as e:
        print(f'FAIL {path}: {e}')
        fail += 1

# Handle asterisk filename
for f in os.listdir('assets/images'):
    if '*9-new.jpg' in f and f.endswith('.jpg'):
        path = os.path.join('assets/images', f)
        out = os.path.splitext(path)[0] + '.webp'
        try:
            img = Image.open(path)
            img = img.convert('RGB')
            img.save(out, 'webp', quality=85, method=6)
            old_sz = os.path.getsize(path)
            new_sz = os.path.getsize(out)
            total_old += old_sz
            total_new += new_sz
            print(f'OK  {path}  {old_sz//1024}KB -> {new_sz//1024}KB  (-{100*(1-new_sz/old_sz):.0f}%)')
            ok += 1
        except Exception as e:
            print(f'FAIL {path}: {e}')
            fail += 1

print('---')
print(f'{ok} converted, {fail} failed')
if total_old:
    print(f'Total: {total_old//1024}KB -> {total_new//1024}KB  (-{100*(1-total_new/total_old):.0f}%)')
