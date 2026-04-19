# Retrospective — wind-tweak-click-spawn

> Run: 2026-04-19T10:41:04.954Z · Overall health: 🟢 green

## What went well

- **Refinement was airtight.** All acceptance criteria were specific and testable; the developer had zero open questions going in.
- **TDD phase produced meaningful tests.** 18 failing tests across 2 files covered in-bounds spawn, out-of-bounds guard, multi-ball coexistence, and the precise new `WIND_AMPLITUDE` value — real red tests, not trivial stubs.
- **Single pass through every phase.** All 56 tests passed on the first developer submission; review approved immediately; demo passed all 6 scenarios on first run.
- **Architecture stayed clean.** `spawnBallOnClick` was exported as a pure, testable helper; `ball.js` required zero changes; no global state beyond what p5 requires.
- **Out-of-bounds guard verified end-to-end.** The bounds check was specified in the proposal, designed in the architecture, tested in TDD, checked at runtime, confirmed in review, and visually verified in demo — full traceability.

---

## Issues found

### Review: Stale JSDoc comment after constant change
**Severity:** low
**What happened:** `src/wind.js` contained a comment saying the scale factor "maps the maximum force (0.3) to a 30-px arrow". After `WIND_AMPLITUDE` was changed to `0.08` the arrow maximum is actually ±8 px, not 30 px. The reviewer flagged it as a warning.
**Root cause:** The developer updated the constant correctly but did not scan for prose that referenced the old numeric consequence of that constant. No automated check correlates comment values with their source constants.
**Improvement:** Add a custom Jest assertion (or ESLint `no-magic-numbers` + doc lint) that asserts key constants match any numbers mentioned in their JSDoc. Alternatively, add an explicit checklist task: *"Search for all comments that reference the changed value and update them."*

---

### Runtime: Sketch.js line coverage structurally capped at 20%
**Severity:** low
**What happened:** `sketch.js` achieved only 20% line coverage in Jest because `setup()`, `draw()`, and `mousePressed()` are p5.js lifecycle callbacks that cannot execute in a Node environment.
**Root cause:** This is a structural limitation of p5.js in a Jest/Node context — not an oversight. The browser-only draw loop cannot be meaningfully unit-tested without a full p5 mock.
**Improvement:** Document the known coverage ceiling explicitly in the test plan (e.g. *"sketch.js browser-only lines are excluded from unit coverage by design; target is ≥ 80% on extracted pure helpers"*). Continue extracting side-effect-free logic (as `spawnBallOnClick` was) so the uncoverable surface shrinks over time.

---

### Status Tracking: Loop counters not initialised for all phases
**Severity:** low
**What happened:** `wiggum/status.json` only recorded `dev_demo: 0`; the `dev_tdd`, `dev_runtime`, and `dev_review` keys were absent entirely.
**Root cause:** Loop counters appear to be written lazily — a phase that completes on the first attempt never increments its counter, so the key is never created.
**Improvement:** Initialise all loop counters to `0` in the status.json scaffold at pipeline start so the retrospective always has a complete, comparable record regardless of whether any loops occurred.

---

## Loop summary

| Phase | Iterations | Target |
|---|---|---|
| Developer ↔ TDD | 0 | ≤ 1 |
| Developer ↔ Runtime | 0 | ≤ 1 |
| Developer ↔ Review | 0 | ≤ 1 |
| Developer ↔ Demo | 0 | ≤ 1 |

> ℹ️ `dev_tdd`, `dev_runtime`, and `dev_review` were not present in `status.json` (see issue above); all are recorded here as 0 based on the phase result data.

---

## Top recommendation

> Add an automated check — a custom Jest assertion or ESLint rule — that catches stale numeric references in JSDoc/comments when a constant changes. The only issue found in this entire run was a stale comment that slipped past the developer; catching it automatically would make future runs fully issue-free.
