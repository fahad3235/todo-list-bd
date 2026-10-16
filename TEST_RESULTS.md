# TEST_RESULTS.md  -  todo-list-bd

Run date: 2026-10-16 (Asia/Dhaka). "Today" forced to 2026-10-16 via `?asof=` in smoke tests.

## Node unit tests  -  46/46 passed

`node tests/logic.test.js`  -  validation (empty/101-char title, 501-char note, bad priority, 2026-02-30 rejected, 2028-02-29 accepted, 31-char category), status engine (done / overdue / due-today / pending / done-never-overdue), toggleDone set/clear, filters (overdue, due-today, done, priority, category, case-insensitive search incl. note search), sorts (due: overdue->today->future->no-due; priority: high->high->medium->low; created), stats (total 4, done 1, pending 3, overdue 1, due-today 1, done-today 1, 25%; empty -> 0%), categories (sorted unique), import validation (wrong app/version, tasks-not-array, duplicate id, bad title, bad done type, bad doneDate), Bengali digits (2026-10-16 renders in Bengali digits; 25 renders as Bengali 25).

## Headless-Chrome smoke  -  desktop 27/27, mobile 28/28 (390px), 0 console/page errors

`node tests/smoke.js desktop|mobile` (raw CDP, `/opt/meta-chromium/chrome`).

Hand-verified flows: add task (Buy notebooks, high, Study, due 2026-10-16) -> total 1, due-today 1, row shows title + High; empty-title submit -> inline "Title is required", no row added; add overdue (Pay mess bill, due 2026-10-15) + no-due (Read book) -> total 3, overdue 1, completion 0%; overdue filter shows only the mess bill; toggle done -> done 1, completion 33% (1/3); search "mess" narrows to 1; edit "Read book" -> "Read novel"; BN toggle -> Bengali title + total "3" in Bengali digits; export state in localStorage -> wipe -> total 0 -> import round-trip restores 3; malformed import rejected, data intact at 3; 390px no horizontal overflow; zero network requests (file:// document load + the browser's built-in date-input data: icon excluded).

## Repairs

- 2 test-harness fixes only: `window.__saved` did not survive `location.reload()` (stash export in localStorage instead); `--window-size` is ignored by headless Chrome  -  390px now forced via `Emulation.setDeviceMetricsOverride` (matches the weight-tracker-bd harness); network check now excludes the `file://` document load and the UA's `data:` date-picker icon.
- 0 app-logic bugs.

## Source hygiene

All sources pure ASCII  -  Bengali emitted as `\uXXXX` escapes in JS and numeric entities in HTML (`grep -P '[^\x00-\x7F]'` zero matches). This keeps the ASCII-safe push path intact.
