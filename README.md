# 中国 · China Trip 2026

Offline-first phone app for the Oct 11 to Nov 4 China trip: scroll-journey itinerary, hotels, daily plan with photos, and a Mandarin phrasebook.

Live at **https://zhongguo.galle.to**

## Structure

```
src/                      the site (plain HTML, CSS, JS; no framework)
├── index.html
├── styles.css
├── trip-data.js          ← cities, hotels, trains, daily plan. Edit this for trip changes
├── phrases.js            ← dictionary phrases
├── app.js                rendering, animations, tabs
├── sw.js                 offline cache (version stamped at build)
├── manifest.webmanifest
├── icons/
└── img/                  city photos + credits.json (written by the photo workflow)
scripts/
├── build.py              src/ → dist/ (+ .artifact.html single-file preview)
├── fetch_images.py       downloads Wikimedia Commons photos into src/img/
└── image_queries.json    what photo to show per city
.github/workflows/
├── deploy.yml            builds and deploys to GitHub Pages on push to main
└── images.yml            refreshes photos when the queries change
```

`dist/` is a build output and is not committed.

## Common changes

| Change | File |
|---|---|
| Add a booking, mark something confirmed | `src/trip-data.js` (`status: 'confirmed'`, `ref`) |
| Add or remove a plan idea | `src/trip-data.js` → `PLAN` |
| Add a phrase | `src/phrases.js` |
| Swap a photo | `scripts/image_queries.json` (the workflow fetches it) |

## Local

```bash
python scripts/build.py
python -m http.server -d dist 8000   # http://localhost:8000
```

## Deploy

Push to `main`. The **Deploy to GitHub Pages** workflow builds `src/` and publishes `dist/`.

One-time settings: **Settings → Pages → Source: GitHub Actions**, custom domain `zhongguo.galle.to`, Enforce HTTPS. With Actions deploys, the domain lives in Settings and no `CNAME` file is needed.

## Photos

Freely licensed photos (CC0, public domain, CC BY, CC BY-SA) from Wikimedia Commons, credited in the app and in `src/img/credits.json`.

## Install on the phone

iPhone (Safari): Share → Add to Home Screen. Android (Chrome): menu → Install app. Open it once online so it caches for offline use.
