/**
 * TDD tests: Comic Sans font-family op de h1-titel
 *
 * Spec: openspec/changes/title-comic-sans
 *
 * Covers:
 *  - Task 1.1: h1-stijl bevat font-family: "Comic Sans MS", "Comic Sans", cursive
 *  - Task 2.1: de titel "Stuiteren!" wordt in Comic Sans weergegeven
 *              (font-family stack aanwezig in de inline stijl voor h1)
 *  - Task 2.2: de rode kleur blijft behouden naast de nieuwe font-family
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
// Task 1.1 – font-family toegevoegd aan h1-stijl
// ---------------------------------------------------------------------------
describe('Comic Sans – font-family in h1 style (task 1.1)', () => {
  test('h1 style block contains "Comic Sans MS"', () => {
    // The style rule for h1 must include "Comic Sans MS"
    // Matches: h1 { ... font-family: "Comic Sans MS" ... }
    expect(html).toMatch(/h1\s*\{[^}]*font-family\s*:[^}]*Comic Sans MS/i);
  });

  test('h1 style block contains "Comic Sans" as fallback', () => {
    // The font-family stack must include plain "Comic Sans" as second option
    // e.g. font-family: "Comic Sans MS", "Comic Sans", cursive
    expect(html).toMatch(/h1\s*\{[^}]*font-family\s*:[^}]*Comic Sans MS[^}]*,\s*["']?Comic Sans["']?/i);
  });

  test('h1 style block contains cursive as final fallback', () => {
    // The font-family stack must end with the generic cursive family
    expect(html).toMatch(/h1\s*\{[^}]*font-family\s*:[^}]*cursive/i);
  });

  test('h1 font-family uses the exact prescribed stack', () => {
    // Full stack: "Comic Sans MS", "Comic Sans", cursive  (order matters)
    expect(html).toMatch(
      /h1\s*\{[^}]*font-family\s*:\s*["']Comic Sans MS["']\s*,\s*["']Comic Sans["']\s*,\s*cursive/i
    );
  });
});

// ---------------------------------------------------------------------------
// Task 2.1 – titel "Stuiteren!" wordt in Comic Sans weergegeven
// ---------------------------------------------------------------------------
describe('Comic Sans – titel "Stuiteren!" krijgt Comic Sans (task 2.1)', () => {
  test('index.html h1 text is "Stuiteren!"', () => {
    // The h1 element must still contain the exact title text
    expect(html).toMatch(/<h1[^>]*>\s*Stuiteren!\s*<\/h1>/i);
  });

  test('font-family is declared inside a <style> block (not inline)', () => {
    // The Comic Sans font-family must be in a <style> block for the h1 selector
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    expect(styleMatch).not.toBeNull();
    const styleContent = styleMatch[1];
    expect(styleContent).toMatch(/h1\s*\{[^}]*font-family\s*:[^}]*Comic Sans MS/i);
  });
});

// ---------------------------------------------------------------------------
// Task 2.2 – rode kleur blijft behouden
// ---------------------------------------------------------------------------
describe('Comic Sans – rode kleur h1 blijft behouden (task 2.2)', () => {
  test('h1 style still declares color: red', () => {
    // The existing color: red must not be removed when adding font-family
    expect(html).toMatch(/h1\s*\{[^}]*color\s*:\s*red/i);
  });

  test('h1 style has both color: red AND Comic Sans font-family', () => {
    // Both declarations must coexist in the same h1 rule block
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    expect(styleMatch).not.toBeNull();
    const styleContent = styleMatch[1];

    // Find the h1 rule block
    const h1RuleMatch = styleContent.match(/h1\s*\{([^}]*)\}/i);
    expect(h1RuleMatch).not.toBeNull();

    const h1Declarations = h1RuleMatch[1];
    expect(h1Declarations).toMatch(/color\s*:\s*red/i);
    expect(h1Declarations).toMatch(/font-family\s*:[^;]*Comic Sans MS/i);
  });
});
