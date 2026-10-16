# AGENTS.md

Instructions for AI agents (Claude, Codex, etc.) working on this repo.

## What this is

A static, offline-first phone app for Sebastian's China trip (Oct 11 to Nov 4, 2026), live at https://zhongguo.galle.to.
Plain HTML, CSS and JS. No framework, no bundler, no build step. GitHub Pages serves the repo root from `main`.

## How to work with the owner

- **A question is a question.** Answer it and wait. Only change code when asked to change something.
- Keep replies short and practical. No em dashes in copy or replies.
- Big or risky changes (structure, design direction, deploy setup): propose first, build after a yes.
- Design experiments go on a branch. `main` is what the phone runs. Delete the branch once it's merged or dropped: `main` should be the only branch.

## Attack every plan before giving it

Any recommendation (a place, a route, a day plan, a timing) goes through two passes, like a GAN: draft it, then attack it as a critic whose job is to make it fail. Fix what breaks, then present it. Never send the first draft.

Attack it on:

- **Wait and crowds**: famous or "must-try" places at peak times (lunch, 6:00 PM to 8:00 PM dinner, weekends, holidays) can mean 1 to 2 hour queues. Check for an online queue number (Dianping/Meituan 排队取号) or reservations.
- **Hours and closures**: today's opening hours, last order or last entry, weekly closing day, seasonal changes. A source from years ago is not confirmed.
- **Deadlines after it**: what comes next (gym closing, booking slot, train) and the real buffer, including the wait, the meal, and travel.
- **Getting there**: real travel time at that hour (rush hour DiDi, metro transfers, security lines at Tiananmen), and where he starts from (he may need to go back to the hotel first).
- **Fit for him**: late starts, specialty coffee after breakfast, eating alone (solo portions, one pot each), what he asked for and nothing extra.
- **Entry requirements**: tickets, passport, reservations, cash only, foreign cards.
- **Fallback**: for anything with a real risk, name a backup that avoids that risk, close by.

In the reply, lead with the option that survives the attack, not the most famous one. Add a short **Risks checked** line with what could still go wrong (for example "expect a 30 min wait after 6:00 PM").

## Looking things up: read the code, don't fetch the site

To find out what the app contains or how it behaves (a day's plan, a phrase, a hotel, a style), **read the files in this repo** (`git pull` first, then `trip-data.js`, `phrases.js`, `app.js`, `styles.css`). If you don't have a clone, read them from GitHub (`sirgalleto/zhongguo`, branch `main`).

Do **not** fetch `https://zhongguo.galle.to` to look things up. The live site sits behind a CDN and browser caches, so it can be up to 10 minutes stale, and it only shows the rendered result, not the source.

The only time to load the live site is the last step of shipping, to confirm a deploy went out (see [RELEASING.md](RELEASING.md) step 5).

## Layout

| Path | What it is | Edit when |
|---|---|---|
| `trip-data.js` | `CITIES`, `STAYS`, `TRANSIT`, `PLAN` | Bookings, confirmed plan, trains, hotels |
| `ideas.js` | `IDEAS`: suggestions and guides per day (the "Ideas nearby" sheet). `TOURS`: audio tours read aloud per day (the "Audio tour" sheet) | Anything not confirmed yet, tour scripts |
| `phrases.js` | `DICT` for the Dictionary tab | Adding or fixing phrases |
| `app.js` | Rendering, tabs, animations, speech | Behavior changes |
| `styles.css` | Tokens and components | Visual changes |
| `index.html` | Shell, tab bar, script order | Rarely |
| `sw.js` | Offline cache | New top-level files (add to `SHELL`) |
| `img/` | City photos + `credits.json` | Never by hand, see Photos |
| `scripts/` | Photo fetcher, preview builder | Tooling only |

Scripts load in order `trip-data.js` → `ideas.js` → `phrases.js` → `app.js`. Data files only declare top-level `const`s; `app.js` reads them.

## Data conventions (`trip-data.js`)

- Dates are `YYYY-MM-DD` strings. The trip runs `2026-10-11` to `2026-11-04`.
- **Times are always 12-hour with AM/PM** (`9:00 AM`, `12:00 PM`, `10:30 PM`), in `time` fields, text, tips and `ideas.js`. Never 24-hour. Same in chat replies.
- A `PLAN` item is an object with a heading `h` (the topic: Breakfast, Coffee, Highlight, Dinner…). Consecutive items with the same `h` render under one heading. No checkboxes.
  ```js
  {h:'Highlight', text:'Forbidden City', status:'confirmed', ref:'2026…', time:'9:00 AM', map:'故宫博物院'}
  ```
  `status` is `'confirmed'` (green "Confirmed") or `'tobook'` (amber "To book"). `ref` renders as a tap-to-copy reference.
  `name` and `ref` (place name, Chinese address) render as tap-to-copy chips. `tag` adds a neutral label such as `'If time'`.
  Never drop a stop the owner asked for to make a day fit; tag it `'If time'` instead.
  `map` is an Amap search keyword (Chinese works best, e.g. `'武康大楼'`) and renders an "Amap ↗" link scoped to that day's city.
- `TRANSIT[date]` uses the same `{text, status, ref}` shape for travel days.
- City keys: `sh bj xa cd cq sz gz`. Each has a color token `--c-<key>` in `styles.css`.
- **Only add what the owner confirmed to `PLAN`.** No suggestions, backups, "If time" extras, second options or alternative venues unless he picked them. Suggestions go in `ideas.js` (same item shape, grouped under `h`) or the chat; when he picks one, move it to `PLAN` and delete it from `IDEAS`. If he asked for a slot (breakfast, a gym) but hasn't picked the place, write the slot as "not picked yet". Never invent bookings, refs or prices.
- **Every place must be verified before it goes in.** Confirm the name and street address with a source (Ctrip, Dianping, Michelin, official news) and put the exact Chinese address in `ref` and the place name in `name` (Chinese if it has one). Both render as tap-to-copy chips with a toast. If you can't confirm an address, say so in the text instead of guessing a map keyword.
- **No money or booking numbers in the app or the repo**: no prices, totals, payment details or hotel booking numbers. The repo is public.

## Phrases (`phrases.js`)

Each entry is `[English, 汉字, pinyin with tone marks, optional spoken text]`. Use the 4th field when the characters would be read wrong aloud (phone numbers are spoken 幺幺零, not 一百一十).

## Design rules

- Minimal, futurist, Chinese: hairlines over cards, Geist / Geist Mono / Noto Sans SC, thin hanzi as hero.
- One accent at a time: `--accent` follows the city (today's city, or the one in view on the Itinerary).
- Status colors (`--ok`, `--warn`) never change per city.
- Every color is a token with light and dark values. Respect `prefers-reduced-motion`.
- Board flip speed: `FLIP_TICKS` and `FLIP_STAGGER` in `app.js`.
- The seal (今天) only shows and stamps on today's city.

## Photos

- `scripts/image_queries.json` holds one `{label, q}` per photo, 4 per city.
- The **Fetch city photos** workflow (`.github/workflows/images.yml`) downloads one CC0 / PD / CC BY / CC BY-SA photo per query from Wikimedia Commons into `img/`, writes credits, and commits. It runs on push when the queries or script change.
- To swap a photo, change its `q` and push, then check the result visually. Search matches can be wrong.
- Credits must stay visible in the app.

## Offline and updates

`sw.js` revalidates every same-origin request (`cache: 'no-cache'`), photos are cache-first, and the app reloads once when a new service worker takes over. Pushed changes appear on the next open; don't add `?v=` hacks. Bump `CACHE` only for new top-level files (add them to `SHELL`) or a forced reset.

## Shipping

Follow **[RELEASING.md](RELEASING.md)** for every change that goes to `main`: local checks, when to bump the service worker, push, and live verification.

## Check before pushing

```bash
node --check app.js trip-data.js phrases.js sw.js
python -m http.server 8000   # open http://localhost:8000, try Itinerary → "Preview a date"
```

The "Preview a date" control simulates any day of the trip (city, board, seal, status).

Always check the real site (`index.html` via the local server), not only the claude.ai preview. The preview wraps the page in its own reset, so it can hide missing base CSS like the `[hidden]` rule at the top of `styles.css`.

## Preview on claude.ai

`python scripts/preview.py` writes `.artifact.html`, the whole app in one file, for publishing as a claude.ai artifact. It is git-ignored and not used by the real site.

## Deploy

Push to `main`. Pages: **Deploy from a branch → `main` / (root)**, custom domain `zhongguo.galle.to`, Enforce HTTPS. `.nojekyll` keeps files served as-is. **Never delete `CNAME`**: with branch deploys it is what keeps the custom domain, and removing it takes `zhongguo.galle.to` offline.

## Commits

Imperative subject line ("Add Dongsi to Beijing"), short body listing what changed.
