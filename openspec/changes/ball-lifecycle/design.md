## Context

Ballen hebben nu een gedeelde `BALL_RADIUS = 12`. Alle botsings- en grenslogica gebruikt deze constante. De lifecycle-feature vereist dat elke bal zijn eigen `radius` bijhoudt zodat ballen kunnen groeien en krimpen.

## Goals / Non-Goals

**Goals:**
- `Ball.radius` als per-instantie property, initieel `BALL_RADIUS`.
- `Ball.colorGroup` (0–5), kleur = `hsbToRgb(colorGroup * 60, 0.85, 0.9)`.
- `resolveCollision` gebruikt `this.radius + other.radius` als collision distance.
- `checkBounds` gebruikt `this.radius`.
- Botsingsuitkomst-logica in `sketch.js` (niet in `Ball`):
  1. `ratio = max/min radius ≥ 1.5` → grotere eet kleinere: `larger.radius = sqrt(r1²+r2²)`, kleinere verwijderd
  2. Zelfde `colorGroup` EN `ratio < 1.5` → beide splitsen: elk → 2 ballen met `radius * 0.707`, loodrechte snelheid ±2px
  3. Anders → bestaande elastische botsing
- `MIN_RADIUS = 4` — ballen onder deze grens worden verwijderd na elke frame.

**Non-Goals:**
- Massa-gebaseerde fysica (alle ballen hebben gelijke dichtheid).
- Animatie bij splitsen of opeten.
- Maximale balgrootte.

## Decisions

| Beslissing | Keuze | Reden |
|---|---|---|
| Grootte-drempel eten | ratio ≥ 1.5 | Klein genoeg om splits te laten werken, groot genoeg om per ongeluk opeten te voorkomen |
| Split-radius | `r * √0.5 ≈ r * 0.707` | Oppervlakteconservering: 2 × π(r·0.707)² ≈ π·r² |
| Split-snelheid | ±2px/frame loodrecht op botsingsas | Zichtbare scheiding zonder te wild te worden |
| Kleurgroepen | 6 (elke 60°) | Herkenbaar onderscheid; grote kans op same-color botsingen |
| MIN_RADIUS | 4px | Zichtbaar maar klein; onder 4px onleesbaar label |
| Collision distance | `this.radius + other.radius` | Correct voor ballen van verschillende grootte |

## Risks / Trade-offs

- **Bal-explosie**: splitsen kan exponentieel veel ballen genereren. Mitigatie: ballen onder `MIN_RADIUS` verdwijnen direct, wat de groei begrenst.
- **Bestaande tests**: `ball-collision.test.js` en `bouncing-ball.test.js` gebruiken `2 * BALL_RADIUS` — moeten worden bijgewerkt.
