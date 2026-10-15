# 中国 · China Trip 2026

Offline-first phone app for the Oct 11 to Nov 4 China trip: scroll-journey itinerary, hotels, daily plan with photos, and a Mandarin phrasebook.

Live at **https://zhongguo.galle.to**

## Structure

Plain static files, no build step. GitHub Pages serves the repo root as-is.

```
index.html
styles.css
trip-data.js          ← cities, hotels, trains, confirmed daily plan. Edit this for trip changes
ideas.js              ← suggestions and guides per day (Ideas nearby sheet), not the plan
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
| Add or remove a confirmed stop | `trip-data.js` → `PLAN` (with a heading `h`) |
| Add a suggestion or guide | `ideas.js` → `IDEAS` |
| Add a phrase | `phrases.js` |
| Swap a photo | `scripts/image_queries.json` (the workflow fetches it) |

## Local

```bash
python -m http.server 8000   # http://localhost:8000
```

## Shipping a new version

See **[RELEASING.md](RELEASING.md)**.

## Deploy

Push to `main`. Pages settings: **Deploy from a branch → `main` / `(root)`**, custom domain `zhongguo.galle.to`, Enforce HTTPS.
`.nojekyll` turns off Jekyll so files are served exactly as they are. `CNAME` holds the custom domain: do not delete it, or Pages drops `zhongguo.galle.to`.

## Offline and updates

`sw.js` caches the app and photos for offline use. Every request revalidates with the server (`cache: 'no-cache'`, a cheap 304 when nothing changed), the service worker is registered with `updateViaCache: 'none'`, checks for updates whenever the app is reopened, and reloads once when a new version takes over. So a push shows up the next time the app is opened, without waiting out GitHub Pages' 10-minute cache. Bump `CACHE` only to force a full re-download.

## Saved on the phone

`localStorage` keeps: the open tab (`cn-tab`), the Plan city filter (`cn-plan-filter`), the Dictionary search (`cn-dict-q`) and the day the seal last stamped (`cn-stamp-day`).

## Photos

Freely licensed photos (CC0, public domain, CC BY, CC BY-SA) from Wikimedia Commons, credited in the app and in `img/credits.json`. The `Fetch city photos` workflow is the only GitHub Action, and it exists because downloading needs a machine with internet access.

## Install on the phone

iPhone (Safari): Share → Add to Home Screen. Android (Chrome): menu → Install app. Open it once online so it caches for offline use.
