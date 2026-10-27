#!/usr/bin/env python3
"""Build a new static staging directory; never replace an existing game.
Usage: python3 tools/make_static_copy.py SOURCE_PUBLIC NEW_STAGING
Hosting-only transforms remove cloud scripts, activate game scripts and make
visual paths relative. Review staging before publishing; browser saves unchanged.
"""
import os, re, shutil, sys, tempfile
from pathlib import Path


def build(source, output):
    src, out = Path(source).resolve(), Path(output).absolute()
    if out.exists() or out.is_symlink():
        raise ValueError('Output already exists; choose a new staging directory')
    dst_real = out.resolve()
    if dst_real == src or src in dst_real.parents:
        raise ValueError('Output must be outside the source directory')
    if not src.is_dir() or not (src / 'index.html').is_file():
        raise ValueError('Source requires a public directory with index.html')
    with tempfile.TemporaryDirectory(prefix='.static-copy-', dir=out.parent) as tmp:
        dst = str(Path(tmp) / 'payload')
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns('cloud-save.js', 'package.json'))
        for root, _, files in os.walk(dst):
            for f in files:
                if not f.endswith(('.html', '.css')): continue
                p = os.path.join(root, f); s = open(p, encoding='utf-8').read(); o = s
                s = re.sub(r'<script type="text/cloud-pending" data-cloud-src="([^"]+)"></script>', r'<script src="\1"></script>', s)
                s = re.sub(r'<script src="/cloud-save\.js[^"]*"></script>', '<!-- game-hub: cloud-save removed; saves are local to this browser -->', s)
                s = re.sub(r'(href|src)="/(visual[^"]*)"', r'\1="\2"', s)
                s = re.sub(r"url\('/(visual/[^']*)'\)", r"url('\1')", s)
                s = s.replace('진행 상황은 기기와 GPT 계정에 저장돼요. 같은 계정으로 다른 기기에서 이어할 수 있어요.', '이 Pages 버전은 현재 브라우저에만 저장돼요. 다른 기기에서는 백업 파일을 가져와 이어할 수 있어요.')
                if s != o: open(p, 'w', encoding='utf-8').write(s); print('edited', p)
        # All reads/transforms must succeed before output appears.
        if out.exists() or out.is_symlink():
            raise ValueError('Output appeared during build; refusing replacement')
        Path(dst).rename(out)
    return out


if __name__ == '__main__':
    if len(sys.argv) != 3:
        sys.exit('Usage: make_static_copy.py SOURCE_PUBLIC NEW_STAGING')
    try:
        result = build(sys.argv[1], sys.argv[2])
        left = [part for part in (result / 'index.html').read_text().split('"')
                if part.startswith('/') and not part.startswith('//')]
        print('remaining root-absolute refs in index.html (check!):', left)
    except (OSError, ValueError, UnicodeError) as error:
        sys.exit(str(error))
