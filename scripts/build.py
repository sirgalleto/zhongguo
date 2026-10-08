"""Build the site from src/.

    python scripts/build.py

dist/            what GitHub Pages deploys (src/ copied as-is, service worker
                 cache name stamped with a content hash so phones update)
.artifact.html   the same app inlined into one file, for the claude.ai preview
"""
import hashlib, pathlib, re, shutil

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC, DIST = ROOT / "src", ROOT / "dist"

# 1. Version = hash of every source file
h = hashlib.sha1()
for f in sorted(p for p in SRC.rglob("*") if p.is_file()):
    h.update(f.relative_to(SRC).as_posix().encode()); h.update(f.read_bytes())
version = h.hexdigest()[:8]

# 2. dist/
shutil.rmtree(DIST, ignore_errors=True)
shutil.copytree(SRC, DIST)
sw = DIST / "sw.js"
sw.write_text(sw.read_text().replace("__VERSION__", version))

# 3. Single-file preview: inline css + scripts, body only (the viewer adds the page skeleton)
html = (SRC / "index.html").read_text()
title = re.search(r"<title>.*?</title>", html).group(0)
fonts = re.search(r'<link rel="stylesheet" href="https://fonts[^"]+">', html).group(0)
body = re.search(r"<body>\n?(.*)</body>", html, re.S).group(1)
body = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: "<script>\n" + (SRC / m.group(1)).read_text() + "</script>", body)
css = (SRC / "styles.css").read_text()
(ROOT / ".artifact.html").write_text(f"{title}\n{fonts}\n<style>\n{css}</style>\n{body}")

print("built", version)
