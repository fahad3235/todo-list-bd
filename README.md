# To-Do List BD

Offline bilingual EN/Bangla to-do list for everyday life. Add tasks with a priority, category, and due date; tick them off; see what's overdue at a glance. Everything stays in your browser  -  no account, no server, no network requests.

## Features

- **Task CRUD**  -  title (required, max 100 chars), optional note (max 500), priority (High / Medium / Low), category (max 30), due date. Inline validation errors; edit any task in place; delete with confirmation.
- **Status engine**  -  each task is Done, Overdue (due before today, not done), Due today, or Pending. Done tasks keep their completion date.
- **Dashboard**  -  total, completed, pending, overdue, due-today counts plus an overall completion percentage.
- **Filter, search & sort**  -  status chips (All / Pending / Done / Overdue / Due today), priority and category dropdowns, Bengali-safe text search, sort by due date / priority / newest.
- **Data portability**  -  JSON export, strict JSON import (wrong app, wrong version, duplicate ids, or invalid tasks are rejected with your data left untouched), erase-all guarded by typing `DELETE`.
- **Bilingual UI**  -  EN/Bangla toggle, persisted across visits; numbers render in Bengali digits in Bangla mode.
- **Fully offline**  -  localStorage persistence; zero network requests by design; responsive down to 390px.

## Stack

Vanilla HTML / CSS / JavaScript. No build step, no dependencies, no framework.

- `index.html`  -  markup
- `css/style.css`  -  styles
- `js/logic.js`  -  pure, DOM-free task logic (also `require()`-able in Node for tests)
- `js/app.js`  -  DOM wiring + i18n (Bengali strings as `\uXXXX` escapes; sources stay pure ASCII)
- `tests/logic.test.js`  -  Node unit tests
- `tests/smoke.js`  -  headless-Chrome smoke tests via raw CDP (no dependencies)

## Prerequisites

Any modern browser. For tests: Node.js 18+ and Chromium at `/opt/meta-chromium/chrome` (smoke test only; the app itself runs from any static host or `file://`).

## Run

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
# or
python3 -m http.server 8000
```

Tip for deterministic testing: append `?asof=YYYY-MM-DD` to force "today" (used by the smoke test).

## Testing

```sh
node tests/logic.test.js        # 46 unit checks
node tests/smoke.js desktop    # 27 headless-Chrome checks
node tests/smoke.js mobile     # 28 checks at 390px
```

See [TEST_RESULTS.md](TEST_RESULTS.md) for the verified numbers and hand-checked cases.

## Deployment

Static site. Copy the folder to any host (GitHub Pages, Netlify, etc.). No server code, no environment variables, no secrets.

## Limitations

- Data lives in one browser's localStorage  -  no sync across devices, and clearing site data deletes tasks (export regularly).
- No reminders/notifications  -  this is a list, not an alarm.
- No recurring tasks, subtasks, or sharing.
- Due-date logic uses the device's local calendar date.

## Status

Complete MVP. See [TEST_RESULTS.md](TEST_RESULTS.md).
