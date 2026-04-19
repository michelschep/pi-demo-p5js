const fs = require('fs');

const retro = JSON.parse(fs.readFileSync('wiggum/results/retrospective.json', 'utf8'));
const git = JSON.parse(fs.readFileSync('wiggum/results/git.json', 'utf8'));
const demo = JSON.parse(fs.readFileSync('wiggum/results/demo.json', 'utf8'));
const status = JSON.parse(fs.readFileSync('wiggum/status.json', 'utf8'));

const screenshots = {};
for (let i = 0; i <= 6; i++) {
  const p = 'wiggum/demo-screenshots/scenario-' + i + '.png';
  if (fs.existsSync(p)) screenshots[i] = fs.readFileSync(p, 'base64');
}

const phaseDurations = {};
(retro.phaseTiming || []).forEach(p => { phaseDurations[p.phase] = p.durationSeconds; });

const healthEmoji = retro.overallHealth === 'green' ? '🟢' : retro.overallHealth === 'yellow' ? '🟡' : '🔴';
const healthClass = retro.overallHealth === 'green' ? 'green' : retro.overallHealth === 'yellow' ? 'yellow' : 'red';

const pipelineRows = Object.entries(status.pipeline)
  .filter(([k,v]) => v !== 'idle')
  .map(([phase, s]) => {
    const dur = phaseDurations[phase];
    const durStr = dur == null ? '—' : dur >= 60 ? Math.floor(dur/60)+'m '+(dur%60)+'s' : dur+'s';
    const loop = status.loops ? (status.loops['dev_'+phase] || '') : '';
    return '<tr><td>'+phase+'</td><td><span class="badge '+s+'">'+s+'</span></td><td>'+durStr+'</td><td>'+(loop||'—')+'</td></tr>';
  }).join('');

const scenarios = demo.scenarios || demo.demoScenarios || [];
const demoRows = scenarios.map((sc, i) => {
  const img = screenshots[i] ? '<img class="img-thumb" src="data:image/png;base64,'+screenshots[i]+'" alt="'+sc.name+'">' : '—';
  const result = sc.passed ? '<span class="badge done">✅ passed</span>' : '<span class="badge failed">❌ failed</span>';
  return '<tr><td>'+sc.name+'</td><td>'+result+'</td><td>'+img+'</td><td><small>'+(sc.notes||'')+'</small></td></tr>';
}).join('');

const issueRows = (retro.issues || []).map(iss => {
  const sev = iss.severity === 'medium' ? 'severity-warning' : iss.severity === 'high' ? 'severity-error' : '';
  return '<tr><td class="'+sev+'">'+iss.phase+'</td><td class="'+sev+'">'+iss.severity+'</td><td>'+iss.what+'</td><td>'+iss.how+'</td></tr>';
}).join('');

const taskMd = fs.readFileSync('openspec/changes/audit-log-per-feature/tasks.md', 'utf8');
const groups = taskMd.split(/\n(?=## )/).filter(s => s.startsWith('## '));
const taskGroupHtml = groups.map(block => {
  const titleLine = block.match(/^## (.+)/)[1];
  const items = [...block.matchAll(/- \[(x| )\] (.+)/g)].map(m => {
    const done = m[1] === 'x';
    return '<li>'+(done?'✅':'○')+' '+m[2]+'</li>';
  }).join('');
  return '<strong>'+titleLine+'</strong><ul>'+items+'</ul>';
}).join('');

let reqCount = 0, scenCount = 0;
try {
  const specMd = fs.readFileSync('openspec/changes/audit-log-per-feature/specs/wiggum-audit-report/spec.md', 'utf8');
  reqCount = (specMd.match(/### Requirement:/g) || []).length;
  scenCount = (specMd.match(/#### Scenario:/g) || []).length;
} catch(e) {}

const runDate = new Date(retro.runDate || retro.completedAt || Date.now()).toLocaleString('nl-NL', {timeZone: 'Europe/Amsterdam'});

const detailsBlock = '<details open>\n'+
'  <summary>\n'+
'    <span>🦆 audit-log-per-feature</span>\n'+
'    <span class="badge '+healthClass+'">'+healthEmoji+' '+retro.overallHealth+' &nbsp;·&nbsp; '+runDate+' &nbsp;·&nbsp; '+(git.commitHash||'—')+'</span>\n'+
'  </summary>\n'+
'  <div class="phase"><h3>Why</h3><p>Momenteel worden alle Wiggum-runs samengevoegd in één groeiend <code>report.html</code>, waardoor individuele feature-rapportages moeilijk te isoleren, te delen of terug te vinden zijn. Door elke feature een eigen, losstaand audit log te geven wordt het overzicht beter en zijn rapporten eenvoudiger te delen.</p></div>\n'+
'  <div class="phase"><h3>What</h3><table><tr><th>Capability</th><th>Requirements</th><th>Scenarios</th></tr><tr><td>wiggum-audit-report</td><td>'+reqCount+'</td><td>'+scenCount+'</td></tr></table></div>\n'+
'  <div class="phase"><h3>How</h3>'+taskGroupHtml+'</div>\n'+
'  <div class="phase"><h3>Pipeline</h3><table><tr><th>Phase</th><th>Status</th><th>Duration</th><th>Loops</th></tr>'+pipelineRows+'</table></div>\n'+
'  <div class="phase"><h3>Demo</h3><table><tr><th>Scenario</th><th>Result</th><th>Screenshot</th><th>Notes</th></tr>'+demoRows+'</table></div>\n'+
'  <div class="phase"><h3>Retrospective</h3><table><tr><th>Phase</th><th>Severity</th><th>Issue</th><th>Fix</th></tr>'+issueRows+'</table><p><strong>Top recommendation:</strong> '+retro.topRecommendation+'</p></div>\n'+
'</details>';

const css = 'body{font-family:system-ui,sans-serif;max-width:960px;margin:40px auto;padding:0 20px;background:#0d1117;color:#c9d1d9} h1{color:#58a6ff} #summary{border:1px solid #58a6ff33;border-radius:6px;padding:16px;margin-bottom:24px;background:#0d1a2a} #summary h2{margin:0 0 12px;color:#58a6ff;font-size:1em;text-transform:uppercase;letter-spacing:.05em} details{border:1px solid #30363d;border-radius:6px;margin:16px 0} summary{padding:12px 16px;cursor:pointer;font-weight:600;font-size:1.05em;background:#161b22;border-radius:6px;list-style:none;display:flex;justify-content:space-between;align-items:center} summary::-webkit-details-marker{display:none} details[open] summary{border-radius:6px 6px 0 0} .phase{padding:12px 16px;border-top:1px solid #30363d} .phase h3{margin:0 0 10px;font-size:.9em;color:#8b949e;text-transform:uppercase;letter-spacing:.05em} .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:.8em;font-weight:600} .badge.approved,.badge.done,.badge.ok,.badge.green{background:#1a4731;color:#3fb950} .badge.failed,.badge.red{background:#4d1a1a;color:#f85149} .badge.needs-work,.badge.yellow{background:#3d2a00;color:#d29922} table{width:100%;border-collapse:collapse;font-size:.88em;margin-top:8px} th{text-align:left;padding:6px 8px;background:#161b22;color:#8b949e;border-bottom:1px solid #30363d} td{padding:6px 8px;border-bottom:1px solid #21262d;vertical-align:top} .severity-error{color:#f85149;font-weight:600} .severity-warning{color:#d29922} .img-thumb{max-width:200px;border:1px solid #30363d;border-radius:4px} code{background:#161b22;padding:1px 5px;border-radius:4px;font-size:.9em} ul{margin:4px 0;padding-left:20px} li{margin:2px 0;font-size:.9em}';

const summaryTable = '<table><tr><th>Change</th><th>Run Date</th><th>Commit</th><th>Health</th><th>Top Recommendation</th></tr>'+
'<tr><td>audit-log-per-feature</td><td>'+runDate+'</td><td><code>'+(git.commitHash||'—')+'</code></td>'+
'<td><span class="badge '+healthClass+'">'+healthEmoji+' '+retro.overallHealth+'</span></td>'+
'<td>'+retro.topRecommendation+'</td></tr></table>';

const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<title>Wiggum Audit Log</title>\n<style>'+css+'</style>\n</head>\n<body>\n'+
'<h1>&#x1F986; Wiggum Audit Log</h1>\n'+
'<section id="summary"><h2>Summary</h2>'+summaryTable+'</section>\n'+
detailsBlock+'\n</body></html>';

fs.writeFileSync('wiggum/report.html', html);
fs.writeFileSync('openspec/changes/audit-log-per-feature/report.html', html);
console.log('Reports written OK — size:', html.length, 'bytes');
