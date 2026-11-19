# Dice Cards — Version 4 dev kit (not used by the game)

- `add/` — the V4 add-ons. The game = the V3 game (`base.html`) + these files, each in its own
  `<script id="v4_NN">` / `<style id="v4_NN">` before `</body>` (`build.py`).
- Get `base.html` back: take the artifact `index.html` and cut out the `v4_…` blocks at the end
  (or take the repo `index.html`, remove the app bits — see `sync.py` — then the `v4_…` blocks).
- `sync.py` — artifact `index.html` → repo `index.html` (adds manifest / service worker bits).
- `tests/` — headless Chrome + Playwright tests with a fake Firebase:
  `mockfb2.js` (one browser, sessionStorage) and `mockfb3.js` + `server.py` (two browsers sharing one store,
  `localhost` vs `127.0.0.1` on port 8766). `run.sh test.py` starts the server, runs, stops.
  `t4` friends/usernames, `t5` battle invites, `t8` full live match (compares both phones), `t9 ff|leave`.
  Paths inside assume `/home/claude/t/site` (served folder) and `/home/claude/v4`.
