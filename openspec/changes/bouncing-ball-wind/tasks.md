## 1. Projectopzet

- [ ] 1.1 Maak `index.html` aan in de projectroot met p5.js geladen via CDN
- [ ] 1.2 Voeg een `<script>`-blok toe met de p5.js `setup()` en `draw()` functies en een canvas van 600×400px

## 2. Stuiterende bal

- [ ] 2.1 Definieer positie-, snelheids- en zwaartekrachtvectoren met `p5.Vector`
- [ ] 2.2 Pas zwaartekracht toe op snelheid en snelheid op positie in `draw()`
- [ ] 2.3 Implementeer randdetectie en stuiteren met dempingsfactor 0.8 voor alle vier randen
- [ ] 2.4 Teken de bal als gevulde cirkel (straal 20px) op de huidige positie

## 3. Windsimulatie

- [ ] 3.1 Bereken windkracht elke frame als `sin(frameCount * 0.02) * 0.3` (horizontaal)
- [ ] 3.2 Pas windkracht toe op de snelheid van de bal in `draw()`

## 4. Windvisualisatie

- [ ] 4.1 Teken een windpijl in de hoek van het canvas die de huidige windrichting en -sterkte toont
- [ ] 4.2 Voeg een label "Wind" toe naast de pijl
