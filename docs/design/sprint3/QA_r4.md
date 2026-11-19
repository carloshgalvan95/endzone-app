# QA r4 del build 405c3d2 (solo web)

18 nov 2026 (hora de Ciudad de México). 16 capturas de Expo web en `build_r4/`, todas de 780 x 1688 px, 2 px por dp, viewport 390 x 844 dp (verificado). Las cotas van en dp desde el borde superior. Spec vigente: `build_r3/QA_r3.md`, `hybrid/r4_color/r4_color.md` y sus boards, `hybrid/H3_how/H3_how.md` y sus boards, `hybrid/tokens.ts` y `hybrid/handoff_components.csv`. No se tocó ningún repo.

## Veredicto

**No pasa.** Hay 3 P0, todos de H3_how: faltan los gráficos de los pasos 2, 3 y 4 (F43, F44 y F45). Es el núcleo del pedido "explicar de forma visual" y necesita otra ronda visual. Además quedan 8 P1 y 10 P2. Fuera de How, Week, Detail y Settings quedaron muy cerca de la spec: casi todo lo de r3 se cerró y el amarillo r4 está bien aplicado en las capturas válidas.

El tema claro forzado y todo ES quedan **pendiente build_r4b**, sin hallazgos, porque las capturas de esos casos no son válidas (ver abajo).

| Prioridad | IDs | N |
| --- | --- | --- |
| P0 | F43, F44, F45 | 3 |
| P1 | F25, F30, F37, F38, F39, F40, F41, F42 | 8 |
| P2 | F15, F18, F29, F32, F33, F35, F46, F47, F48, F49 | 10 |

## Validez de las capturas (sha256)

| Captura | sha256 (16) | Estado | Qué muestra en realidad |
| --- | --- | --- | --- |
| dark-week | e5c2837c039bda04 | válida | Week oscuro EN |
| light-week | e5c2837c039bda04 | **duplicada** de dark-week | oscuro EN. Pendiente build_r4b |
| es-week | e5c2837c039bda04 | **duplicada** de dark-week | oscuro EN. Pendiente build_r4b |
| dark-detail | 52c819b4a302fa0c | válida | Detail oscuro EN |
| light-detail | 52c819b4a302fa0c | **duplicada** de dark-detail | oscuro EN. Pendiente build_r4b |
| en-week | cb5b997484f20f16 | válida | Week claro EN (tema Auto, sistema claro) |
| en-week-collapsed | 1c7634d95ac9ccf4 | válida | Week colapsada claro EN |
| en-detail | e3d7115e05b00829 | válida | Detail claro EN |
| en-detail-final | c7671531f2a3345e | válida | FINAL claro EN |
| en-how-a / en-how-b | 4441e40425278e61 / 50ec6719c6d1454d | válidas | How claro EN: paso 1 e inicio del 2; paso 6 |
| en-settings | e5deaa754bc6d56f | válida | Settings claro EN, tema Auto |
| light-settings | 87f19f9dedf91553 | única, pero no es claro | Settings **oscuro** EN con el radio **Dark** marcado. Vale como Settings oscuro; claro forzado pendiente build_r4b |
| es-detail-final | 571a5b1fe8e59a15 | única, pero no es ES | FINAL **oscuro EN**. Vale como FINAL oscuro; ES pendiente build_r4b |
| es-how-a / es-how-b | 9068afaa9c0c3bf9 / b19a60832a5d3721 | únicas, pero no son ES | How **oscuro EN**. Valen como How oscuro; ES pendiente build_r4b |

No hay duplicados contra build_r2 ni build_r3. Las capturas válidas son en-* (claro por Auto), dark-*, light-settings como Settings oscuro, y es-detail-final y es-how-a/b como pantallas oscuras en EN.

### ¿es-how-a en inglés es un bug de i18n?

es-how-a **no** es una captura repetida: su sha256 es único. Aun así, con esta evidencia no se puede atribuir a i18n. Lo más probable es que el locale no se aplicara en la captura:

1. es-week es byte a byte igual a dark-week. La ronda r3 mostró que las claves de Week sí salen en ES (`es-week.png` de r3: "SEMANA", "MAÑANA", "de 10 Texans").
2. es-detail-final sale en EN con claves que r3 ya demostró en ES ("Open ML experiment. Not a recommendation." en vez de "Experimento abierto de ML. Esto no es una recomendación.", "How it is calculated" en vez de "Cómo se calcula") y con fecha en formato en-US ("Fri, Nov 13, 1:15 AM").
3. En los dos Settings capturados el idioma es "System default". Ninguna captura r4 muestra "Español" elegido, a diferencia de r3, donde es-settings tenía "Español" marcado. Con el navegador en en-US, "System default" resuelve a inglés.
4. Lo mismo pasa con el tema: light-settings muestra "Dark" marcado. El script parece elegir los radios por posición: el orden de la UI es Auto, Dark, Light y el segundo radio es Dark.

Lo que sí queda abierto: con r4 tampoco se puede probar que las 80 claves `how.*` estén cableadas a `t()`. `strings_en_es.csv` las tiene con valor ES (solo `how.season.tick`, `how.step` y `how.s4.metric` son iguales en EN y ES, a propósito).

**Verificación propuesta para r4b:**

1. En el script de captura, elegir idioma y tema por etiqueta accesible ("Español", "Light" / "Claro"), no por índice. Esperar el cambio y comprobar antes de disparar: en ES, que aparezca el texto "Semana" o "Cómo se calcula"; en claro, que el fondo en (10, 10) px sea `#F4EEDF`. Si la comprobación falla, el script aborta en vez de guardar la captura. Imprimir el sha256 de cada archivo y abortar si dos capturas con nombres distintos coinciden.
2. Test de unidad: renderizar How con locale `es` y comprobar que el texto de cada clave `how.*` del CSV coincide con su columna `es`. Un test de completitud verifica que todas las claves del CSV existen en el recurso `es`, sin caer al fallback EN.
3. Revisión de código: el componente How no tiene literales en inglés fuera de `t()`.

Si en r4b, con "Español" elegido, Week o Detail salen en ES y How sigue en EN, entonces sí es i18n (claves `how.*` sin cablear), y sube a P0.

## Hallazgos

| ID | Sev. | Captura | Medida contra spec | Fix exacto |
| --- | --- | --- | --- | --- |
| F43 | P0 (Must, gap declarado) | en-how-a, es-how-a (inicio del paso 2), board H3_how_en_a | El paso 2 no tiene balanza ni campo HK / ST (declarado por el build) | `How: Strength diagram`: 358 x 340, radio 12. Barras de balanza de 16 dp con largos ilustrativos, monogramas ficticios HK / ST de 32, píldora "Learned home edge" (`how.s2.home`). Mini campo de 72 con la geometría de la tira (end zones 20, línea de 50 `accent.nav.fieldMidline` 2 dp, en claro 1 tinta + 2 amarillo + 1 tinta), anillo 16 del modelo relleno `playField`, etiqueta `how.s2.p_lab`, sello `how.illustrative` |
| F44 | P0 (Must, gap declarado) | declarado; sin captura del paso 3 | El paso 3 lista 3 porcentajes en vez de state cards conectadas | `How: Cover rule`: regla de 358, thumb 20, ticks de producto en 55 y 95 sin número. Thumbs de ejemplo en 52, 69 y 96, cada uno con su leader a una state card rotulada Example / Ejemplo: "Toss-up"; "7 / in 10 / Hawks win" con cifra 40 sp que no escala y 10 puntos; "More than 9 in 10". Desplegable `how.s3.exact.title` / `how.s3.exact` en mono 12 |
| F45 | P0 (Must, gap declarado) | declarado; sin captura del paso 4 | El paso 4 es copy más desplegable, sin diagrama de nodos | `How: Train/test gate` (`chart.how.flow`): 358 x 424, nodos de 52, gap 16, radio 12, puerta de 88. Nodos: `how.s4.train` → `how.s4.test` → `how.s4.retrain` (refresh manual) → `how.s4.gate` (log loss, sin número) → `how.s4.accept` / `how.s4.keep` de 44. La regla 0.002 vive solo en el desplegable `how.s4.exact`. Nunca 0.003 |
| F39 | P1 | en-how-a (522 a 695.5 dp) | El timeline mide 174 dp: una fila de años, una barra azul a todo lo ancho con el color pleno del modelo (`#22509B` / `#5A86D6`) y una barra gris. Spec: 358 x 228, cuatro bloques de año, banda results / plays, leyenda | `How: Timeline`: 358 x 228, radio 12, cuatro bloques 1999 / 2016 / 2024 / 2026 con "partial" bajo 2026. Banda plays en la familia del modelo, `blueDeep` (`#24344F` oscuro, `#D5DEEE` claro), y results en marrón raised. Leyenda `how.s1.results` / `how.s1.plays`, sello Illustrative arriba a la derecha y foot `how.s1.foot`. Sin el azul pleno del modelo como relleno de datos |
| F40 | P1 | en-how-a (folio 263.5 a 298) | Falta el progreso de 6 segmentos junto al folio 48. Tampoco hay hairline entre pasos | `chart.how` / `rhythm.how`: progreso 6 x (16 x 4), gap 4, a la derecha del folio, alineado a su centro; el paso actual en cream (claro: tinta) y el resto muted. Entre pasos: 24 + hairline 1 dp `border` + 24 (hoy hay 48 sin línea) |
| F41 | P1 | en-how-b, es-how-b | "2026 season to date, small sample" sale **dos veces** (ink 536 y 576). La fila 2026 se dibuja con barras grandes, con el mismo peso que el par principal. Se muestra "Example 0.559 vs 0.506" en el producto | Una sola línea `how.s6.live` y debajo los valores enlazados de `track_record.json` en `type.bodySmall` 14/20 muted ("0.559 vs 0.506", 3 decimales, coma en ES), sin barras. `how.s6.live_ex` y `how.s5.calls_ex` no se renderizan nunca en la app. `how.s6.market_lower` una sola vez, bajo el par principal. Verificar el binding con un fixture distinto (p. ej. 0.612 vs 0.588). Handoff corregido |
| F42 | P1 | en-how-b (ink 764 a 817) | La URL es texto sin estilo de enlace y corta en el guion ("endzone- / mlops") | `how.s6.foot`: Pressable con `accessibilityRole="link"` y `Linking.openURL`, estilo del enlace de Detail (Jost 500, texto cream / tinta). Corte solo tras "/" (U+200B después de cada "/") y guion no separable U+2011 en "endzone-mlops" |
| F37 | P1 | dark-week, en-week | Card de 154 dp de alto (spec 136). El kicker termina en ~345 y los nombres empiezan en ~368: 23 dp de gap (spec 8). La columna de la derecha (cifra 48 + "in 10 Texans") empieza bajo el kicker y empuja la fila | Columna derecha a la altura del contenido completo: de la parte superior del kicker al pie de los nombres (16 + 8 + 48 = 72), con `justifyContent: flex-end`. Cifra 48/1 y "in 10 {short}" 16/20 = 68, que cabe en 72. Kicker a nombres 8 y caja de 136, como el board r4_color_week |
| F38 | P1 | dark-week, en-week, en-week-collapsed | La etiqueta del mini campo va fija al borde: "Texans 69%" en x 44 a 124 con el anillo en x ~253; "Jaguars 56%" pegada a la end zone derecha con el anillo a la izquierda | `weekField.labelGap` 6: etiqueta 6 dp a la derecha del anillo. Si pasaría de `w - e - 4`, va 6 dp a la izquierda del anillo. Toss-up: `chip.tossup` |
| F25 | P1 | dark-week, en-week | El chip PUBLIC ALPHA va alineado a la izquierda, en x 106 a 213.5, a 6.5 dp de la cifra 96 (que termina en x 99.5). En vertical está bien (96 a 119.5, 8 dp bajo el sello) | Columna derecha `alignItems: flex-end`: el chip termina en x 374 (padX 16), igual que `week.count` y `week.saved` |
| F30 | P1 | en-settings, light-settings (oscuro) | Las opciones ya tienen paso 48. Pendiente: "Clear" con centro en 471.5 y el sello en 486.5 (15 dp de desfase); título "Settings" (ink hasta 52.5) a LANGUAGE (55.5): 3 dp; "Off" (hasta 571.5) a VERSION (580.5): 9 dp | La caché en una fila de 48 con `alignItems: center`. Del título a la primera sección, 16 (kicker de LANGUAGE en ink ~71.5). Gap de sección 16 antes de VERSION |
| F15 | P2 | en-detail, dark-detail | La composición ya es la de H2 ("in 10" y "Texans win" a la derecha del 7). La base de "Texans win" (~381) queda 12.5 dp bajo la base del 7 (368.5) | Subir la columna 12 dp para que la base de `cover.wins` caiga en la base del 7 (más o menos 2) |
| F18 | P2 | dark-week, en-week | Del pie de la card (465.5) a SUNDAY: 28 dp de caja (spec en archivos 16; el brief dice 24). Del primer encabezado bajo el masthead: 16 (spec 8) | Encabezado de día: 16 arriba (8 si es el primero), 8 abajo, según `tokens.ts` y el handoff. Si Idaho decidió 24, actualizar `rhythm.week.dayHeaderGapAbove` y la fila Day header |
| F29 | P2 | en-detail, dark-detail | El pie ya está anclado abajo (cerrado en lo funcional). La caja del enlace termina en ~814: 30 dp al borde (spec 24 + inset) | Padding inferior `afterLink` 24 + inset |
| F32 | P2 | todas las de nav | La nav sigue siendo una barra plana a todo lo ancho con hairline. El handoff ya pide el contenedor en píldora | Contenedor `surface`, borde `border`, píldora, `nav.sideMargin` 16, `nav.bottomGap` 12 |
| F33 | P2 | en-detail, dark-detail | Falta "50%" bajo la línea y las flechas de dirección | `type.axis50` 11/14 muted bajo la línea de 50, y "← Colts" / "Texans →" en `type.fieldLabel` |
| F35 | P2 | en-settings | "SAVED THU, NOV 19, 6:31 AM" frente a "Saved Wed, Nov 18, 7:03 PM" en Week: dos hechos con la misma palabra | `set.cache.when`: "Downloaded {dt}" / "Descargado {dt}" (propuesta de copy) |
| F46 | P2 | en-how-a | El lead va en tinta (`#151515`); spec: muted. H1 grande bajo la barra; el board pone el título en la barra | Lead 18/26 `textMuted`. Título `how.title` en la barra de 64, sin H1 en el cuerpo (o confirmar el H1 en el handoff) |
| F47 | P2 | en-detail-final, es-detail-final | Las cifras del marcador van en Jost 700, no en Plex Mono. "7" en `cover.old` no va en 700 | Cifras `type.figureLg` 32/36 IBM Plex Mono 600, tabular. {n} de `cover.old` en Jost 700 |
| F48 | P2 | dark-week, en-week | End zones de la tira 22 dp (16 a 38) y de la fila 7 (33 a 40): se escalaron con el ancho. La regla depende del alto: 72 da 20 y 24 da 6 | End zone fija por alto: tira 20, fila 6. El área de juego absorbe el ancho extra de 390 dp |
| F49 | P2 (Later, gap declarado) | no visible en capturas estáticas | Los cambios de carril no animan | `translateY` 200 ms, `cubic-bezier(0.2, 0, 0, 1)`, sin spring; con reduce motion, snap. Va después de este PR |

### Gaps declarados por el build

| Gap | Clase | Valor |
| --- | --- | --- |
| Cambio de carril sin `translateY` de 200 ms | Later (F49) | 200 ms, easing estándar, sin spring, snap con reduce motion |
| Paso 2 sin balanza ni campo HK / ST | **Must** (F43) | Ver F43 |
| Paso 3 con 3 porcentajes en vez de state cards | **Must** (F44) | Ver F44 |
| Paso 4 sin diagrama de nodos | **Must** (F45) | Ver F45 |
| how-b muestra el paso 6 y el desplegable queda fuera de cuadro | Captura requerida (no es fix de código) | r4b: capturas de los pasos 2, 3, 4 y 5 y del desplegable "The exact rule" abierto, en EN y ES |

## Cerrados de r3

| ID | Estado r4 | Evidencia |
| --- | --- | --- |
| F12 | cerrado salvo F25 | Masthead con count y saved a la derecha, orbes 40, tira 72 (200 a 271.5), colapso |
| F13 | cerrado en lo funcional; claro forzado pendiente build_r4b | Tema y caché en en-settings (claro por Auto) y light-settings (oscuro). Ajustes de espacio en F30 |
| F14 | cerrado en EN; FINAL en ES pendiente build_r4b | Marcador en dos filas (paso 40), ganador 700 y perdedor muted, `cover.old` "The model had 7 in 10 for Giants.", sin sello, sin cuenta atrás. Tipografía de cifras en F47 |
| F15 | cerrado en composición; base en F15 (P2) | "in 10" 24 y "Texans win" a la derecha del 7; campo en 439 (spec 436) |
| F18 | sustituido por la card r4 | Ver F37 y F18 (P2) |
| F23 | cerrado | 3 carriles en 16 / 36 / 56 de la tira y diámetro 12 en semana densa (pasos 2 y 3). El solape de 4 anillos dentro de 6 dp (x ~270 a 276) es el resultado previsto del paso 3 |
| F24 | cerrado | Barra compacta: chip de 20 a 43.5, número de 24 a 39.5, sello a la derecha, sin amarillo |
| F26 | sustituido | Orbe activo amarillo (r4) |
| F27 | cerrado | Kicker en x 16 de la card, logo centrado en su nombre, rival Jost 400 muted |
| F28 | cerrado | No aparece el aviso de keys duplicadas en ninguna captura |
| F29 | cerrado | Pie anclado abajo; padding en F29 (P2) |
| F31 | no verificable | No hay Giants en las capturas oscuras válidas |
| F34 | cerrado | El título de How queda a 21 dp de ink del hairline (caja 16) |

## Spec r4 color en las capturas válidas

- **Amarillo, 4 usos cerrados.** TOMORROW: texto `#EDB01A` en oscuro; en claro, relleno de 20 dp con texto tinta (288 a 307.5). Orbe activo relleno amarillo con número tinta, con borde tinta en claro. Indicador de nav amarillo de 56 x 32 con icono tinta, con borde tinta en claro; la etiqueta del tab sigue en cream / tinta. Línea de 50 en la tira, en las filas y en Detail: 2 dp `#EDB01A` en oscuro (x 194 a 196) y 1 tinta + 2 amarillo + 1 tinta en claro (193 a 197), al centro exacto del campo (195). Detail tiene un solo amarillo y la barra compacta ninguno. No aparece ningún uso fuera de la lista.
- **Etiquetas del modelo azules:** `#8AA6DC` en oscuro y `#22509B` en claro. Anillo `#5A86D6` / `#22509B`. Rellenos `#14181C` / `#F4EEDF` en la fila.
- **Card:** borde `#30363C`, fondo `#262B30`, margen 16 (16 a 374), gap 12 (361.5 a 374), padding 16. Radio visual 16. Alto en F37.
- **Contrastes:** los hex medidos coinciden con la tabla de r4_color.md, así que los ratios publicados aplican.

## Otros chequeos

- **Mercado:** no aparece en Week ni en la portada de Detail. Solo vive en el paso 6 de How. Widget: no verificable.
- **Pie "Open ML experiment. Not a recommendation.":** está en Detail, FINAL y Settings. El pie de Week no se ve en ninguna captura.
- **FINAL:** sin sello ni círculo.
- **Em dash y en dash:** 0 en el texto visible de las 13 capturas únicas, y 0 en `strings_en_es.csv`.
- **Truncados:** ninguno en EN. ES pendiente build_r4b.
- **No verificable sin Android:** widget 2x2 / 4x2 / 4x1 y monograma, haptics, reduce motion, ícono adaptativo y motion (stagger, colapso, reveal de How, carriles).

## Qué debe traer build_r4b

Script: elegir idioma y tema por etiqueta, comprobar antes de capturar (texto ES o fondo `#F4EEDF`) e imprimir los sha256. No se acepta un lote con dos nombres y el mismo sha256.

1. `light-week.png`: Week con tema **Light** forzado desde Settings.
2. `light-week-collapsed.png`: Week colapsada con Light forzado.
3. `light-detail.png`: Detail con Light forzado.
4. `light-settings.png`: Settings con el radio **Light** marcado (cierra F13).
5. `es-settings.png`: Settings con **Español** marcado.
6. `es-week.png` y `es-week-collapsed.png`: Semana en ES.
7. `es-detail.png` y `es-detail-final.png`: Detalle y FINAL en ES (cierra F14 en ES).
8. `es-how-a.png` y `es-how-b.png`: How en ES (confirma o descarta el bug de i18n).
9. How completo en EN y ES: pasos 2, 3, 4 y 5 en capturas propias, más el desplegable "The exact rule" abierto en los pasos 3 y 4. Una tira larga sirve si mide 780 px de ancho.
10. Una semana con un juego del Giants en oscuro (cierra F31) y el pie de Week.
11. Si hay build con los fixes: las mismas capturas de F37, F38, F25, F30 y F39 a F45.

## Cambios a la spec en esta pasada

Releí el archivo antes de editar. En `hybrid/handoff_components.csv` hice ediciones puntuales en dos filas:
- **How: Honesty bars:** la fila 2026 es una línea sin barras, con los valores enlazados; `how.s6.live_ex` y los chips son solo de board; el URL es un enlace y corta tras "/".
- **How: Calibration:** el foot renderiza {k} de {n} enlazados; `how.s5.calls_ex` es solo de board.

Siguen 29 filas. `strings_en_es.csv` no se tocó (191 claves) y `tokens.ts` tampoco.

## Rutas

- Informe: `QA_r4.md`
- Board anotado (interno, trae logos reales del build; 3840 x 2160; solo IHDR, pHYs, IDAT e IEND): `QA_r4_board.png`
- Handoff: `handoff_components.csv`
