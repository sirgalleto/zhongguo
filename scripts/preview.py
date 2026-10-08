"""Inline the site into one file for the claude.ai preview (not needed for the real site).

    python scripts/preview.py   →  .artifact.html

The real site needs no build: GitHub Pages serves the repo root as-is.
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text()
title = re.search(r"<title>.*?</title>", html).group(0)
fonts = re.search(r'<link rel="stylesheet" href="https://fonts[^"]+">', html).group(0)
body = re.search(r"<body>\n?(.*)</body>", html, re.S).group(1)
body = re.sub(r'<script src="([^"]+)"></script>',
              lambda m: "<script>\n" + (ROOT / m.group(1)).read_text() + "</script>", body)
css = (ROOT / "styles.css").read_text()
(ROOT / ".artifact.html").write_text(f"{title}\n{fonts}\n<style>\n{css}</style>\n{body}")
print("wrote .artifact.html")
