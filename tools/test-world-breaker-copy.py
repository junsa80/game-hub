import importlib.util
from pathlib import Path
import shutil
import sys
import tempfile
spec=importlib.util.spec_from_file_location("builder",Path(__file__).with_name("build_world_breaker_copy.py"))
builder=importlib.util.module_from_spec(spec);spec.loader.exec_module(builder)
source=Path(sys.argv[1])
def inventory(root):
    return {p.relative_to(root).as_posix():p.read_bytes() for p in root.rglob("*") if p.is_file()}
with tempfile.TemporaryDirectory() as temp:
    temp=Path(temp);copy=temp/"source";shutil.copytree(source,copy)
    original=inventory(copy);out=temp/"output"
    builder.build(copy,out)
    assert inventory(out)==inventory(builder.ROOT/"play/world-breaker"),"rebuild must preserve every runtime byte"
    assert inventory(copy)==original,"source must not mutate"
    try:builder.build(copy,out);raise AssertionError("existing output accepted")
    except ValueError:pass
    for path in ["src/audio.js","src/main.js","src/art.js","index.html"]:
        file=copy/path;old=file.read_bytes();file.write_bytes(old+b"\n// upstream edit")
        candidate=temp/"conflict"
        try:builder.build(copy,candidate);raise AssertionError("conflict accepted")
        except ValueError:pass
        assert not candidate.exists(),"failed build must leave no output"
        file.write_bytes(old)
    (copy/"sfx").mkdir();(copy/"sfx/hit.wav").write_bytes(b"new upstream sound")
    try:builder.build(copy,temp/"new-file");raise AssertionError("new upstream collision accepted")
    except ValueError:pass
    assert not (temp/"new-file").exists()
print("PASS full runtime byte equality, canonical source preservation, existing output refusal, four upstream conflicts and new asset collision")
