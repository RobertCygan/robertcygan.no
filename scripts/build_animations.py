"""Package only animations/ as a downloadable ZIP, without the rest of the website."""
import argparse
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
source = ROOT / 'animations'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('output', nargs='?', type=Path, default=ROOT / 'downloads/animacje-projektow.zip')
output = parser.parse_args().output.resolve()
if output.is_relative_to(source):
    parser.error('Write the archive outside animations/ to avoid including it in itself.')

files = sorted(p for p in source.rglob('*') if p.is_file())
for path in files:
    if path.is_symlink() or not path.resolve().is_relative_to(source):
        raise ValueError(f'Refusing to package a symlink or external file: {path}')
output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(output, 'w', compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for path in files:
        archive.write(path, path.relative_to(ROOT))
with ZipFile(output) as archive:
    assert archive.testzip() is None
    assert set(archive.namelist()) == {p.relative_to(ROOT).as_posix() for p in files}
    for path in files:
        assert archive.read(path.relative_to(ROOT).as_posix()) == path.read_bytes()
print(f'{output}: {len(files)} files, {output.stat().st_size / 1024**2:.2f} MiB')
