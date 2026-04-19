## ADDED Requirements

### Requirement: Rode paginatitel bovenaan de pagina
De pagina SHALL een `<h1>` element bevatten met de tekst "Stuiteren!" dat bovenaan de pagina wordt weergegeven in de kleur rood.

#### Scenario: Titel zichtbaar bij laden
- **WHEN** de gebruiker de pagina opent
- **THEN** SHALL de tekst "Stuiteren!" zichtbaar zijn bovenaan de pagina in het rood

#### Scenario: Titel staat boven het canvas
- **WHEN** de pagina geladen is
- **THEN** SHALL de titel boven het p5.js canvas verschijnen
