# QA r4c del build a416730 (solo web, 70 tests)

19 nov 2026, hora de Ciudad de México. 18 capturas en `build_r4c/`, todas de 780 x 1688 px, a 2 px por dp, con un viewport de 390 x 844 dp. Las cotas van en dp desde el borde superior. Spec vigente: `build_r4b/QA_r4b.md`, `r4_color.md`, `H3_how.md`, `render_h3_how.py` (board), `tokens.ts`, `handoff_components.csv` y H2.md. No se tocó ningún repo.

## Veredicto

**Pasa salvo menores, condicionado a F58.**
- No quedan P0. F51 baja a P1: la referencia ya es la diagonal y = x en datos, pero falla la forma de dibujarla.
- Para cerrar el sprint hay que resolver 5 P1 (Must), todos de alcance chico.
- F58 es la condición: las capturas muestran 23 de 29 y 0.559 vs 0.506, no los valores del fixture (11 de 16 y 0.612 vs 0.588). Mientras no se demuestre que el binding lee `track_record.json`, no se puede dar por cerrado.
- Los P2 siguen sin cambios, como declaró el build. Se separan en Must barato y Later.

| Grupo | IDs | N |
| --- | --- | --- |
| P0 | ninguno | 0 |
| P1 Must para cerrar sprint | F58, F51, F31, F44, F43 | 5 |
| P2 Must barato | F53, F57 (decisión de copy) | 2 |
| P2 Later | F15, F18, F29, F32, F33, F35, F41r, F45r, F46, F47, F48, F49, F52, F56, F59, F60 | 16 |

## Validez de las capturas

- **sha256:** las 18 son únicas. Ninguna coincide con `build_r4` ni con `build_r4b`. En el cruce global, los únicos duplicados son los ya conocidos de r4 y r4b; r4c no tiene ninguno.
- **Nombre contra contenido:**
  - light-*, es-* y en-how-* tienen fondo `#F4EEDF`; dark-* tiene `#1B1F23`.
  - es-week-collapsed dice "SEMANA". El resto de las es-* muestran textos en ES ("Ajustes", "Los datos son públicos.", "Pesa a los dos equipos", "El mercado queda como referencia honesta.").
  - light-settings tiene Light marcado. es-settings tiene Español y Claro.
  - dark-detail-giants es Week 10 en oscuro con la card FINAL Commanders at Giants, como dijo Idaho. No es Detail, pero sirve para F31.
- **Resultado:** 18 válidas, 0 rechazadas.

| Captura | sha256 (16) | | Captura | sha256 (16) |
| --- | --- | --- | --- | --- |
| dark-detail-giants | 3ff4934b4b661fd0 | | es-how-b | b7db75f4aa18c5ec |
| dark-week | f008d59d1eb86c98 | | es-how-s1 | a80d1d8f08432532 |
| en-how-a | f003d836c5d489cf | | es-how-s2 | 26f1ef94a0ab5a4c |
| en-how-b | 907a67eaafc43414 | | es-how-s3-open | 96b4de66161c8e41 |
| en-how-s1 | 9342da5816204f23 | | es-how-s5 | 1b2f886d60e1f127 |
| en-how-s2 | 67534ba5d9ae9da3 | | es-settings | 48d2401c3338cc91 |
| en-how-s3-open | c508bab6cf15ab26 | | es-week-collapsed | 5ecbbd95c3ef9a0b |
| en-how-s4-open | 7e6869cd2e2621f7 | | light-settings | 3d1b0e09550f262b |
| en-how-s5 | f7166fd1dddf03ee | | light-week | ceb82e7bb213d45c |

## Hallazgos abiertos

| ID | Sev. | Captura | Medida contra spec | Fix exacto |
| --- | --- | --- | --- | --- |
| F58 | P1 Must (nuevo; condición del veredicto) | en-how-s5, es-how-s5, en-how-b, es-how-b | Idaho dice que el fixture es 11 de 16 y 0.612 vs 0.588. Las 4 capturas muestran "Correct calls 23 of 29" / "Aciertos 23 de 29" y "0.559 vs 0.506" / "0,559 vs 0,506", es decir, los valores del ejemplo del board. Con esto no se puede saber si el fixture no se cargó en el build de captura o si los valores están escritos en el código | Buscar los literales 23, 29, 0.559 y 0.506 (y "23 of 29") en el código de How y quitarlos. Los valores salen de `track_record.json`: `pick_hits` y `pick_hits + pick_misses`, `model_log_loss` y `market_log_loss`, con 3 decimales. Recapturar s5 y el paso 6 con el fixture cargado y comprobar antes del disparo que se lee "11 of 16" y "0.612 vs 0.588" ("0,612 contra 0,588" en ES) |
| F51 | P1 Must (era P0) | en-how-s5, es-how-s5 | **Lo que ya está bien:** la referencia va de dato (0.05, 0.06) a (0.99, 0.99), sobre el mismo marco que los puntos (x = 57.2 + 269.5·pred, y = 286.1 − 180.1·obs, ajuste con los 10 puntos). Los títulos de eje están. **Lo que falla:** (a) el patrón. Son 15 guiones **horizontales** sin rotar de 5 x 2 dp, color `#5E5950`, con paso de 17 dp en x y 11 en y (20.2 dp sobre la línea), o sea unos 5 on y 15 off en escalera. Eso es lo que vio Idaho. (b) Los rótulos 0 y 1 no caen sobre los datos: el "1" de x está en 362 con el dato 1 en 326.8 (35 dp); el "1" de y está en 89 con el dato en 106 (17 dp); el "0" de x en 63 contra 57.2 y el "0" de y en 275 contra 286. (c) No hay líneas de eje ni marcas. (d) axisPad mide 41 a la izquierda y 40 abajo (spec 44). (e) Los 24 dp antes de HOLDOUT no se pueden medir porque s5 empieza bajo el tope del plot | Una sola línea de dato (0,0) a (1,1) con `react-native-svg` `Line`, `strokeDasharray="4 4"`, `strokeWidth` 1, `textMuted`, sin offset. Es el patrón del board (`render_h3_how.py`: dash S(4), gap S(4), width S(1)); 1.5 dp solo si se cambia también el board. Sobre esta diagonal (~324 dp) salen unos 40 períodos de 8. Ejes de 1 dp `textMuted`. Rótulos 0 y 1 de x centrados en x de dato 0 y 1, 6 dp bajo el eje; los de y alineados a la derecha, 6 dp a la izquierda del eje, en y de dato 0 y 1. axisPad 44: origen en x 60 y en y 282.5 sobre la caja actual. Handoff corregido |
| F31 | P1 Must (antes P2; ya medido en el build actual) | dark-detail-giants | Logo de Giants en la card oscura: navy `#001D67` sobre `#262B30`, **1.07:1**, el slot se ve vacío. Jets en la misma captura: `#00563C`, **1.63:1**. Commanders se lee por su dorado (7.44:1) | En oscuro, si el contraste medio de los píxeles opacos del logo contra la superficie es < 3:1, usar la variante para fondo oscuro de la fuente pública; si no la hay, el monograma. Sin placa. Handoff "Logo slot" corregido |
| F44 | P1 Must (resto) | en-how-s3-open, es-how-s3-open | Cerrado salvo un punto: thumbs rellenos de 20 (16 + trazo 2 en surface), leaders de cada thumb a su card, 3 cards en una fila, ejemplos y desplegable. Pero los 10 puntos de la card 69 (7 dp + gap 5) ocupan de 149.5 a 264.5 y la card termina en 248: **salen 16.5 dp** de la card, en EN y en ES | Puntos de 6 dp con gap 3: 10 x 6 + 9 x 3 = 87 dp, dentro del interior de 90 (card ~106, padding 8). Handoff "How: Cover rule" corregido |
| F43 | P1 Must (resto) | en-how-s2, es-how-s2 | Cerrado salvo un punto: balanza con viga (51 a 339, y 550), fulcro triangular (185 a 205, punta en 565), barras verticales `#22509B`, campo sobre `#F4EEDF` y etiquetas en orden. La marca suelta "I" que vio Idaho es **la flecha del fulcro mal colocada**: un trazo de 2 x 12 dp en `#5E5950`, en x 28 a 30, y 567 a 579 (ES: y 603). Debería estar en x 195, bajo la punta del fulcro; ahí no hay nada. La píldora también quedó a la izquierda, en x 34 | Flecha (tallo 2 x 12 + punta) centrada en x 195, 4 dp bajo la punta del fulcro (de y 569 a 581), y la píldora centrada debajo, con `alignSelf: center` en ambas. Handoff corregido |
| F53 | P2 Must barato | es-how-b | Sigue "0,559 vs 0,506" | "contra" en ES, como en el handoff r4b |
| F57 | P2 (copy) | es-how-s1 | "Más de 7,000" usa coma inglesa | Decide Carlos: "Más de 7000" o "7.000" |
| F52 | P2 Later (parcial) | light-week, es-week-collapsed | La etiqueta ya tiene fondo, pero empieza en x 194: el borde tinta izquierdo de la línea (193 a 194) queda pegado al glifo ("Texans", "Jaguars") | Fondo con padX 2 desde x 191, para que la línea se corte entera detrás del texto |
| F59 | P2 Later (nuevo) | en-how-s2, es-how-s2 | La viga está horizontal aunque ST pesa más (barras de 35 contra 70); el board la inclina hacia el lado pesado. El monograma ST queda a ~6 dp bajo el sello en ES | Inclinar la viga unos 3° hacia el lado de la barra larga. Sello a la izquierda, como en el board, o 12 dp sobre ST |
| F60 | P2 Later (nuevo) | en-how-s5 | Al plot le falta la polilínea de modelo entre los puntos y los puntos no llevan contorno; el board tiene polilínea de 2 dp y puntos de 8 con contorno de 1 dp. Además el plot va en una caja con borde en vez de la card surface | Polilínea de 2 dp en modelo, puntos de 8 con contorno de 1 dp en surface, card surface con radio 12 |
| F41r | P2 Later | en-how-b, es-how-b | El par principal sigue sin card 358, sin ticks 0 y 1 y sin valores mono alineados a la derecha | Como dice el handoff |
| F45r | P2 Later | en-how-s4-open | No hay conectores de la puerta a Accept / Keep, quedan 60 dp vacíos y el tope del diagrama sigue fuera de cuadro | Dos conectores de 1 dp y alto del contenido. Capturar el paso 4 completo |
| F56 | P2 Later | es-how-s1, en-how-a | Del cuerpo a la gráfica: ~16 (ES) y ~20 (EN); spec 24 | 24 |
| F15, F18, F29, F32, F33, F35, F46, F47, F48, F49 | P2 Later | varias | Sin cambios, como declaró el build. El day header sigue 28 bajo la card (spec 16). End zones 7 / 22 (spec 6 / 20). F47: los marcadores FINAL de Week (24 / 21, 31 / 12) siguen en Jost y no en mono 600 | Los fixes de `QA_r4.md` |

## Cerrados en r4c

| ID | Medida |
| --- | --- |
| F54 | Ticks bajo el riel: 2 x 8 dp, `#5E5950`, en x 211 a 213 (centro 212; spec 211.7) y 344 a 346 (centro 345; spec 345.3), en y 264 a 272: de 12 a 20 dp bajo el centro del riel (252). Ningún thumb los tapa |
| F38 | Las volteadas quedan a la distancia correcta: Texans 69% voltea (anillo 245 a 261, etiqueta hasta 238, 7 dp con la sangría del "%"); Chiefs 84% (anillo 292, etiqueta hasta 285.5, 6.5); Broncos 74% (anillo 261, etiqueta hasta 255, 6). Ninguna pisa end zone |
| F50 | La barra compacta en ES dice "mié 18 nov, 19:03" completo, sin elipsis |
| F30 | La caché va en una fila centrada. Claro: "No saved data" con centro en 500.8 y Clear (deshabilitado, atenuado) en 499.8. ES: "Guardado jue, 19 nov, 7:06" alineado con "Borrar" |
| F55 | es-how-b sale en claro, igual que es-settings con Claro marcado. Todas las ES de r4c son claras |
| F39 | Timeline de 358 x 228 (296 a 523.5 en ES). El pie queda **fuera** de la card, a ~8 dp (ink en 534.5), sin recorte. Results en `#D9D1BD` con borde de 1 dp `#BAB3A4`, sin tinte crimson. Leyenda con muestras ("Jugadas" y "Resultados") |
| F43 (núcleo) | Balanza, barras modelo, campo `#F4EEDF` en claro, `p_lab` arriba y `out` abajo. Queda solo la flecha (P1 arriba) |
| F44 (núcleo) | Thumbs rellenos, leaders, 3 cards en fila. Quedan solo los puntos (P1 arriba) |
| F51 (dirección) | La referencia es la diagonal y = x en el marco de los datos, no una línea horizontal. El resto sigue P1 arriba |

## Regresiones

Diff de píxeles contra r4b, en las mismas pantallas:
- **dark-week y light-week:** solo cambian las filas de etiquetas del mini campo (por F38).
- **es-week-collapsed:** cambia el sello (por F50) y las etiquetas.
- **light-settings y es-settings:** solo cambia la fila de caché (por F30).
- Masthead, cards, tira, day headers, nav y amarillo quedan idénticos.
- El **amarillo** sigue correcto en los dos temas:
  - Claro: MAÑANA / TOMORROW con relleno e ink; orbe con borde ink; nav con borde ink; línea de 50 de 1 + 2 + 1 en tira, filas y paso 2.
  - Oscuro: línea de 2 dp y TOMORROW en texto amarillo.
- **Sin regresiones.**
- **Detail:** no hay captura en r4c y el build no lo tocó; queda como en r4b.

## ES

No hay truncados:
- Semana compacta.
- Ajustes: "Predeterminado del sistema" en una línea; la ayuda y el pie en 2 líneas cada uno.
- How:
  - Títulos de 3 líneas.
  - "Más de 9 de cada 10" y "Juego parejo" caben.
  - "Ventaja de local aprendida" y "p, probabilidad de que gane el local" caben.
  - Desplegable completo.

Lo único que sale de su contenedor son los puntos del paso 3 (F44, en EN y ES). No hay em dash ni en dash visibles.

## Must y Later para cerrar sprint

- **Must:**
  - F58: demostrar el binding con el fixture, y quitar los literales si los hay.
  - F51: diagonal `4 4` de 1 dp, ejes y rótulos en el marco.
  - F31: logo oscuro o monograma por debajo de 3:1.
  - F44: puntos de 6 / 3.
  - F43: flecha centrada.
  - F53: "contra" en ES.
- **Decisión de copy de Carlos:** F57.
- **Later:** F15, F18, F29, F32, F33, F35, F41r, F45r, F46, F47, F48, F49, F52, F56, F59 y F60.

## Qué debe traer r4d (corta)

1. s5 completo, desde el último párrafo hasta "Correct calls", en EN y ES, con el fixture. Debe verse "11 of 16" y "0.612 vs 0.588" (ES "0,612 contra 0,588"), y los 24 dp antes de HOLDOUT.
2. El paso 6 con el fixture.
3. El paso 2 y la card 69 del paso 3 con los fixes.
4. dark-detail-giants con el monograma o la variante oscura.
5. El paso 4 completo.

No verificable sin Android: widget, haptics, reduce motion, ícono adaptativo y motion.

## Cambios a la spec en esta pasada

Releí el archivo antes de editar. En `hybrid/handoff_components.csv` agregué una nota "QA r4c" al final de 4 filas:
- **How: Calibration:** la línea con dasharray 4 4 de 1 dp, los ejes y los rótulos en el marco de los datos.
- **How: Cover rule:** puntos de 6 / 3 dentro de la card.
- **How: Strength diagram:** flecha y píldora centradas en el fulcro.
- **Logo slot:** regla de 3:1 con los valores de Giants y Jets.

Cambiaron solo esas 4 líneas. Siguen 29 filas, `strings_en_es.csv` sigue con 191 claves y `tokens.ts` no se tocó.

## Rutas

- Informe: `QA_r4c.md`
- Board (interno, trae logos reales del build; 3840 x 2160; solo IHDR, pHYs, IDAT e IEND): `QA_r4c_board.png`
- Handoff: `handoff_components.csv`
