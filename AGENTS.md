# AGENTS.md

Instructions for AI agents (Claude, Codex, etc.) working on this repo.

## What this is

A static, offline-first phone app for Sebastian's China trip (Oct 11 to Nov 4, 2026), live at https://zhongguo.galle.to.
Plain HTML, CSS and JS. No framework, no bundler, no build step. GitHub Pages serves the repo root from `main`.

## How to work with the owner

- **A question is a question.** Answer it and wait. Only change code when asked to change something.
- Keep replies short and practical. No em dashes in copy or replies.
- Big or risky changes (structure, design direction, deploy setup): propose first, build after a yes.
- Design experiments go on a branch. `main` is what the phone runs.

## Layout

| Path | What it is | Edit when |
|---|---|---|
| `trip-data.js` | `CITIES`, `STAYS`, `TRANSIT`, `PLAN` | Bookings, plan ideas, trains, hotels |
| `phrases.js` | `DICT` for the Dictionary tab | Adding or fixing phrases |
| `app.js` | Rendering, tabs, animations, speech | Behavior changes |
| `styles.css` | Tokens and components | Visual changes |
| `index.html` | Shell, tab bar, script order | Rarely |
| `sw.js` | Offline cache | New top-level files (add to `SHELL`) |
| `img/` | City photos + `credits.json` | Never by hand, see Photos |
| `scripts/` | Photo fetcher, preview builder | Tooling only |

Scripts load in order `trip-data.js` → `phrases.js` → `app.js`. Data files only declare top-level `const`s; `app.js` reads them.

## Data conventions (`trip-data.js`)

- Dates are `YYYY-MM-DD` strings. The trip runs `2026-10-11` to `2026-11-04`.
- A `PLAN` item is either a string (an idea, no label) or an object:
  ```js
  {text:'Forbidden City', status:'confirmed', ref:'2026…', time:'09:00'}
  ```
  `status` is `'confirmed'` (green "Confirmed") or `'tobook'` (amber "To book"). `ref` renders as a tap-to-copy reference.
- `TRANSIT[date]` uses the same `{text, status, ref}` shape for travel days.
- Checkbox state is keyed by the item's text. Rewording an item resets its tick, which is fine.
- City keys: `sh bj xa cd cq sz gz`. Each has a color token `--c-<key>` in `styles.css`.
- Only add what the owner actually confirmed or asked for. Never invent bookings, refs or prices.
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

## Offline

`sw.js` is network-first with a cache fallback and pre-caches the shell plus every photo in `img/credits.json`. Edits show up on their own. Bump `CACHE` only to force a full re-download. Add any new top-level file to `SHELL`.

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
