#!/usr/bin/env python3
"""Stage a reviewed static export with hub-only Prism additions; never publish.

Usage: python3 tools/stage_prism_copy.py EXPORTED_RUNTIME NEW_OUTPUT
This is not a Next.js builder. A changed export must be reviewed and re-pinned.
"""
import hashlib
import json
from pathlib import Path
import shutil
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / 'tools/patches/prism-muse-overlays.json'
PUBLISHED = ROOT / 'play/prism-muse'

def inventory(root):
    if not root.is_dir():
        raise ValueError('Missing runtime directory: ' + str(root))
    result = {}
    for path in sorted(root.rglob('*')):
        if path.is_symlink():
            raise ValueError('Symlinks are not supported: ' + str(path))
        if path.is_file():
            result[path.relative_to(root).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return result

def verify(actual, expected, label):
    changes = sorted(k for k in actual.keys() | expected.keys() if actual.get(k) != expected.get(k))
    if changes:
        raise ValueError(label + ' differs; review before updating manifest: ' + ', '.join(changes[:8]))

def stage(source, output, published=PUBLISHED, manifest_path=MANIFEST):
    source, output, published = (Path(p).absolute() for p in (source, output, published))
    if output.exists() or output.is_symlink():
        raise ValueError('Output must not exist')
    for root in (source, published):
        if output.resolve().is_relative_to(root.resolve()) or root.resolve().is_relative_to(output.resolve()):
            raise ValueError('Output must be separate from input and published runtime')
    manifest = json.loads(Path(manifest_path).read_text())
    verify(inventory(source), manifest['baselineFiles'], 'Export')
    verify(inventory(published), manifest['publishedFiles'], 'Published runtime')
    for name in manifest['overlays']:
        if Path(name).is_absolute() or '..' in Path(name).parts:
            raise ValueError('Invalid overlay path')
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='prism-stage-', dir=output.parent) as tmp:
        target = Path(tmp) / 'runtime'
        shutil.copytree(source, target)
        for name in manifest['overlays']:
            dest = target / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(published / name, dest)
        # Detect mismatches and input changes during copying before output appears.
        verify(inventory(target), manifest['publishedFiles'], 'Staged runtime')
        if output.exists() or output.is_symlink():
            raise ValueError('Output appeared during staging')
        target.rename(output)
    return output

if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    try:
        print(stage(sys.argv[1], sys.argv[2]))
    except (ValueError, OSError) as error:
        raise SystemExit(str(error))
