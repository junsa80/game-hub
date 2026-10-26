#!/usr/bin/env python3
"""[GrokBot] prism-muse 플레이 사본의 대형 PNG를 같은 해상도의 WebP(q90)로 변환하고
빌드 산출물(_next/static/chunks/*.css|*.js)의 참조를 .webp로 바꾼다.
원본 PNG는 지우지 않는다(이전 캐시 청크/롤백 호환). 재빌드 후 다시 실행하면 된다.
사용: python3 tools/optimize_prism_images.py [play/prism-muse]"""
import glob, os, re, sys
from PIL import Image

root = sys.argv[1] if len(sys.argv) > 1 else 'play/prism-muse'
names = []
for f in sorted(glob.glob(os.path.join(root, '*.png'))):
    base = os.path.basename(f)[:-4]
    if not re.fullmatch(r'(muses[a-z-]*|fusion-[a-z-]+)', base):
        continue
    im = Image.open(f).convert('RGB')
    out = f[:-4] + '.webp'
    im.save(out, 'WEBP', quality=90, method=6)
    assert Image.open(out).size == im.size, f
    names.append(base)
    print(f'{base}: {os.path.getsize(f)//1024}KB -> {os.path.getsize(out)//1024}KB {im.size}')
pat = re.compile(r'(/game-hub/play/prism-muse/(?:%s))\.png' % '|'.join(map(re.escape, names)))
for f in glob.glob(os.path.join(root, '_next/static/chunks/*')):
    if not f.endswith(('.css', '.js')):
        continue
    s = open(f, encoding='utf-8').read()
    t = pat.sub(r'\1.webp', s)
    if t != s:
        open(f, 'w', encoding='utf-8').write(t)
        print('rewrote', f)
