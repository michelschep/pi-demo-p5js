'use strict';

/**
 * Formats a date/ISO-string to Amsterdam-timezone string.
 * Output format: YYYY-MM-DD HH:mm (Amsterdam)
 *
 * Uses Intl.DateTimeFormat with timeZone 'Europe/Amsterdam', which
 * automatically handles CET (UTC+1) in winter and CEST (UTC+2) in summer.
 *
 * @param {string|Date} input - ISO 8601 date string or Date object
 * @returns {string} e.g. "2026-04-19 14:00 (Amsterdam)"
 */
function formatAmsterdam(input) {
  const date = input instanceof Date ? input : new Date(input);

  // Use Intl.DateTimeFormat with formatToParts so the locale separator
  // format doesn't matter – we pick individual fields by type.
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date).reduce((acc, { type, value }) => {
    acc[type] = value;
    return acc;
  }, {});

  const { year, month, day, minute } = parts;
  // Guard against edge-case "24" returned for midnight by some ICU builds
  const hour = parts.hour === '24' ? '00' : parts.hour;

  return `${year}-${month}-${day} ${hour}:${minute} (Amsterdam)`;
}

module.exports = { formatAmsterdam };
