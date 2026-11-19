# QA r4d del build 74eb461 (solo web, 72 tests)

19 nov 2026, hora de Ciudad de México. Es la QA de cierre del sprint visual. Hay 10 capturas en `build_r4d/`, todas de 780 x 1688 px, a 2 px por dp, con un viewport de 390 x 844 dp. Las cotas van en dp. Spec vigente: `build_r4c/QA_r4c.md`, `H3_how.md`, `render_h3_how.py` (board), `tokens.ts` y `handoff_components.csv`. No se tocó ningún repo.

## Veredicto

**Sprint visual cerrado.**
- No quedan P0 ni P1. Se cierran con medida los 5 P1 Must de r4c (F58, F51, F31, F44 y F43) y el P2 Must barato F53.
- F57 se acepta con condición: falta un test unitario (ver abajo). No es un hallazgo visual.
- Hay un hallazgo nuevo, F61 (P2), sobre cómo se mide la regla de 3:1 de los logos. No bloquea el cierre.

| Grupo | IDs | N |
| --- | --- | --- |
| P0 | ninguno | 0 |
| P1 | ninguno | 0 |
| Cerrados en r4d | F58, F51, F31, F44, F43, F53 | 6 |
| Aceptado con test pendiente | F57 | 1 |
| P2 Must barato (nuevo) | F61 | 1 |
| P2 Later | F15, F18, F29, F32, F33, F35, F41r, F45r, F46, F47, F48, F49, F52, F56, F59, F60 | 16 |

## Validez de las capturas

- **sha256:** las 10 son únicas. Ninguna coincide con `build_r4`, `build_r4b` ni `build_r4c`. En el cruce global solo siguen los duplicados viejos de r4 y r4b.
- **Nombre contra contenido:**
  - Las en-how-* y es-how-* tienen fondo claro `#F4EEDF`. Las es-* están en español ("Aciertos", "contra", "La regla exacta").
  - s5-fixture y s6-fixture muestran los datos del fixture.
  - dark-week tiene fondo `#1B1F23`.
  - dark-detail-giants ahora sí es Detail: FINAL Commanders at Giants, en oscuro, sobre `#1B1F23`.
- **Resultado:** 10 válidas, 0 rechazadas.

| Captura | sha256 (16) |
| --- | --- |
| dark-detail-giants | 456b99be826dce0e |
| dark-week | 275c0135ca8aa693 |
| en-how-s2 | 70911cfdd7a77e94 |
| en-how-s3-open | 655f1ef26c772297 |
| en-how-s4-open | dfc2f9963f7fad8c |
| en-how-s5-fixture | f3a81a6d841e577b |
| en-how-s6-fixture | 3a3da958a64b4962 |
| es-how-s3-open | 37120fcfaa274566 |
| es-how-s5-fixture | 11d96f6138e2a0f2 |
| es-how-s6-fixture | 23c9a246e756c53d |

## Cerrados en r4d

| ID | Medida |
| --- | --- |
| F58 | En s5 se lee "Correct calls 11 of 16" y en ES "Aciertos 11 de 16". En el paso 6 se lee "2026 season to date, small sample" con "0.612 vs 0.588", y en ES "0,612 contra 0,588". En ninguna captura How aparecen 23/29, 0.559, 0.506 ni 7,000. Sí aparecen 0.621 / 0,621 y 0.598, pero como valores congelados del holdout. Idaho dice que ya no son literales; eso no se puede comprobar con píxeles, y el test del binding lo cubre |
| F51 | Hay 24 dp entre la última línea del cuerpo (~112) y HOLDOUT (~136). El plot mide 268 (163 a 430.5). El marco de datos sale x = 61.2 + 269.5 p e y = 388.1 - 180.1 o. Ejes de 1 dp: x en y 387.5 a 388.5, y en x 60.5 a 61.5. axisPad de ~45 a la izquierda (con el borde) y ~42.4 abajo (spec 44). Labels: "0" en x con centro en 61.0 (dato 61.2) y "1" en 331.25 (dato 330.75); en y, "0" con centro en 388 y "1" en 208 (datos 388.1 y 208.0), a 6 dp del eje. Diagonal: una sola línea de (0,0) a (1,1), de 324 dp, con 39 a 40 guiones. Patrón de ~4 on / 4 off (4.5 / 3.5 por el antialias), trazo de 1 dp, en muted (~`#726D63` con antialias). ES idéntica |
| F31 | El slot de Giants muestra un monograma "NYG" de 32 x 32 dp (x 56 a 88, y 145 a 177), en Jost 700 y en cream `#F4EEDF`. Sobre `#1B1F23` da 14.32:1 (AA). El anillo mide 1 a 1.5 dp, en `#8C877D` (neutro apagado, sin color NFL real, como pide la fila Monogram), y da 4.64:1. No lleva relleno ni placa. Commanders conserva su logo, con una media por píxel de 3.08:1 (pasa 3:1) |
| F44 | 10 puntos de 6 dp con paso de 9 (gap 3), en y 403.5 a 408.5 (6 dp). Van de x 151 a 238 (87 dp), dentro de la card de x 142 a 248 (interior de 90: 151 a 241). EN y ES idénticas |
| F43 | El ápice del fulcro está en y 565 y la flecha empieza en 569: 4 dp. La flecha ocupa x 191 a 199 (centro 195) e y 569 a 586. La píldora "Learned home edge" va de x 133 a 257 (centro 195.0) y de y 598 a 624. Ya no aparece la marca suelta en x 28 |
| F53 | ES dice "0,612 contra 0,588" |

## F57 (aceptado, con test pendiente)

El formato sale de Intl según el locale, y la VM usa un es genérico; por eso se ve "0,612". Se acepta si el build agrega un test unitario que pruebe:
- es-MX da "0.612" y "7,000".
- es-ES da "0,612".
No es un hallazgo visual.

## Nuevo: F61 (P2 Must barato), métrica de 3:1 para logos en oscuro

La regla de r4c dice "mean contrast of the opaque logo pixels" pero no fija la métrica, y el build no sigue ninguna de las candidatas. La medí en pantalla (dark-week y dark-detail-giants de r4c, slot de 24 dp, píxeles distintos del surface, `#262B30`):

| Equipo | Media de ratios por píxel | Ratio del color medio | Build r4d |
| --- | --- | --- | --- |
| Giants | 1.07 | 1.08 | monograma (ok) |
| Jets | 1.45 | 1.43 | sin captura en r4d |
| Panthers | 1.60 | 1.17 | **logo** |
| Colts | 2.86 | 2.04 | **logo** |
| Cardinals | 2.91 | 1.69 | monograma (ok) |
| Bills | 3.04 | 2.11 | sin captura en r4d |
| Commanders | 3.08 | 2.24 | logo (ok) |
| Ravens | 3.66 | 2.46 | logo (ok) |
| Texans | 4.18 | 1.99 | **monograma** |
| Chiefs | 7.60 | 5.55 | logo (ok) |

- Con la media por píxel (la única que deja a Commanders con logo, como se pidió), Panthers y Colts deberían pasar a monograma y Texans debería conservar el logo.
- No es P1: en los tres casos el nombre del equipo va al lado y ningún slot queda en blanco. Panthers 1.60 es el caso más flojo.
- **Fix:** calcular la media de ratios WCAG por píxel, con alfa 0.5 o más, sobre el asset decodificado contra el surface donde se pinta. Agregar un test por equipo con la tabla de arriba como esperado. Las cifras salen de pantalla con antialias, así que el test debe correr sobre el asset.
- **Spec:** se agregó una nota a la fila Logo slot (ver abajo).

## Regresiones

Diff de píxeles contra r4c:
- **dark-week:** solo cambian los slots de Texans (y 377 a 400.5) y Cardinals (y 543 a 566.5), que pasan a monograma "HOU" y "ARI" (x 33 a 56.5). El resto queda igual al píxel: mini campo, etiquetas volteadas, footer y nav.
- **en-how-s4-open:** sin ningún cambio.
- **en-how-s2:** solo cambia la zona de la flecha y la píldora (y 567 a 740), por F43.
- **en-how-s3-open y es-how-s3-open:**
  - Cambia la card ilustrativa (y 77 a 410), por F44.
  - En ES, "Juego parejo" ahora parte en dos líneas dentro de su card. Es wrap, no truncado. Ningún texto se corta.
- Steps 2 a 4 sin regresiones.

## P2 Later

F15, F18, F29, F32, F33, F35, F41r, F45r, F46, F47, F48, F49, F52, F56, F59 y F60 (s5 sigue sin la polilínea de calibración). Sin cambios desde r4c. Siguen en el backlog con el fix descrito en `build_r4c/QA_r4c.md`.

## Pendiente en Android (sin cubrir por esta QA web)

- Widget (2x2, 4x1 y 4x2, con el logo slot de 24 dp en 4x2).
- Haptics.
- Reduce motion.
- Ícono de la app (adaptive y monochrome).
- Animaciones (entrada del mini campo, thumbs y transiciones).

## Cambios en la spec

- Hubo una sola edición puntual, en `hybrid/handoff_components.csv`, fila Logo slot, columna states. Se agregó la nota "QA r4d (F61)" con la métrica exacta y la tabla esperada por equipo.
- Siguen 29 filas, `strings_en_es.csv` tiene 191 claves y hay 0 em dash o en dash. `tokens.ts` no se tocó.

## Rutas

- `QA_r4d.md`
- `QA_r4d_board.png` (interno: trae logos reales del build, no va al repo)
- `handoff_components.csv`
