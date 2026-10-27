"""Inline every asset referenced by index.html into a single self-contained HTML file."""
import base64, mimetypes, pathlib, re

root = pathlib.Path(__file__).parent
html = (root / 'index.html').read_text()

def data_uri(rel):
    path = root / rel
    mime = mimetypes.guess_type(path.name)[0] or ('font/woff2' if path.suffix == '.woff2' else 'application/octet-stream')
    return f'data:{mime};base64,' + base64.b64encode(path.read_bytes()).decode()

out = re.sub(r'assets/[\w./-]+\.(?:png|jpg|woff2)', lambda m: data_uri(m.group(0)), html)
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist' / 'the-original-tour-prototype.html').write_text(out)
print('wrote dist/the-original-tour-prototype.html', len(out) // 1024, 'KB')
