## Why

When GitHub Pages deploys the project, `node_modules/` is not included — so the current `<script src="node_modules/p5/lib/p5.min.js">` reference in `index.html` causes a 404 and the sketch never runs. Switching to the publicly hosted p5.js CDN URL fixes the deployment without requiring any build step.

## What Changes

- Replace `<script src="node_modules/p5/lib/p5.min.js">` in `index.html` with the CDN URL for p5.js (matching the version already declared in `package.json`: `1.11.3`).
- Remove `p5` from `dependencies` in `package.json` (runtime dependency is no longer needed; p5 is provided by CDN at runtime).

## Capabilities

### New Capabilities

- `cdn-p5js-loading`: The HTML page loads p5.js from the jsDelivr CDN (`https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js`) instead of the local `node_modules` path.

### Modified Capabilities

<!-- None — no existing spec files exist yet. -->

## Impact

- `index.html`: script tag for p5.js changes from local path to CDN URL.
- `package.json`: `p5` removed from `dependencies`; `npm install` no longer installs it.
- No code changes to `src/` files — they are unaffected.
- Local development still works (browser fetches from CDN on every run).
- Tests are unaffected (Jest mocks p5; does not load `node_modules/p5`).
