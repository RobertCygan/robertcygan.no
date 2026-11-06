"""Create a portable static website ZIP; exclude Git, tests, uploads and development files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('output', type=Path, help='ZIP path outside the repository')
args = parser.parse_args()
output = args.output.resolve()
if output.is_relative_to(ROOT):
    parser.error('Write the ZIP outside the repository to avoid packaging it recursively.')

extensions = {'.html', '.css', '.js', '.pdf', '.png', '.webp', '.svg', '.apk', '.ico'}
files = [p for p in ROOT.iterdir() if p.is_file() and p.suffix in extensions]
for folder in ('assets', 'downloads'):
    files.extend(p for p in (ROOT / folder).rglob('*') if p.is_file())
for path in files:
    if path.is_symlink() or not path.resolve().is_relative_to(ROOT):
        raise ValueError(f'Refusing to package a symlink or external path: {path}')
output.parent.mkdir(parents=True, exist_ok=True)
with ZipFile(output, 'w', compression=ZIP_DEFLATED, compresslevel=6) as archive:
    for path in sorted(files):
        archive.write(path, path.relative_to(ROOT))
with ZipFile(output) as archive:
    assert archive.testzip() is None
    assert 'index.html' in archive.namelist()
    assert 'downloads/InvoiceFlowAI.exe' in archive.namelist()
    assert not any(name.startswith(('.git/', 'tests/', 'attachments/')) for name in archive.namelist())
print(f'{len(files)} files: {output} ({output.stat().st_size / 1024**2:.1f} MiB)')
