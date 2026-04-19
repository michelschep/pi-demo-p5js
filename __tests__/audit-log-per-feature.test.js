/**
 * TDD tests: formatAmsterdam – task 4.1
 *
 * Covers:
 *  - Return format is exactly `YYYY-MM-DD HH:mm (Amsterdam)`
 *  - CET offset (UTC+1) is applied for a winter timestamp
 *  - CEST offset (UTC+2) is applied for a summer timestamp
 *  - Midnight UTC is shifted correctly to Amsterdam local time
 *  - DST boundary: last hour before switch (CET → CEST, 2026-03-29T00:59Z → 01:59 CET)
 *  - DST boundary: first hour after switch (2026-03-29T01:00Z → 03:00 CEST, UTC+2)
 *  - A string is returned (never null / undefined)
 *
 * Source under test (to be created):
 *   wiggum/formatAmsterdam.js  — exports { formatAmsterdam }
 */

// Safe import: if the module does not exist yet, every test fails explicitly
let formatAmsterdam;
try {
  ({ formatAmsterdam } = require('../wiggum/formatAmsterdam'));
} catch (_) {
  formatAmsterdam = () => { throw new Error('TDD: formatAmsterdam not yet implemented'); };
}

// ---------------------------------------------------------------------------
// Output format
// ---------------------------------------------------------------------------
describe('formatAmsterdam – output format', () => {
  test('returns a string matching YYYY-MM-DD HH:mm (Amsterdam)', () => {
    // Arrange
    const iso = '2026-04-19T12:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(typeof result).toBe('string');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2} \(Amsterdam\)$/);
  });

  test('the literal suffix " (Amsterdam)" is always present', () => {
    // Arrange
    const iso = '2026-07-15T08:30:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toMatch(/\(Amsterdam\)$/);
  });
});

// ---------------------------------------------------------------------------
// CET – UTC+1 (winter)
// ---------------------------------------------------------------------------
describe('formatAmsterdam – CET (UTC+1, winter)', () => {
  test('2026-01-15T12:00:00.000Z → 2026-01-15 13:00 (Amsterdam)', () => {
    // Arrange – mid-winter, CET = UTC+1
    const iso = '2026-01-15T12:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-01-15 13:00 (Amsterdam)');
  });

  test('2026-12-31T23:00:00.000Z → 2027-01-01 00:00 (Amsterdam) – crosses midnight', () => {
    // Arrange – New Year's Eve, CET = UTC+1, midnight rollover
    const iso = '2026-12-31T23:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2027-01-01 00:00 (Amsterdam)');
  });

  test('2026-02-01T00:00:00.000Z → 2026-02-01 01:00 (Amsterdam) – midnight UTC', () => {
    // Arrange – UTC midnight in February, Amsterdam = 01:00
    const iso = '2026-02-01T00:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-02-01 01:00 (Amsterdam)');
  });
});

// ---------------------------------------------------------------------------
// CEST – UTC+2 (summer / DST)
// ---------------------------------------------------------------------------
describe('formatAmsterdam – CEST (UTC+2, summer)', () => {
  test('2026-07-15T12:00:00.000Z → 2026-07-15 14:00 (Amsterdam)', () => {
    // Arrange – mid-summer, CEST = UTC+2
    const iso = '2026-07-15T12:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-07-15 14:00 (Amsterdam)');
  });

  test('2026-08-20T22:00:00.000Z → 2026-08-21 00:00 (Amsterdam) – crosses midnight in CEST', () => {
    // Arrange – summer night, 22:00 UTC = 00:00 CEST next day
    const iso = '2026-08-20T22:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-08-21 00:00 (Amsterdam)');
  });

  test('2026-04-19T12:00:00.000Z → 2026-04-19 14:00 (Amsterdam) – spring CEST already active', () => {
    // Arrange – DST has already switched (last Sunday in March), April is CEST
    const iso = '2026-04-19T12:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-04-19 14:00 (Amsterdam)');
  });
});

// ---------------------------------------------------------------------------
// DST boundary (CET ↔ CEST switch)
// ---------------------------------------------------------------------------
describe('formatAmsterdam – DST boundary 2026', () => {
  test('last minute of CET: 2026-03-29T00:59:00.000Z → 2026-03-29 01:59 (Amsterdam)', () => {
    // Arrange – clocks switch at 02:00 CET = 01:00 UTC on last Sunday of March
    // 2026-03-29T00:59Z is still CET (+1), so Amsterdam = 01:59
    const iso = '2026-03-29T00:59:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-03-29 01:59 (Amsterdam)');
  });

  test('first minute of CEST: 2026-03-29T01:00:00.000Z → 2026-03-29 03:00 (Amsterdam)', () => {
    // Arrange – at 01:00 UTC clocks jump from 02:00 → 03:00, so CEST (+2) starts
    const iso = '2026-03-29T01:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-03-29 03:00 (Amsterdam)');
  });

  test('last minute of CEST: 2026-10-25T00:59:00.000Z → 2026-10-25 02:59 (Amsterdam)', () => {
    // Arrange – clocks fall back at 03:00 CEST = 01:00 UTC on last Sunday of October
    // 2026-10-25T00:59Z is still CEST (+2)
    const iso = '2026-10-25T00:59:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-10-25 02:59 (Amsterdam)');
  });

  test('first minute of CET again: 2026-10-25T01:00:00.000Z → 2026-10-25 02:00 (Amsterdam)', () => {
    // Arrange – at 01:00 UTC clocks fall back to 02:00 CET (+1)
    const iso = '2026-10-25T01:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).toBe('2026-10-25 02:00 (Amsterdam)');
  });
});

// ---------------------------------------------------------------------------
// Robustness
// ---------------------------------------------------------------------------
describe('formatAmsterdam – robustness', () => {
  test('accepts a Date object in addition to an ISO string', () => {
    // Arrange
    const date = new Date('2026-07-01T10:00:00.000Z');

    // Act
    const result = formatAmsterdam(date);

    // Assert
    expect(result).toBe('2026-07-01 12:00 (Amsterdam)');
  });

  test('returns a non-empty string and never null', () => {
    // Arrange
    const iso = '2026-06-21T06:00:00.000Z';

    // Act
    const result = formatAmsterdam(iso);

    // Assert
    expect(result).not.toBeNull();
    expect(result).not.toBe('');
    expect(result.length).toBeGreaterThan(0);
  });
});
