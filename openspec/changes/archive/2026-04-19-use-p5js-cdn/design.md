## Context

The project is a vanilla p5.js sketch served as static files. It has no build pipeline — the browser loads scripts directly via `<script>` tags. Currently `index.html` references `node_modules/p5/lib/p5.min.js`, which only exists locally after `npm install`. GitHub Pages serves the repo contents but does not include `node_modules/`, making the sketch broken on every deployment.

The fix is a one-line HTML change: point the script tag to the jsDelivr CDN URL for the same p5.js version (`1.11.3`) already declared in `package.json`.

## Goals / Non-Goals

**Goals:**
- The deployed GitHub Pages site loads p5.js correctly without a build step.
- Local development continues to work (CDN is reachable in any browser).
- The change is minimal and reversible.

**Non-Goals:**
- Introducing a bundler (Vite, Webpack, Parcel) — out of scope.
- Upgrading the p5.js version — keep `1.11.3` to avoid regressions.
- Changing how `src/` files are loaded — they remain as `<script>` tags.

## Decisions

### CDN provider: jsDelivr

**Decision**: Use `https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js`

**Rationale**: jsDelivr is a free, widely-used, SRI-friendly CDN that mirrors npm packages automatically. The URL structure pins the exact version, so there are no surprise updates. Alternative — cdnjs — requires manual version registration and is slightly less reliable for new patch releases. The official p5js.org docs also reference jsDelivr as the recommended CDN.

### Remove `p5` from `package.json` dependencies

**Decision**: Delete the `"p5": "^1.11.3"` entry from `dependencies`.

**Rationale**: With CDN loading, the runtime no longer uses the local npm package. Keeping it would mislead contributors into thinking the local copy is used and would unnecessarily inflate `npm install` time. Jest tests already mock p5 and do not depend on the real package.

## Risks / Trade-offs

- **[Risk] CDN unavailability** → The sketch won't load if jsDelivr is down. Mitigation: This is acceptable for a demo project; no SLA is required. A fallback `<script>` tag pointing to `node_modules` could be added locally for offline dev if needed.
- **[Risk] Version drift** → Pinned to `1.11.3` in the URL, so no accidental upgrades. When upgrading p5, both the URL and (optional) `package.json` devDependency must be updated together.

## Migration Plan

1. Update `index.html`: replace the `node_modules` script tag with the CDN URL.
2. Remove `p5` from `dependencies` in `package.json` (and run `npm install` to update `package-lock.json`).
3. Test locally by opening the page in a browser.
4. Commit and push — GitHub Pages deployment will use the CDN automatically.

**Rollback**: Revert the two file changes; re-add `"p5": "^1.11.3"` to `package.json`.
