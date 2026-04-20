## ADDED Requirements

### Requirement: Ballen splitsen bij botsing met gelijke kleur en vergelijkbare grootte
Wanneer twee ballen met dezelfde `colorGroup` botsen en de verhouding van hun stralen kleiner is dan 1.5, SHALL elke bal worden vervangen door twee nieuwe kleinere ballen. De nieuwe straal SHALL `oudRadius × √0.5` zijn. De nieuwe ballen krijgen de oorspronkelijke snelheid plus een loodrechte component van ±2px/frame om uiteen te bewegen.

#### Scenario: Twee gelijke ballen splitsen
- **WHEN** twee ballen met dezelfde `colorGroup` en gelijke straal botsen
- **THEN** SHALL elke bal worden vervangen door twee ballen met `radius = oudRadius × 0.707`

#### Scenario: Gesplitste ballen bewegen uiteen
- **WHEN** een splitsing plaatsvindt
- **THEN** SHALL de twee nieuwe ballen een loodrechte snelheidscomponent krijgen zodat ze van elkaar af bewegen

#### Scenario: Gesplitste ballen behouden kleurgroep
- **WHEN** een splitsing plaatsvindt
- **THEN** SHALL de nieuwe ballen dezelfde `colorGroup` hebben als de oorspronkelijke bal

### Requirement: Grotere ballen eten kleinere ballen op
Wanneer twee ballen botsen en de verhouding van de grootste naar de kleinste straal groter dan of gelijk is aan 1.5, SHALL de grotere bal de kleinere opeten. De straal van de grotere bal SHALL groeien via oppervlakteconservering: `nieuweStraal = √(r₁² + r₂²)`. De kleinere bal SHALL worden verwijderd.

#### Scenario: Grote bal eet kleine bal
- **WHEN** een bal met straal `r1` botst met een bal met straal `r2` en `r1 / r2 ≥ 1.5`
- **THEN** SHALL de grote bal groeien naar `√(r1² + r2²)` en de kleine bal verdwijnen

#### Scenario: Grotere bal behoudt kleurgroep na eten
- **WHEN** een grote bal een kleine bal eet
- **THEN** SHALL de kleurgroep van de grote bal onveranderd blijven

### Requirement: Te kleine ballen verdwijnen
Ballen met een straal kleiner dan `MIN_RADIUS = 4px` SHALL aan het einde van elke frame worden verwijderd uit de simulatie.

#### Scenario: Bal verdwijnt onder minimale grootte
- **WHEN** de straal van een bal kleiner wordt dan 4px
- **THEN** SHALL de bal worden verwijderd uit de ballen-array

#### Scenario: Bal op exact de minimale grootte blijft
- **WHEN** de straal van een bal gelijk is aan 4px
- **THEN** SHALL de bal in de simulatie blijven

## Test Todos

- [ ] twee ballen zelfde colorGroup, ratio < 1.5 → beide vervangen door 2 kleinere (totaal 4 ballen)
- [ ] gesplitste ballen hebben `radius ≈ oudRadius × 0.707`
- [ ] gesplitste ballen hebben zelfde `colorGroup` als origineel
- [ ] bal met r1=18 botst met r2=12 (ratio=1.5) → grote eet kleine, grote.radius ≈ √(18²+12²) ≈ 21.6
- [ ] bal met r1=20 botst met r2=12 (ratio>1.5) → kleine verdwijnt
- [ ] bal met r1=12 botst met r2=12, andere colorGroup → geen split, geen eten (normale botsing)
- [ ] bal met radius=3 (< MIN_RADIUS=4) wordt verwijderd na frame
- [ ] bal met radius=4 (= MIN_RADIUS) blijft bestaan
