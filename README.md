# China Trip 2026

Phone app for the Oct 11 to Nov 4 China trip: itinerary, accommodation, daily plan, and pinyin phrases. Works offline once installed.

## Structure
- `app.html` is the single source. All trip data lives in the `TRIP DATA` block at the top of its script.
- `build.py` wraps it into `docs/` (index.html, manifest, service worker, icons) and bumps the cache version.
- `docs/` is what GitHub Pages serves.

## Update
1. Edit `app.html`
2. `python3 build.py`
3. Commit and push

## Deploy
Settings > Pages > Deploy from branch > `main` / `docs`.

## Install
- iPhone (Safari): Share > Add to Home Screen
- Android (Chrome): menu > Install app

Open it once online after installing so it caches for offline use.
