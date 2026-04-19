## Context

Ballen bewegen al correct met zwaartekracht, wind en randbotsingen. Ze negeren echter andere ballen volledig. Bij meerdere ballen overlappen ze, wat onnatuurlijk oogt.

## Goals / Non-Goals

**Goals:**
- Ballen detecteren wanneer ze elkaar raken
- Snelheden worden correct uitgewisseld langs de botsingsas (elastische botsing, gelijke massa)
- Ballen overlappen na een botsing niet

**Non-Goals:**
- Frictie of energieverlies bij bal-bal botsing (alleen rand-damping blijft)
- Verschillende massa's of radii per bal

## Decisions

**Elastische botsing langs botsingsas**
Bij gelijke massa wisselen de snelheidscomponenten langs de normaal (lijn tussen middelpunten) van teken:
1. Bereken normaalvector `n` = (pos2 - pos1) / afstand
2. Bereken relatieve snelheid langs normaal: `dvn = dot(v1 - v2, n)`
3. Als `dvn >= 0`: ballen bewegen al uit elkaar — sla over
4. Pas correctie toe: `v1 -= dvn * n`, `v2 += dvn * n`
5. Schuif ballen uit elkaar zodat ze exact raken (geen overlap)

Alternatief (volledige snelheidswisseling) werkt alleen voor frontale botsingen; de normaal-projectiemethode werkt voor alle hoeken.

**Positiecorrectie na botsing**
Overlap = `2 * RADIUS - afstand`. Elke bal schuift `overlap / 2` terug langs de normaal. Dit voorkomt dat ballen "plakken" of door elkaar heen bewegen bij hoge snelheid.

**O(n²) parencheck per frame**
Met het verwachte aantal ballen (<20) is een eenvoudige dubbele lus voldoende. Spatial hashing is buiten scope.

## Risks / Trade-offs

- [Tunneling bij hoge snelheid] → Niet aangepakt; ballen bewegen langzaam genoeg dankzij damping
- [O(n²) schaalt slecht] → Acceptabel voor dit project; toekomstige optimalisatie mogelijk
