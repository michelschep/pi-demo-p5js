## Context

De simulatie toont meerdere ballen op een canvas. In `src/sketch.js` wordt elke bal getekend met `fill(100, 180, 255)` — een vaste kleur voor alle ballen. De `Ball`-klasse in `src/ball.js` heeft geen kleur-property; kleur is puur een zaak van de tekenlogica in de sketch.

## Goals / Non-Goals

**Goals:**
- Elke `Ball`-instantie heeft een eigen unieke kleur
- Kleuren zijn goed onderscheidbaar (gebruik HSB-hue verdeling of een vaste palet)
- Kleurtoewijzing gebeurt automatisch bij aanmaken van een bal (geen handmatige invoer)

**Non-Goals:**
- Kleuren persisteren niet tussen sessies
- Gebruikers kunnen geen kleur kiezen
- Kleur heeft geen invloed op fysica of botsinglogica

## Decisions

### 1. Kleur opslaan in de `Ball`-constructor

**Beslissing**: De `Ball`-constructor genereert zelf een willekeurige kleur en slaat die op als `this.color = { r, g, b }`.

**Alternatieven overwogen:**
- *Kleur injecteren als parameter*: Geeft meer controle aan de aanroeper, maar vereist extra logica in sketch.js en in tests.
- *Kleur uitrekenen in sketch.js op basis van index*: Werkt niet goed bij dynamisch spawnen (index verandert niet bij verwijdering).

**Rationale**: Kapselt verantwoordelijkheid in waar de bal leeft. De sketch hoeft alleen `ball.color` te lezen.

### 2. Kleuralgoritme: hue-rotatie via HSB → RGB

**Beslissing**: Genereer een willekeurige hue (0–360°) met vaste saturatie (80%) en brightness (90%), converteer naar RGB.

**Alternatieven overwogen:**
- *Willekeurige RGB*: Kan onleesbare kleuren opleveren (te donker, te licht, te grijzig).
- *Vaste palet*: Beperkt aantal ballen dat uniek gekleur kan worden.

**Rationale**: HSB met hoge saturatie en brightness levert altijd levendige, goed zichtbare kleuren op een donkere achtergrond.

### 3. Sketch gebruikt `ball.color` in plaats van hardgecodeerde fill

**Beslissing**: Vervang `fill(100, 180, 255)` door `fill(ball.color.r, ball.color.g, ball.color.b)`.

## Risks / Trade-offs

- [Kleurbotsing bij weinig ballen] Twee ballen kunnen toevallig een gelijkaardige hue krijgen → acceptabel; bij weinig ballen is dit zelden storend.
- [p5.js kleurmode] Sketch gebruikt standaard RGB-modus; HSB→RGB conversie gebeurt in JavaScript, geen `colorMode(HSB)` nodig — vermijdt sideeffects in de sketch.
