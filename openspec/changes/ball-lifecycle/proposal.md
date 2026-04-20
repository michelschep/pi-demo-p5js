## Why

De ballen zijn momenteel allemaal gelijkwaardig — er is geen interactie anders dan elastisch terugkaatsen. Door kleursplitsing en het opeten van kleinere ballen krijgt de simulatie een levensachtig karakter waarbij ballen groeien, splitsen en verdwijnen.

## What Changes

- **Radius per bal**: elke bal krijgt een eigen `radius` property (aanvankelijk 12px). Constante `BALL_RADIUS` blijft als beginwaarde.
- **Kleurgroepen**: ballen krijgen een `colorGroup` (0–5) i.p.v. een willekeurige hue. Elke groep heeft een vaste kleur (6 gelijkmatig verdeelde hues: 0°, 60°, 120°, 180°, 240°, 300°).
- **Splitsen**: twee ballen van dezelfde kleurgroep met vergelijkbare grootte (ratio < 1.5) splitsen elk in twee kleinere ballen bij botsing.
- **Opeten**: een bal die minstens 1.5× groter is dan een andere eet de kleinere op en groeit (oppervlakteconservering).
- **Verdwijnen**: ballen met `radius < 4px` worden verwijderd.

## Capabilities

### New Capabilities

- `ball-lifecycle`: splitsen, opeten en verdwijnen van ballen op basis van kleur en grootte.

### Modified Capabilities

- `bouncing-ball`: radius wordt per-instantie ipv constante; kleurgroepen ipv willekeurige hue; `checkBounds` en `resolveCollision` gebruiken `this.radius`.
- `ball-collision`: botsingsdetectie gebruikt `this.radius + other.radius` ipv `2 × BALL_RADIUS`.

## Impact

- `src/ball.js` — `radius` property, `colorGroup`, kleur op basis van groep, `resolveCollision` met per-instantie straal
- `src/sketch.js` — nieuwe botsingsuitkomsten: split/eat/normal; ballen toevoegen/verwijderen uit array
- `__tests__/ball-lifecycle.test.js` — nieuw testbestand
- `__tests__/bouncing-ball.test.js`, `__tests__/ball-collision.test.js` — bijwerken voor per-instantie radius
