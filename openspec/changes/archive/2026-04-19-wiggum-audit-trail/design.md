## Context

De Wiggum pipeline bestaat uit drie lagen die nu niet aan elkaar gekoppeld zijn in de output:
1. **OpenSpec-laag**: `proposal.md` (waarom), `specs/<capability>/spec.md` (wat), `tasks.md` (hoe, in genummerde groepen)
2. **Pipeline-laag**: 9 fasen in `status.json` (refinement t/m retrospective)
3. **Rapportage-laag**: `report.html` (audit log) en `wiggum-flow.ts` (TUI-widget)

Het huidige `status.json` bevat alleen `task` (de change-naam) en pipeline-statussen. Er is geen veld voor de actieve spec-capability of taakgroep. De TUI-widget rendert alleen de 9 stage-boxes. Het rapport genereert een `<details>` per run maar zonder structurele link naar proposal/specs/tasks.

## Goals / Non-Goals

**Goals:**
- `status.json` uitbreiden met `currentSpec` en `currentTaskGroup` velden
- TUI-widget: één contextregel tonen (`change → spec → taakgroep`)
- `progress.html`: zelfde context tonen (auto-refresh elke 3s, al aanwezig)
- `refinement.md`: altijd `approved` — nooit `needs-clarification` of blocking questions
- `report.html`: per-task sectie als verhaal (proposal-samenvatting → spec-lijst → taakgroepen met vinkjes → demo-screenshots base64 embedded → retro-tabel), plus eindblok met retro-samenvatting over alle taken

**Non-Goals:**
- Nieuwe pipeline-fasen toevoegen
- Interactieve TUI-elementen (click, scroll)
- Specs voor niet-Wiggum agents aanpassen

## Decisions

### Beslissing 1: `currentSpec` en `currentTaskGroup` als top-level velden in status.json
**Rationale:** De TUI-widget en progress.html lezen beide `status.json`. Door twee nieuwe velden toe te voegen (`currentSpec: string | null`, `currentTaskGroup: string | null`) hoeven beide consumers identiek dezelfde data te gebruiken. De orchestrator schrijft deze velden via `update.mjs` bij elke fase-overgang.

*Alternatief:* apart `context.json` bestand — onnodige extra file, status.json is al de single source of truth.

### Beslissing 2: TUI-widget contextregel onder de stage-boxes
**Rationale:** De stage-boxes tonen de pipeline-voortgang; de contextregel eronder toont de OpenSpec-dimensie. Gescheiden rijen vermijden clashtussen twee informatiedimensies. De contextregel is smal (één regel) en verdwijnt als `currentSpec` null is.

Format: `  📋 change-name  ›  spec-capability  ›  Taakgroep 2: Multi-bal ondersteuning`

### Beslissing 3: Demo-screenshots base64 embedded in report.html
**Rationale:** `report.html` moet standalone leesbaar zijn zonder afhankelijkheid van de `wiggum/demo-screenshots/` map. Na archivering of verplaatsing van de change-folder zijn relatieve paden onbetrouwbaar. Base64-embedding maakt het rapport self-contained.

*Alternatief:* absolute paden — werkt niet na archivering.

### Beslissing 4: Rapport-structuur per taak als `<details open>` blok
Elke task-run wordt een `<details open>` blok met vaste secties top-to-bottom:
1. **Why** (proposal.md samenvatting + priority)
2. **What** (specs-lijst met capability-namen en requirement-count)
3. **How** (taakgroepen uit tasks.md, afgevinkt op basis van dev-output)
4. **Pipeline** (fase-tabel met loop-counts)
5. **Demo** (scenario-tabel + embedded screenshots)
6. **Retrospective** (issue-tabel + top recommendation)

### Beslissing 5: Eindblok retro-samenvatting
Na alle task-blokken een `<section id="summary">` met:
- Tabel: elke taak → health-kleur → top recommendation
- Geaggregeerde loop-counts over alle taken
- Dit blok wordt herschreven bij elke nieuwe run (niet geappend).

### Beslissing 6: Refinement = startstap, nooit blocking
**Rationale:** De gebruiker heeft al proposal/specs/tasks goedgekeurd via het OpenSpec-workflow. Refinement als extra goedkeuringsstap is redundant en blokkeert autonomie. De agent leest de artifacts, schrijft een summary naar `refinement.json` en geeft altijd `approved` terug. Eventuele observaties landen als `notes`, nooit als `questions`.

## Risks / Trade-offs

- **Base64-afbeeldingen vergroten report.html** → Acceptabel voor audit-doeleinden; screenshots zijn klein (canvas-captures).
- **Retro-samenvatting overschreven bij elke run** → By design: toont altijd de actuele stand van alle uitgevoerde taken.
- **`currentSpec` kan null zijn** (bijv. tijdens git-fase) → Widget toont dan alleen de change-naam.
