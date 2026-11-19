# QA r1 del primer build, contra H2.1

18 nov 2026, zona America/Mexico_City. Once capturas EN/ES de Expo web, sin emulador, en `build_r1/`. No hay captura del widget. La hora en UTC es del VM: no se cuenta como bug. No se tocó ningún repo.

Escala de las capturas: 780 px de ancho, 2 px por dp (viewport 390 dp). Las cotas de abajo usan esa escala.

## Líneas de yarda, no números de yarda

Hay un posible conflicto entre el handoff ("sin números de yarda") y el campo v2 de `tokens.ts` / `H2.md` (filetes cada 10). La regla es:

- Sí van las líneas finas cada 10, token de color de filete `#3A4148` (`fieldTickOnPlayField` 1.72:1, solo textura).
- Sí va la línea de 50%, cream al 60% (`opacity.fieldMid`, contraste compuesto 6.18:1).
- No van números de yarda (10, 20, 30, 40, 50) ni marcas de tipo "yard line" como en un campo real.
- En Semana, el mini campo no llena las end zones: lleva caps de 2 dp en `#30363C`.
- En Detalle, end zones de 30 dp en `crimsonHero` `#9A3350`, juego de 300 dp, ancho total `field.width` 360, alto `field.detailHeight` 112.

## Fixes

### F01 · Week · Week row · Must

**Qué está mal.** La cifra de la fila dice solo "7 in 10" / "7 de 10". No nombra al favorito. El peso 700 en "Texans" ayuda, pero no cumple la regla de la cifra. Visto por Idaho.

**Valor esperado.** La cifra nombra al favorito del modelo (`H2.md`, `how.cover`: "The cover figure names the model favorite"). En la fila, cifra compacta `type.rowFigure` (48 sp) más el nombre corto, por ejemplo "7 in 10 Texans" / "7 de 10 Texans" (claves `cover.in10` / `cover.in10.short` y el short name; en toss-up, solo "Toss-up" / "Juego parejo", sin nombre).

**Evidencia.** `es-week.png`, `en-week.png`.

### F02 · Week · Logo slot · Must

**Qué está mal.** Hay un solo logo por fila, el del primer equipo (visitante). Visto por Idaho.

**Valor esperado.** Un slot de 24 dp por equipo (`teamLogos.sizeRow`), columna a la izquierda de los nombres, sin placa de color y sin borde de color. El logo no es un acento. En estas capturas el tamaño del logo único sí es 24 dp.

**Evidencia.** `en-week.png`, `es-week.png`.

### F03 · Detail · Logo slot · Must

**Qué está mal.** Los dos logos de 32 dp quedan en los extremos del encabezado (izquierda y derecha), no agrupados con el título. Visto por Idaho.

**Valor esperado.** Par de 32 dp (`teamLogos.sizeHeader`) junto a "Colts at Texans" / "Colts en Texans" (`detail.at`). En la barra compacta de 64, 24 dp (`teamLogos.sizeBar`). El tamaño medido ya es 32 dp; falla la colocación.

**Evidencia.** `en-detail.png`, `es-detail.png`.

### F04 · Week, History, Settings · Bottom nav · Must

**Qué está mal.** Los iconos son cuadros placeholder de 18 dp (36 px). El indicador activo es una pastilla oscura alrededor del cuadro, no el indicador cream detrás de un icono de trazo. Visto por Idaho.

**Valor esperado.** `nav.icon` 24 dp, trazos de Semana / Historial / Ajustes. Indicador cream `nav.indicator` 56×32 solo detrás del icono; el icono activo pasa a ink `#151515` sobre cream. Barra `nav.height` 64. Etiquetas `type.navLabel`, claves `nav.week`, `nav.history`, `nav.settings`.

**Evidencia.** `en-week.png`, `es-week.png`, `en-history.png`, `es-history.png`, `en-settings.png`, `es-settings.png`.

### F05 · Detail, How it is calculated · Bottom nav (barra de Detalle) · Must

**Qué está mal.** No hay barra de 64 dp con icono de back. Solo el texto "Week" / "Semana" arriba a la izquierda. Visto por Idaho. Lo mismo en How it is calculated.

**Valor esperado.** Barra de 64 dp (`nav.height`) con icono de back de 24 dp. El título compacto (`type.titleCompact`, `detail.compact`) entra en la barra al hacer scroll, con el par de logos de 24 dp.

**Evidencia.** `en-detail.png`, `es-detail.png`, `en-how.png`, `es-how.png`.

### F06 · Detail, Week · Detail field / Mini field · Must

**Qué está mal.** Al campo de Detalle y al mini campo de Semana les faltan las líneas finas de 10 en 10 y la línea de 50%. Idaho señaló también la dirección: en Detalle sí hay nombres cortos fuera del campo (Colts, Texans); no se pide un número de yarda. Lo que falta son los filetes y la línea de 50%.

**Valor esperado.** Filetes cada 10 en `#3A4148` (textura, sin números). Línea de 50% cream al 60% (`opacity.fieldMid`). Mini campo de Semana: caps de 2 dp en `#30363C`, sin end zones llenas. Ver la nota de arriba.

**Evidencia.** `en-detail.png`, `es-detail.png`, `en-week.png`, `es-week.png`.

### F07 · Detail · Detail field · Must

**Qué está mal.** El campo de Detalle no usa las cotas de `field`. Ancho medido 198 dp (392 px, de x=96 dp a 294 dp), end zones de 16 dp, juego de 166 dp. El alto sí es `field.detailHeight` 112. El color de las end zones sí es `crimsonHero` `#9A3350`. El anillo O, en proporción, cae cerca de x = 30 + 3p (medido 236 en un canvas de 360; a p ≈ 0.70 se espera 240).

**Valor esperado.** `field.width` 360, `field.endZone` 30, `field.play` 300, `field.detailHeight` 112, `field.markerClamp` [38, 322], anillo `field.modelRing` 16 / `field.modelStroke` 3, color `darkPalette.model` `#5A86D6`. Posición x = 30 + 3p con p del local.

**Evidencia.** `en-detail.png`, `es-detail.png`.

### F08 · Detail · Detail field · Must

**Qué está mal.** No está la etiqueta de probabilidad del favorito sobre el campo (debería leerse "70%" junto al anillo, no el 30% del local). Tampoco está el bloque de valores "Texans 70% model" / "Texans 70% modelo".

**Valor esperado.** Etiqueta `type.fieldLabel` (14/16, max 1.3) con el porcentaje del favorito nombrado. Bloque `detail.vals` ("{team} {pm} model" / "{team} {pm} modelo"). La frase de portada sí nombra al favorito (`cover.in10`: "In 10 games like this, Texans win 7.") y los puntos 16/8/10 están bien (7 encendidos).

**Evidencia.** `en-detail.png`, `es-detail.png`.

### F09 · Week · Footer with link · Must

**Qué está mal.** El pie "Open ML experiment. Not a recommendation." / "Experimento abierto de ML…" y el enlace "How it is calculated" / "Cómo se calcula" quedan cortados por la nav. Se ve solo el remate superior de las letras.

**Valor esperado.** `nav.listPaddingBottom` = 64 + 12 + inset + 16. El pie usa `detail.footer` (la misma frase en Semana y Detalle) y el enlace a `how.title`. Hit de 48 dp, texto completo, sin cortar. En Detalle, sin nav, el pie sí se ve entero.

**Evidencia.** `en-week.png`, `es-week.png`.

### F10 · First run · Masthead (lockup) · Must

**Qué está mal.** El wordmark "endzone-mlops" entra cortado a la izquierda (el trazo de la "e" nace en x = 0). No está el mark de logo_v4. El lead y el CTA sí coinciden con `first.lead` y `first.cta`.

**Valor esperado.** Lockup de marca (mark + wordmark) en una sola línea, nunca partido ni recortado (`H2.md`). Margen interior, no pegado al borde del viewport.

**Evidencia.** `en-first.png` (no hay captura ES de primer uso).

### F11 · Widget (sin captura) · Monogram · Must

**Qué está mal.** No hay captura de widget en este set (Expo web, sin emulador). El fallback de monograma dentro del widget no está demostrado. Un widget sin red, con el flag apagado o con error de carga, se rompe si no hay monograma.

**Valor esperado.** Misma cadena que el logo slot: si `teamLogos.enabled` está apagado, monograma; si no, caché, red, monograma. Abreviatura de 2 o 3 letras, Jost 700, cream sobre `#262B30` (12.34:1). Color de equipo solo como anillo de 1.5 dp (`teamLogos.ring`) o punto de 5 dp, nunca relleno. contentDescription `logo.cd.mono` ("{team}"). En 4×2 el slot va; en 2×2 y 4×1, no (ver `H2.md`).

**Evidencia.** Ninguna captura de widget. Queda como Must de implementación para este PR.

### F12 · Week · Masthead · Later

**Qué está mal.** El encabezado de Semana es plano: "Week 11" / "Semana 11", "13 games" / "13 juegos" y la fecha de guardado. Faltan la cifra grande de semana, los orbes 9 / 10 / 11 y la tira de todos los anillos O.

**Valor esperado.** Masthead de `handoff_components.csv`: `type.title` / cifra de semana, `orbs` para cambiar de semana, tira `field.stripHeight` 72 con solo el anillo O. Chip `alpha` ("Public Alpha") con contorno cream, no solo un kicker muted.

**Evidencia.** `en-week.png`, `es-week.png`.

### F13 · Settings · Language selector (tema y caché) · Later

**Qué está mal.** El selector de idioma está bien: System default / English / Español, radio de 20 dp (`langOption.radio`), `set.lang.*`, el español no se corta. Faltan el selector de tema Auto / Dark / Light y la acción de limpiar caché (con fecha de caché en formato del locale).

**Valor esperado.** Tema y "Clear cache" / equivalente, según `H2.md` (Ajustes). No bloquean este PR; van en el siguiente. Ver triage.

**Evidencia.** `en-settings.png`, `es-settings.png`.

### F14 · Detail · FINAL kicker (cuenta atrás) · Later

**Qué está mal.** En Detalle no está la cuenta atrás ("Starts in…"). Forma parte del motion completo. En este set tampoco hay un juego FINAL, así que no se pudo QA el kicker FINAL ni la ausencia de sello.

**Valor esperado.** Cuenta atrás en el Detalle previo, con reduce-motion que no quite contenido. Finales: `chip.final`, ganador 700, perdedor muted, sin sello. Ver triage.

**Evidencia.** `en-detail.png`, `es-detail.png` (previo, sin final en el set).

## Lo que sí cumple

- Mercado fuera de Semana y Detalle. Vive en Historial (baldosa cream, línea honesta, mancuernas O/X sin color de ganador) y en How it is calculated. Claves `how.honest` / la línea de Historial. Formato de log loss: 0.461 en EN, 0,461 en ES.
- Tokens de color en las superficies vistas: fondo `#1B1F23`, cream `#F4EEDF`, muted `#A9A396`, anillo `#5A86D6`, end zones `#9A3350`. Sin amarillo `#EDB01A` en Semana, Detalle ni Ajustes. Un acento: el cream y el anillo azul; los logos reales no llevan placa de color.
- Tipografía de títulos, cifras y cuerpo: coincide con Jost 400/500/700. Kickers como "PHONE LOCAL TIME" / "LOG LOSS BY WEEK" y "HORA DE ESTE TELÉFONO" coinciden con Plex Mono. No hay evidencia clara de una fuente de sistema en la UI de la app. El widget no está en este set (ver triage para Jost en el widget).
- Sin cortes de texto en ES, aparte del pie de Semana (F09) y el wordmark de primer uso (F10). "Predeterminado del sistema" cabe. Los nombres de equipos reales se quedan en inglés en ES; no se cuenta como corte.
- Puntos de portada: `dots.size` 16, `dots.gap` 8, `dots.count` 10, 7 encendidos para n = 7.
- Tamaños de logo: 24 dp en la fila, 32 dp en el encabezado de Detalle (falla la cantidad y la colocación, no el tamaño).
- El anillo O es el único marcador en Semana y Detalle. En las filas de Semana, x = 30 + 3p se cumple en un campo de ~358 dp de ancho.
- Selector de idioma, en los dos idiomas, con radios de 20 dp.

## No se pudo QA en este set

- Widget 2×2, 4×2 y 4×1 (no hay emulador ni captura). Incluye Jost en el widget, monograma (F11), línea del partido en peso 400, "7 in 10 {team}" y la decisión de no poner logo en 2×2 ni 4×1.
- Un juego FINAL (kicker, ganador 700, perdedor muted, sin sello).
- Monograma en Semana o Detalle: los logos de nflverse cargaron, así que la cadena no muestra el fallback (es el estado esperado con flag encendido y red).
- Hora de saque en UTC: no es un bug.

## Triage de lo no implementado

Propuesta ajustada. Los Must visuales F01 a F10 entran en este PR junto con el monograma del widget. Lo demás puede esperar, con una salvedad en Jost del widget.

| Ítem | Este PR | Nota |
| --- | --- | --- |
| Fixes F01 a F10 (cifra con favorito, logos, nav, barra de back, campo, pie, wordmark) | Must | Vistos en las capturas, varios ya señalados por Idaho |
| Fallback de monograma en el widget | Must | Sin él, un widget sin red se rompe. No hay captura; hay que implementarlo y QA en un development build |
| Jost en el widget, si `react-native-android-widget` acepta la fuente bundleada | Must si se puede; si no, Later | Si la librería no puede usar Jost, se documenta que el 700 de sistema es aceptable en el widget, no en la app |
| Motion completo (colapso del masthead, cuenta atrás, springs, haptics) | Later | En este PR basta que los números no hagan bounce. F14 es la cuenta atrás |
| Masthead completo de Semana (cifra, orbes, tira, chip Public Alpha) | Later | F12. La lista de juegos funciona sin eso |
| Tema claro / auto | Later | No está en Ajustes (F13) |
| Limpiar caché en Ajustes, con fecha en formato del locale | Later | F13 |
| Colores themed de Android 12 en el widget | Later | El mono themed ya está especificado en H2.1; puede ir en el PR siguiente |

## Ícono adaptativo v2

El foreground de r1 llegaba a un diámetro de unos 75 dp y salía del círculo seguro de 66 dp, porque se escaló el ancho óptico a 62 dp y las esquinas del mark se salían. En `assets/v2/` el mark de logo_v4 se dejó intacto y se escaló para que **todo** el foreground quepa en un círculo de 62 dp centrado, sobre un canvas de 108 dp.

Bounding box real, medido en código (ink con alfa ≥ 10):

| Layer | Canvas | Bbox (dp) | Diámetro circunscrito (dp) | ¿Cabe en 62? | ¿Cabe en 66? |
| --- | --- | --- | --- | --- | --- |
| foreground / monochrome 432 | 108 dp (432 px) | 50.50 × 35.50 | 61.38 | Sí | Sí |
| foreground / monochrome 1024 | 108 dp (1024 px) | 50.73 × 35.65 | 61.94 | Sí | Sí |

La diferencia de 0.5 dp entre 432 y 1024 es redondeo de píxel. El centro del ink coincide con el centro del canvas. La guía de 66 dp (anillo amarillo) y la de 62 dp (anillo cream) van solo en `icon_masks_preview_v2.png`, no en las capas.

## Rutas

- Este informe: `/workspace/endzone-app-design/sprint3/build_r1/QA_r1.md`
- Board anotado: `/workspace/endzone-app-design/sprint3/build_r1/QA_r1_board.png`
- Capturas: `/workspace/endzone-app-design/sprint3/build_r1/*.png`
- Capas del ícono: `/workspace/endzone-app-design/sprint3/assets/v2/foreground.png`, `foreground-1024.png`, `background.png`, `background-1024.png`, `monochrome.png`, `monochrome-1024.png`
- Preview de máscaras: `/workspace/endzone-app-design/sprint3/assets/v2/icon_masks_preview_v2.png`
- Métricas: `/workspace/endzone-app-design/sprint3/assets/v2/icon_metrics_v2.txt`
