"""Download one freely licensed Wikimedia Commons photo per query into docs/img/.

Runs in GitHub Actions (see .github/workflows/images.yml), so the photos are
self-hosted on the site and keep working offline and inside mainland China.

- Queries live in scripts/image_queries.json, grouped by city key.
- Only CC0, public domain, CC BY and CC BY-SA files are used.
- Writes docs/img/credits.json with author, license and source page per photo.
- Existing photos are kept; delete a file (or its credits entry) to refetch it.
"""
import io, json, pathlib, re, sys, time, urllib.parse, urllib.request
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "img"
API = "https://commons.wikimedia.org/w/api.php"
UA = "zhongguo-trip-pwa/1.0 (https://github.com/sirgalleto/zhongguo)"
OK_LICENSE = re.compile(r"^(cc0|public domain|pd|cc by(-sa)?( \d\.\d)?)", re.I)


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def strip_html(s):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", s or "")).strip()


def search(q, quality):
    term = f"{q} filetype:bitmap" + (" incategory:Quality_images" if quality else "")
    params = {
        "action": "query", "format": "json", "generator": "search",
        "gsrnamespace": 6, "gsrlimit": 15, "gsrsearch": term,
        "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1200,
    }
    data = json.loads(get(API + "?" + urllib.parse.urlencode(params)))
    pages = sorted(data.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    for p in pages:
        ii = (p.get("imageinfo") or [{}])[0]
        meta = ii.get("extmetadata", {})
        lic = meta.get("LicenseShortName", {}).get("value", "")
        if not OK_LICENSE.match(lic.strip()):
            continue
        w, h = ii.get("width", 0), ii.get("height", 0)
        if w < 1000 or w < h:  # landscape, big enough
            continue
        yield {
            "title": p["title"],
            "thumb": ii.get("thumburl") or ii.get("url"),
            "page": ii.get("descriptionurl"),
            "author": strip_html(meta.get("Artist", {}).get("value", "")) or "Unknown",
            "license": lic.strip(),
            "license_url": meta.get("LicenseUrl", {}).get("value", ""),
        }


def main():
    queries = json.loads((ROOT / "scripts" / "image_queries.json").read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    credits_path = OUT / "credits.json"
    old = {c["file"]: c for c in json.loads(credits_path.read_text())} if credits_path.exists() else {}
    credits, used = [], set()
    for city, items in queries.items():
        for n, item in enumerate(items, 1):
            name = f"{city}-{n}.jpg"
            if name in old and (OUT / name).exists() and old[name].get("q") == item["q"]:
                credits.append(old[name]); used.add(old[name]["title"]); continue
            pick = None
            for quality in (True, False):
                for cand in search(item["q"], quality):
                    if cand["title"] not in used:
                        pick = cand; break
                if pick: break
                time.sleep(1)
            if not pick:
                print(f"skip {name}: nothing usable for {item['q']!r}", file=sys.stderr); continue
            img = Image.open(io.BytesIO(get(pick["thumb"]))).convert("RGB")
            img.thumbnail((1000, 1000))
            img.save(OUT / name, "JPEG", quality=78, optimize=True, progressive=True)
            used.add(pick["title"])
            credits.append({"city": city, "file": name, "label": item["label"], "q": item["q"],
                            **{k: pick[k] for k in ("title", "page", "author", "license", "license_url")}})
            print(f"ok   {name}: {pick['title']} ({pick['license']})")
            time.sleep(1)
    credits_path.write_text(json.dumps(credits, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
