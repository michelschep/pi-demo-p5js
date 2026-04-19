## Why

De Wiggum pipeline voert taken uit maar de zichtbaarheid van *wat* er gedaan wordt ontbreekt. De TUI-widget toont alleen de pipeline-fase (Refinement, TDD, etc.) maar niet welke OpenSpec change, spec of taakgroep actief is. Het HTML-rapport is een technisch logboek maar leest niet als een verhaal: er is geen heldere relatie met de OpenSpec structuur (proposal → specs → tasks), demo-screenshots zitten niet ingebed, en een overkoepelende retro-samenvatting over alle taken ontbreekt. Bovendien kan de refinement-agent de pipeline blokkeren met gebruikersvragen — dat moet een automatische startstap zijn.

## What Changes

- **`status.json` uitgebreid**: huidige change-naam, actieve spec-capability en actieve taakgroep worden bijgehouden zodat TUI en progress.html dit kunnen tonen.
- **TUI-widget (`wiggum-flow.ts`)**: toont onder de pipeline-stages een contextregel met de actieve change → spec → taakgroep.
- **`progress.html`**: bevat dezelfde OpenSpec-context (change, spec, taakgroep) naast de pipeline-status.
- **`refinement`-agent**: wordt een pure startstap — geen gebruikersvragen, nooit `needs-clarification`, altijd `approved`. Legt alleen vast welke stack en specs gevonden zijn.
- **Audit-rapport (`report.html`)**: volledig herzien als chronologisch verhaal per taak: proposal (waarom) → specs (wat) → taakgroepen (hoe) → demo-screenshots embedded → retro. Aan het eind een retro-samenvatting over alle taken.

## Capabilities

### New Capabilities
- `wiggum-task-context`: Bijhouden en tonen van de actieve OpenSpec-context (change, spec, taakgroep) in status.json, TUI-widget en progress.html.
- `wiggum-audit-report`: Audit-rapport als verhaal per taak met OpenSpec-relatie, ingebedde demo-screenshots en overkoepelende retro-samenvatting.

### Modified Capabilities
*(geen bestaande spec-capabilities — Wiggum agents zijn geen gespecificeerde capabilities)*

## Impact

- `~/.pi/agent/agents/refinement.md`: gebruikersvragen verwijderen, altijd approved.
- `~/.pi/agent/agents/wiggum-orchestrator.md`: status.json vullen met spec/taakgroep context; rapport-generatie volledig herzien.
- `.pi/extensions/wiggum-flow.ts`: contextregel toevoegen aan widget.
