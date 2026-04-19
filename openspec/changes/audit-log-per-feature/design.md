## Context

De Wiggum-pipeline genereert na elke run een audit log. Momenteel worden alle runs samengevoegd in één `wiggum/report.html` via accumulerende `<details>`-blokken. Het rapportage-script (onderdeel van de retrospective-agent of een aparte stap) schrijft na elke run een nieuw blok bovenaan of onderaan `report.html`.

De `<section id="summary">` wordt bij elke run volledig herschreven om de nieuwe feature mee te nemen.

## Goals / Non-Goals

**Goals:**
- Elke Wiggum-run schrijft zijn eigen HTML-bestand naar `wiggum/reports/<feature-name>.html`
- `report.html` wordt een index-pagina met een tabel van alle features en klikbare links naar de individuele bestanden
- Individuele rapporten zijn volledig standalone (base64 screenshots, geen externe dependencies)
- Bestaande rapportage-inhoud (Why, What, How, Pipeline, Demo, Retro) blijft ongewijzigd

**Non-Goals:**
- Historische `report.html`-inhoud migreren naar losse bestanden (handmatige migratie buiten scope)
- Sortering of filteren van de index-pagina
- Authenticatie of toegangsbeheer

## Decisions

### 1. Bestandsnaam per feature: `<feature-name>.html`

**Beslissing**: `wiggum/reports/<feature-name>.html` — geen datum prefix in de bestandsnaam.

**Alternatieven overwogen:**
- *`<datum>-<feature-name>.html`*: Duidelijker tijdlijn, maar maakt links broos (datum wisselt per run). Feature-naam is al uniek binnen een project.
- *UUID*: Niet leesbaar.

**Rationale**: Feature-naam is stabiel en mensleesbaar. De datum staat al in de HTML-inhoud zelf.

### 2. `report.html` als pure index (geen inline details meer)

**Beslissing**: `report.html` bevat alleen de summary-tabel met links; alle detailinhoud zit in de losse bestanden.

**Alternatieven overwogen:**
- *`report.html` behoudt `<details>`-blokken + losse bestanden*: Dubbel werk, content loopt uit sync.
- *`report.html` embedded iframes*: Werkt niet goed zonder server.

**Rationale**: Enkelvoudige source of truth per feature. Index is licht en snel te laden.

### 3. Terugwaartse compatibiliteit: bestaande `report.html` blijft staan

**Beslissing**: De bestaande `report.html` wordt niet gemigreerd of overschreven door deze change. Nieuwe runs schrijven naar de nieuwe structuur; de index wordt opgebouwd vanuit de `wiggum/reports/`-map.

**Rationale**: Minimaliseert risico en implementatiecomplexiteit.

## Risks / Trade-offs

- [Links in index werken alleen lokaal] `report.html` linkt naar relatieve paden in `wiggum/reports/` — werkt niet als alleen `report.html` gedeeld wordt. → Mitigation: individuele rapporten zijn de te-delen eenheid; `report.html` is lokale navigatiehulp.
- [Bestaande `<details>`-inhoud in report.html] Na de migratie staat er verouderde inhoud in `report.html`. → Mitigation: accepteren of handmatig opschonen na implementatie.

## Migration Plan

1. Maak `wiggum/reports/` aan als nieuwe outputmap
2. Pas het rapportage-script aan: schrijf per-feature HTML naar `wiggum/reports/<feature-name>.html`
3. Pas `report.html`-generatie aan: bouw de index op vanuit bestanden in `wiggum/reports/`
4. Verwijder de logica die `<details>`-blokken aan `report.html` toevoegt
