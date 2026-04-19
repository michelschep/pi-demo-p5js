/**
 * TDD tests: CDN configuration
 *
 * Covers:
 *  - index.html loads p5 from the pinned CDN URL (not node_modules)
 *  - index.html does NOT reference the node_modules path for p5
 *  - package.json does NOT list "p5" as a dependency
 *
 * Expected CDN URL (exact, version-pinned):
 *   https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js
 *
 * These tests FAIL until the implementation tasks are completed:
 *   Task 1.1 – replace <script src> in index.html with the CDN URL
 *   Task 2.1 – remove "p5" from package.json dependencies
 *   Task 2.2 – run `npm install` so node_modules reflects the change
 */

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths resolved relative to the project root (one level up from __tests__)
// ---------------------------------------------------------------------------
const ROOT         = path.resolve(__dirname, '..');
const INDEX_HTML   = path.join(ROOT, 'index.html');
const PACKAGE_JSON = path.join(ROOT, 'package.json');

const CDN_URL          = 'https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js';
const NODE_MODULES_P5  = 'node_modules/p5';

// ---------------------------------------------------------------------------
// index.html — CDN URL present
// ---------------------------------------------------------------------------
describe('index.html – CDN script source', () => {
  let htmlContent;

  beforeAll(() => {
    htmlContent = fs.readFileSync(INDEX_HTML, 'utf8');
  });

  test('contains the pinned CDN URL for p5@1.11.3', () => {
    // Arrange – htmlContent loaded above
    // Assert
    expect(htmlContent).toContain(CDN_URL);
  });

  test('does NOT reference node_modules/p5 as the script source', () => {
    // Arrange – htmlContent loaded above
    // Assert
    expect(htmlContent).not.toContain(NODE_MODULES_P5);
  });

  test('CDN <script> tag is well-formed', () => {
    // The tag must be a proper script element pointing at the CDN URL
    const scriptTagRegex = new RegExp(
      `<script[^>]+src=["']${CDN_URL.replace(/\./g, '\\.').replace(/\//g, '\\/')}["'][^>]*>`
    );
    expect(htmlContent).toMatch(scriptTagRegex);
  });
});

// ---------------------------------------------------------------------------
// package.json — p5 removed from dependencies
// ---------------------------------------------------------------------------
describe('package.json – p5 dependency removed', () => {
  let pkg;

  beforeAll(() => {
    const raw = fs.readFileSync(PACKAGE_JSON, 'utf8');
    pkg = JSON.parse(raw);
  });

  test('dependencies object does NOT contain a "p5" key', () => {
    // Arrange – pkg loaded above
    const deps = pkg.dependencies || {};
    // Assert
    expect(deps).not.toHaveProperty('p5');
  });

  test('devDependencies object does NOT contain a "p5" key', () => {
    // p5 should not be shifted to devDependencies either — it is CDN-only
    const devDeps = pkg.devDependencies || {};
    expect(devDeps).not.toHaveProperty('p5');
  });
});
