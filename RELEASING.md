# Shipping a new version

The site is static. Shipping = push to `main`. GitHub Pages deploys it in about a minute.
This checklist is what keeps that push from breaking the phone in the middle of the trip.

## 1. Make the change

| Change | File |
|---|---|
| Booking, plan idea, train, hotel | `trip-data.js` |
| Phrase | `phrases.js` |
| Behavior | `app.js` |
| Look | `styles.css` |
| Photo | `scripts/image_queries.json` (see step 6) |

Experiments (design, structure) go on a branch first. `main` is what the phone runs.

## 2. Check locally

```bash
node --check app.js trip-data.js phrases.js sw.js
python -m http.server 8000      # open http://localhost:8000
```

Test the **real site** (`index.html` from the local server), not only the claude.ai preview. The preview adds its own CSS reset and can hide bugs.

In the browser, at phone width:

- [ ] Itinerary loads, board flips, rail works, scroll changes the city
- [ ] **Preview a date** on a few days:
  - before the trip (today)
  - `2026-10-11` arrival with flights
  - `2026-10-15` Beijing, Palace Museum booked
  - `2026-10-29` long train day
  - `2026-11-04` departure
- [ ] Seal only appears on today's city
- [ ] Accommodation, Plan (photos + checkboxes) and Dictionary (search + audio) open
- [ ] Light and dark mode both readable
- [ ] No overlay or blank screen. If you see only "Play audio / Close", the `[hidden]` rule in `styles.css` is missing.

## 3. Service worker: bump or not?

`sw.js` is network-first, so normal edits reach phones without a bump.

Bump `CACHE` in `sw.js` (`china-trip-v2` → `v3`) **only** when:

- you add, rename or remove a top-level file (also update `SHELL`)
- you change `sw.js` logic
- you need every phone to throw away its cache

## 4. Commit and push

```bash
git add -A
git commit -m "Add Dongsi to Beijing"     # imperative subject, short body
git push origin main
```

**Never delete `CNAME`.** With branch deploys it holds the custom domain. Removing it sends `zhongguo.galle.to` to 404.

## 5. Verify live

1. GitHub → **Actions** → "pages build and deployment" turns green (about 1 min).
2. Open `https://zhongguo.galle.to/?v=<anything>` to skip the CDN cache and confirm the change.
3. On the phone, reload or reopen the home-screen app while online.

GitHub's CDN and the browser cache files for up to **10 minutes**. A plain reload can show the old version for that long. That's normal, not a failed deploy.

## 6. Photos (only if `scripts/image_queries.json` changed)

1. Push. The **Fetch city photos** workflow downloads the new photo and commits it to `img/` (about 1 min).
2. `git pull` to get that commit locally.
3. Look at the new photo. Commons search can return the wrong place. If it's wrong, change the query and push again.

## 7. Update the claude.ai preview (optional)

```bash
python scripts/preview.py      # writes .artifact.html (git-ignored)
```

Publish `.artifact.html` to the existing artifact. It only exists for previewing in Claude.

## Pages settings (one-time, for reference)

- Source: **Deploy from a branch → `main` / (root)**
- Custom domain: `zhongguo.galle.to` (DNS: `CNAME zhongguo → sirgalleto.github.io`)
- Enforce HTTPS: on

## When something looks wrong

| Symptom | Cause | Fix |
|---|---|---|
| 404 at `zhongguo.galle.to` | `CNAME` missing, or Pages source changed | Restore `CNAME`, check Pages settings |
| 404 only on the plain URL, `/?v=1` works | CDN cached an old 404 | Wait up to 10 min |
| README shown instead of the app | Pages source points to a folder without `index.html` | Source: `main` / (root) |
| Only "Play audio / Close" on a dark screen | Base reset missing, or old CSS cached | Check top of `styles.css`, wait for caches |
| Change not showing on the phone | Browser or CDN cache | Wait 10 min, or open with `?v=…` |
| Photos missing offline | App not opened online since the photos changed | Open once on Wi-Fi |
