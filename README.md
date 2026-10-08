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

## City photos
- `scripts/image_queries.json` lists what to show per city (label + Commons search).
- The `Fetch city photos` GitHub Action downloads one CC0 / PD / CC BY / CC BY-SA photo per query
  from Wikimedia Commons into `docs/img/`, with credits in `docs/img/credits.json`.
- It runs on any push that changes those files, or manually from the Actions tab.
- To swap a photo: change its query, or delete the jpg and its credits entry, then push.

## Deploy
Live at https://zhongguo.galle.to

- Settings > Pages > Deploy from branch > `main` / `docs`
- Custom domain comes from `docs/CNAME` (`zhongguo.galle.to`)
- DNS: `CNAME zhongguo → sirgalleto.github.io`
- Tick "Enforce HTTPS" once the certificate is issued (needed for the service worker)

## Install
- iPhone (Safari): Share > Add to Home Screen
- Android (Chrome): menu > Install app

Open it once online after installing so it caches for offline use.
