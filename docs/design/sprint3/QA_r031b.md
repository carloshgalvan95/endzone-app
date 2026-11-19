# QA r031b de endzone-app (fix/no-market-in-app, commit fd48b85, 80 tests, 185 claves)

19 nov 2026, hora de Ciudad de México. QA pixel contra la spec de `build_r031/QA_r031.md` y las filas History bento (r031) y How: Method link (r031) de `hybrid/handoff_components.csv`. Las capturas miden 780 x 1688 px, a 2 px por dp (390 x 844 dp). No se tocó ningún repo.

Idaho cerró las open questions:
- No hay racha.
- El CSV de 185 claves es la fuente de verdad.
- `weeks` llega solo hasta la semana actual.
- No hay línea de empates.

## Veredicto

**Pasa sin P0 ni P1.**
- F62 a F68 quedan cerrados.
- Hay 4 P2 nuevos (F69 a F72), todos baratos. Ninguno bloquea; conviene resolverlos antes de taggear v0.3.1.

## Validez de las capturas

- **sha256:** las 9 de r031b y las 6 de r031 son únicas entre sí y no coinciden con ninguna otra PNG de `sprint3/`.
- **Tema:** las dark-* tienen fondo `#1B1F23` y las light-* `#F4EEDF`.
- **Idioma:**
  - En las *-en se lee "History", "Season 2026" y "The method is public.".
  - En las *-es se lee "Historial", "Temporada 2026" y "El método es público.".
- **dark-historial-nofinals:** solo la semana 10 tiene finales (12 de 14) y la 11 no tiene. Sirve para probar la semana sin finales y el colapso a una baldosa. No muestra el estado de temporada sin finales (`hist.hero.none`, n = 0); falta esa captura.

| Captura | sha256 (16) |
| --- | --- |
| dark-historial-en | d25a41bc2637b2f3 |
| dark-historial-es | ccd78a2064dd51c9 |
| dark-historial-nofinals | 3479988a219a0f05 |
| dark-how-s6-en | 980715e2da583df4 |
| dark-how-s6-es | 56c5388e00571f70 |
| light-historial-en | 3ace4d2e108bbdbf |
| light-historial-es | 551532ea5a2976f4 |
| light-how-s6-en | 3c77e19f851b3d04 |
| light-how-s6-es | 19af6c0ed3d9a20f |
| r031 dark-historial-en | 1d6fa5f8c184e241 |
| r031 light-historial-en | ff9164596be23ad3 |
| r031 dark-how-s6-en | 351c3f9b69c17498 |
| r031 dark-how-s6-es | a95842e90f868c17 |
| r031 light-how-s6-en | d8decf4b7e21ec5a |
| r031 light-how-s6-es | d57c7c0f4656a998 |

## Nota sobre r031 (capturas viejas, ya medidas)

Las 6 capturas de r031 confirman las severidades provisionales, sin cambios: F62 P1, F63 P2, F64 P1, F65 P1, F66 P2.
- El Historial era una lista sin baldosas.
- Una card "Correct calls this season." más la etiqueta "Correct calls" repetían el título.
- Se leía "29 of 48 decided games, the contract threshold.".
- Cada semana era una franja de campo con un aro azul suelto, y "No finals" quedaba colgando debajo.
- s6 decía "El método es público: https://github.com/..." en tres líneas.

Claro y oscuro tenían la misma estructura. `QA_r031.md` no se reescribe.

## Medidas de r031b

| Punto | Medida | Estado |
| --- | --- | --- |
| Masthead | Kicker "HISTORY" en mono muted y "Season 2026" en Jost 700 | ok |
| Héroe | x 16 a 374 (358) e y 99 a 303 (204, por las dos líneas de muestra chica; spec 204). Relleno `#F4EEDF` con tinta `#151515` en dark y `#151515` con cream en light: 15.78:1 en ambos. k "23" con ink desde x 34 (padding 16 más el sidebearing), alto de cifra 70 dp (display 96) | ok |
| "of n" | "of 29" / "de 29" a 7 dp de k. Base en y 194, contra 197.5 de k | F72 |
| Línea y muestra chica | "games won by the model's favorite" / "partidos que ganó el favorito del modelo". La muestra chica va en `#5E5950` sobre cream (6.01:1) y en `#A9A396` sobre tinta (7.28:1). No imprime el umbral | ok |
| Gap | Héroe a semanal 8; semanal a tiles 8; tiles entre sí 8 | ok |
| Semanal | y 311 a 522 (211, spec 206, +5 de interlínea). Superficie `#262B30` / `#E8E0CC` con borde 1 dp `#30363C` / `#D9D1BD`. Línea base de 1 dp en y 450 a 451 | ok |
| Barras | pitch 40 y ancho 24. Semana 9: 14 aciertos y 1 fallo (15 unidades, tope en 357, 94 dp ≈ 96). Semana 10: 9 y 5 (14 unidades, 87.5 dp). u = 6.4: bloques de ~4.4 con hueco 2. Aciertos rellenos `#5A86D6` (3.95:1 en surface dark) y `#22509B` (5.94:1 en light). Fallos con contorno de 1 dp `#A9A396` / `#5E5950` (5.69 / 5.29) | ok, ver F71 y abajo |
| Contorno de fallo | 1 dp en lugar de 1.5. Con bloques de 4.4 dp, un trazo de 1.5 deja 1.4 dp de hueco y se lee como bloque relleno | Aceptado; spec ajustada (1 dp si u - 2 < 6) |
| Semana sin finales | La 11 muestra solo la línea base y el número "11" en muted. Sin barra, sin aro y sin texto. En nofinals pasa lo mismo | ok |
| Números de semana | Plex Mono 11 muted, ink en y 462 a 470 (8 dp bajo la base). Centros en 53, 93 y 133; las barras están centradas en 45 y 85 | F71 |
| Leyenda | Cuadro lleno "Correct" / "Acierto" y cuadro en contorno "Missed" / "Fallo" | ok |
| Tiles | x 16 a 191 y 199 a 374 (175 cada una, gap 8), y 530 a 699 (169, crecen por el wrap). Kicker mono muted "BEST WEEK" / "MEJOR SEMANA" y "LATEST WEEK" / "ÚLTIMA SEMANA". La cifra en Jost 700 40 parte en dos líneas: "14 of / 15", "14 de / 15" y, en ES, también "9 de / 14" | F69 |
| Reglas de tiles | Mejor = semana 9 (14 aciertos); última = semana 10. Son distintas, así que van dos tiles: correcto | ok |
| Colapso | En nofinals hay una sola semana con finales y sale una sola baldosa W "LATEST WEEK 12 of 14 / Week 10", de 358 x 125 (mín 124) | ok |
| Pie | `detail.footer` en muted y "How it is calculated" / "Cómo se calcula" subrayado en `#8AA6DC` (6.76:1) / `#22509B` (6.75:1). Todo termina antes de la nav (y 780) | ok |
| Amarillo | Solo el indicador de la nav, 56 x 32 (x 167 a 223, y 788 a 820); en light con borde tinta. En s6 hay 0 px amarillos | ok |
| Modelo azul | Bloques, leyenda y enlaces en `#5A86D6` / `#8AA6DC` (dark) y `#22509B` (light) | ok |
| Intl es-MX | Historial solo muestra enteros (23, 29, 14, 15), sin separador. s5 dice "Aciertos 23 de 29". No hay decimales que verificar en estas pantallas | ok |
| Mercado y apuestas | Leí todo el texto visible de las 9 capturas: 0 market/mercado y 0 lenguaje de apuestas. Catálogo de diseño: 185 claves, 0 coincidencias | ok |
| s6 | Título "The method is public." / "El método es público."; cuerpo `how.s6.p1` igual al CSV; enlace "Read the model card" / "Lee el model card" subrayado en azul modelo, una sola línea en y 788 a 804, sin URL ni título repetido. Sin gráfica ni números. Barra de progreso 06 sin amarillo | ok, ver F70 |
| Ícono externo | Cuadro vacío de 16 x 16 dp con contorno azul y sin flecha | F70 |

## Estado de F62 a F68

| ID | Sev. original | Estado | Evidencia |
| --- | --- | --- | --- |
| F62 | P1 | Cerrado | Bento D completo: héroe invertido, semanal, dos tiles y pie, con una sola forma de color |
| F63 | P2 | Cerrado | No hay card que repita el título |
| F64 | P1 | Cerrado | No hay "contract threshold". La muestra chica va sin umbral |
| F65 | P1 | Cerrado | No hay aros. La semana sin finales muestra solo línea base y número |
| F66 | P2 | Cerrado | El enlace no repite el título ni muestra la URL |
| F67 | P1 | Cerrado | El build tiene 185 claves iguales al CSV y la guardia pasa. En el CSV hay 0 market/mercado |
| F68 | P2 | Cerrado según Idaho | Los tokens de mercado están borrados en el build. No se puede verificar en píxeles y no abrí el repo. En el handoff corregí la mención "Not on History week-level dumbbells" de la fila Logo slot |

## Hallazgos nuevos

| ID | Sev. | Pantalla | Hallazgo | Fix |
| --- | --- | --- | --- | --- |
| F69 | P2 | Historial, tiles, EN y ES | La cifra parte en dos líneas: "14 of 15" mide 156 dp a Jost 700 40, "14 de 15" 166 y "9 de 14" 147, y el interior de la tile es 143. Es un error de mi spec r031 | Igual que en el héroe: k en `type.tileFigure` 40 y "of n" (`hist.hero.of`) en `type.title` 24 sobre la misma base, a 8 dp. "14" + "de 15" mide ~120 dp y cabe en el peor caso ("16 de 16") |
| F70 | P2 | How s6, 4 capturas | El ícono externo es un cuadro vacío de 16 dp, sin flecha. Se lee como checkbox y en Historial es el mismo glifo que la leyenda "Missed" | Usar el ícono de enlace externo con flecha diagonal (por ejemplo `open-in-new` / `arrow-up-right` del set de la nav), 16 dp, en `modelLabel`. Si no está en el set, quitarlo: el subrayado ya dice que es enlace |
| F71 | P2 | Historial, semanal | Las barras van alineadas a la izquierda de su columna (x 33 a 57 y 73 a 97) y los números quedan centrados en la columna (53 y 93): 8 dp de desfase. Mi spec no decía "centrado" | Centrar cada barra en su columna: centro = izquierda interior + pitch × (i + 0.5), es decir 53, 93, 133. El número va bajo ese mismo centro |
| F72 | P2 | Historial, héroe | La base de "of 29" queda 3.5 dp arriba de la base de k (194 contra 197.5). Parece alineado por la caja de línea, no por la base del texto | Alinear por la base del texto (`alignItems: 'baseline'` o un offset calculado con las métricas de Jost). Tolerancia de 1 dp |

**Nota P2 (cobertura, no es defecto):** falta la captura de `hist.hero.none` (temporada con n = 0, sin semanal ni tiles).

## Cambios en la spec

- **Fila History bento (r031):**
  - Barra centrada en su columna, con el número bajo la barra.
  - Contorno de fallo de 1 dp cuando u - 2 < 6, y de 1.5 en otro caso.
  - Figura de tile y héroe: k más "of n" en title 24 sobre la misma base. La cifra no parte línea.
- **Fila Logo slot:** quité la referencia a las mancuernas de Historial.

Siguen 29 filas de 8 columnas y 0 em dash o en dash. No toqué `strings_en_es.csv` (185 claves); no hacen falta claves nuevas.

## Rutas

- `QA_r031b.md`
- `QA_r031b_board.png` (3840 x 2160, chunks IHDR, pHYs, IDAT, IEND; interno)
- `handoff_components.csv`
