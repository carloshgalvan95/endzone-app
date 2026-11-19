# Fuentes, H2 híbrido, sprint 3

Documento de diseño en `/workspace/endzone-app-design/sprint3/hybrid/`. Las fechas de consulta son del 18 de noviembre de 2026, hora de America/Mexico_City (UTC-6).

H2 retoma H1.1 y centra el producto en las predicciones del modelo. El mercado queda como referencia en How it is calculated y en Historial. H1.1 está en `hybrid/v1_H1_1/`. H1, en `hybrid/v1_H1/`. A y `options/` no se modificaron. El kit no se toca: `#9A3350` queda como token de la app en `tokens.ts`; `#2E5EC2` no se retira del kit.

## Auditoría e insumos

- Auditoría de Idaho, 18 nov 2026: `/workspace/endzone-app-design/sprint3/hybrid_audit.md`. Varias partidas de H1 se mantienen (cifra 5 a 9, campo v2, nav 64, historial honesto). El estado "No market data" en Semana y Detalle se retira porque esas superficies ya no pintan el mercado.
- Investigación previa: `/workspace/endzone/ux_sprint3_research.md`, `lisan_sprint3_input.md`.
- Propuesta A (no modificada): `/workspace/endzone-app-design/sprint3/propuesta.md`, `index.html`, `SOURCES.md`, y los boards de 18 nov 2026 a las 20:29.
- Ronda 2 de opciones B, C y D (no modificada): `/workspace/endzone-app-design/sprint3/options/`.

## Identidad

- Kit DARK endzone-mlops, `brand.json` y tokens de color: fondo `#1B1F23`, superficie `#262B30`, borde `#30363C`, cream `#F4EEDF`, muted `#A9A396`, azul `#5A86D6`, carmesí de tipo `#D04A63`, amarillo `#EDB01A` (sin uso nuevo en H2), ink `#151515`.
- `crimsonHero` `#9A3350` es token de la app para las end zones del Detalle. `blueHero` `#2E5EC2` permanece en el kit y no se usa en esta UI (2.76:1 sobre el fondo).

## H2.1 (18 nov 2026, America/Mexico_City)

Cambio menor sobre H2 vivo, sin archivo nuevo. La cifra del widget 4×2 y 4×1 nombra al favorito (`wid.cover`, `wid.cover.more9`). La línea del partido en 4×2 es Jost 400. 4×1 retira esa línea para caber a fontScale 1.3 con Estrellas / Atlantic. Logos solo en runtime, detrás de `teamLogos.enabled`, desde URLs públicas de nflverse con caché; no van en el repo ni en el APK. Las láminas usan placeholders `#30363C` y monogramas con colores ficticios, nunca marcas reales. Tabla de handoff: `handoff_components.csv` (16 componentes). 106 claves en `strings_en_es.csv`. Lámina nueva: `H2_logos.png`.
