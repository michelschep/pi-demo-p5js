## ADDED Requirements

### Requirement: status.json bevat actieve OpenSpec-context
Het systeem SHALL `status.json` uitbreiden met de velden `currentSpec` (actieve spec-capability, string of null) en `currentTaskGroup` (actieve taakgroep-titel uit tasks.md, string of null). Deze velden SHALL worden bijgewerkt door de orchestrator bij elke fase-overgang.

#### Scenario: Context ingesteld bij start van een fase
- **WHEN** de orchestrator een nieuwe pipeline-fase start voor een bepaalde spec-capability
- **THEN** bevat `status.json.currentSpec` de naam van die capability en `status.json.currentTaskGroup` de bijbehorende taakgroeptitel

#### Scenario: Context leeg tijdens fase zonder spec-context
- **WHEN** de orchestrator een fase uitvoert die niet aan een specifieke spec is gebonden (bijv. git, retrospective)
- **THEN** zijn `currentSpec` en `currentTaskGroup` null

### Requirement: TUI-widget toont OpenSpec-context
De TUI-widget SHALL onder de pipeline stage-boxes één contextregel tonen met de actieve change-naam, spec-capability en taakgroep, gescheiden door `›`. De contextregel SHALL alleen getoond worden als er activiteit is.

#### Scenario: Contextregel zichtbaar tijdens actieve run
- **WHEN** `status.json.currentSpec` een waarde heeft
- **THEN** toont de widget de regel `📋 <change> › <spec> › <taakgroep>`

#### Scenario: Contextregel toont alleen change bij ontbrekende spec
- **WHEN** `status.json.currentSpec` null is maar er wel een actieve `task` is
- **THEN** toont de widget de regel `📋 <change>`

#### Scenario: Geen contextregel bij geen activiteit
- **WHEN** alle pipeline-fasen `idle` zijn
- **THEN** toont de widget geen contextregel en ook geen stage-boxes

### Requirement: progress.html toont OpenSpec-context
De gegenereerde `wiggum/progress.html` SHALL naast de pipeline-statustabel een sectie tonen met de actieve change, spec-capability en taakgroep.

#### Scenario: Context-sectie aanwezig in progress.html
- **WHEN** `status.json` een actieve task heeft met currentSpec ingevuld
- **THEN** toont progress.html de actieve change-naam, spec en taakgroep als aparte rijen boven de pipeline-tabel

### Requirement: Refinement-agent geeft altijd approved terug
De refinement-agent SHALL altijd `status: "approved"` schrijven naar `wiggum/results/refinement.json`. De agent SHALL nooit `needs-clarification` gebruiken of vragen aan de gebruiker stellen. Observaties over onvolledigheid SHALL als `notes` worden vastgelegd, niet als blokkerende `questions`.

#### Scenario: Refinement keurt altijd goed
- **WHEN** de refinement-agent wordt aangeroepen voor een OpenSpec change
- **THEN** schrijft hij `{"status": "approved"}` naar refinement.json, ongeacht de inhoud van de artifacts

#### Scenario: Observaties landen als notes
- **WHEN** de refinement-agent een potentieel onduidelijkheid opmerkt
- **THEN** schrijft hij dit als tekst in het `notes`-veld en retourneert alsnog `approved`
