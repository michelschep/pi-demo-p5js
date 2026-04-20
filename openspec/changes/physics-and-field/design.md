## Context

Drie losstaande problemen in de huidige implementatie:
1. `getWindVector` gebruikt "waarheen"-semantiek: angle 0° = wind blaast noordwaarts. De gebruiker verwacht meteorologische "waarvan"-semantiek: angle 0° (N) = wind **van** het noorden = blaast zuidwaarts.
2. Wrijving ontbreekt: `DAMPING = 0.8` geldt alleen bij muurbotsingen. Tussen botsingen in blijft horizontale snelheid constant, ballen komen nooit tot rust.
3. Canvas (600×400) en balstraal (20px) zijn te groot/klein voor de gewenste look.

## Goals / Non-Goals

**Goals:**
- Windvector formule omdraaien: `{x: -sin(θ)*s, y: cos(θ)*s}` zodat Z→omhoog, N→omlaag.
- Wrijving per frame: `velocity.x *= FRICTION`, `velocity.y *= FRICTION` (bijv. 0.988), plus velocity-drempel om micro-bounce te stoppen.
- Horizontaal wrappen: `checkBounds` kaatst niet terug aan x-randen maar wrapt positie.
- Canvas 900×600, `BALL_RADIUS` 12px, label `textSize` 8px.
- Border: `noFill(); stroke(...); rect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT)` in `draw()`.

**Non-Goals:**
- Verticaal wrappen.
- Wrijving afhankelijk van ondergrond of balgewicht.

## Decisions

| Beslissing | Keuze | Reden |
|---|---|---|
| Windformule | `x=-sin(θ)*s, y=cos(θ)*s` | N(0°)→omlaag(+y), Z(180°)→omhoog(-y), O(90°)→links(-x), W(270°)→rechts(+x) — meteorologische conventie |
| Wrijving | `FRICTION = 0.988` per frame | ~50% snelheidsverlies na 5s bij 60fps; subtiel maar merkbaar |
| Rust-drempel | `abs(v) < 0.1` → zet op 0 | Voorkomt eindeloos micro-bewegen zonder zichtbaar effect |
| Wrap-rand | positie teleporteert bij `x < -r` of `x > W+r` | Naadloos: bal verdwijnt aan één kant en verschijnt aan andere kant |
| Border kleur | `#58a6ff` (blauw, zelfde als UI-accent) | Consistent met de rest van de UI |

## Risks / Trade-offs

- **Bestaande x-bounds tests breken**: `checkBounds` tests voor x-kaatsen moeten herschreven worden naar wrap-gedrag.
- **Windvector tests breken**: alle `getWindVector` scenario-tests hebben omgekeerde verwachtingen.
- **FRICTION wijzigt alle bewegingstests**: tests die exacte posities checken na N frames moeten wrijving meenemen.
