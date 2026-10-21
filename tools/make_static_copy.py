#!/usr/bin/env python3
"""Make a game-hub hosted copy (play/<name>/) from a GPT game's static public/ folder.

Usage: python3 tools/make_static_copy.py <source public/ dir> play/<name>
Edits (hosting only, game code untouched):
  - drop cloud-save.js and package.json (ChatGPT Sites account save; no API on GitHub Pages)
  - <script type="text/cloud-pending" data-cloud-src="X"> -> <script src="X">
  - remove <script src="/cloud-save.js...">
  - root-absolute /visual.* and url('/visual/...') -> relative (site lives under /game-hub/play/<name>/)
Result: saves are local to this browser only.
"""
import os, re, shutil, sys
src, dst = sys.argv[1], sys.argv[2]
if os.path.exists(dst): shutil.rmtree(dst)
shutil.copytree(src, dst, ignore=shutil.ignore_patterns('cloud-save.js', 'package.json'))
for root, _, files in os.walk(dst):
    for f in files:
        if not f.endswith(('.html', '.css')): continue
        p = os.path.join(root, f); s = open(p, encoding='utf-8').read(); o = s
        s = re.sub(r'<script type="text/cloud-pending" data-cloud-src="([^"]+)"></script>', r'<script src="\1"></script>', s)
        s = re.sub(r'<script src="/cloud-save\.js[^"]*"></script>', '<!-- game-hub: cloud-save removed; saves are local to this browser -->', s)
        s = re.sub(r'(href|src)="/(visual[^"]*)"', r'\1="\2"', s)
        s = re.sub(r"url\('/(visual/[^']*)'\)", r"url('\1')", s)
        if s != o: open(p, 'w', encoding='utf-8').write(s); print('edited', p)
left = [l for l in open(os.path.join(dst, 'index.html'), encoding='utf-8').read().split('"') if l.startswith('/') and not l.startswith('//')]
print('remaining root-absolute refs in index.html (check!):', left)
