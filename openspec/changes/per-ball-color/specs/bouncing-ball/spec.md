## MODIFIED Requirements

### Requirement: Bal wordt visueel weergegeven
De bal SHALL als gevulde cirkel worden getekend met een vaste straal van 20px en de eigen unieke kleur van die bal.

#### Scenario: Bal zichtbaar op canvas
- **WHEN** het canvas wordt getekend
- **THEN** is de bal zichtbaar als cirkel op de huidige positie, getekend in de eigen kleur van die bal

#### Scenario: Elke bal heeft een unieke kleur
- **WHEN** een nieuwe bal aangemaakt wordt
- **THEN** krijgt die bal automatisch een willekeurige unieke kleur (hue-gebaseerd, hoge saturatie en brightness) die verschilt van de vaste standaardkleur

#### Scenario: Kleur blijft consistent
- **WHEN** een bal over het canvas beweegt, stuitert of botst
- **THEN** blijft de kleur van die bal onveranderd gedurende de hele levensduur
