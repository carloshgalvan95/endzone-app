# H3.1 How it is calculated / Cómo se calcula

Date: 19 nov 2026, America/Mexico_City. Build r4. Folder: `sprint3/hybrid/H3_how/`. H3 v1 is archived in `H3_how/v1/`.

A six-step scrollytelling screen in the dark kit. Copy is plain language for a curious fan, not a spec. Values on this screen come from `DATA_values.md` (Idaho, 19 nov 2026). Nothing else was invented. Live bindings stay as visible `{k}`, `{n}`, `{model_ll}`, and `{market_ll}` chips, with a labeled example beside them.

English is the default locale. Spanish is written to sound natural, not like a translation. No betting language, no em dash, no en dash, no real team logos (Hawks / Stars only). Crimson is used only on the field end zones. The model ring stays blue. The field mid line uses the r4 yellow `#EDB01A`, same as the cover field.

## What changed in H3.1

- Copy was rewritten in short, active sentences. The cover formula and the 0.002 gate margin live in a foldable "The exact rule" / "La regla exacta", in small mono. The main screen has no numeric gate threshold, and never mentions 0.003.
- Hierarchy: step titles are Jost 700 at 28/36. The step number is a muted 48 Jost 700 folio that does not scale, plus a 6-segment progress. Lead is 18/26.
- Graphics fill the 358 dp content width with more height. Step 1 uses real years and an illustrative results/plays band. Step 2 is a balance that ends in the same field ring as the cover. Step 3 connects each example point to its state. Step 4 is a clear gate with a manual refresh. Step 5 draws the frozen holdout 2024 to 2025 calibration. Step 6 is an honest 0 to 1 comparative bar.
- Body text no longer carries `{value}` chips except where the app must bind a moving figure. Known values were substituted. The rest sit on the chart or on a foot line.

## Narrative, step by step

### 01. The data is public. / Los datos son públicos.

The model learns from public game results and play-by-play, published by nflverse. That history starts in 1999. The model trains on every completed game up to before week 10 of 2026. Updates when games finish, not live. Foot: more than 7,000 games since 1999. The exact prod v2 row count is not published; it is not shown.

The timeline marks 1999, 2016 (first CV season), 2024 (first holdout season), and 2026 (current, partial). Band heights that distinguish results from plays are illustrative. No per-season counts are labeled, because 1999 and 2026 have none in the repo.

### 02. It weighs two teams, then learns a home edge. / Pesa a los dos equipos y aprende la ventaja de local.

Four signals, in plain language: recent form (how the offense and defense have been playing, play by play, over the last 10 games); the season so far, blended with last season at the start; wins over the last 10 games; and days of rest. The model is not an Elo-type rating and does not use margin of victory. Home advantage is learned from past games; it is not a named signal. The result is `p`, the probability that the home team wins (`model_home_wp`), shown as the same ring as on the field.

The balance bar lengths and the ring position are illustrative.

### 03. We say it in tens. / Lo decimos en decenas.

We take the favorite's chance and round it to the nearest ten. 69% becomes 7 in 10. Close games say Toss-up, and we never say 10 in 10, because nothing is certain. The three states on the rule (52%, 69%, 96%) are pedagogical examples of `coverFromHomeProb`, not a live game. The exact rule is in the foldable: `p` is the home win probability, `pFav` is the larger of `p` and `1-p`, `n` is `pFav` times 10, rounded half up, kept between 5 and 9. Below 55 percent: Toss-up. From 95 percent: More than 9 in 10. It never says 10.

### 04. We test it on seasons it has not seen. / Lo ponemos a prueba en temporadas que no ha visto.

It trains on earlier seasons, then we ask it to read a later season it did not train on (true of the CV, the holdout, and the walk-forward). When newer games are added, the model can be refit by hand. A new version is published only if it is no worse than the current one, within a tiny margin. The gate uses log loss. Lower is better. There is no threshold on the main screen.

The exact rule, in the foldable only: the same model, retrained, passes if it is no more than 0.002 worse. A different model has to be strictly better. Do not mention 0.003 (that is the feature-adoption rule, not this gate).

### 05. We check if 7 in 10 really holds. / Revisamos si el 7 de 10 se cumple.

The curve compares what the model said with what later happened, in ten groups of games, from lowest to highest `p`. Each group has 57 games. This is the holdout from 2024 to 2025, 570 games, not a live report. The annotation on the chart: "When we say 7 in 10, it should happen about 7 times in 10." The points are the frozen `h2_full` pooled bins from `holdout_2024_2025.json`. ECE 0.0520 is documented in `DATA_values.md` and is not printed on the screen.

Correct calls are `{k}` of `{n}` on decided games, bound from `track_record.json` as `pick_hits` and `pick_hits + pick_misses`. The boards show a labeled example, 23 of 29, with an honest proportion bar (not a made-up game-by-game pattern).

### 06. The market stays as an honest reference. / El mercado queda como referencia honesta.

Log loss is a score for how close the probabilities were to what happened. Lower is better. On the holdout from 2024 to 2025, 570 games, the market has a lower log loss than the model, 0.598 against 0.621 (0,598 contra 0,621 in Spanish). This is an open experiment, not a recommendation. The bars share a 0 to 1 scale. Neither bar is colored as a winner. The small visual difference is honest.

A secondary row, 2026 season to date, is labeled as a small sample. The app binds `{model_ll}` and `{market_ll}`. The boards show a labeled example, 0.559 vs 0.506 (0,559 contra 0,506). Those live figures mix model versions and rest on 29 games; they are not the primary claim.

The method is public: https://github.com/carloshgalvan95/endzone-mlops/blob/main/docs/model_card.md

## Graphic specs

Widths are 358 dp. Heights are `chart.how.*` and `chart.calibration`. All charts have empty, loading, and error states (`how.chart.empty`, skeleton bars, `how.chart.error` plus `how.chart.retry`). Do not invent values in those states.

### Timeline (`chart.how.timeline`, 358 x 228)

Input: none required at runtime besides the fixed years. Schema: `{ years: [1999, 2016, 2024, 2026], partial: 2026 }`. Bands are decorative. Scale: none. Tokens: surface, radius 12, plays fill in the model family, results fill in a muted raised brown, stamp `how.illustrative` at the top right. Foot string `how.s1.foot`.

### Strength (`chart.how.strength`, 358 x 340)

Input: none. The two bar lengths and the ring `x` are illustrative. The mini field reuses the cover field at strip height 72: end zones 20 (`weekField`), mid line `accent.nav.fieldMidline` 2 dp yellow, ring 16, fill `playField`. Label `how.s2.p_lab`. Fictional monograms HK and ST.

### Cover rule (`chart.how.rule`)

Input: none at runtime. Product thresholds 0.55 and 0.95 as ticks only. Example states `[0.52, 0.69, 0.96]`, labeled Example / Ejemplo, each connected by a leader to a state card. Cover typography is reused. Stamp `how.illustrative`.

### Train/test gate (`chart.how.flow`, 358 x 424)

Input: none. Nodes: train, test, manual refresh, gate (log loss, no number), Accept / Keep current. The 0.002 rule is not drawn here.

### Calibration (`chart.calibration`, plot 268)

Input (bundled, frozen): ten pairs `{ pred, obs }`, `nBin` 57, `nHoldout` 570, label Holdout 2024 to 2025. Axes 0 to 1, dashed diagonal, model points 8 dp. Annotation `how.s5.note`. Not a live report. Empty/loading/error if the bundle is missing. Calls foot: `{k}` of `{n}`. Example bar: 23 of 29, labeled.

### Honesty bars (`chart.how.compare`, 358 x 268)

Input, primary (frozen): `{ model: 0.621, market: 0.598, n: 570, label: "Holdout 2024 to 2025" }`. Scale 0 to 1, same cream fill, no winner color. Input, secondary (live): `{ model_ll, market_ll, sample: "small" }` from `track_record.json`. If market is not lower, the app already switches wording (`logLossComparison`); keep the sentence conditional in product code. Locale: 3 decimals, comma in Spanish.

## Motion

`chart.how.motion`: reveal 320 ms, easing standard `[0.2, 0, 0, 1]`, translateY 8 dp. Stagger 30 ms inside the step: kicker 48, progress, title, body, chart, foot. Steps trigger on enter, no page-level stagger. The exact rule opens with `duration.sm` and the same easing. The 64 dp back bar stays pinned. No spring, no haptic on reveal. `reducedMotion`: durations 1 ms, `keepContent` true, already at rest.

## Type proof

Typographic scan of every string at fontScale 1.0 and 1.3, width 358 dp: 312 rows, 0 overflow. Visual QA of the four EN/ES boards, plus 1.3 proofs of the bar title and the model card URL (wrapped at slashes).

## Lista de datos necesarios

Values and sources are from `DATA_values.md`, 19 nov 2026, America/Mexico_City. Confidence as Idaho recorded it. "On screen" is what H3.1 actually shows.

| Placeholder or need | On screen (EN / ES) | Source | Confidence | Notes |
| --- | --- | --- | --- | --- |
| `{season_start}` | 1999 / 1999 | `docs/adr/ADR-010-holdout-2024-2025.md`, `docs/model_card.md` Training data, `docs/runbook.md`, `docs/ATTRIBUTION.md` | high | Substituted in the body. |
| Training window | every completed game up to before week 10 of 2026 / todos los juegos completados hasta antes de la semana 10 de 2026 | `docs/runbook.md` lines 1188 and 1235, prod `h2_full` v2 | high | In `how.s1.p2`. |
| `{n_games}` | More than 7,000 games since 1999 / Más de 7,000 juegos desde 1999 | Inferred prod size is about 7,412 (low). Frozen train-before-2025 is 6,991 (high). No exact prod v2 count is committed. | low for the exact prod count | Do not print 6,991, 7,412, or "about 7,400". The briefed wording has no exact count. |
| Timeline years | 1999, 2016, 2024, 2026 | 1999 and 2026 are documented. 2016 is `cv_start_season`. 2024 is the first holdout season. 2026 is labeled partial. | high for ends and meaning; mid ticks are labels, not claims | No per-season counts (missing for 1999 and 2026). |
| `{feature_1}` | recent form: offense and defense, play by play, last 10 games / forma reciente: ofensiva y defensiva, jugada a jugada, últimos 10 juegos | `endzone/features/pregame.py` lines 90 to 103, `docs/model_card.md` line 61 | high | Plain language in the body, not a chip. EPA glossed as "play by play" / "jugada a jugada". |
| `{feature_2}` | season so far, blended with last season at the start / la temporada hasta hoy, mezclada con la temporada pasada al inicio | `pregame.py` `REGRESSED_EPA_COLUMNS`, `SEASON_SHRINK_FACTOR`, `SEASON_BLEND_K` | high | In `how.s2.p2`. |
| `{feature_3}` | wins over the last 10 games / las victorias de los últimos 10 juegos | `pregame.py` `home_recent_win_rate`, `away_recent_win_rate` | high | In `how.s2.p2`. |
| `{feature_4}` | days of rest / los días de descanso | `pregame.py` `home_rest_days`, `away_rest_days` | high | In `how.s2.p2`. |
| Home advantage | learned from past games, not a named signal / se aprende de juegos pasados; no es una señal con nombre | `endzone/modeling/models.py`, `docs/model_card.md` line 17 | medium | The pill is a concept, not a feature name. Not Elo, no margin of victory. |
| `{p}` | probability that the home team wins / probabilidad de que gane el equipo local | `model_home_wp`, `coverFromHomeProb` | high | Labeled on the field. No live game value is drawn. |
| `{metric}` | log loss / log loss | `docs/model_card.md` line 43, `registry.py` `walk_forward_promotion_gate` | high | English term in both locales, first explained in step 6. |
| `{gate_rule}` on the main screen | only if it is no worse than the current one, within a tiny margin / solo se publica si no queda peor que el anterior, salvo por un margen mínimo | `registry.py` `REFRESH_LOG_LOSS_MARGIN = 0.002`, ADR-009 | high | No number on the main screen. Refresh is manual, not weekly. |
| `{gate_rule}` in the fold | The same model, retrained, passes if it is no more than 0.002 worse. A different model has to be strictly better. / El mismo modelo, reentrenado, pasa si no empeora más de 0.002. Un modelo distinto tiene que ser estrictamente mejor. | same, `walk_forward_promotion_gate` | high | Foldable only. Do not mention 0.003. |
| `{n_bin}` | 57 games per group / 57 juegos por grupo | `evaluation.py` `N_CALIBRATION_BINS = 10`, `holdout_2024_2025.json` `bins[].n` | high | "Ten groups of games", never "bin by bin". |
| Calibration points | pred 0.277, 0.376, 0.435, 0.485, 0.536, 0.587, 0.638, 0.687, 0.752, 0.836; obs 0.298, 0.246, 0.474, 0.386, 0.456, 0.614, 0.649, 0.667, 0.719, 0.895 | `holdout_2024_2025.json` `calibration[]`, `h2_full` pooled, ECE 0.0520 | high | Drawn on the chart, labeled Holdout 2024 to 2025. Not a live report. ECE is not printed. |
| `{k}` | `{k}` chip, example 23 | `track_record.json` `summary.pick_hits`, generated 2026-11-19T01:35:47Z (18 nov 2026, 19:35 America/Mexico_City) | high | Live binding. 23 is a labeled example only. |
| `{n}` | `{n}` chip, example 29 | `pick_hits + pick_misses` (app `HistoryScreen.tsx`), live 23 + 6 | high | Decided games only. 29 is a labeled example only. |
| Holdout `{model_ll}` / `{market_ll}` | 0.621 against 0.598 / 0,621 contra 0,598, n 570 | `holdout_2024_2025.json` `pooled.rows` (0.6207 and 0.5976), `docs/model_card.md` line 127 | high | Primary claim of step 6. Displayed at 3 decimals. |
| Live 2026 `{model_ll}` / `{market_ll}` | `{model_ll}` vs `{market_ll}`, example 0.559 vs 0.506, small sample | `track_record.json` `model_log_loss` 0.559299, `market_log_loss` 0.506379, `sample_label` small, 29 games | high | Secondary row only. Keep the sentence conditional in the app. |
| `{season}` | 2026 on the secondary row, as "2026 season to date" | `track_record.json` `seasons[0].season` | high | Not the primary pair. |
| `{repo_link}` | https://github.com/carloshgalvan95/endzone-mlops/blob/main/docs/model_card.md | the file on `main` | high | Substituted in the foot. Wrap at slashes. |

## Editorial decisions

- Titles stay as short claims, not section labels.
- "More than 7,000" was chosen over 6,991 or an inferred 7,412, because the exact prod v2 count is not published.
- Timeline mid ticks are 2016 and 2024 because those seasons have a published role (CV start, holdout start). They are labels, not a claim that those years are special in the training set.
- EPA is explained in plain language as play-by-play form, not as an acronym in the body.
- The 0.002 margin is told only in the fold, following the brief that no threshold should appear on the main screen.
- The primary honesty pair is the holdout of 570 games, not the 29-game 2026 sample. The live row is present, labeled small, and bound with chips.
- Calibration uses the frozen bins and says so. It does not pretend to be a live report, and it does not say "bin by bin".
- 23 of 29 and 0.559 vs 0.506 appear only as labeled examples next to the live chips.
- v1 said the model kept "a strength in the family of a rating" and looked at margin. That was wrong for prod `h2_full` and has been removed.

## Deliverable paths

- `H3_how_en_a.png`
- `H3_how_en_b.png`
- `H3_how_es_a.png`
- `H3_how_es_b.png`
- `H3_how_componentes.png`
- `H3_how_motion.png`
- `H3_how.md`
- `h3_copy.py`
- `render_h3_how.py`
- `DATA_values.md`
- `v1/` (archived H3)
