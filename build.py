"""Build the offline PWA from app.html (the single source of truth).

app.html  → published as the claude.ai artifact as-is
          → wrapped into docs/index.html with manifest + service worker
The service worker cache name is derived from the content hash, so every
build forces installed phones to pick up the new version.
"""
import hashlib, pathlib, re, zipfile

root = pathlib.Path(__file__).parent
body = (root / "app.html").read_text()
version = hashlib.sha1(body.encode()).hexdigest()[:8]

head = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#15233A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="China Trip">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}[hidden]{display:none!important}img{max-width:100%}</style>
</head>
<body>
"""
pwa = root / "docs"
(pwa / "index.html").write_text(head + body + "\n</body>\n</html>\n")

sw = (pwa / "sw.js").read_text()
sw = re.sub(r"const CACHE='china-trip-[^']*';", f"const CACHE='china-trip-{version}';", sw)
(pwa / "sw.js").write_text(sw)

with zipfile.ZipFile(root / "china-trip-pwa.zip", "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(pwa.iterdir()):
        z.write(f, f.name)
print("built", version)
