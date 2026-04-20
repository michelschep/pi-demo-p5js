## MODIFIED Requirements

### Requirement: Windkrachtvector is door gebruiker instelbaar in 2D
Het systeem SHALL een windkrachtvector berekenen op basis van een door de gebruiker opgegeven hoek (in graden, 0 = Noord kloksgewijs) en sterkte. De vector SHALL worden berekend als `{x: sin(θ) * sterkte, y: -cos(θ) * sterkte}` waarbij θ de hoek in radialen is. De automatische sinusgolf (`calculateWind`) SHALL worden verwijderd.

#### Scenario: Noord-wind geeft negatieve y-component
- **WHEN** de hoek 0° is (Noord) en sterkte > 0
- **THEN** SHALL de windvector `{x: 0, y: -sterkte}` zijn (wind blaast omhoog op canvas)

#### Scenario: Oost-wind geeft positieve x-component
- **WHEN** de hoek 90° is (Oost) en sterkte > 0
- **THEN** SHALL de windvector `{x: sterkte, y: 0}` zijn (wind blaast naar rechts)

#### Scenario: Zuid-wind geeft positieve y-component
- **WHEN** de hoek 180° is (Zuid) en sterkte > 0
- **THEN** SHALL de windvector `{x: 0, y: sterkte}` zijn (wind blaast omlaag op canvas)

#### Scenario: West-wind geeft negatieve x-component
- **WHEN** de hoek 270° is (West) en sterkte > 0
- **THEN** SHALL de windvector `{x: -sterkte, y: 0}` zijn (wind blaast naar links)

#### Scenario: Windstilte geeft nulvector
- **WHEN** de sterkte 0 is
- **THEN** SHALL de windvector `{x: 0, y: 0}` zijn ongeacht de hoek

### Requirement: applyWind past 2D windvector toe op snelheid
Het systeem SHALL `applyWind(velocity, windVector)` accepteren waarbij `windVector` een object `{x, y}` is. Zowel de x- als y-component van de snelheid SHALL worden aangepast.

#### Scenario: Wind beïnvloedt zowel x als y snelheid
- **WHEN** `applyWind({x: 1, y: 2}, {x: 0.1, y: -0.1})` wordt aangeroepen
- **THEN** SHALL het resultaat `{x: 1.1, y: 1.9}` zijn

#### Scenario: Nulvector verandert snelheid niet
- **WHEN** `applyWind({x: 2, y: 3}, {x: 0, y: 0})` wordt aangeroepen
- **THEN** SHALL het resultaat `{x: 2, y: 3}` zijn

### Requirement: Windvisualisatie toont 2D richting en sterkte
De windpijl op het canvas SHALL zowel dx als dy tonen zodat de volledige 2D windrichting zichtbaar is. `getWindArrow` SHALL een object `{dx, dy}` teruggeven.

#### Scenario: Noord-wind toont pijl omhoog
- **WHEN** de windvector `{x: 0, y: -0.1}` is
- **THEN** SHALL `getWindArrow` een object teruggeven met `dy < 0` en `dx ≈ 0`

#### Scenario: Diagonale wind toont schuine pijl
- **WHEN** de windvector `{x: 0.1, y: -0.1}` is
- **THEN** SHALL `getWindArrow` `dx > 0` en `dy < 0` teruggeven
