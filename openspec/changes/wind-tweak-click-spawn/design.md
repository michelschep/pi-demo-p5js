## Context

De simulatie heeft één bal (`let ball`) in `sketch.js` en een windmodule (`src/wind.js`) met `WIND_AMPLITUDE = 0.3`. De wind wordt elke frame direct opgeteld bij de snelheid, waardoor bij hoge amplitude de bal snel dominant naar links/rechts wordt gestuwd. Er is momenteel geen gebruikersinteractie.

## Goals / Non-Goals

**Goals:**
- `WIND_AMPLITUDE` verlagen zodat wind merkbaar maar niet dominant is
- Meerdere ballen ondersteunen via een array in `sketch.js`
- `mousePressed()` toevoegen die een nieuwe bal spawnt op de klikpositie

**Non-Goals:**
- Windrichting of -frequentie aanpassen
- UI-controls voor windsterkte
- Limiet op het maximale aantal ballen

## Decisions

### Beslissing 1: Nieuwe windamplitude = 0.08
**Rationale:** De huidige `0.3` wordt elke frame opgeteld, wat bij 60fps snel dominant wordt. Een waarde van `0.08` is ~4× zwakker en past beter bij zwaartekracht (`0.5`) als referentie. De windpijl-visualisatie blijft zichtbaar (schaal 100 → ±8px arrow, nog herkenbaar).

*Alternatief overwogen:* `0.1` – iets sterker, maar `0.08` geeft een betere balans ten opzichte van de dempingsfactor van `0.8`.

### Beslissing 2: Ballen als array in sketch.js
**Rationale:** De `Ball`-klasse in `src/ball.js` is zelfstandig en herbruikbaar. Eén array `let balls = []` in `sketch.js` vervangt `let ball`. De draw/update loop itereert over de array. Dit vereist geen wijzigingen in `ball.js` zelf.

*Alternatief overwogen:* BallManager-klasse – onnodige complexiteit voor deze schaal.

### Beslissing 3: Spawnen via mousePressed()
**Rationale:** p5.js biedt `mousePressed()` als globale callback. Een nieuwe bal wordt aangemaakt op `{x: mouseX, y: mouseY}` met beginsnelheid `{x: 0, y: 0}` zodat hij direct omlaag valt onder zwaartekracht. Wind en stuiteren werken automatisch via de bestaande loop.

## Risks / Trade-offs

- **Veel ballen → performance** → Acceptabel voor demo-gebruik; geen harde limiet nodig.
- **Windamplitude te laag** → Gebruiker merkt wind nauwelijks. Mitigatie: `0.08` is bewust gekozen als subtiel maar zichtbaar.
- **Klik buiten canvas** → `mousePressed` vuurt ook buiten canvas; `mouseX/mouseY` kan dan buiten bounds zijn. Mitigatie: check of klik binnen canvas valt voor spawnen.
