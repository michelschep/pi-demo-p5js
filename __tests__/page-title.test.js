/**
 * TDD tests: Rode paginatitel bovenaan de pagina
 *
 * Spec: openspec/changes/add-page-title/specs/page-title/spec.md
 *
 * Covers:
 *  - index.html has an <h1> element with exact text "Stuiteren!"
 *  - The <h1> is styled with color: red (via a <style> block)
 *  - The <h1> appears before the p5.js canvas in the document (i.e. before
 *    the <script> tag that loads p5.js, which creates the canvas at runtime)
 */

const fs = require('fs');
const path = require('path');

// Read index.html once for all tests
const htmlPath = path.join(__dirname, '..', 'index.html');
let html;
beforeAll(() => {
  html = fs.readFileSync(htmlPath, 'utf-8');
});

// ---------------------------------------------------------------------------
// Scenario: Titel zichtbaar bij laden
// ---------------------------------------------------------------------------
describe('Page title – <h1> element present', () => {
  test('index.html contains an <h1> element', () => {
    // Assert
    expect(html).toMatch(/<h1[\s>]/i);
  });

  test('<h1> element has exact text "Stuiteren!"', () => {
    // Assert – matches <h1>Stuiteren!</h1> (with optional whitespace)
    expect(html).toMatch(/<h1[^>]*>\s*Stuiteren!\s*<\/h1>/i);
  });

  test('<h1> is styled with color red', () => {
    // The style block must declare color: red for h1
    // Accepts both `h1 { color: red; }` and variations like `color:red`
    expect(html).toMatch(/h1\s*\{[^}]*color\s*:\s*red/i);
  });
});

// ---------------------------------------------------------------------------
// Scenario: Titel staat boven het canvas
// ---------------------------------------------------------------------------
describe('Page title – <h1> appears before the p5.js canvas', () => {
  test('<h1> appears before the p5.js <script> tag in the document', () => {
    // The p5.js script creates the canvas at runtime, so we verify
    // that the <h1> element is positioned before the p5 script tag
    // in the static HTML source.
    const h1Index = html.search(/<h1[\s>]/i);
    const p5ScriptIndex = html.indexOf('p5');

    // Both must be present
    expect(h1Index).toBeGreaterThanOrEqual(0);
    expect(p5ScriptIndex).toBeGreaterThanOrEqual(0);

    // h1 must come first
    expect(h1Index).toBeLessThan(p5ScriptIndex);
  });

  test('<h1> is a direct child of <body> (not buried inside a container)', () => {
    // Simplistic check: after <body>, the first meaningful tag is <h1>
    const bodyIndex = html.search(/<body[^>]*>/i);
    const afterBody = html.slice(bodyIndex);

    // Strip the opening <body...> tag itself, then look for the first element tag
    const insideBody = afterBody.replace(/^<body[^>]*>/i, '').trimStart();
    expect(insideBody).toMatch(/^<h1[\s>]/i);
  });
});
