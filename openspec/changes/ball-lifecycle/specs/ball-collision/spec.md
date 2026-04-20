## MODIFIED Requirements

### Requirement: Ballen detecteren een botsing
Twee ballen SHALL als botsend worden beschouwd wanneer de afstand tussen hun middelpunten kleiner is dan of gelijk is aan de som van hun individuele stralen (`this.radius + other.radius`).

#### Scenario: Botsing gedetecteerd op basis van per-instantie stralen
- **WHEN** de afstand tussen twee ballen kleiner is dan `r1 + r2`
- **THEN** wordt een botsingsrespons toegepast

#### Scenario: Geen botsing bij ballen op afstand
- **WHEN** de afstand tussen twee ballen groter is dan `r1 + r2`
- **THEN** worden de snelheden niet aangepast

## Test Todos

- [ ] twee ballen met r1=10, r2=8: botsing als afstand ≤ 18
- [ ] twee ballen met r1=10, r2=8: geen botsing als afstand > 18
