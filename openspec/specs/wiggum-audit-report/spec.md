### Requirement: Audit-rapport is een verhaal per taak
Het systeem SHALL voor elke Wiggum-run een `<details open>` blok genereren in `report.html` dat de volgende secties bevat in volgorde: Why (proposal-samenvatting), What (specs-lijst), How (taakgroepen), Pipeline (fase-tabel), Demo (screenshots), Retrospective (issues + aanbeveling). Het rapport SHALL standalone leesbaar zijn zonder externe bestanden.

#### Scenario: Blok bevat alle secties in volgorde
- **WHEN** een Wiggum-run succesvol is afgerond
- **THEN** bevat het gegenereerde `<details>` blok de secties Why, What, How, Pipeline, Demo en Retrospective in die volgorde van boven naar beneden

#### Scenario: Rapport is standalone
- **WHEN** report.html wordt geopend op een andere locatie dan het project
- **THEN** zijn alle demo-screenshots zichtbaar (base64 embedded, geen externe paden)

### Requirement: Why-sectie toont proposal-samenvatting
De Why-sectie SHALL de eerste alinea van `proposal.md` tonen als samenvatting, samen met de priority (indien aanwezig in frontmatter).

#### Scenario: Why-sectie gevuld vanuit proposal.md
- **WHEN** `proposal.md` aanwezig is in de change-folder
- **THEN** toont de Why-sectie de motivatietekst en priority

### Requirement: What-sectie toont specs met requirements
De What-sectie SHALL een lijst tonen van alle spec-capabilities in `specs/` van de change, met per capability het aantal requirements en scenario's.

#### Scenario: What-sectie somt capabilities op
- **WHEN** de change specs heeft in `specs/<capability>/spec.md`
- **THEN** toont de What-sectie elke capability-naam met het aantal requirements (### Requirement: koppen)

### Requirement: How-sectie toont taakgroepen met voltooiingsstatus
De How-sectie SHALL de taakgroepen uit `tasks.md` tonen (## 1., ## 2., etc.) met per taakgroep de individuele taken en hun voltooiingsstatus (afgevinkt of niet).

#### Scenario: Taakgroepen zichtbaar met vinkjes
- **WHEN** tasks.md taakgroepen bevat met `- [x]` of `- [ ]` items
- **THEN** toont de How-sectie elke groep met groen vinkje (✅) voor voltooide taken en grijs rondje (○) voor openstaande taken

### Requirement: Demo-screenshots zijn base64 embedded
De Demo-sectie SHALL voor elk scenario de screenshot tonen als `<img>` met een base64 data-URI. Als een screenshot-bestand niet bestaat SHALL een placeholder getoond worden.

#### Scenario: Screenshot embedded als base64
- **WHEN** `scenario.screenshot` verwijst naar een bestaand PNG-bestand
- **THEN** toont de Demo-sectie een `<img src="data:image/png;base64,...">` voor dat scenario

#### Scenario: Placeholder bij ontbrekende screenshot
- **WHEN** het screenshot-bestand niet bestaat
- **THEN** toont de Demo-sectie de tekst "screenshot niet beschikbaar" op die positie

### Requirement: Eindblok retro-samenvatting
Het rapport SHALL na alle task-blokken een vaste `<section id="summary">` bevatten met een tabel van alle uitgevoerde taken, hun retro-health-score en top recommendation. Dit blok SHALL bij elke nieuwe run volledig herschreven worden.

#### Scenario: Samenvatting toont alle taken
- **WHEN** meerdere taken zijn uitgevoerd en report.html bevat meerdere task-blokken
- **THEN** toont de summary-sectie elke taak als tabelrij met health-badge (🟢/🟡/🔴) en top recommendation

#### Scenario: Samenvatting herschreven bij nieuwe run
- **WHEN** een nieuwe Wiggum-run wordt toegevoegd aan report.html
- **THEN** is de `<section id="summary">` bijgewerkt met de nieuwe taak erin
