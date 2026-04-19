## MODIFIED Requirements

### Requirement: Bal wordt visueel weergegeven
De bal SHALL als gevulde cirkel worden getekend met een vaste straal van 20px, de eigen unieke vulkleur van die bal, én een zichtbare rand van 3px in de complementaire kleur van de vulkleur.

#### Scenario: Bal zichtbaar op canvas
- **WHEN** het canvas wordt getekend
- **THEN** is de bal zichtbaar als cirkel op de huidige positie, getekend in de eigen vulkleur van die bal

#### Scenario: Elke bal heeft een unieke vulkleur
- **WHEN** een nieuwe bal aangemaakt wordt
- **THEN** krijgt die bal automatisch een willekeurige unieke vulkleur (hue-gebaseerd, hoge saturatie en brightness) die verschilt van de vaste standaardkleur

#### Scenario: Kleur blijft consistent
- **WHEN** een bal over het canvas beweegt, stuitert of botst
- **THEN** blijft de vulkleur van die bal onveranderd gedurende de hele levensduur

#### Scenario: Bal heeft zichtbare rand
- **WHEN** het canvas wordt getekend
- **THEN** heeft de bal een rand van 3px in de complementaire kleur van de vulkleur (hue verschoven met 180°)

#### Scenario: Randkleur blijft consistent
- **WHEN** een bal over het canvas beweegt, stuitert of botst
- **THEN** blijft de randkleur van die bal onveranderd gedurende de hele levensduur
