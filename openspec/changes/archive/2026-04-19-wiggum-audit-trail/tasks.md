## 1. status.json context-velden

- [x] 1.1 Voeg `currentSpec: null` en `currentTaskGroup: null` toe aan de initiële status.json scaffold in `wiggum-orchestrator.md`
- [x] 1.2 Breid `update.mjs` in de orchestrator uit: accepteer optionele `--spec <naam>` en `--taskgroup <titel>` argumenten die deze velden schrijven
- [x] 1.3 Roep `update.mjs` aan met `--spec` en `--taskgroup` op het moment dat de developer-fase start voor een bepaalde taakgroep
- [x] 1.4 Reset `currentSpec` en `currentTaskGroup` naar null tijdens git- en retrospective-fasen

## 2. Refinement-agent: altijd approved

- [x] 2.1 Verwijder de `needs-clarification` branch en alle `questions`-logica uit `~/.pi/agent/agents/refinement.md`
- [x] 2.2 Vervang de `## Rules` sectie: altijd `approved`, observaties in `notes`, nooit blocking
- [x] 2.3 Verwijder de `needs-clarification` check en STOP-instructie uit de orchestrator (Phase 2)

## 3. TUI-widget: contextregel

- [x] 3.1 Lees `currentSpec` en `currentTaskGroup` uit `statusCache` in `wiggum-flow.ts`
- [x] 3.2 Voeg na de stage-boxes een contextregel toe: `📋 <change> › <spec> › <taakgroep>` (of alleen `📋 <change>` als spec null is)
- [x] 3.3 Toon de contextregel alleen als er activiteit is (niet bij alle-idle)
- [x] 3.4 Stijl de contextregel met `theme.fg("dim", ...)` voor change en spec, `theme.fg("text", ...)` voor taakgroep

## 4. progress.html: context-sectie

- [x] 4.1 Voeg een context-sectie toe aan de HTML-template in `update.mjs`: toon `currentSpec` en `currentTaskGroup` als aparte rijen boven de pipeline-tabel
- [x] 4.2 Verberg de context-sectie (of toon "—") als de velden null zijn

## 5. Audit-rapport: verhaal-structuur per taak

- [x] 5.1 Schrijf een helper in de orchestrator die `proposal.md` leest en de eerste alinea na `## Why` extraheert
- [x] 5.2 Schrijf een helper die `specs/` scant en per capability het aantal `### Requirement:` koppen telt
- [x] 5.3 Schrijf een helper die `tasks.md` parset: groepen (`## N.`) en items (`- [x]` / `- [ ]`) naar een datastructuur
- [x] 5.4 Schrijf een helper die een screenshot-pad leest, naar base64 converteert en een `<img data-URI>` genereert (of placeholder bij ontbrekend bestand)
- [x] 5.5 Genereer het `<details open>` blok met secties in volgorde: Why → What → How → Pipeline → Demo → Retrospective
- [x] 5.6 Vervang de huidige rapport-generatiecode in de orchestrator door de nieuwe helper

## 6. Audit-rapport: retro-samenvatting eindblok

- [x] 6.1 Na het toevoegen van een task-blok: scan alle `<details>` blokken in report.html en extraheer per taak de retro-health en top recommendation
- [x] 6.2 Genereer de `<section id="summary">` tabel met alle taken, health-badges en aanbevelingen
- [x] 6.3 Vervang de bestaande `<section id="summary">` in report.html (of voeg toe als nog niet aanwezig) vóór `</body>`

## 7. Git-agent: taakafvinken en commit-traceability

- [x] 7.1 Voeg `tasks.md` toe aan de Input-sectie van `git-committer.md`
- [x] 7.2 Voeg stap toe die actieve taakgroep bepaalt uit `currentTaskGroup` in `status.json`
- [x] 7.3 Verplicht `Task N — <titel>` + `Ref: openspec/changes/<change>` in elke commit message
- [x] 7.4 Na commit: vervang `- [ ]` door `- [x]` voor alle items in de actieve taakgroep in `tasks.md`
- [x] 7.5 Amend de commit om de bijgewerkte `tasks.md` mee te nemen

## 8. Verificatie

- [ ] 7.1 Draai Wiggum op een test-change en controleer dat `status.json` `currentSpec` en `currentTaskGroup` bevat tijdens de developer-fase
- [ ] 7.2 Controleer dat de TUI-widget de contextregel toont
- [ ] 7.3 Controleer dat `report.html` de secties Why/What/How/Demo/Retro bevat in de juiste volgorde
- [ ] 7.4 Controleer dat demo-screenshots base64 embedded zijn (geen externe src-paden)
- [ ] 7.5 Controleer dat de retro-samenvatting onderaan aanwezig en correct is
