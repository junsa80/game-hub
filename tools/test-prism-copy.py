#!/usr/bin/env python3
"""Uses a historical static export fixture; does not claim a fresh source build."""
import importlib.util
from pathlib import Path
import shutil
import sys
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('prism_copy', Path(__file__).with_name('stage_prism_copy.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
BASE = Path(sys.argv.pop(1)).resolve() if len(sys.argv) > 1 else None

class Preservation(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.source = self.root / 'source'
        shutil.copytree(BASE, self.source)
        self.published = self.root / 'published'
        shutil.copytree(m.PUBLISHED, self.published)
        self.output = self.root / 'output'
        self.before = m.inventory(self.published)

    def run_stage(self):
        return m.stage(self.source, self.output, self.published)

    def rejected(self):
        with self.assertRaises((ValueError, OSError)):
            self.run_stage()
        self.assertFalse(self.output.exists())
        self.assertEqual(m.inventory(self.published), self.before)

    def test_exact_reconstruction_and_input_unchanged(self):
        original = m.inventory(self.source)
        self.run_stage()
        self.assertEqual(m.inventory(self.output), self.before)
        self.assertEqual(m.inventory(self.source), original)
        self.assertEqual(m.inventory(self.published), self.before)

    def test_existing_output_preserved(self):
        self.output.mkdir()
        (self.output / 'sentinel').write_text('preserve')
        with self.assertRaises(ValueError): self.run_stage()
        self.assertEqual((self.output / 'sentinel').read_text(), 'preserve')

    def test_missing_source(self):
        shutil.rmtree(self.source)
        self.rejected()

    def test_changed_chunk_rejected(self):
        next((self.source / '_next').rglob('*.js')).write_text('new source build')
        self.rejected()

    def test_new_source_asset_collision(self):
        (self.source / 'sfx').mkdir()
        (self.source / 'sfx/soft.wav').write_bytes(b'new upstream sound')
        self.rejected()

    def test_changed_published_overlay(self):
        (self.published / 'sfx/soft.wav').write_bytes(b'new hub sound')
        self.before = m.inventory(self.published)
        self.rejected()

    def test_nested_output_rejected(self):
        self.output = self.source / 'nested'
        self.rejected()

    def test_symlink_rejected(self):
        (self.source / 'linked').symlink_to(self.published, target_is_directory=True)
        self.rejected()

    def test_copy_failure_cleans_partial_staging(self):
        with patch.object(m.shutil, 'copyfile', side_effect=OSError('injected copy failure')):
            self.rejected()
        self.assertEqual(list(self.root.glob('prism-stage-*')), [])

if __name__ == '__main__':
    if BASE is None: raise SystemExit('Usage: python3 tools/test-prism-copy.py BASELINE_EXPORT')
    unittest.main()
