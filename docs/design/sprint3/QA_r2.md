# QA r2 del build 5a609a1, contra H2.1 (listón subido)

18 nov 2026, zona America/Mexico_City. Diez capturas EN/ES de Expo web, commit `5a609a1`, en `build_r2/`. Sin emulador, sin captura de Historial, de primer uso en ES, del widget ni de un juego FINAL. La hora en UTC es del VM: no se cuenta como bug. No se tocó ningún repo. Las láminas de QA que usan capturas del build son solo internas; no llevan marcas NFL a ningún archivo destinado al repo.

Escala de las capturas: 780 px de ancho (1688 o 1690 px de alto), 2 px por dp (viewport 390 dp). Las cotas de abajo usan esa escala. La comparación es lado a lado con `H2_pantallas_a.png`, `H2_pantallas_b.png`, `H2_pantallas_c.png`, `H2_componentes.png`, `H2_graficas.png`, `H2_tipografia_100_135.png` y `H2_motion.png`. Cumplir los Must de r1 ya no basta: también se señala lo que se ve peor que esas láminas (espaciados, jerarquía, pesos, alineaciones, ritmo vertical en escala de 4, densidad, vacíos y estados).

F12, F13, F14 y el motion completo, que en r1 quedaron como Later, entran a este PR como Must, con spec ejecutable.

## Veredicto

r3 no se aprueba con este build. Para aprobar, el build r3 tiene que traer todo lo P0 y lo P1:

- Barra de back de 64 dp con icono de 24 (cerrar F05).
- Masthead colapsable de Semana, con cifra 96, orbes, tira de 72, chip cream de Public Alpha y colapso por transform (cerrar F12).
- `cover.wins` bajo la cifra 168, para que "7 / in 10 / Texans win" se lea solo (cerrar F15).
- Tema Auto / Oscuro / Claro y borrar caché en Ajustes, con paleta clara de `lightPalette` y `contrastLight` (cerrar F13).
- Cuenta atrás pre-saque y estado FINAL tipográfico, sin sello (cerrar F14).
- Encabezados de día (F16), kicker de fila encima de los nombres (F17) y ritmo vertical en escala de 4, con los huecos de 39 y 40 dp cerrados (F18).
- Motion completo de `H2_motion` y `tokens.ts`: 120 / 200 / 320, curva `(0.2, 0, 0, 1)`, spring solo en formas de marca, cifras sin bounce, haptics por evento, respeto de reduce motion (F19).
- Logos del encabezado de Detalle en slot de 32 dp (cerrar F03) y monograma implementado, a verificar en Android (F11).

Lo P2 (icono de Historial como barras, etiqueta de probabilidad sobre el mini campo) no bloquea la aprobación.

## Conteo

| Prioridad | Qué significa | IDs | N |
| --- | --- | --- | --- |
| P0 | Bloquea el PR y la aprobación de r3 | F05, F12, F15 | 3 |
| P1 | Va en este PR; r3 lo tiene que traer para aprobar | F03, F11, F13, F14, F16, F17, F18, F19 | 8 |
| P2 | Mejora opcional, coherente con el kit | F21, F22 | 2 |

Cerrados en r2: F01, F02, F04, F06, F07, F08, F09, F10 (8). Parciales: F03, F05. Abiertos de r1 que ahora son Must: F11, F12, F13, F14. Nuevos: F15 a F19, F21, F22.

## Top 10 de lo que más mejora la percepción

1. F15. "Texans win" / "gana Texans" bajo la cifra 168 (`cover.wins`, `type.subtitle` 18/24, 8 dp).
2. F12. Masthead de Semana: kicker WEEK, cifra `type.display` 96, "13 GAMES", stamp, chip Public Alpha, orbes, tira de 72, y el colapso.
3. F17. La hora y el estado como kicker encima de los nombres, no debajo.
4. F16. Encabezados de día (Today / Tomorrow / weekday).
5. F18. Cerrar el hueco de 40 dp entre filas y los de 39 dp alrededor de la portada; alinear a 4 dp.
6. F14. Cuenta atrás y un FINAL tipográfico (ganador 700, perdedor muted, sin sello).
7. F05. Barra de back de 64 dp, no un chevron suelto.
8. F13. Tema Auto / Oscuro / Claro y "Datos guardados" con fecha y Borrar.
9. F19. Lista con stagger de 30 ms, colapso a 320 ms, cifras sin bounce.
10. F22 (mejora) o, si no entra, F03: etiqueta "Hawks 69%" sobre el mini campo, o el par de logos de Detalle en 32 dp.

## Líneas de yarda, no números de yarda

Se mantiene la regla de r1. En r2 los filetes cada 10 (`#3A4148`) y la línea de 50% (`#9A9891`, cream 60% sobre `#14181C`, 6.18:1) ya están. No van números de yarda.

## Estado F01 a F14

### F01 · Week · Week row · cerrado

La cifra de la fila nombra al favorito: "7 in 10 Texans" / "7 de 10 Texans". Toss-up se muestra como "Toss-up" / "Juego parejo" en la etiqueta del campo, sin nombre. La matemática de portada se cumple (69% → 7, 84% → 8, 58% → 6, 56% → 6, 60% → 6, 66% → 7, 75% → 8, 63% → 6). Evidencia: `en-week.png`, `es-week.png`.

### F02 · Week · Logo slot · cerrado

Dos logos por fila, slot de 24 dp (`teamLogos.sizeRow`), columna a la izquierda de los nombres, sin placa de color. El ink del mark mide unos 18 dp dentro del slot; el paso entre centros coincide con 24 + 6. Evidencia: `en-week.png`, `es-week.png`.

### F03 · Detail · Logo slot · parcial · P1

La colocación ya es la de H2: el par va agrupado a la izquierda de "Colts at Texans" / "Colts en Texans". El tamaño no: la banda de logos + título mide 26.5 dp de ink (131.5 a 158 dp), no un slot de `teamLogos.sizeHeader` 32. Visualmente los marks quedan en 24 a 27 dp. En r3 el slot es 32 dp; en la barra compacta de 64, 24 dp. Evidencia: `en-detail.png`, `es-detail.png`.

### F04 · Week, Settings · Bottom nav · cerrado

Indicador cream medido 56×32 dp, exactamente `nav.indicator`. Barra 64 (hairline a 65 dp del borde). Iconos de trazo reales (calendario, reloj, sol), no cuadros. Activo: ink `#151515` sobre cream. Inactivo History ink ~18 dp, Settings ~20 a 22, cerca de `nav.icon` 24. El icono de Historial es un reloj y no las barras de `H2_componentes.png`; eso queda como mejora F21, no reabre F04. Sin captura de Historial. Evidencia: `en-week.png`, `en-settings.png`, `es-settings.png`.

### F05 · Detail, How it is calculated · barra de back · parcial · P0

Hay un chevron muted `#A9A396`. El ink útil del glifo mide 8.5 dp de alto (67.5 a 76 dp desde el borde superior). No hay una barra de 64 dp como superficie: el kicker "PHONE LOCAL TIME" entra en el flujo a 97 dp, 21 dp bajo el chevron, y el icono no es un 24 dp en un hit de 64. Lo mismo en How it is calculated. Valor esperado: barra `nav.height` 64, icono de back 24, hit 48; el título compacto (`type.titleCompact`, `detail.compact`) y el par de logos de 24 (`teamLogos.sizeBar`) entran en la barra al hacer scroll. Evidencia: `en-detail.png`, `es-detail.png`, `en-how.png`, `es-how.png`.

### F06 · Detail, Week · filetes y línea de 50% · cerrado

Filetes cada 10 en `#3A4148`. Línea de 50% `#9A9891`. Mini campo de Semana: alto 24, caps 2 dp en `#30363C`, sin end zones llenas. Evidencia: `en-detail.png`, `en-week.png`.

### F07 · Detail · geometría del campo · cerrado

Ancho 360, end zones 30, juego 300, alto 112, `crimsonHero` `#9A3350`, anillo 16. A p = 0.69, x medido ≈ 236.75 frente a 30 + 3×69 = 240 (dentro del anillo y de `field.markerClamp` [38, 322]). Evidencia: `en-detail.png`.

### F08 · Detail · etiquetas y valores · cerrado

"69%" junto al anillo; "Texans 69% model" / "Texans 69% modelo"; puntos 7 de 10; frase `detail.dots`: "In 10 games like this, Texans win 7." / "En 10 partidos como este, Texans gana 7." El favorito queda nombrado en esos bloques, no en la cifra 168 (eso es F15). Evidencia: `en-detail.png`, `es-detail.png`.

### F09 · Week · Footer with link · cerrado

`en-week-footer.png` muestra el pie completo encima de la nav: "Open ML experiment…" y el enlace "How it is calculated". En `en-week.png` la última fila del medio de la lista asoma bajo la nav; eso es scroll, no un pie recortado. Evidencia: `en-week-footer.png`.

### F10 · First-run · wordmark · cerrado

Marca + "endzone-mlops" en una línea, margen izquierdo 24 dp, sin recorte. `first.lead` y `first.cta` están. Evidencia: `en-first.png`.

### F11 · Widget · Monogram · abierto · P1

No se puede verificar en Expo web (no hay captura de widget ni del icono adaptativo instalado). No bloquea la lectura visual de estas pantallas. En este PR hay que implementar el monograma (anillo 1.5 dp o punto 5 dp, abreviatura ficticia, Jost 700, cream sobre `#262B30`) y verificarlo en un development build de Android, con el flag `teamLogos.enabled` apagado o con un fallo de red. Las capas v2 del icono ya están en `sprint3/assets/v2/` y caben en 62 dp; eso tampoco se puede confirmar en estas capturas web.

### F12 · Week · Masthead · abierto · P0

Must (antes Later). El encabezado de r2 es un bloque de ~90 dp: kicker muted "PUBLIC ALPHA" (15.5 a 24 dp, no es un chip con trazo cream), título `type.title` "Week 11" / "Semana 11" (40.5 a 58, ink 17.5 dp, correcto para 24 sp) y meta "13 games Saved…" / "13 juegos Guardado…". Faltan, frente a `H2_pantallas_a.png`:

- Kicker `week.kicker` "WEEK" / "SEMANA", `type.kicker` 12/16, cream.
- Cifra de la semana `type.display` 96/1, tracking −4, `maxFontSizeMultiplier` 1.0, sin scaling.
- `week.count` ("13 games" / "13 juegos") y `week.saved` ("Saved {dt}" / "Guardado {dt}") en `type.bodySmall`.
- Chip Public Alpha: trazo cream 1.5 dp, radio 4, padding 8×4, `type.chip` 11/14, clave `alpha`. No un kicker muted.
- Orbes de semanas adyacentes, diámetro 40 dp, gap 4, el actual con anillo cream de 2 dp. Cambio de semana: `hapticEvents.weekChange` `selectionAsync`.
- Tira `field.stripHeight` 72, solo O, misma geometría que el mini campo.
- Colapso por scroll, `motion.heroCollapseScroll`: `start` 0, `compactFrom` 80, `compactVisible` 120. Se anima con `transform` (translateY / scale), no con `fontSize`, duración `motion.duration.lg` 320, easing `cubic-bezier(0.2, 0, 0, 1)`. Barra compacta de 64: kicker + número en `type.titleCompact` 22/28, el chip y el stamp; sin orbes ni tira. Reduce motion: snap en `compactFrom`, el contenido de la barra compacta no se oculta. `heroCollapse` está en `hapticEvents.never`.

Evidencia: `en-week.png`, `es-week.png`, comparado con `H2_pantallas_a.png`.

### F13 · Settings · Theme selector y Cache control · abierto · P1

Must (antes Later). El selector de idioma está bien (radios 20 dp, "System default" / "Predeterminado del sistema", "English", "Español", la fila larga envuelve). No hay tema ni caché. La alerta del martes no es un bug. Versión 0.3.0.

Spec ejecutable:

- Sección `set.theme` ("Theme" / "Tema"), 16 dp bajo Idioma (`space.md`). Tres radios, `langOption.minHeight` 48, radio 20: `set.theme.auto` Auto / Auto (sigue el teléfono, `themePref.default` `system`, `storageKey` `theme.pref`); `set.theme.dark` Dark / Oscuro; `set.theme.light` Light / Claro. Sin haptic al cambiar.
- Paleta clara: `lightPalette` en `tokens.ts`. Fondo `#F4EEDF`, surface `#E8E0CC`, raised/border `#D9D1BD`, texto `#151515`, muted `#5E5950`, model `#22509B` (6.75:1 sobre cream), `crimsonHero` `#AE2440` con cream 5.80:1 en las end zones (no usar ink ahí), `playField` `#E8E0CC`, `fieldTick` `#BAB3A4` (1.59:1, solo textura), línea de 50% `textMuted` 5.29:1, tintes `blueDeep` `#D5DEEE`, `crimsonDeep` `#F0D4DA`, `blueSoft` `#3E68B0` (4.76:1 sobre cream; 4.19 sobre surface, no usarlo como cuerpo), `glass` `#EFE8D6`. Ratios en `contrastLight`. Sin amarillo en superficies primarias.
- Sección `set.cache` ("Saved data" / "Datos guardados"), 16 dp bajo Tema. Fila 48: stamp `set.cache.when` "Saved {dt}" / "Guardado {dt}" en `type.kicker` muted, fecha en formato del locale, y botón `set.clear` "Clear" / "Borrar", `type.body` cream (en claro: ink o model), hit 48. Tras borrar: `set.cache.cleared` y luego `set.cache.empty`; el botón queda deshabilitado hasta que haya datos nuevos. Sin haptic.

Evidencia: `en-settings.png`, `es-settings.png`, comparado con `H2_pantallas_c.png`.

### F14 · Detail, Week · Countdown y FINAL · abierto · P1

Must (antes Later). En las capturas de Detalle no hay cuenta atrás. No hay un juego FINAL en este set, así que el estado tipográfico no se pudo ver.

Spec ejecutable:

- Pre-saque, Detalle: `detail.countdown` "Starts in {d} d {h} h" / "Empieza en {d} d {h} h" cuando d ≥ 1; `detail.countdown.short` "Starts in {h} h {m} m" / "Empieza en {h} h {m} min" cuando d = 0 y h ≥ 1; `detail.countdown.min` "Starts in {m} min" / "Empieza en {m} min" bajo 1 hora. Tipo `type.subtitle` 18/24 o `type.figure` 16/20 mono 500 tabular, cream (en claro: ink), una línea. Actualiza cada 60 s. Los dígitos usan `motion.duration.sm` 120 y easing standard, nunca `springShape`.
- En juego: se oculta la cuenta, se muestra `chip.live` y `detail.livekicker`, sin pulso, se conserva la probabilidad de pre-saque.
- FINAL: kicker `chip.final` (`type.kicker`, uppercase, "FINAL" en los dos idiomas). Se sustituye la cifra 168 y la cuenta por el marcador: Detalle `type.figureLg` 32/36 mono 600 tabular; fila de Semana `type.scoreRow` 22/24 y nombres `type.scoreName` 18/24. Ganador Jost 700 cream (en claro: ink). Perdedor Jost 400 muted. Sin círculo cream de 24 ni sello de check. Empate: `chip.tie`. Reduce motion: el texto cambia, no hay tween en los dígitos.

Evidencia de la ausencia: `en-detail.png`, `es-detail.png`. Sin captura FINAL.

## Fixes nuevos

### F15 · Detail · Cover figure · P0

**Qué está mal.** La portada es solo "7" + "in 10" / "de 10". No está `cover.wins` bajo la cifra. Idaho lo señaló. Aunque `detail.dots` y `detail.vals` nombran a Texans, la cifra de 168 sp tiene que leerse sola: "siempre nombrar al favorito".

**Valor esperado.** En el estado in10 (5 a 9): cifra `type.cover` 168, `cover.in10`, y `cover.wins` ("{team} win" / "gana {team}") en `type.subtitle` 18/24 Jost 500, cream, una línea, gap `rhythm.detail.in10ToWins` 8 dp bajo "in 10" / "de 10". Ejemplo: "7 / in 10 / Texans win" y "7 / de 10 / gana Texans". En toss-up y en "More than 9 in 10" no se usa `cover.wins` (la frase ya se sostiene sola). Hay 39 dp libres entre el final de "in 10" (317 dp) y las etiquetas del campo (356 dp); 8 dp caben sin apretar el campo.

**Evidencia.** `en-detail.png`, `es-detail.png`. Clave confirmada: `cover.wins`.

### F16 · Week · Day header · P1

**Qué está mal.** La lista no agrupa por día. H2 (`H2_pantallas_a.png`) lleva encabezados entre bloques de filas.

**Valor esperado.** `type.kicker` 12/16, tracking 1.2, uppercase, cream (en claro: ink). Gaps `rhythm.week.dayHeaderGapAbove` 16 (8 si es el primero bajo el masthead) y `dayHeaderGapBelow` 8, padX 16. Claves: `week.day.today` Today / Hoy, `week.day.tomorrow` Tomorrow / Mañana, o `week.day` `{weekday}` en el locale (el kicker lo pasa a mayúsculas). Las horas siguen en el kicker de la fila, en hora del teléfono.

**Evidencia.** `en-week.png`, `es-week.png`.

### F17 · Week · Week row (kicker) · P1

**Qué está mal.** La hora ("Fri, Nov 20, 12:00 AM GMT+0") queda bajo los nombres, en el mismo bloque que el título. En H2 el kicker va encima de los nombres (fecha / estado) y la cifra 48 se alinea con ese bloque. Cambia la jerarquía: el partido no tiene un riel de estado, y la meta se lee como un subtítulo pesado.

**Valor esperado.** Una línea `type.kicker` 12/16 encima de los nombres, gap `rhythm.week.rowKickerGap` 8. Contenido: fecha-hora del saque en locale, o `chip.live` / `chip.final`. Nombres `type.teams` 16/22 500, cifra `type.rowFigure` 48. Luego 8 dp y el mini campo de 24.

**Evidencia.** `en-week.png`, `es-week.png`, comparado con `H2_pantallas_a.png`.

### F18 · Week, Detail · ritmo vertical · P1

**Qué está mal.** Varios gaps no caen en la escala de 4 y la densidad queda más floja que H2. Medido:

Semana (`en-week.png`):

- Tras la meta del header, 27.5 dp hasta la primera fila (debería ser 16 o 24, y 8 si hay encabezado de día).
- Nombres → campo: 12.5 dp (esperado 8).
- Campo → etiqueta "Texans 69%": 7 dp (no es múltiplo de 4).
- Etiqueta → siguiente fila: 40 dp. Es el hueco que más se ve. Esperado `rhythm.week.fieldToNext` 16.
- Paso de fila 152 dp frente a `rhythm.week.rowMinHeight` 132.

Detalle (`en-detail.png`):

- Chevron a 67.5 dp del borde, luego 21 dp al kicker (97 a 112).
- Tras el título (ink hasta 158), 39 dp hasta la cifra 7 (197 a 317, ink 120, coherente con 168 sp).
- Tras "in 10" (hasta 317), 39 dp hasta las etiquetas del campo (356 a 365), luego 8 al campo (373 a 485, 112 exacto).
- Campo → valores 14.5; valores → puntos 15; puntos → frase 16.5; frase → pie 29.5; pie → enlace 10.5; el contenido termina a 634 dp y quedan ~210 dp de aire hasta el borde de una pantalla de 844 dp.

**Valor esperado.** Todos los padding y gaps en `space` (4, 8, 12, 16, 24, 32, 48, 64). Usar `rhythm.week` y `rhythm.detail` de `tokens.ts`. En Detalle, tras la barra de 64: 16, kicker, 8, fecha, 16, logos 32 + título, 16, portada 168 + in 10 + `cover.wins` a 8 dp, 16, etiquetas, 8, campo 112, 12, valores, 8, puntos, 8, frase, 16, pie, 8, enlace, 24 + inset. No se inventa un relleno para tapar el aire; se cierra la holgura del stack. A 100%, ver cuenta y pie puede pedir scroll, y eso está especificado. La cuenta atrás de F14 ocupa parte del recorrido, no hay que anclar el pie.

**Evidencia.** `en-week.png`, `en-detail.png`, `es-detail.png`.

### F19 · App · Motion and haptics · P1

**Qué está mal.** Must (antes Later). Las capturas web no muestran motion. No hay stagger de entrada, no hay colapso (no hay masthead), no se puede ver reduce motion ni haptics.

**Valor esperado.** Spec en `tokens.ts` y en la fila "Motion and haptics" de `handoff_components.csv`:

- Duraciones `motion.duration`: sm 120, md 200, lg 320.
- Easing `motion.easing.standard` `[0.2, 0, 0, 1]`, o sea `cubic-bezier(0.2, 0, 0, 1)`.
- Stagger 30 ms en las primeras 6 filas de Semana, solo al entrar.
- `springShape`: damping 16, stiffness 180, mass 1, `overshootClamping` false. Solo formas de marca en primer uso, vacío y offline sin caché. Nunca en cifras de portada, de fila, porcentajes ni cuenta atrás (sin bounce).
- Colapso: ver F12.
- `motion.reducedMotion`: duraciones 1 ms, `disableSpring` true, `keepContent` true; el colapso hace snap; los dígitos siguen actualizándose.
- Haptics permitidos: `weekChange` y `navChange` `selectionAsync`; `switchOn` `impactLight` / `AndroidHaptics.Toggle_On`; `switchOff` `impactLight` / `AndroidHaptics.Toggle_Off`.
- `hapticEvents.never`: `probabilityUpdate`, `heroCollapse`, `refresh`, `finalResult`, `modelHit`, `skeletonPulse`, y el clear de caché.
- Pressed `opacity.pressed` 0.72.

**Evidencia.** Ausencia en todo el set r2, más `H2_motion.png`.

## Mejoras (P2)

Solo las que valen la pena y siguen el kit (un acento, sin mercado en la portada, sin lenguaje de apuestas). Ilustración en `QA_r2_mejoras.png`, con equipos ficticios, sin marcas NFL.

### F21 · Week, Settings · Bottom nav · mejora · P2

El icono de Historial es un reloj (ink ~18 dp). En `H2_componentes.png` es un pictograma de barras, más cercano a un historial de aciertos. Valor: icono de 24 dp, trazo 2 dp, mismas reglas cream / muted / ink que el resto de la nav. No reabre F04.

### F22 · Week · Mini field · mejora · P2

La etiqueta "Texans 69%" / "Texans 69%" vive 7 dp bajo el mini campo y añade unos 17 dp al paso de fila. Valor: llevar `type.fieldLabel` 14/16 (color `model` / `modelLabel`) sobre el campo, como en Detalle, y eliminar esa banda. El paso objetivo queda en 132 dp (`rhythm.week.rowMinHeight`). En toss-up, la etiqueta es `chip.tossup`, sin nombre. La posición del anillo sigue usando p del local.

## Tokens y handoff añadidos en esta pasada

En `hybrid/tokens.ts` (el kit oscuro no cambia de hex):

- `space`: 4, 8, 12, 16, 24, 32, 48, 64.
- `rhythm.week` y `rhythm.detail`, con los gaps de F17 y F18.
- `themePref`: default `system`, options `system | light | dark`, `storageKey` `theme.pref`.
- `motion.reducedMotion` y la regla de no usar `springShape` en cifras.
- `lightPalette`: `fieldTick` pasa de `#D9D1BD` (1.16:1, casi invisible) a `#BAB3A4` (1.59:1, textura). Se agregan `blueDeep` `#D5DEEE`, `crimsonDeep` `#F0D4DA`, `blueSoft` `#3E68B0`, `glass` `#EFE8D6`. `crimsonHero` `#AE2440` se documenta con cream 5.80:1.
- `contrastLight` con los ratios AA del tema claro (incluida la línea de 50% `mutedOnPlayField` 5.29).

En `hybrid/handoff_components.csv` (de 16 a 21 filas): se actualizaron Cover figure (incluye `cover.wins`), Masthead (colapso), FINAL kicker, Week row (kicker encima). Filas nuevas: Theme selector, Cache control, Countdown, Motion and haptics, Day header.

En `hybrid/strings_en_es.csv` (de 106 a 114 claves): `week.day`, `week.day.today`, `week.day.tomorrow`, `set.cache.when`, `set.cache.cleared`, `set.cache.empty`, `detail.countdown.short`, `detail.countdown.min`. Ya existían `cover.wins`, `detail.countdown`, `set.theme*`, `set.cache`, `set.clear`.

## Lo que no es un bug

- Hora de saque en UTC: es el VM.
- Alerta del martes en Ajustes.
- Mercado solo en How it is calculated (y en Historial, no recapturado). No está en Semana ni en Detalle.
- Sin amarillo en las superficies primarias.
- No hay captura de Historial, de primer uso en ES, de widget ni de FINAL: se documenta, no se inventa un fallo visual.

## Rutas

- Este informe: `/workspace/endzone-app-design/sprint3/build_r2/QA_r2.md`
- Board anotado (interno, 2x): `/workspace/endzone-app-design/sprint3/build_r2/QA_r2_board.png`
- Mini board de mejoras y specs (sin marcas NFL): `/workspace/endzone-app-design/sprint3/build_r2/QA_r2_mejoras.png`
- Capturas: `/workspace/endzone-app-design/sprint3/build_r2/*.png`
- Tokens: `/workspace/endzone-app-design/sprint3/hybrid/tokens.ts`
- Handoff: `/workspace/endzone-app-design/sprint3/hybrid/handoff_components.csv`
- Strings: `/workspace/endzone-app-design/sprint3/hybrid/strings_en_es.csv`
