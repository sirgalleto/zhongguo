# 中国 · China Trip 2026

Offline-first phone app for the Oct 11 to Nov 4 China trip: scroll-journey itinerary, hotels, daily plan with photos, and a Mandarin phrasebook.

Live at **https://zhongguo.galle.to**

## Structure

Plain static files, no build step. GitHub Pages serves the repo root as-is.

```
index.html
styles.css
trip-data.js          ← cities, hotels, trains, daily plan. Edit this for trip changes
phrases.js            ← dictionary phrases
app.js                rendering, animations, tabs
sw.js                 offline cache
manifest.webmanifest
icons/
img/                  city photos + credits.json (written by the photo workflow)
scripts/
├── fetch_images.py   downloads Wikimedia Commons photos into img/
├── image_queries.json  what photo to show per city
└── preview.py        single-file version for the claude.ai preview only
.github/workflows/images.yml   refreshes photos when the queries change
```

## Common changes

| Change | File |
|---|---|
| Add a booking, mark something confirmed | `trip-data.js` (`status: 'confirmed'`, `ref`) |
| Add or remove a plan idea | `trip-data.js` → `PLAN` |
| Add a phrase | `phrases.js` |
| Swap a photo | `scripts/image_queries.json` (the workflow fetches it) |

## Local

```bash
python -m http.server 8000   # http://localhost:8000
```

## Deploy

Push to `main`. Pages settings: **Deploy from a branch → `main` / `(root)`**, custom domain `zhongguo.galle.to`, Enforce HTTPS.
`.nojekyll` turns off Jekyll so files are served exactly as they are.

## Offline

`sw.js` caches the app and photos. It fetches fresh files when online and falls back to the cache offline, so normal edits show up on their own. Bump `CACHE` in `sw.js` to force every phone to re-download everything.

## Photos

Freely licensed photos (CC0, public domain, CC BY, CC BY-SA) from Wikimedia Commons, credited in the app and in `img/credits.json`. The `Fetch city photos` workflow is the only GitHub Action, and it exists because downloading needs a machine with internet access.

## Install on the phone

iPhone (Safari): Share → Add to Home Screen. Android (Chrome): menu → Install app. Open it once online so it caches for offline use.
