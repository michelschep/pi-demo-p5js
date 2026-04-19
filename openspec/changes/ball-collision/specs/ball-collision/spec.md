## ADDED Requirements

### Requirement: Ballen detecteren een botsing
Twee ballen SHALL als botsend worden beschouwd wanneer de afstand tussen hun middelpunten kleiner dan of gelijk is aan de som van hun stralen (2 × BALL_RADIUS).

#### Scenario: Botsing gedetecteerd bij overlappende ballen
- **WHEN** de afstand tussen twee ballen kleiner is dan of gelijk aan 2 × BALL_RADIUS
- **THEN** wordt een botsingsrespons toegepast op beide ballen

#### Scenario: Geen botsing bij ballen op afstand
- **WHEN** de afstand tussen twee ballen groter is dan 2 × BALL_RADIUS
- **THEN** worden de snelheden van beide ballen niet aangepast door bal-bal interactie

### Requirement: Ballen ketsen de juiste kant op bij een botsing
Bij een botsing SHALL de snelheidscomponent langs de botsingsas (normaalvector tussen de twee middelpunten) worden uitgewisseld. Snelheidscomponenten loodrecht op de botsingsas blijven ongewijzigd. Als de ballen al van elkaar af bewegen SHALL geen aanpassing plaatsvinden.

#### Scenario: Frontale botsing wisselt snelheden
- **WHEN** twee ballen frontaal op elkaar botsen (snelheden tegengesteld langs de botsingsas)
- **THEN** worden de snelheden volledig uitgewisseld zodat beide ballen terugkaatsen

#### Scenario: Schuine botsing past alleen de normaalcomponent aan
- **WHEN** twee ballen elkaar schuin raken
- **THEN** wordt alleen de snelheidscomponent langs de normaalvector aangepast en blijft de tangentiële component ongewijzigd

### Requirement: Ballen overlappen niet na een botsing
Na botsingsrespons SHALL de positie van elke bal worden gecorrigeerd zodat de onderlinge afstand exact gelijk is aan 2 × BALL_RADIUS. Elke bal beweegt de helft van de overlap langs de normaalvector.

#### Scenario: Overlap opgeheven na botsing
- **WHEN** twee ballen overlappen na een frame-update
- **THEN** worden beide posities gecorrigeerd zodat hun middelpunten exact 2 × BALL_RADIUS uit elkaar staan
