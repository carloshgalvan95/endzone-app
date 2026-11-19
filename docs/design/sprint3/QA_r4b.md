# QA r4b del build 19ba46e (solo web)

19 nov 2026 (hora de Ciudad de México). 22 capturas en `build_r4b/`, todas de 780 x 1688 px, 2 px por dp, viewport 390 x 844 dp. Las cotas van en dp desde el borde superior. Spec vigente: `build_r4/QA_r4.md`, `hybrid/r4_color/r4_color.md`, `hybrid/H3_how/H3_how.md` y sus boards, `hybrid/tokens.ts`, `hybrid/handoff_components.csv` y H2.md. No se tocó ningún repo.

## Veredicto

**No pasa.** Queda 1 P0: la calibración del paso 5 (F51) dibuja la referencia como una línea horizontal en 0.5 en vez de la diagonal y = x. En la pantalla de honestidad eso enseña otra lectura. El arreglo es corto.

Los tres P0 de r4 (F43 a F45) ya existen en el build. F45 se cierra; F43 y F44 bajan a P1 porque no siguen el board. Además hay 8 P1 y 15 P2.

El tema claro y ES quedaron validados con capturas reales:
- El amarillo en claro está correcto en Week, Detail, Settings y How.
- El ES no trunca nada en Week, Detail, FINAL, Settings ni How, salvo el sello de la barra compacta (F50) y el pie del timeline, que la card recorta (F39).

| Prioridad | IDs | N |
| --- | --- | --- |
| P0 | F51 | 1 |
| P1 | F30, F38, F39, F43, F44, F50, F54, F55 | 8 |
| P2 | F15, F18, F29, F31, F32, F33, F35, F46, F47, F48, F49, F52, F53, F56, F57 | 15 |

## Validez de las capturas

sha256 de las 22 y cruce contra `build_r2`, `build_r3` y `build_r4`. Después, comprobación de que cada archivo es lo que dice su nombre:
- Tema claro: fondo `#F4EEDF` en (10, 10) px.
- ES en Week: el texto "SEMANA".
- ES en las demás pantallas: textos ES visibles.
- Settings: el radio correcto marcado.

| Captura | sha256 (16) | Resultado |
| --- | --- | --- |
| light-week | b87ec98e10ab88db | válida: `#F4EEDF`, EN |
| light-week-collapsed | 9edb2d94a8427fec | válida: `#F4EEDF` |
| light-detail | 3f21538d53d9a9ff | válida: `#F4EEDF` |
| light-settings | abe17ade36b0ecec | válida: `#F4EEDF`, radio **Light** marcado |
| es-settings | 8ed6fb4794a9a383 | válida: **Español** marcado (y Claro) |
| es-week | ddb9ef61531fc5b9 | válida: "SEMANA", claro |
| es-week-collapsed | e946e155c9066f5a | válida: "SEMANA" en la barra |
| es-detail | 6869b653563dd34d | válida: "HORA DE ESTE TELÉFONO", "de 10", "gana Texans" |
| es-detail-final | fbbc43ef65213d54 | válida: "El modelo daba 7 de cada 10 a Giants." |
| es-how-a | cf78d86f6cf7bb7a | válida: "Cómo se calcula", claro |
| es-how-b | 809b523c4f5da245 | válida en idioma; sale **oscuro** aunque es-settings tiene Claro (F55) |
| es-how-s2 / s3-open / s4-open / s5 | 1b95e7d0 / 3c9ff59c / bcf0fd0e / ab8e0a6b | válidas: ES, claro |
| en-how-s2 / s3-open / s4-open / s5 | eae32628 / 235b6d20 / 118b733a / 522d3378 | válidas: EN, oscuro |
| dark-week | 8db40f225234033c | válida: `#1B1F23` |
| dark-week-footer | 883e45f66e4ee9c7 | válida: pie de Week |
| **dark-detail-giants** | **571a5b1fe8e59a15** | **RECHAZADA:** idéntica byte a byte a `build_r4/es-detail-final.png`, es decir, una captura del build 405c3d2. No sirve para 19ba46e; F31 sigue sin verificar |

Hay 21 válidas, todas únicas dentro del lote, y 1 rechazada. Ninguna otra coincide con capturas de rondas anteriores.

## Hallazgos

| ID | Sev. | Captura | Medida contra spec | Fix exacto |
| --- | --- | --- | --- | --- |
| F51 | **P0** (nuevo; el paso 5 no se había capturado) | en-how-s5, es-how-s5 | Plot 268 alto (311 a 578.5), correcto. Los 10 puntos caen donde deben: pred 0.277 en x 115 dp, obs 0.298 en y 302. Pero la referencia punteada es **horizontal** en y = 0.5 (y 270 dp), no la diagonal. Sin ticks 0 y 1, sin títulos de eje, sin axisPad 44. El kicker HOLDOUT queda pegado al cuerpo (~0 dp; spec bodyToChart 24) | Diagonal punteada y = x de (0, 0) a (1, 1) en coordenadas del plot, `diagonalStyle` dashed, color muted. Ticks 0 y 1 en ambos ejes, `how.s5.pred` (x) y `how.s5.obs` (y) en 11 muted, `axisPad` 44. 24 dp del cuerpo al kicker HOLDOUT. Handoff "How: Calibration" corregido |
| F43 | P1 (era P0; implementado, pero no como el board) | es-how-s2, en-how-s2 | Card 358 x 340 (464 a 804), sello y píldora correctos. Monogramas HK / ST de 32. Mini campo 72 (610 a 682), end zones 20, línea 1 + 2 + 1 en claro, anillo 16 relleno. Pero: (a) no es una balanza: hay dos barras **horizontales** apiladas desde x 72 (largos 113 y 177, 16 de alto), sin viga, sin fulcro y sin flecha a la píldora; (b) barras en `blueDeep` `#D5DEEE` sobre `#E8E0CC`, **1.03:1**; (c) en claro el campo va sobre `#E8E0CC`, igual que la card, así que no se distingue (spec `playFieldInCard` `#F4EEDF`); (d) "se vuelve el anillo del campo" arriba y `p_lab` abajo, al revés que el board; (e) 106 dp vacíos bajo el campo | Balanza como en `H3_how_en_a`: viga sobre un fulcro, una barra vertical de 16 bajo cada monograma, en modelo `#5A86D6` / `#22509B` (5.94:1 sobre surface claro), y flecha del fulcro a la píldora. `how.s2.p_lab` arriba del campo, `how.s2.out` debajo. Área de juego en `weekField.playFieldInCard` (`#14181C` / `#F4EEDF`). Sin banda vacía. Handoff corregido |
| F44 | P1 (era P0; implementado en parte) | en-how-s3-open, es-how-s3-open | Riel de 334 (x 28 a 362), thumbs de 20 en 52 / 69 / 96 (centros 202, 258, 349). Las 3 state cards llevan "Example 52%" y similares; cifra 40 (cap ~29); 10 puntos; desplegable con mono 12. Pero los thumbs son anillos huecos, no hay leader de cada thumb a su card, y las cards van apiladas en vertical con una barra lateral común | Thumbs rellenos de modelo con trazo de 2 dp en surface. Leader de 1 dp muted de cada thumb a su card. Tres cards en una fila, como en el board. Handoff "How: Cover rule" corregido |
| F54 | P1 (pregunta de Idaho) | en-how-s3-open, es-how-s3-open | Los ticks **sí existen**, pero no se leen. Tick 55: 2 x 12 dp en x 212 a 214, y 126 a 138, muted `#A9A396` / `#5E5950`. El anillo de 52 termina en x 211.5: **0.5 dp** de separación, así que se ve como parte del anillo. Tick 95: x 345 a 347, **dentro** del anillo de 96 (hueco 341.5 a 356.5), a 3.3 dp de su centro. Además, el tick mide 12 de alto y el thumb 20, así que nunca sobresale | Ticks **bajo el riel**: 2 x 8 dp, textMuted, de 12 a 20 dp bajo el centro del riel (fuera del radio 10 del thumb), en x = 28 + 334 x 0.55 = 211.7 y 28 + 334 x 0.95 = 345.3. Así ningún thumb los tapa |
| F39 | P1 (parcial; antes timeline equivocado) | es-how-a | Ya es 358 x 228 (530 a 757.5), con 4 bloques 1999 / 2016 / 2024 / 2026, "parcial", ILUSTRATIVO y bandas. Pero: (a) el pie "Más de 7,000 juegos desde 1999." va **dentro** de la card y la card lo recorta (la base cae en ~755 y la card termina en 758; se cortan los descendentes de "juegos"); (b) results se rellena con `crimsonDeep` `#F0D4DA`, un tinte crimson, cuando el crimson es solo para end zones (spec: raised brown); (c) la leyenda "Jugadas / Resultados" no tiene muestras | `how.s1.foot` fuera de la card, 8 dp debajo, 12/16 muted. Results en `surfaceRaised` (`#30363C` / `#D9D1BD`) con borde de 1 dp `fieldTick`. Muestra de 12 dp antes de cada etiqueta de la leyenda. Handoff corregido |
| F38 | P1 (parcial) | light-week, light-week-collapsed, es-week, dark-week | A la derecha ya funciona: Texans, anillo 245 a 261, etiqueta desde 269.5 (≈6 + sangría del glifo). Fallas: (a) la etiqueta volteada queda **pegada** al anillo: Chiefs "%" termina en 291.5 con el anillo en 292 (0.5 dp; Broncos igual, 260.5 contra 261); (b) Texans 69% no voltea aunque su borde derecho (352.5) pasa el límite w − e − 4 = 346 y pisa la end zone (350) | Volteada: borde derecho en ringX − 8 − 6 = ringX − 14. Voltear cuando ringX + 14 + ancho de etiqueta > borde del campo − e − 4 (346 en 390 dp, 286 en la referencia 360). Handoff "Mini field" corregido |
| F50 | P1 (nuevo, ES) | es-week-collapsed | El sello de la barra compacta sale truncado: "Guardado mié, 18 nov, 1…". El espacio libre a la derecha del chip es de ~141 dp, y "Guardado mié, 18 nov, 19:03" en 14 sp necesita ~175. El sello debe permanecer en la barra compacta | Variante compacta del sello sin la palabra: `week.saved.short` "{dt}" con fecha corta ("mié 18 nov, 19:03" / "Wed Nov 18, 7:03 PM"), `numberOfLines` 1 sin elipsis. Si a 1.3 aún no cabe, solo la hora del día de hoy ("19:03"). Propuesta de string; el CSV no se tocó |
| F30 | P1 (parcial) | light-settings, es-settings | Cerrado: del título a LANGUAGE hay 16 (ink del kicker en 71.5) y de "Off" a VERSION hay ≥16. Abierto: en la caché, "Clear" tiene el centro en 487.8 y el sello en 502.8, 15 dp de desfase, y del kicker DATOS GUARDADOS al sello hay 31 | La caché en una fila de 48 con `alignItems: center`: sello a la izquierda, Clear / Borrar a la derecha, 8 bajo el kicker |
| F55 | P1 (verificación) | es-how-b | La única pantalla ES en **oscuro**, aunque es-settings del mismo lote tiene **Claro** marcado. O se capturó en otra sesión, o el tema vuelve a oscuro al navegar a How, que es la carrera de `hydratePreference` que el build da por corregida | Recapturar es-how-b en la misma sesión, con la aserción de fondo `#F4EEDF` antes del disparo. Si sale oscuro, el bug sigue: leer la preferencia de AsyncStorage antes del primer render (gate de hidratación) y no escribir el valor por defecto encima |
| F31 | P2 (abierto, no verificable) | dark-detail-giants (rechazada) | La única captura oscura con Giants es la de 405c3d2. Ahí el navy `#001D67` sobre `#1B1F23` da **1.08:1**. En claro está bien: 13.23:1 sobre `#F4EEDF` (es-detail-final) y 11.64:1 sobre `#E8E0CC` (light-week-collapsed) | Igual que r3: en oscuro, si el contraste del trazo opaco contra el fondo es < 3:1, usar la variante para fondo oscuro, o si no hay, el monograma. Sin placa |
| F52 | P2 (nuevo) | es-week-collapsed, light-week-collapsed | La etiqueta del modelo cruza la línea de 50: "Jaguars 56%" (la J sobre x 193 a 197) y "Broncos 74%". El amarillo pasa por encima de los glifos | Si la etiqueta cruza la línea, darle un fondo `playFieldInCard` con padX 2; la línea se corta solo detrás del texto. Handoff "Mini field" corregido |
| F53 | P2 (nuevo, ES) | es-how-b | La línea 2026 dice "0,559 vs 0,506". La copy ES usa "contra" ("0,598 contra 0,621", `how.s6.live_ex`) | Conector "contra" en ES y "vs" en EN. Handoff "How: Honesty bars" corregido |
| F56 | P2 (nuevo) | es-how-a, en-how-s5 | Del cuerpo a la gráfica: 16 en el paso 1 y ~0 en el 5. Spec `bodyToChart` 24 | 24 en todos los pasos |
| F57 | P2 (copy) | es-how-a | "Más de 7,000" usa la coma inglesa de miles. En español el número de 4 cifras va sin separador (7000) o con punto (7.000) | Proponer `how.s1.foot` ES "Más de 7000 juegos desde 1999." Decisión de copy; el CSV no se tocó |
| F41 (resto) | P2 | es-how-b | La parte P1 está cerrada. Falta la card 358 con columna de etiquetas, valores mono alineados a la derecha y ticks 0 y 1 | Como dice el handoff |
| F45 (resto) | P2 | en-how-s4-open, es-how-s4-open | La parte P0 está cerrada. Faltan los conectores de la puerta a Accept / Keep (x 195, de 282 a 298: no hay línea) y quedan 60 dp vacíos bajo los botones (342 a 402). El tope del diagrama (Train y el sello) queda fuera de cuadro | Dos conectores de 1 dp de la puerta a cada salida. Alto del contenido, o centrar la salida en la card. Capturar el paso 4 completo |
| F15, F18, F29, F32, F33, F35, F46, F47, F48, F49 | P2 | varias | Sin cambios, como declaró el build. Medidas iguales a r4: day header 28 bajo la card (spec 16), end zones 7 / 22 (spec 6 / 20). F46: el lead sigue en tinta, pero el hairline entre pasos ya está (782) | Los fixes de `QA_r4.md` |

## Cerrados en r4b

| ID | Medida |
| --- | --- |
| F25 | Chip PUBLIC ALPHA de x 266 a 374, alineado a la derecha con el count (318.5 a 374) y el sello (hasta 373.5); a 8 dp bajo el sello |
| F37 | Card de 316 a 454 en claro y de 312 a 450 en oscuro: borde 1 + padding 16 + contenido 104 + 16 + 1 = 138 por fuera, 136 dentro del borde (RN dibuja el borde dentro de la caja). Kicker 329 a 345, nombres 353 a 401, campo 409 a 433: kicker a nombres 8, nombres a campo 8. Se acepta: la spec suma 136 sin el borde. Si Idaho quiere 136 por fuera, el padding queda en 15 |
| F40 | Progreso de 6 segmentos de 16 x 4, gap 4 (x 84 a 200), centrado en el folio (265 contra 266). Hairline entre pasos presente |
| F41 | Paso 6: una sola línea "Temporada 2026 hasta hoy, muestra pequeña" y debajo "0,559 vs 0,506", sin barras ni "Ejemplo". "El mercado queda más bajo" aparece una vez. Los valores coinciden con el ejemplo; falta el test con fixture distinto |
| F42 | El URL corta solo tras "/" ("https://github.com/ · carloshgalvan95/endzone-mlops/blob/main/docs/ · model_card.md"), sin cortar en el guion, estilo de enlace. El rol de enlace no se puede ver en una captura: verificar `role="link"` en el DOM web o `accessibilityRole` en Android |
| F45 | Paso 4 (salvo el resto P2): nodos de 52 (126 a 178), gap 16, puerta de 88 (194 a 282) con "log loss" sin número, Accept / Keep de 44 (298 a 342). El desplegable trae la regla 0.002 y no menciona 0.003. ES "Prueba en una temporada posterior" y "Se queda el actual" caben |
| F13 | Settings en claro con Light marcado; radio en tinta |
| F14 (ES) | FINAL en ES: kicker FINAL, "vie, 13 nov, 1:15", "Commanders en Giants", 24 / 21, ganador 700 y perdedor muted, "El modelo daba 7 de cada 10 a Giants.", sin sello ni cuenta atrás. La tipografía de las cifras sigue en F47 |
| F09 | Pie de Week: "Open ML experiment. Not a recommendation." en muted `#A9A396` (6.6:1); el enlace "How it is calculated" en cream, a 92 del fondo (`listPaddingBottom` 64 + 12 + 16) |

## Tema claro (QA completa)

- **Fondos:** página `#F4EEDF`. Las cards de Week son `#E8E0CC` con borde `#D9D1BD`, y su campo va sobre **`#F4EEDF`** (x 40 a 350), como pide `playFieldInCard`. La tira y el campo de Detail usan `#E8E0CC` sobre la página `#F4EEDF`. **Excepción:** el campo del paso 2 de How va sobre `#E8E0CC` dentro de una card `#E8E0CC` (F43).
- **Amarillo solo como relleno con tinta o con borde:**

  | Uso | Medida | Contraste |
  | --- | --- | --- |
  | MAÑANA / TOMORROW | relleno de 20 dp (288 a 307.5), texto tinta | 9.41 |
  | Orbe activo | relleno `#EDB01A`, número tinta, borde tinta ~1.5 | |
  | Indicador de nav | relleno con borde tinta de 1.5 (x 37.5 a 39); la etiqueta del tab va en tinta | |

  No hay amarillo suelto sobre crema (1.68) ni sobre surface (1.47).
- **Línea de 50 de tinta + amarillo + tinta:** 1 + 2 + 1 = 4 dp en la tira (x 193 a 197), en cada fila (193 a 197, centro 195 = centro del campo), en Detail (193 a 197) y en el paso 2 de How. La tinta de los bordes da 15.78 sobre `#F4EEDF` y 13.88 sobre `#E8E0CC`.
- **AA:**

  | Elemento | Contraste |
  | --- | --- |
  | Etiquetas `#22509B` sobre `#F4EEDF` | 6.75 |
  | Etiquetas `#22509B` sobre `#E8E0CC` | 5.94 |
  | Muted `#5E5950` | 6.01 / 5.29 |
  | Tinta sobre la card | 13.88 |

  Falla solo un gráfico con significado: las barras del paso 2, 1.03 (F43).
- **Rol cerrado:** el amarillo no aparece fuera de sus 4 roles. Detail tiene solo la línea, y la barra compacta no tiene amarillo.

## ES (QA completa)

- **Week:** "SEMANA", "13 juegos", "Guardado mié, 18 nov, 19:03", "MAÑANA", "DOMINGO", "VIE, 20 NOV, 1:15", "de 10 Texans" y "de 10 Jaguars" caben. El único truncado es el sello de la barra compacta (F50).
- **Detail:** "Empieza en 18 h 28 min", "Colts en Texans", "gana Texans", "Texans 69% modelo"; el pie ocupa una línea. Sin desbordes.
- **FINAL:** correcto (F14 cerrado en ES).
- **Settings:** "Predeterminado del sistema" en una línea. La ayuda de idioma y el pie ocupan 2 líneas cada uno, sin recorte. "Borrar" está desalineado (F30).
- **How (las claves `how.*`):**
  - Títulos de 2 y 3 líneas sin recorte, y nodos del paso 4 sin recorte.
  - "Más de 9 de cada 10" y "Juego parejo" caben en sus cards.
  - Los desplegables están completos.
  - Problemas: el pie del paso 1 se recorta (F39), la línea 2026 usa "vs" (F53) y "7,000" lleva coma (F57).
  - El paso 5 deja "en 10." sola en una línea: aceptable.
- **Em dash y en dash:** 0 en el texto visible. Los segmentos de progreso son gráficos.

## Qué debe traer r4c

1. `dark-detail-giants.png` (o una Week oscura con Giants) **del build actual**, para F31. El sha256 no puede coincidir con ninguna ronda anterior.
2. `es-how-b.png` en la misma sesión que es-settings, con Claro y la aserción de fondo (F55).
3. El paso 4 completo, del sello al pie, en EN y ES (F45).
4. `en-how-b.png` (paso 6 en EN) y `en-how-a.png` (timeline EN, para ver si el pie también se recorta).
5. Capturas de verificación de F51, F43, F44, F54, F38, F50 y F30 con los fixes.
6. Un test con fixture de `track_record.json` distinto de 23 / 29 y 0.559 / 0.506.

No verificable sin Android: widget, haptics, reduce motion, ícono adaptativo y motion.

## Cambios a la spec en esta pasada

Releí el archivo antes de editar. En `hybrid/handoff_components.csv` agregué una nota "QA r4b" al final de 6 filas: Mini field (row / strip), How: Timeline, How: Strength diagram, How: Cover rule, How: Calibration y How: Honesty bars. Cambiaron solo esas 6 líneas. Siguen 29 filas; `strings_en_es.csv` sigue con 191 claves y `tokens.ts` no se tocó.

## Rutas

- Informe: `QA_r4b.md`
- Board (interno, trae logos reales del build; 3840 x 2160; solo IHDR, pHYs, IDAT e IEND): `QA_r4b_board.png`
- Handoff: `handoff_components.csv`
