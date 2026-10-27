"""Regression: failed builds must not erase a published game or leave partial output."""
import importlib.util
from pathlib import Path
import tempfile

spec = importlib.util.spec_from_file_location('copy_game', Path(__file__).with_name('make_static_copy.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp)
    src = root / 'source'
    src.mkdir()
    html = '<script type="text/cloud-pending" data-cloud-src="game.js"></script><script src="/cloud-save.js?v=3"></script><link href="/visual.css">진행 상황은 기기와 GPT 계정에 저장돼요. 같은 계정으로 다른 기기에서 이어할 수 있어요.'
    (src / 'index.html').write_text(html)
    (src / 'game.js').write_text('localStorage.getItem("existing-key")')
    (src / 'visual.css').write_text("body{background:url('/visual/cover.webp')}")
    (src / 'cloud-save.js').write_text('cloud')
    (src / 'package.json').write_text('{}')
    out = root / 'published'
    out.mkdir()
    sentinel = out / 'game.js'
    sentinel.write_text('published improvement')
    def rejects(source, target):
        try:
            module.build(source, target)
        except (ValueError, OSError, UnicodeError):
            return
        raise AssertionError('Expected refusal')
    rejects(root / 'missing', out)
    assert sentinel.read_text() == 'published improvement'
    rejects(src, out)
    assert sentinel.read_text() == 'published improvement'
    rejects(src, src / 'nested')
    rejects(root / 'missing', root / 'missing-output')
    assert not (root / 'missing-output').exists()
    (src / 'broken.css').write_bytes(b'\xff')
    rejects(src, root / 'failed-output')
    assert not (root / 'failed-output').exists()
    (src / 'broken.css').unlink()
    target = module.build(src, root / 'staging')
    text = (target / 'index.html').read_text()
    assert '<script src="game.js"></script>' in text
    assert '<script src="/cloud-save' not in text
    assert 'href="visual.css"' in text
    assert '현재 브라우저에만 저장' in text and 'GPT 계정' not in text
    assert (target / 'game.js').read_bytes() == (src / 'game.js').read_bytes()
    assert (target / 'visual.css').read_text() == "body{background:url('visual/cover.webp')}"
    assert not (target / 'cloud-save.js').exists() and not (target / 'package.json').exists()
    assert (src / 'index.html').read_text() == html
    assert sentinel.read_text() == 'published improvement'
    assert not list(root.glob('.static-copy-*'))
print('PASS existing output/source preserved; missing source, nested output and decode failure refused; hosting transforms and local-save notice; no partial output')
