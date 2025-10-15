import re
from pathlib import Path

src = Path('css/styles.css')
out = Path('css/compressed/styles.min.css')

css = src.read_text(encoding='utf-8')
# remove comments
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
# collapse whitespace
css = re.sub(r'\s+', ' ', css)
# remove spaces around symbols
css = re.sub(r'\s*([{};:,])\s*', r'\1', css)
# trim
css = css.strip()
# ensure newline at end
out.write_text(css + '\n', encoding='utf-8')
print(f'Minified {src} -> {out} (size {len(css)} bytes)')
