## MODIFIED Requirements

### Requirement: Audit-rapport is een verhaal per taak
Het systeem SHALL voor elke Wiggum-run een losstaand HTML-bestand genereren op het pad `wiggum/reports/<feature-name>.html` dat de volgende secties bevat in volgorde: Why (proposal-samenvatting), What (specs-lijst), How (taakgroepen), Pipeline (fase-tabel), Demo (screenshots), Retrospective (issues + aanbeveling). Het rapport SHALL standalone leesbaar zijn zonder externe bestanden. `report.html` fungeert als index-pagina met een tabel van alle features en klikbare links naar de individuele rapporten; de `<details>`-blokken verdwijnen uit `report.html`.

#### Scenario: Per-feature bestand aangemaakt
- **WHEN** een Wiggum-run succesvol is afgerond voor feature `<feature-name>`
- **THEN** bestaat het bestand `wiggum/reports/<feature-name>.html` met de secties Why, What, How, Pipeline, Demo en Retrospective in die volgorde

#### Scenario: Rapport is standalone
- **WHEN** `wiggum/reports/<feature-name>.html` wordt geopend op een andere locatie dan het project
- **THEN** zijn alle demo-screenshots zichtbaar (base64 embedded, geen externe paden)

#### Scenario: report.html is een index
- **WHEN** meerdere features zijn uitgevoerd
- **THEN** bevat `report.html` een tabel met per feature: naam, datum+tijd, commit, health-badge en een link naar het bijbehorende per-feature rapport

### Requirement: Eindblok retro-samenvatting
Het rapport SHALL na alle task-blokken een vaste `<section id="summary">` bevatten met een tabel van alle uitgevoerde taken, hun retro-health-score en top recommendation. Dit blok SHALL bij elke nieuwe run volledig herschreven worden.

#### Scenario: Samenvatting toont alle taken
- **WHEN** meerdere taken zijn uitgevoerd en `wiggum/reports/` meerdere bestanden bevat
- **THEN** toont de summary-sectie in `report.html` elke taak als tabelrij met health-badge (🟢/🟡/🔴) en top recommendation

#### Scenario: Samenvatting herschreven bij nieuwe run
- **WHEN** een nieuwe Wiggum-run wordt uitgevoerd
- **THEN** is de `<section id="summary">` in `report.html` bijgewerkt met de nieuwe feature erin

## ADDED Requirements

### Requirement: Datum en tijd in Amsterdam-tijdzone getoond
Elk audit-rapport (zowel het per-feature bestand als de index-tabel in `report.html`) SHALL de datum én tijd van de run tonen in de tijdzone Europe/Amsterdam (CET/CEST), geformatteerd als `YYYY-MM-DD HH:mm (Amsterdam)`.

#### Scenario: Tijdstempel toont lokale Amsterdam-tijd
- **WHEN** een Wiggum-run wordt afgerond en het rapport gegenereerd
- **THEN** staat in de header van het per-feature rapport de run-tijd weergegeven als bijv. `2026-04-19 13:42 (Amsterdam)`

#### Scenario: Index-tabel toont datum én tijd
- **WHEN** `report.html` wordt gegenereerd na een run
- **THEN** toont de index-tabel in de kolom "Run Date" zowel de datum als de tijd in Amsterdam-tijdzone, bijv. `2026-04-19 13:42`
