## Why

Momenteel worden alle Wiggum-runs samengevoegd in één groeiend `report.html`, waardoor individuele feature-rapportages moeilijk te isoleren, te delen of terug te vinden zijn. Door elke feature een eigen, losstaand audit log te geven wordt het overzicht beter en zijn rapporten eenvoudiger te delen.

## What Changes

- Elke Wiggum-run genereert een eigen losstaand HTML-bestand: `wiggum/reports/<feature-name>.html`
- `report.html` wordt een overzichtspagina (index) met een tabel van alle features en links naar de individuele rapporten — de `<details>`-blokken verdwijnen uit `report.html`
- De inhoud per feature (Why, What, How, Pipeline, Demo, Retrospective) blijft hetzelfde maar staat nu in het individuele bestand
- De `<section id="summary">` in `report.html` blijft bestaan als samenvatting-index

## Capabilities

### New Capabilities

*(geen)*

### Modified Capabilities

- `wiggum-audit-report`: De requirement "Audit-rapport is een verhaal per taak" verandert — het rapport per taak wordt niet langer als `<details>`-blok aan `report.html` toegevoegd, maar als een apart bestand in `wiggum/reports/<feature-name>.html` weggeschreven. `report.html` fungeert als index met links.

## Impact

- `wiggum/update.mjs` of het rapportage-script: logica voor het genereren van per-feature HTML-bestanden toevoegen
- `wiggum/report.html`: structuur wijzigt van accumulerende details naar een statische index-pagina met links
- `wiggum/reports/` (nieuwe map): bevat per-feature audit logs
