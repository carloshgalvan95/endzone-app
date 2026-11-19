# r4 color · amarillo de navegación y end zones de Week

**Ronda r4** (19 nov 2026, America/Mexico_City). Decisiones de Carlos, transmitidas por Idaho. Datos de las láminas: EJEMPLO, equipos ficticios (Hawks, Stars, United North, Atlantic Coast, Wild River, High Sierra). Sin logos reales: los slots de logo son discos neutros. Sin mercado en Week, Detail ni widget. Sin lenguaje de apuestas. No se tocó ningún repo ni el sitio, ni el kit.

## Archivos

| Archivo | Qué es |
| --- | --- |
| `r4_color_week.png` | Week oscuro y claro con el amarillo aplicado, cards de fila, end zones delgadas en tira y mini campo, zoom con dp. 3840×2160 (2x) |
| `r4_color_detail.png` | Detail oscuro y claro, línea de 50 amarilla, zoom del campo, contrastes. 3840×2160 (2x) |
| `r4_color.md` | Este documento |
| `build_r4_color.py` | Genera las dos láminas desde HTML (Chrome headless, 2x) y limpia el PNG |
| `r4_color_week.html`, `r4_color_detail.html` | Fuente de las láminas |

PNG limpios: solo IHDR, pHYs (5669 px/m), IDAT e IEND (verificado).

La lámina comparativa `r4_labels_AB.png` no se hizo: Carlos decidió antes (ver abajo).

## Regla del amarillo (reemplaza a "no se inventa otro uso del amarillo")

`#EDB01A` es un acento de **navegación y tiempo**. La lista de usos es **cerrada**: cualquier uso nuevo requiere aprobación de Carlos. Nunca es señal de recomendación ni del modelo: no marca favoritos, cifras, porcentajes, etiquetas, anillos ni resultados. El widget no lleva amarillo.

| # | Rol (`accent.nav`) | Dónde | Oscuro | Claro |
| --- | --- | --- | --- | --- |
| 1 | `nextKickoffKicker` | Encabezado del día que contiene el próximo saque, solo si dice TOMORROW / TODAY (MAÑANA / HOY). Máximo uno por pantalla | Texto `#EDB01A` sobre `#1B1F23` | Relleno `#EDB01A` de 20 dp, padX 6, radio 4, texto tinta `#151515` |
| 2 | `weekSelectorActive` | Orbe de la semana activa (40 dp) | Relleno amarillo, número tinta | Relleno amarillo, número tinta, borde tinta 1.5 dp |
| 3 | `navIndicator` | Indicador 56×32 del tab activo | Relleno amarillo, ícono tinta | Relleno amarillo, ícono tinta, borde tinta 1.5 dp |
| 4 | `fieldMidline` | Línea de 50 de todos los campos: Detail, tira del masthead y mini campo de cada fila (296×24). Cuenta como UN solo uso | 2 dp amarillo | Forma con borde: 1 dp tinta + 2 dp amarillo + 1 dp tinta (4 dp) |

Reglas de aplicación:

- En claro el amarillo nunca va como texto suelto ni como forma sin tinta o borde (amarillo sobre `#F4EEDF` mide 1.68).
- La etiqueta del tab activo sigue cream / tinta, no amarilla.
- La línea de 50 amarilla va también en el mini campo de cada fila (decisión de Carlos, 19 nov 2026), con el alto completo de 24 dp. Sigue siendo un solo uso: la lista se queda en 4.
- Detail lleva un solo amarillo: la línea de 50. PHONE LOCAL TIME sigue muted y la cuenta regresiva y el enlace no son amarillos.
- La barra compacta del masthead no lleva amarillo.
- El orbe activo amarillo reemplaza el relleno cream de F26 (QA r3).
- En `tokens.ts` la clave de paleta `yellow` / `yellowInk` pasa a `accentNav` / `accentNavInk`, para que el hex viva solo bajo nombres de rol aprobados. Si el código de r3 usa `palette.yellow`, hay que renombrarlo.

Recuento por pantalla (oscuro): Week tiene 4 roles de amarillo: orbe, TOMORROW, indicador y la línea de 50 (en la tira y en cada fila visible, unas 3 a 5 a la vez; cada una mide 2 × 24 dp). Detail tiene 1. Revisado en la lámina: el 96 del masthead y las cifras 48 siguen siendo el protagonista; las líneas de fila se leen como una marca de centro, no como bloque de color.

## Contrastes (WCAG 2, luminancia relativa sRGB)

| Par | Ratio | Uso |
| --- | --- | --- |
| `#EDB01A` sobre `#1B1F23` (bg oscuro) | 8.55 | Kicker TOMORROW / TODAY, AA cuerpo |
| `#EDB01A` sobre `#262B30` (surface oscuro) | 7.36 | Indicador sobre la nav, orbe |
| `#EDB01A` sobre `#14181C` (playField oscuro, también el campo de fila en la card) | 9.20 | Línea de 50 en Detail, tira y filas |
| `#151515` sobre `#EDB01A` | 9.41 | Número del orbe, ícono, texto del chip |
| `#EDB01A` sobre `#F4EEDF` (bg claro) | 1.68 | Prohibido como texto o forma sin borde |
| `#EDB01A` sobre `#E8E0CC` (playField claro) | 1.47 | Por eso la línea de 50 en claro lleva bordes tinta |
| `#151515` sobre `#E8E0CC` | 13.88 | Borde tinta de la línea de 50 en claro (Detail, tira) |
| `#151515` sobre `#F4EEDF` (campo de fila en claro) | 15.78 | Borde tinta de la línea de 50 en la fila |
| `#EDB01A` sobre `#F4EEDF` (campo de fila en claro) | 1.68 | Por eso la fila en claro también lleva bordes tinta |
| `#151515` sobre `#F4EEDF` | 15.78 | Borde del orbe y del indicador en claro |
| `#9A3350` sobre `#14181C` | 2.52 | End zones oscuro, decorativas (no llevan dato) |
| `#AE2440` sobre `#E8E0CC` / `#F4EEDF` | 5.11 / 5.80 | End zones claro |
| `#5A86D6` anillo sobre `#14181C` | 4.94 | Anillo O |
| `#8AA6DC` etiqueta sobre `#14181C` | 7.28 | Etiqueta del modelo, oscuro |
| `#22509B` sobre `#E8E0CC` / `#F4EEDF` | 5.94 / 6.75 | Anillo y etiqueta en claro (el mini campo de fila en claro va sobre `#F4EEDF`) |

## End zones de Week

Regla, proporcional al campo de Detail: **ancho de end zone = alto del campo × 30/112, redondeado a dp par**. Es la misma proporción del Detail (30 dp por 112 de alto, referencia 360), así que la end zone se lee como el mismo objeto a menor escala.

| Campo | Tamaño | End zone | Juego | x del anillo (p del local, 0 a 100) | Clamp del centro |
| --- | --- | --- | --- | --- | --- |
| Detail (sin cambios) | 360 × 112 (ref.) | 30 | 300 | `30 + 3p`, escalado a w/360 | [38, 322] |
| Tira del masthead | 328 × 72 | **20** | 288 | `20 + 2.88p` | [28, 300] |
| Mini campo de fila (en la card) | 296 × 24 | **6** | 284 | `6 + 2.84p` | [14, 282] |
| Widget 4x2 | 152 × 48 | sin end zones | | sin cambio | |

- Color: `crimsonHero` de cada paleta (`#9A3350` oscuro, `#AE2440` claro). Sin texto encima.
- No compiten con el anillo azul: el clamp deja el centro del anillo a 8 dp o más del borde del juego, así que el anillo nunca toca la end zone. En la fila la end zone es un filo de 6 dp (2% del ancho); en la tira, 20 dp.
- Los anillos llevan relleno del color del campo, así la línea de 50 no los atraviesa (en el ejemplo, el juego de p 0.50 cae sobre la línea).
- Fila cerca de 50 (2.84 dp por punto, línea en x 148): el anillo relleno (radio exterior 8) tapa la línea por completo con |p - 50| ≤ 2.4 en oscuro (línea de 2 dp) o ≤ 2.1 en claro (4 dp), y la toca hasta |p - 50| = 3.2 / 3.5. Todos esos juegos son Toss-up (pFav < 0.55 equivale a |p - 50| < 5) y la etiqueta dice `chip.tossup`, así que anillo sobre la línea se lee "parejo", que es cierto. El clamp [14, 282] queda a 134 dp de la línea. La lámina muestra p 50 y p 53 en ambos temas.
- Etiqueta del modelo en la fila: 6 dp a la derecha del anillo; si pasaría de `w - e - 4`, va a la izquierda. Toss-up usa `chip.tossup`.
- La regla de colisión de QA r3 (`stripLanes`, `assignStripLanes`) no cambia: carriles y 16 / 36 / 56, diámetro 16 y luego 12, minDx = d + 4. Solo cambia la x: `weekField.strip.x`. El área de juego de la tira pasa de 273 dp efectivos (x = 27.3 + 2.73p con el campo viejo escalado) a 288, así que hay más espacio horizontal, no menos. Con los 14 juegos de ejemplo resuelve en el paso 1 (diámetro 16).

## Card de fila (reemplaza la caja de 132 de `rhythm.week`)

`weekCard` en `tokens.ts`: card de 328 (marginX 16), padding 16, radio 16, borde 1 dp `border`, fondo `surface`. Contenido 296: kicker 16 + 8 + nombres 2 × 24 + 8 + mini campo 24 = 104. Caja 136. Gap entre cards 12. Encabezados de día: 16 arriba, 8 abajo. Kicker en x 16 dentro de la card (F27). Favorito Jost 700, rival Jost 400 muted (F27). Logo 24 centrado en su línea de 24, 12 dp al nombre. La cifra 48 se alinea abajo con el bloque de nombres, con "in 10 {nombre corto}" debajo. En claro el mini campo va sobre `#F4EEDF` porque la card es `#E8E0CC`. `rhythm.week.rowMinHeight` queda solo como historial.

## Etiquetas del modelo: decidido

**Azules, ligadas al anillo O.** Decisión de Carlos, 19 nov 2026. No hay variante amarilla y no se hizo la lámina A/B. "Hawks 70%" en el campo y "Hawks 70% model" en Detail usan `modelLabel` (`#8AA6DC` oscuro, 7.28 sobre playField; `#22509B` claro). El amarillo nunca nombra al favorito.

## Ediciones puntuales fuera de esta carpeta

- `tokens.ts`: nota de cabecera r4; comentario en `rhythm.week.rowMinHeight` (reemplazado por `weekCard`); `stripLanes` usa `weekField.strip.x`; `yellow` / `yellowInk` pasan a `accentNav` / `accentNavInk` en ambas paletas; contrastes nuevos en `contrastDark` y `contrastLight`; exports nuevos `accent` (`accent.nav`), `weekField` y `weekCard` al final. 19 nov, 00:20: `fieldMidline.surfaces` incluye `weekRow` y `weekField.rowMidline` documenta la línea de fila. Compila con `tsc --strict` (copia con `TextStyle` simulado).
- `handoff_components.csv`: filas Mini field (row / strip), Detail field, Week row, Masthead, Bottom nav y Day header. Sin filas nuevas (siguen 29 componentes).
- `H2.md`: decisión 9 con la regla nueva del amarillo, nota de end zones de Week en Campo y el indicador amarillo en Nav.
- `strings_en_es.csv`: sin cambios (TOMORROW / TODAY ya existen: `week.day.tomorrow`, `week.day.today`).

## Pendiente

- Validar en Android real el indicador amarillo con borde en claro y la línea de 50 de 4 dp en claro sobre la tira de 72 y sobre el mini campo de 24.
