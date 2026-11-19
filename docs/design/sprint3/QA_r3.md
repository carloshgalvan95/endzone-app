# QA r3 del build d243279, contra H2.1 (mismo listón que r2)

19 nov 2026, zona America/Mexico_City. 17 capturas de Expo web en `build_r3/`: dark-week, dark-detail, en-week, en-week-collapsed, en-detail, en-detail-final, en-first, en-how, en-settings, es-week, es-week-collapsed, es-detail, es-how, es-settings, light-week, light-week-collapsed, light-detail. Sin emulador. La hora en UTC es del VM: no cuenta. La pantalla How sigue siendo la vieja a propósito (H3_how va en r4): solo se revisaron regresiones. No se tocó ningún repo, sitio ni lámina.

Escala verificada: 780 x 1688 px en las 17 capturas, 2 px por dp, viewport 390 x 844 dp. Las cotas son en dp desde el borde superior de la captura; "ink" es el trazo medido, "caja" es la caja de línea del token. Comparación lado a lado con `H2_pantallas_a.png`, `H2_pantallas_b.png`, `H2_componentes.png`, `tokens.ts` y `handoff_components.csv`.

## Veredicto

**Pasa salvo menores.** No hay P0. Lo que falta son ajustes de valor, posición o copy con spec exacta, sin cambios de estructura. Pueden ir junto con H3_how en r4 sin una ronda de QA visual aparte; se confirman en las capturas de r4 (lista al final).

Menores para r4: F12 (vía F23 a F26), F13, F14, F15, F18, F23, F24, F25, F26, F27, F28, F29, F30. Opcionales P2: F31 a F35.

## Conteo

| Prioridad | Qué significa | IDs | N |
| --- | --- | --- | --- |
| P0 | Bloquea el PR | ninguno | 0 |
| P1 | Va en este PR, en r4 junto con H3_how | F12, F13, F14, F15, F18, F23, F24, F25, F26, F27, F28, F29, F30 | 13 |
| P2 | Mejora opcional, coherente con el kit | F31, F32, F33, F34, F35 | 5 |

Cerrados en r3: F01, F02, F03, F04, F05, F06, F07, F08, F10, F16, F17, F21, F22 (13). Parciales: F12, F13, F14, F15, F18 (5). No verificables: F09, F11, F19 (3). F20 no existe (el número no se usó en r2).

## Estado F01 a F22

| ID | Pantalla · componente | r2 | r3 | Evidencia y nota |
| --- | --- | --- | --- | --- |
| F01 | Week · cifra de fila | cerrado | cerrado | 69 a 7 Texans, 84 a 8 Chiefs, 58 a 6 Panthers, 56 visitante a 6 Jaguars, 74 a 7 Broncos. EN "in 10 Texans", ES "de 10 Texans". |
| F02 | Week · logo slot | cerrado | cerrado | Dos logos por fila, slot 24, sin placa. Alineación con los nombres en F27; legibilidad en oscuro en F31. |
| F03 | Detail · logos 32 | parcial P1 | cerrado | Banda logos + título 180.5 a 209.5 dp (29 de ink en slot 32). |
| F04 | Nav | cerrado | cerrado | Barra 64 (hairline en 780), indicador 56 x 32, Historial con barras. Contenedor flotante del board en F32 (P2). |
| F05 | Detail, How · barra de back | parcial P0 | cerrado | Barra 64 (hairline en 63 dp), chevron ink 22.5 en icono 24. El título compacto al hacer scroll no tiene captura: ver "No verificable". |
| F06 | Campo · filetes y 50% | cerrado | cerrado | Oscuro `#3A4148` y `#9A9891`. Claro `#BAB3A4` y `#5E5950`. |
| F07 | Detail · geometría del campo | cerrado | cerrado | 112 de alto (471 a 582.5), end zones `#9A3350` en oscuro y `#AE2440` en claro. |
| F08 | Detail · etiquetas y valores | cerrado | cerrado | "69%", "Texans 69% model" / "Texans 69% modelo", puntos 7 de 10. |
| F09 | Week · pie con enlace | cerrado | no verificable | Ninguna captura r3 llega al pie de Semana. |
| F10 | Primer uso · wordmark | cerrado | cerrado | Geometría idéntica a r2 (marca 47 a 75, lead 116.5 a 156, CTA 184 a 231.5), ahora en claro. Sin regresión. |
| F11 | Widget · monograma | abierto P1 | no verificable | Reportado hecho. Va a verificación en Android tras el PR. |
| F12 | Week · masthead | abierto P0 | parcial P1 | Ya hay kicker, cifra 96 (ink 68), meta, chip, orbes 40, tira 72 (252 a 323.5) y colapso a barra 64. Pendiente: F23 colisiones, F24 chip de la barra compacta, F25 composición, F26 orbe actual. |
| F13 | Settings · tema y caché | abierto P1 | parcial P1 | Tema Auto / Oscuro / Claro y Datos guardados están, en EN y ES. Pendiente: F30 (densidad y fila de caché). Para cerrar F13 falta la captura de Settings en tema claro (requerida en r4, no bloquea). |
| F14 | Detail · cuenta atrás y FINAL | abierto P1 | parcial P1 | Cuenta atrás correcta: "Starts in 19 h 23 m" / "Empieza en 19 h 23 min". FINAL: kicker FINAL, sin sello, ganador 700, perdedor muted. Pendiente: tipografía del marcador y frase (detalle abajo). Falta FINAL en ES y una fila FINAL en Semana (requeridas en r4, no bloquean). |
| F15 | Detail · portada | P0 | parcial P1 | "7 / in 10 / Texans win" y "7 / de 10 / gana Texans" ya se leen solos. Pendiente: la composición (detalle abajo). |
| F16 | Week · encabezados de día | P1 | cerrado | TOMORROW / SUNDAY, MAÑANA / DOMINGO. Encabezado a kicker de fila: caja 8 dp (ink 531.5 a 547). |
| F17 | Week · kicker encima de nombres | P1 | cerrado | "FRI, NOV 20, 1:15 AM" encima de los nombres. Sangría y alineación de logos en F27. |
| F18 | Week, Detail · ritmo vertical | P1 | parcial P1 | Idaho punto 2. Detalle abajo. |
| F19 | App · motion y haptics | P1 | no verificable | Capturas estáticas. Reportado hecho. Verificar en Android: 120 / 200 / 320, cifras sin bounce, haptics por evento, reduce motion. |
| F20 | | | | ID no usado. |
| F21 | Nav · icono de Historial | P2 | cerrado | Pictograma de barras. |
| F22 | Week · etiqueta sobre el mini campo | P2 | cerrado | "Texans 69%" dentro del campo; con el anillo a la izquierda va a la derecha ("Jaguars 56%"). |

## Detalle de los parciales

### F14 · Detail FINAL · marcador y frase · P1

Medido en `en-detail-final.png`: "Commanders 24" es una sola cadena Jost 700 de unos 36 sp (ink 197 a 222.5); "Giants 21" Jost 400 muted (ink 239 a 262). La frase es `detail.dots` en presente, "In 10 games like this, Giants win 7.", justo después de que Giants perdió.

Valor esperado (fila FINAL kicker del handoff y `H2_pantallas_b.png`):

- Dos filas de marcador, gap 4. Nombre a la izquierda en `type.scoreName` 18/24; cifra alineada a la derecha en x 374 (padX 16) en `type.figureLg` 32/36 IBM Plex Mono 600, tabular-nums. Ganador: nombre Jost 700 y cifra en cream (claro: ink `#151515`). Perdedor: nombre Jost 400 y cifra en muted (`#A9A396`, claro `#5E5950`).
- Frase: `cover.old`, "The model had 7 in 10 for Giants." / "El modelo daba 7 de cada 10 a Giants.", en `type.subtitle` 18/24, con {n} en Jost 700. Va 16 dp bajo el marcador y antes de las etiquetas del campo. En FINAL no se muestra `detail.dots`; los puntos pueden quedarse.
- Se mantiene: kicker FINAL, sin sello, sin círculo de 24, sin cuenta atrás.

### F15 · Detail · composición de la portada · P1

Medido en `dark-detail.png`: el 7 ocupa de 251 a 368.5 dp (base en 368.5). "in 10" está debajo de la base, con el ink entre 376 y 388.5, y "Texans win" baja a otra línea a la izquierda (408.5 a 421). La portada termina en 425 y el campo empieza en 471.

Valor esperado (`H2_pantallas_b.png`, estado en juego): fila con `alignItems: flex-end`. Columna derecha a 12 dp del avance del 7, con `cover.in10` en `type.title` 24/30 Jost 700 y, 8 dp debajo, `cover.wins` en `type.subtitle` 18/24 Jost 500. La base de `cover.wins` coincide con la base del 7 (368.5 aquí, más o menos 2 dp). La caja de portada va de 224 a 392; las etiquetas del campo empiezan en 408 y el campo en 436 (hoy 471, sube 35 dp). Toss-up y "More than 9 in 10" no cambian. En ES, "gana Texans" cabe en la columna: la columna arranca en x ~142 y deja 216 dp.

### F18 · ritmo vertical · P1 (Idaho punto 2)

**Semana** (`dark-week.png`, igual en `light-week.png` y `es-week.png`):

| Tramo | Medido | Esperado |
| --- | --- | --- |
| Fondo del mini campo (455.5) a SUNDAY (ink 523.5) | 68 ink, 64 de caja | 32 de caja (padBottom 16 + dayHeaderGapAbove 16); ink ~36 |
| Fondo del campo (643.5) al kicker de la fila siguiente del mismo día (ink 695.5) | 52 ink, 48 de caja | 32 de caja (16 + 16) |
| Paso entre kickers del mismo día (547 a 695.5) | 148.5 | 132 |
| Encabezado de día a kicker de fila | 8 de caja | 8 (correcto) |

Causa: `rowMinHeight` 132 se aplicó como alto mínimo del contenido, que hoy mide 100 (kicker 16, 8, nombres 44, 8, campo 24), y además se sumaron `fieldToNext` 16 y `dayHeaderGapAbove` 16. No es un fallo solo del último elemento del día: también afecta a cada fila. El 132 es la caja completa: padTop 16 + 100 + padBottom 16, con un hairline de 1 dp en `border` al pie. La primera fila bajo un encabezado de día lleva padTop 0, porque el gap es el 8 del encabezado. Por cada día se ahorran 32 dp y por cada fila 16. Ya quedó aclarado en `tokens.ts` (`rhythm.week.rowPadY`, `rowContent`) y en la fila Week row del handoff.

**Detalle:** de la frase (caja hasta ~667.5) al pie (ink 695) hay 24 dp de caja; el esperado es `phraseToFooter` 16. Lo demás del stack ya cae en `rhythm.detail`: afterBar 16, kicker a fecha 8, campo a valores 12, valores a puntos 8, puntos a frase 8 y pie a enlace 8.

## Nuevos (F23 en adelante)

### F23 · Week · Masthead, tira de 72 · colisión de anillos · P1 (Idaho punto 1)

Medido: los anillos van en un solo carril a y 287.5 (centro de la tira, 252 + 36). Hay 20 bordes de anillo entre x 149 y 308.5, con centros separados apenas 6 a 8 dp, cuando el diámetro es 16. Se leen como una cadena.

Regla (ya en `tokens.ts` como `stripLanes` + `assignStripLanes`, y en la fila Masthead del handoff):

```
W = ancho de la tira (358 en 390 dp)
x(g) = clampX(field.x(g.pHome * 100, W), W)     // x nunca se mueve
orden = por x asc, luego kickoff asc, luego gameId asc (estable)
carriles: y = 36 (centro), 16 (arriba), 56 (abajo), en dp desde el borde superior
para d en [16, 12]:                     // paso 1 (trazo 3) y paso 2 (trazo 2.5)
  minDx = d + 4
  last = [-inf, -inf, -inf]
  para cada anillo en orden:
    carril = primero de [0, 1, 2] con x - last[carril] >= minDx
    si no hay: el paso falla, probar el siguiente d
    last[carril] = x
  si todos caben: devolver (d, carriles)
// paso 3, semanas muy densas: d = 12, primer carril libre con minDx 16;
// si no hay, el carril con más espacio (x - last mayor), empate al índice menor.
// Nunca se oculta un anillo. Máximo 3 carriles. Diámetro mínimo 12.
```

El diámetro es global para toda la tira. Con 3 carriles a 20 dp de paso y anillos de 16, quedan 4 dp entre carriles y 8 dp de margen arriba y abajo (8 a 64). Un cambio de carril anima `translateY` 200 ms con `cubic-bezier(0.2, 0, 0, 1)`, sin spring; con reduce motion hace snap. Los mini campos de fila no usan carriles.

Prueba con `tsc --strict`, sin errores. Con 8 juegos entre 55 y 85% resuelve en el paso 2 (diámetro 12) sin solapes. Con 13 juegos, 4 de ellos dentro de 9 dp, resuelve en el paso 3: la distancia mínima en un mismo carril es de 14.9 dp, mayor que el diámetro de 12, así que tampoco hay solape.

### F24 · Week · barra compacta · chip fuera de lugar · P1

Medido en `en-week-collapsed.png` y `es-week-collapsed.png`: el chip PUBLIC ALPHA va de y 0.5 a 23.5 y de x 88 a 196, pegado al borde superior y por encima de la línea de "WEEK 11" (ink 24 a 39.5). El sello "Saved..." queda en 26.5 a 37.5 y el hairline en 63. Parece el translateY del colapso sin asentar.

Valor: una sola fila centrada en y 32 de la barra de 64. El número `type.titleCompact` 22/28 va con su caja de 18 a 46, el chip (24 de alto) de 20 a 44 y 12 dp después del número, y el sello alineado a la derecha en padX 16. Nada por encima de y 8. Pasa igual en EN, ES y claro.

### F25 · Week · masthead expandido · composición · P1

Medido: todo va apilado: cifra (52.5 a 120.5), meta (148 a 161.5), chip (172 a 195.5), orbes (204 a 243.5) y tira hasta 323.5.

Valor (`H2_pantallas_a.png`): `week.count` y `week.saved` van en una columna derecha junto al 96, alineada a la derecha en padX 16 y con el tope en el tope de la cifra; el chip va 8 dp debajo, en la misma columna. Los orbes van 12 dp bajo la caja de la cifra y la tira 12 dp bajo los orbes. Alto del masthead, del top 16 al fondo de la tira: 268 dp, frente a 324 hoy (56 dp menos antes de la primera fila).

### F26 · Week · orbe de la semana actual · P1

Medido: el orbe actual es un anillo cream de 2 dp con número cream (como decía el CSV).

Valor (`H2_componentes.png` y `H2_pantallas_a.png`): el orbe actual es un círculo relleno cream `#F4EEDF` con número ink `#151515` (15.78:1); en claro, relleno ink con número cream. Los inactivos llevan borde muted de 1.5. El CSV ya está corregido.

### F27 · Week · fila: logos y jerarquía de nombres · P1

Medido en `dark-week.png`, fila 1: el logo 1 tiene su centro en y 368 y el nombre 1 en 389.5 (21.5 dp más arriba); el logo 2 en 396 y el nombre 2 en 412.5 (16.5 más arriba). Los logos arrancan a la altura del kicker. El kicker está sangrado a x 53. "Colts", que no es el favorito, sale en cream `#F4EEDF` Jost 500.

Valor: el kicker arranca en x 16. Debajo van dos líneas de 24 dp de alto, cada una con su logo de 24 centrado en su nombre, con un gap de 12 entre logo y nombre. El favorito va en Jost 700 cream (claro: ink) y el otro equipo en Jost 400 muted `#A9A396` (claro `#5E5950`), como dice la nota de Fila de `H2_pantallas_a.png`. La cifra 48 se alinea con el bloque.

### F28 · App · keys duplicadas · P1

En `en-week.png`, `en-week-collapsed.png` y `en-detail.png` aparece el aviso de dev "Encountered two children with the same key". Con keys repetidas, React puede duplicar u omitir filas al actualizar. Valor: la key de cada fila, anillo de la tira y orbe es el `gameId` único (o el número de semana en los orbes), nunca la hora de saque, el equipo ni el índice. Es un cambio de código, no visual. En r4 no debe aparecer el aviso.

### F29 · Detail · aire abajo · P1 (Idaho punto 3)

Medido (`dark-detail.png`, igual en claro y ES): el enlace termina en ink 734 y quedan 110 dp vacíos hasta 844. En FINAL (`en-detail-final.png`) el enlace termina en 576 y quedan 268 dp.

Valor: no se agrega contenido. Un bloque de partido siguiente no está en H2 y Detalle no lleva nav (fila Bottom nav del handoff), así que se descarta. Primero se cierra el stack (F15 sube 35 dp, F18 quita 8). Luego `contentContainerStyle { flexGrow: 1 }` y un espaciador `flex: 1` entre la frase de los puntos y el pie, con un mínimo de `phraseToFooter` 16. El pie y el enlace quedan anclados abajo con un padding inferior de `afterLink` 24 más el inset, como en las láminas de `H2_pantallas_b.png`, donde el pie vive abajo y el aire queda entre el bloque del modelo y el pie. A 844 dp el pie queda en 768 a 788 y el enlace en 796 a 820. En pantallas más bajas o con fontScale 1.3, el espaciador baja a 16 y hay scroll, como ya está especificado. En FINAL, `cover.old` (F14) ocupa parte del hueco.

### F30 · Settings · densidad y fila de caché · P1

Medido en `en-settings.png` y `es-settings.png`: el paso entre opciones de radio es de 64 dp (113, 177, 241) y debería ser 48. En la fila de caché, el centro de "Clear" está en 623.5 y el del sello en 637.5; en ES, "Borrar" en 644 y el sello en 658.5. Hay 14 dp de desfase. Con "NO SAVED DATA", "Clear" sale en muted `#5E5950` a opacidad plena.

Valor: cada opción mide `langOption.minHeight` 48, con paso 48; del kicker de sección a la primera opción hay 8 y entre secciones hay `space.md` 16. La caché es una sola fila de 48 con `alignItems: center`: sello a la izquierda y Clear / Borrar a la derecha, con hit de 48. Sin datos, el botón queda deshabilitado con `opacity.disabled` 0.4 y `accessibilityState.disabled`. Se ahorran 96 dp en la página. No hay truncados en EN ni ES: "Predeterminado del sistema" y la ayuda de idioma (2 líneas) caben.

### F31 · Week, Detail · logo oscuro sobre fondo oscuro · P2

En `es-week-collapsed.png`, el logo de Giants (navy) sobre `#1B1F23` casi no se ve; en claro (`light-week-collapsed.png`) sí. Valor: en tema oscuro, si el contraste promedio del trazo opaco del logo contra el fondo es menor de 3:1, se usa la variante para fondo oscuro si la fuente pública la ofrece; si no, el monograma. Sin placa de color. Solo con el flag `teamLogos.enabled`.

### F32 · Nav · contenedor flotante · P2

El build usa una barra plana a todo el ancho, con el fondo de la página y un hairline. `H2_componentes.png` muestra un contenedor `#262B30` con borde `#30363C`, en píldora, a `nav.sideMargin` 16 de los lados y `nav.bottomGap` 12 del fondo (tokens que ya existen). No reabre F04.

### F33 · Detail · eje del campo · P2

Faltan "50%" bajo la línea de 50% (`type.axis50` 11/14, muted) y las flechas de dirección de las láminas ("← Colts" / "Texans →" en `type.fieldLabel` mono). Hoy son nombres en Jost 14 muted sin flechas.

### F34 · How · título pegado a la barra · P2

El título tiene el ink en 68 y el hairline de la barra nueva en 63: 4.5 dp. Es una regresión menor causada por F05. H3_how ya usa `rhythm.how.afterBar` 16 (caja del título en 80), así que se resuelve en r4 con el rediseño.

### F35 · Settings · dos "Guardado" distintos · P2

Semana dice "Guardado mié, 18 nov, 19:03" y Ajustes "GUARDADO JUE, 19 NOV, 5:51". Son dos hechos distintos (dato publicado y escritura de caché) con la misma palabra. La diferencia de día se explica por el VM en UTC. Propuesta de copy para `set.cache.when`: "Downloaded {dt}" / "Descargado {dt}". No se cambió el CSV de strings.

## Tema claro contra lightPalette

Medido por píxel en `light-week.png`, `light-detail.png`, `en-detail-final.png`, `en-settings.png` y `en-first.png`: todo coincide con `lightPalette`.

- Fondo `#F4EEDF`, `playField` `#E8E0CC`, `fieldTick` `#BAB3A4` (1.59:1, textura), línea de 50% `#5E5950` (5.29:1 sobre playField).
- End zones `crimsonHero` `#AE2440`, solo en Detalle. El modelo es `#22509B` en anillos, etiquetas y valores (5.94:1 sobre playField). Muted `#5E5950` (6.01:1 sobre fondo).
- Puntos: llenos en ink `#151515` y vacíos en `#D9D1BD`. Indicador de nav en ink con icono cream. Hairlines `#D9D1BD`.
- Un solo acento, el azul del modelo. Sin amarillo en superficies primarias. El carmesí solo en end zones (el rojo de la marca en primer uso es el mark del kit, no UI).

En oscuro, también por píxel: `#1B1F23`, `#14181C`, `#3A4148`, `#9A9891`, `#9A3350`, `#5A86D6`, `#8AA6DC` y `#A9A396`. Todo correcto.

## Colapso del masthead en EN, ES y claro

En las tres capturas colapsadas: barra de 64 (hairline en 63), sin orbes ni tira, con el kicker WEEK / SEMANA, el número, el chip y el sello. Correcto según el handoff. El único defecto es la posición del chip (F24). No se pudo ver la animación. Nota: el board H2_pantallas_a muestra los orbes y la tira bajo la barra compacta, pero el handoff (fuente para código) dice sin orbes ni tira. Se mantiene el handoff.

## ES

Sin truncados en Semana, Detalle, Ajustes ni How. "HORA DE ESTE TELÉFONO", "vie, 20 nov, 1:15", "Empieza en 19 h 23 min", "gana Texans", "Colts en Texans" y "Experimento abierto de ML. Esto no es una recomendación." caben en una línea (el pie llega a x 370 de 374). "Public Alpha" no se traduce (clave `alpha`). Falta FINAL en ES.

## Lo que no es un bug

- La hora en UTC es del VM.
- How sigue con el contenido viejo (H3_how va en r4), con mercado solo ahí.
- Detail sin nav inferior: así lo pide el handoff.
- Colapsado sin orbes ni tira: así lo pide el handoff.
- "9 de 10 Bills": la fila está cortada y no se ve el %; si pFav llega a 0.95 o más, debe decir "More than 9 in 10". Se revisa en r4.

## No verificable con estas capturas

- Widget 2x2, 4x2 y 4x1, monograma dentro del widget, Jost en el widget (F11): Android real.
- Ícono adaptativo v2 dentro de 66 dp: Android real.
- Motion completo, springs, haptics y reduce motion (F19): Android real.
- Título compacto y logos de 24 en la barra de Detalle al hacer scroll (parte de F05).
- Pie de Semana (F09), filas FINAL y en juego en Semana, toss-up y "More than 9 in 10".
- fontScale 1.3.

## Capturas requeridas en r4 (no bloquean r3)

1. Settings en tema claro: para cerrar F13.
2. Detail FINAL en ES: para cerrar F14 y la pasada de ES.

Recomendadas en la misma tanda: Week con la tira de una semana densa (F23), las tres barras colapsadas (F24), Detail con scroll (F05), el final de la lista de Semana (F09), Settings con datos guardados y vacía (F30), y una fila FINAL en Semana.

## Cambios a la spec en esta pasada

Ediciones puntuales sobre los archivos actuales; la otra tarea ya había agregado H3. No se reescribió nada desde una copia vieja.

- `hybrid/tokens.ts`:
  - `stripLanes` y `assignStripLanes` (F23), con el pseudocódigo en el comentario.
  - `rhythm.week.rowPadY` 16 y `rowContent` 100, con la aclaración de que `rowMinHeight` 132 es la caja completa (F18).
  - Se unieron las dos declaraciones `export const space`, que eran un error de TypeScript por duplicado, en una con claves numéricas y nombradas de los mismos valores.
  - Compila con `tsc --strict`.
- `hybrid/handoff_components.csv`: solo cambiaron las filas Masthead (colisiones, composición, orbe relleno y barra compacta) y Week row (caja de 132, kicker en x 16, logos sobre nombres, rival muted). Siguen 29 filas.
- `hybrid/strings_en_es.csv`: sin cambios, 171 claves.

## Rutas

- Este informe: `QA_r3.md`
- Board anotado (interno, 2x, 3840 x 2160, solo IHDR, pHYs, IDAT e IEND; trae logos reales del build, no va al repo): `QA_r3_board.png`
- Capturas: `*.png`
- Tokens: `tokens.ts`
- Handoff: `handoff_components.csv`
