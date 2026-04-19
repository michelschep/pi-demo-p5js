#!/usr/bin/env node
/**
 * wiggum/generateFeatureReport.mjs
 *
 * Per-feature HTML report generator.
 *
 * Task 1.1 – Ensures wiggum/reports/ exists before writing.
 * Task 1.2 – Writes a standalone HTML file to wiggum/reports/<feature-name>.html.
 * Task 1.3 – Every generated file contains a <title> and a back-link to ../report.html.
 * Task 2.1 – formatAmsterdam wired in from ./formatAmsterdam.js (CJS → ESM via createRequire).
 * Task 2.2 – runDate formatted as Amsterdam timestamp in the per-feature report header.
 * Task 2.3 – "Run Date" column in the index table shows Amsterdam-timezone date+time.
 * Task 3.1 – No <details> block logic; report.html is a pure index page.
 * Task 3.2 – generateIndexReport() builds report.html by reading all wiggum/reports/*.html.
 * Task 3.3 – Each row in the index table links to reports/<feature-name>.html.
 */

import { mkdirSync, writeFileSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'module';

// Task 2.1 – wire formatAmsterdam into this module
const _require = createRequire(import.meta.url);
const { formatAmsterdam } = _require('./formatAmsterdam.js');

const REPORTS_DIR = 'wiggum/reports';
const INDEX_FILE  = 'wiggum/report.html';

// ---------------------------------------------------------------------------
// Task 1.1 – Ensure the reports directory exists
// ---------------------------------------------------------------------------

/**
 * Creates wiggum/reports/ if it does not yet exist.
 * Safe to call multiple times (uses { recursive: true }).
 */
export function ensureReportsDir() {
  mkdirSync(REPORTS_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Task 1.2 – Write per-feature HTML to wiggum/reports/<feature-name>.html
// ---------------------------------------------------------------------------

/**
 * Generates a standalone HTML report for one feature run and writes it to
 * wiggum/reports/<featureName>.html.
 *
 * @param {string} featureName - Stable feature name (used as filename).
 * @param {Object} [data={}]   - Report data (see buildFeatureHtml for shape).
 * @returns {string} The path of the written file.
 */
export function generateFeatureReport(featureName, data = {}) {
  // Task 1.1: guarantee the output directory exists
  ensureReportsDir();

  const filePath = join(REPORTS_DIR, `${featureName}.html`);
  const html = buildFeatureHtml(featureName, data);
  writeFileSync(filePath, html, 'utf8');
  return filePath;
}

// ---------------------------------------------------------------------------
// Task 1.3 + 2.2 – Build HTML with <title>, back-link and Amsterdam timestamp
// ---------------------------------------------------------------------------

/**
 * Builds the full HTML string for a per-feature report.
 * Includes:
 *   - <title>Wiggum — <featureName></title>               (task 1.3)
 *   - Back-link: <a href="../report.html">← Terug</a>     (task 1.3)
 *   - Run date formatted as Amsterdam timestamp            (task 2.2)
 *   - All six content sections: Why, What, How, Pipeline, Demo, Retro
 *
 * @param {string} featureName
 * @param {Object} data
 * @param {string}   [data.commit='—']
 * @param {string}   [data.runDate]          ISO date string or Date object
 * @param {string}   [data.health='—']       Human-readable health label
 * @param {string}   [data.badge='idle']     CSS badge class key
 * @param {string}   [data.why='']
 * @param {Array}    [data.capabilities=[]]  [{name, requirements, scenarios}]
 * @param {Array}    [data.taskGroups=[]]    [{title, tasks: string[]}]
 * @param {Object}   [data.pipeline={}]      {phaseName: status}
 * @param {Object}   [data.loops={}]         {loopKey: count}
 * @param {Array}    [data.demo=[]]          [{scenario, result, notes}]
 * @param {Array}    [data.issues=[]]        [{phase, severity, what, how}]
 * @param {Array}    [data.wins=[]]
 * @param {Array}    [data.recommendations=[]]
 * @param {string}   [data.topRecommendation='']
 * @returns {string} Full HTML document
 */
export function buildFeatureHtml(featureName, data = {}) {
  // FIX #2: Use startedAt as fallback when runDate is not a full ISO timestamp.
  // The pipeline layer passes { startedAt: new Date().toISOString() } rather than runDate.
  const rawRunDate = data.runDate || data.startedAt || new Date().toISOString();

  // Support both flat data shape and nested { retrospective: { issues, wins, … } }
  const retro = data.retrospective ?? {};

  const {
    commit = '—',
    health = '—',
    badge = 'idle',
    why = '',
    capabilities = [],
    taskGroups = [],
    pipeline = {},
    loops = {},
  } = data;

  // demo accepts either data.demo or data.demoScenarios
  const demo               = data.demo          ?? data.demoScenarios    ?? [];
  const issues             = data.issues         ?? retro.issues          ?? [];
  const wins               = data.wins           ?? retro.wins            ?? [];
  const recommendations    = data.recommendations ?? retro.recommendations ?? [];
  const topRecommendation  = data.topRecommendation ?? retro.topRecommendation ?? '';

  // Alias for inner scope (kept from original shape)
  const runDate = rawRunDate;

  // Task 2.2 – format runDate as Amsterdam timestamp
  // Accept ISO strings, Date objects, or already-formatted strings.
  const formattedRunDate = _formatRunDate(runDate);

  // --- Capabilities table rows ---
  const capRows = capabilities.length
    ? capabilities.map(c =>
        `    <tr><td>${esc(c.name ?? String(c))}</td><td>${c.requirements ?? '—'}</td><td>${c.scenarios ?? '—'}</td></tr>`
      ).join('\n')
    : '    <tr><td colspan="3">—</td></tr>';

  // --- How / task groups ---
  const taskGroupHtml = taskGroups.map(g => `
  <p><strong>${esc(g.title)}</strong></p>
  <ul>
${(g.tasks ?? []).map(t => {
    if (typeof t === 'string') return `    <li>${esc(t)}</li>`;
    // t is an object — render id + desc/description/name fields
    const id    = t.id   != null ? esc(String(t.id))   : null;
    const label = t.desc != null ? esc(String(t.desc))
                : t.description != null ? esc(String(t.description))
                : t.name != null        ? esc(String(t.name))
                : null;
    const text  = id && label ? `${id} — ${label}`
                : id          ? id
                : label       ? label
                : esc(JSON.stringify(t));
    const check = t.done ? ' ✅' : '';
    return `    <li>${text}${check}</li>`;
  }).join('\n')}
  </ul>`).join('\n');

  // --- Pipeline rows ---
  const ICONS = { idle: '⬜', running: '🔄', done: '✅', failed: '❌', skipped: '⏭️' };
  const pipelineRows = Object.entries(pipeline).map(([phase, status]) =>
    `    <tr><td>${ICONS[status] || '⬜'} ${esc(phase)}</td><td>${esc(status)}</td></tr>`
  ).join('\n');

  const loopRows = Object.entries(loops).map(([key, count]) =>
    `    <tr><td>${esc(key.replace('dev_', 'dev ↔ '))}</td><td>${count}${count > 1 ? ' ⚠️' : ''}</td></tr>`
  ).join('\n');

  // --- Demo rows ---
  const demoRows = demo.map(s =>
    `    <tr><td>${esc(s.scenario ?? '')}</td><td><span class="badge ${esc(s.result ?? '')}">${esc(s.result ?? '')}</span></td><td>${esc(s.notes ?? '')}</td></tr>`
  ).join('\n');

  // --- Retrospective ---
  const issueRows = issues.map(i =>
    `    <tr><td>${esc(i.phase ?? '')}</td><td class="severity-${esc(i.severity ?? '')}">${esc(i.severity ?? '')}</td><td>${esc(i.what ?? '')}</td><td>${esc(i.how ?? '')}</td></tr>`
  ).join('\n');

  const winItems  = wins.map(w => `    <li>${esc(w)}</li>`).join('\n');
  const recItems  = recommendations.map(r => `    <li>${esc(r)}</li>`).join('\n');

  // --- Assemble document ---
  // Task 1.3: <title> and back-link are mandatory in every file
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Wiggum — ${esc(featureName)}</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:960px;margin:40px auto;padding:0 20px;background:#0d1117;color:#c9d1d9}
  h1{color:#58a6ff}
  .back-link{display:inline-block;margin-bottom:20px;color:#58a6ff;text-decoration:none;font-size:.9em}
  .back-link:hover{text-decoration:underline}
  .phase{border:1px solid #30363d;border-radius:6px;margin:16px 0}
  .phase-header{padding:12px 16px;border-bottom:1px solid #30363d}
  .phase-body{padding:12px 16px}
  .phase h3{margin:0 0 10px;font-size:.9em;color:#8b949e;text-transform:uppercase;letter-spacing:.05em}
  .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:.8em;font-weight:600}
  .badge.approved,.badge.done,.badge.ok,.badge.green{background:#1a4731;color:#3fb950}
  .badge.failed,.badge.red{background:#4d1a1a;color:#f85149}
  .badge.needs-work,.badge.yellow{background:#3d2a00;color:#d29922}
  table{width:100%;border-collapse:collapse;font-size:.88em;margin-top:8px}
  th{text-align:left;padding:6px 8px;background:#161b22;color:#8b949e;border-bottom:1px solid #30363d}
  td{padding:6px 8px;border-bottom:1px solid #21262d;vertical-align:top}
  tr:last-child td{border-bottom:none}
  .severity-error{color:#f85149;font-weight:600}
  .severity-warning{color:#d29922}
  .meta{color:#8b949e;font-size:.85em}
  code{background:#161b22;padding:1px 5px;border-radius:4px;font-size:.9em}
  ul{margin:4px 0;padding-left:20px}
  li{margin:2px 0;font-size:.9em}
</style>
</head>
<body>

<!-- Task 1.3: back-link to index page -->
<a class="back-link" href="../report.html">← Terug naar overzicht</a>

<h1>🦆 ${esc(featureName)}</h1>
<p class="meta">
  Commit: <code>${esc(commit)}</code> &nbsp;·&nbsp;
  Run date: ${esc(formattedRunDate)} &nbsp;·&nbsp;
  <span class="badge ${esc(badge)}">${esc(health)}</span>
</p>

<div class="phase">
<div class="phase-body">
<h3>Why</h3>
<p>${why}</p>
</div>
</div>

<div class="phase">
<div class="phase-body">
<h3>What — Capabilities</h3>
<table>
  <tr><th>Capability</th><th>Requirements</th><th>Scenarios</th></tr>
${capRows}
</table>
</div>
</div>

<div class="phase">
<div class="phase-body">
<h3>How — Task Groups</h3>
${taskGroupHtml || '<p>—</p>'}
</div>
</div>

<div class="phase">
<div class="phase-body">
<h3>Pipeline</h3>
<table>
  <tr><th>Phase</th><th>Status</th></tr>
${pipelineRows || '  <tr><td colspan="2">—</td></tr>'}
</table>
${loopRows ? `<table style="margin-top:12px">
  <tr><th>Loop</th><th>Count</th></tr>
${loopRows}
</table>` : ''}
</div>
</div>

<div class="phase">
<div class="phase-body">
<h3>Demo</h3>
<table>
  <tr><th>Scenario</th><th>Result</th><th>Notes</th></tr>
${demoRows || '  <tr><td colspan="3">—</td></tr>'}
</table>
</div>
</div>

<div class="phase">
<div class="phase-body">
<h3>Retrospective</h3>
${wins.length ? `<p><strong>Wins</strong></p>\n<ul>\n${winItems}\n</ul>` : ''}
${issues.length ? `<table>\n  <tr><th>Phase</th><th>Severity</th><th>Issue</th><th>Fix</th></tr>\n${issueRows}\n</table>` : ''}
${recommendations.length ? `<p><strong>Recommendations</strong></p>\n<ul>\n${recItems}\n</ul>` : ''}
${topRecommendation ? `<p><strong>Top recommendation:</strong> ${esc(topRecommendation)}</p>` : ''}
</div>
</div>

</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Tasks 3.1, 3.2, 3.3 – Generate report.html as a pure index page
// ---------------------------------------------------------------------------

/**
 * Reads all *.html files in wiggum/reports/, extracts metadata from each,
 * and writes a pure index page to wiggum/report.html.
 *
 * Tasks covered:
 *   3.1 – No <details> blocks; report.html is only an index table.
 *   3.2 – Index built dynamically from the files in wiggum/reports/.
 *   3.3 – Every row contains a link to reports/<feature-name>.html.
 *   2.3 – "Run Date" column uses Amsterdam-timezone formatting.
 *
 * @param {string} [reportsDir=REPORTS_DIR]  Source directory with per-feature files.
 * @param {string} [indexFile=INDEX_FILE]    Destination path for report.html.
 * @returns {string[]} List of feature names included in the index.
 */
export function generateIndexReport(reportsDir = REPORTS_DIR, indexFile = INDEX_FILE) {
  // Collect metadata from every *.html file in the reports directory
  let files;
  try {
    files = readdirSync(reportsDir).filter(f => f.endsWith('.html'));
  } catch (_) {
    // Directory does not exist yet – write an empty index
    files = [];
  }

  const rows = files.map(filename => {
    const featureName = filename.replace(/\.html$/, '');
    let rawHtml = '';
    try {
      rawHtml = readFileSync(join(reportsDir, filename), 'utf8');
    } catch (_) { /* skip unreadable files */ }

    // Extract commit: first <code>...</code> in the meta paragraph
    const commitMatch = rawHtml.match(/<code>([^<]+)<\/code>/);
    const commit = commitMatch ? commitMatch[1] : '—';

    // Extract run date: text between "Run date: " and " &nbsp;"
    const runDateMatch = rawHtml.match(/Run date:\s*([^&<]+)/);
    // The stored value is already Amsterdam-formatted (task 2.2) or a plain date.
    // Use it as-is for display; no double-formatting.
    const runDate = runDateMatch ? runDateMatch[1].trim() : '—';

    // Extract health badge text: first badge span in the meta paragraph
    const badgeMatch = rawHtml.match(/<span class="badge ([^"]+)">([^<]+)<\/span>/);
    const badgeClass = badgeMatch ? badgeMatch[1] : '';
    const healthText = badgeMatch ? badgeMatch[2] : '—';

    return { featureName, commit, runDate, badgeClass, healthText };
  });

  const featureNames = rows.map(r => r.featureName);

  // Task 3.1: pure index — no <details> blocks
  // Task 3.3: each row links to reports/<feature-name>.html
  // Task 2.3: runDate column shows Amsterdam timestamp (already formatted in the source file)
  const tableRows = rows.length
    ? rows.map(r => `    <tr>
      <td><a href="reports/${esc(r.featureName)}.html">${esc(r.featureName)}</a></td>
      <td>${esc(r.runDate)}</td>
      <td><code>${esc(r.commit)}</code></td>
      <td><span class="badge ${esc(r.badgeClass)}">${esc(r.healthText)}</span></td>
    </tr>`).join('\n')
    : '    <tr><td colspan="4">Geen rapporten gevonden in wiggum/reports/</td></tr>';

  const generatedAt = formatAmsterdam(new Date());

  // Task 3.1: report.html contains only the summary table (no <details> blocks)
  // FIX #1 — Build <section id="summary"> rows
  const HEALTH_EMOJI = {
    green: '🟢', approved: '🟢', done: '🟢', ok: '🟢',
    yellow: '🟡', 'needs-work': '🟡',
    red: '🔴', failed: '🔴',
  };

  const summaryRows = rows.length
    ? rows.map(r => {
        // Extract top recommendation from per-feature HTML
        const topRecMatch = readFileSync(join(reportsDir, `${r.featureName}.html`), 'utf8')
          .match(/<p><strong>Top recommendation:<\/strong>\s*([^<]+)<\/p>/);
        const topRec = topRecMatch ? topRecMatch[1].trim() : '—';
        // Fall back to healthText (e.g. 'green') when badgeClass ('idle') has no mapping
        const emoji  = HEALTH_EMOJI[r.badgeClass] ?? HEALTH_EMOJI[r.healthText?.toLowerCase()] ?? '⬜';
        return `    <tr>
      <td><a href="reports/${esc(r.featureName)}.html">${esc(r.featureName)}</a></td>
      <td>${emoji}</td>
      <td>${esc(topRec)}</td>
    </tr>`;
      }).join('\n')
    : '    <tr><td colspan="3">Geen rapporten gevonden</td></tr>';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Wiggum Audit Log</title>
<style>
  body{font-family:system-ui,sans-serif;max-width:960px;margin:40px auto;padding:0 20px;background:#0d1117;color:#c9d1d9}
  h1{color:#58a6ff}
  .meta{color:#8b949e;font-size:.85em;margin-bottom:24px}
  .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:.8em;font-weight:600}
  .badge.approved,.badge.done,.badge.ok,.badge.green{background:#1a4731;color:#3fb950}
  .badge.failed,.badge.red{background:#4d1a1a;color:#f85149}
  .badge.needs-work,.badge.yellow{background:#3d2a00;color:#d29922}
  table{width:100%;border-collapse:collapse;font-size:.88em}
  th{text-align:left;padding:6px 8px;background:#161b22;color:#8b949e;border-bottom:1px solid #30363d}
  td{padding:6px 8px;border-bottom:1px solid #21262d;vertical-align:top}
  tr:last-child td{border-bottom:none}
  a{color:#58a6ff;text-decoration:none}
  a:hover{text-decoration:underline}
  code{background:#161b22;padding:1px 5px;border-radius:4px;font-size:.9em}
</style>
</head>
<body>
<h1>🦆 Wiggum Audit Log</h1>
<p class="meta">Gegenereerd op: ${generatedAt}</p>

<!-- Tasks 3.1/3.2: pure index built from wiggum/reports/ — no accordion blocks -->
<table>
  <tr>
    <th>Feature</th>
    <!-- Task 2.3: Run Date column shows Amsterdam-timezone date+time -->
    <th>Run Date</th>
    <th>Commit</th>
    <th>Health</th>
  </tr>
${tableRows}
</table>

<!-- FIX #1: summary section — fully regenerated on every run -->
<section id="summary">
<h2>📋 Summary</h2>
<table>
  <tr>
    <th>Feature</th>
    <th>Health</th>
    <th>Top Recommendation</th>
  </tr>
${summaryRows}
</table>
</section>

</body>
</html>`;

  writeFileSync(indexFile, html, 'utf8');
  return featureNames;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Formats a runDate value as an Amsterdam timestamp.
 *
 * - If the value is already formatted (contains "(Amsterdam)"), return it as-is.
 * - If it looks like an ISO string or is a Date object, pass it to formatAmsterdam.
 * - Otherwise, return it unchanged (plain date strings, '—', etc.).
 *
 * @param {string|Date} value
 * @returns {string}
 */
function _formatRunDate(value) {
  if (value instanceof Date) {
    return formatAmsterdam(value);
  }
  const str = String(value);
  // Already formatted by a previous call
  if (str.includes('(Amsterdam)')) return str;
  // Looks like an ISO 8601 string: starts with 4 digits and contains 'T' or '-'
  if (/^\d{4}-\d{2}-\d{2}T/.test(str) || /^\d{4}-\d{2}-\d{2}$/.test(str)) {
    try {
      return formatAmsterdam(str);
    } catch (_) { /* fall through */ }
  }
  return str;
}

/** Escapes HTML special characters to prevent injection in data fields. */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
