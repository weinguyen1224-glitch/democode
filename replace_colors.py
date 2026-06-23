import os

replacements = [
    ('var(--color-ink, #f8d077)', 'var(--color-ink, #ffffff)'),
]

files = [
    'css/chapters/ch2-ngu-hanh.css',
    'css/chapters/ch2-bao-ton.css',
    'css/custom/ch2-enhancements.css',
]

for fpath in files:
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != original:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated: ' + fpath)
    else:
        print('No change: ' + fpath)
