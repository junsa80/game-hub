#!/usr/bin/env python3
"""Build a NEW staging folder; preserve reviewed hub art/audio overlays.
Usage: python3 tools/build_world_breaker_copy.py SOURCE NEW_OUTPUT
Source and existing published files are read-only. Run game's tests before publish.
"""
import hashlib
import json
from pathlib import Path
import shutil
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "tools/patches/world-breaker-overlays.json"

def blob(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def build(source, output):
    source, output = Path(source).resolve(), Path(output).resolve()
    if output.exists():
        raise ValueError("Output must not exist; publish only after reviewing staging")
    # Do not write inside either source tree or the existing public runtime.
    published = ROOT / "play/world-breaker"
    if output.is_relative_to(source) or output.is_relative_to(published):
        raise ValueError("Output must be outside source and published runtime")
    manifest = json.loads(MANIFEST.read_text())
    for name in manifest["sourceFiles"]:
        if not (source / name).is_file():
            raise ValueError("Missing canonical runtime: " + name)
    # Refuse to silently overwrite new upstream edits or changed hub overlays.
    for name, entry in manifest["overlays"].items():
        original = source / name
        expected = entry["sourceBlob"]
        if expected:
            if not original.is_file() or blob(original.read_bytes()) != expected:
                raise ValueError("Upstream overlay conflict: " + name)
        elif original.exists():
            raise ValueError("New upstream file conflicts with overlay: " + name)
        current = published / name
        if not current.is_file() or hashlib.sha256(current.read_bytes()).hexdigest() != entry["overlaySha256"]:
            raise ValueError("Hub overlay changed; review manifest: " + name)
    output.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="world-breaker-build-", dir=output.parent) as temp:
        stage = Path(temp) / "runtime"
        stage.mkdir()
        for name in ["index.html", "styles.css", "game-score.js"]:
            shutil.copy2(source / name, stage / name)
        for name in ["src", "visual"]:
            shutil.copytree(source / name, stage / name)
        for name in manifest["overlays"]:
            target = stage / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(published / name, target)
        stage.rename(output)
    return output

if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    try:
        print("Staged runtime:", build(sys.argv[1], sys.argv[2]))
    except (ValueError, OSError) as error:
        raise SystemExit(str(error))
