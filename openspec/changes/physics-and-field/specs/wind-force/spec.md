## MODIFIED Requirements

### Requirement: Windkrachtvector gebruikt meteorologische herkomst-conventie
De windvector SHALL worden berekend op basis van de herkomstrichting (waar de wind vandaan komt). De formule SHALL zijn: `{x: -sin(θ) * sterkte, y: cos(θ) * sterkte}` waarbij θ de hoek in radialen is. Zo geeft Z (180°) een opwaartse kracht (negatieve y) en N (0°) een neerwaartse kracht (positieve y).

#### Scenario: Zuid-wind (Z, 180°) geeft opwaartse kracht
- **WHEN** de hoek 180° is (Z, wind van het zuiden) en sterkte > 0
- **THEN** SHALL de windvector `{x: 0, y: -sterkte}` zijn (wind blaast omhoog op canvas)

#### Scenario: Noord-wind (N, 0°) geeft neerwaartse kracht
- **WHEN** de hoek 0° is (N, wind van het noorden) en sterkte > 0
- **THEN** SHALL de windvector `{x: 0, y: +sterkte}` zijn (wind blaast omlaag op canvas)

#### Scenario: Oost-wind (O, 90°) geeft kracht naar links
- **WHEN** de hoek 90° is (O, wind van het oosten) en sterkte > 0
- **THEN** SHALL de windvector `{x: -sterkte, y: 0}` zijn (wind blaast naar links)

#### Scenario: West-wind (W, 270°) geeft kracht naar rechts
- **WHEN** de hoek 270° is (W, wind van het westen) en sterkte > 0
- **THEN** SHALL de windvector `{x: +sterkte, y: 0}` zijn (wind blaast naar rechts)

#### Scenario: Windstilte geeft nulvector
- **WHEN** de sterkte 0 is
- **THEN** SHALL de windvector `{x: 0, y: 0}` zijn ongeacht de hoek

## Test Todos

- [ ] `getWindVector(180, 0.1)` geeft `{x: 0, y: -0.1}` (Z = omhoog)
- [ ] `getWindVector(0, 0.1)` geeft `{x: 0, y: +0.1}` (N = omlaag)
- [ ] `getWindVector(90, 0.1)` geeft `{x: -0.1, y: 0}` (O = naar links)
- [ ] `getWindVector(270, 0.1)` geeft `{x: +0.1, y: 0}` (W = naar rechts)
- [ ] `getWindVector(0, 0)` geeft `{x: 0, y: 0}` (windstilte)
