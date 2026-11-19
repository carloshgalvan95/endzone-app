# endzone-app

Android and iOS client for the weekly NFL win probabilities published by [endzone-mlops](https://github.com/carloshgalvan95/endzone-mlops). Android is the first native target. The same Expo project is the iOS client later.

Version 0.2.0. Application id `io.github.carloshgalvan95.endzone`. The app reads site data contract major version 1 and nothing else. It does not ship a model and it is not betting advice.

## Architecture

```mermaid
flowchart LR
  pipeline["endzone-mlops pipeline"]
  pages["GitHub Pages JSON"]
  schemas["contracts/site-data/v1"]
  app["endzone-app"]
  pipeline --> pages
  schemas -.-> pages
  pages --> app
  schemas -.->|"vendored copy, major 1"| app
```

endzone-mlops scores the week and writes JSON. GitHub Pages serves that JSON at `https://carloshgalvan95.github.io/endzone-mlops/data/`. The schemas stay in the MLOps repo. This app vendors major version 1 from commit `b9f8342c4e24009ce74a942d82b285626259a43e` under `contracts/v1/` and checks every file with those schemas before drawing it.

| File                                | Role                                                 |
| ----------------------------------- | ---------------------------------------------------- |
| `latest.json`                       | Current slate. Home screen when no week is selected. |
| `predictions/<season>-w<week>.json` | One week, same shape as `latest.json`.               |
| `teams.json`                        | Names, colors, and logo URLs.                        |
| `track_record.json`                 | Derived record. The Record screen reads it.          |
| `sample.json`                       | Example slate (`sample: true`).                      |

A missing `contract_version` means major 1, because files published before the field existed are still valid. A different major shows an update state instead of rendering a shape this version does not know.

## Screens

1. Weekly slate, the home screen. Season and week, model version, one card per game. Each card shows both teams, the model home win probability, the market probability and the difference, the estimated margin and total, and the final score when the game is final. An example slate (`sample: true`) shows an example banner. Loading, empty, error, offline-stale, and contract-update states are all on this screen.
2. Week picker. The list is `weeks_available` from the open slate.
3. About. The market has the lower log loss. This is not a recommendation. Links to the model card, the repository, and the site.
4. Record. Per week and season to date correct picks, plus model and market log loss. A small sample is labeled as one. The sentence follows the published numbers. On the current file the market has the lower log loss.
5. Game detail. Tap a game. It shows the model home probability, the market comparison when the file has one, kickoff in the phone's local time, and the result when the game is final.
6. Alerts. A Tuesday local notification, off until you turn it on. It stays on the phone. There is no push server.

## Download

Release files are split by CPU so a phone does not download every architecture. On a recent phone, install `endzone-<version>-arm64-v8a.apk`. On an older 32-bit phone, install `endzone-<version>-armeabi-v7a.apk`. The universal file contains both and is the larger download. See [docs/release.md](docs/release.md).

## Run

Node.js 22.

```bash
npm install
npx expo start
```

Then open the project in Expo Go on Android, or press `a` for an emulator. iOS needs macOS.

Checks:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run contract:check
```

`contract:check` needs the network. It downloads the live JSON and validates it against `contracts/v1/`.

## Contract policy

- Pin major version 1. Schemas are `contracts/v1/*.schema.json`. Checksums are in `contracts/v1/checksums.json`. The checksum test fails if a schema file changes without a new recorded digest.
- Runtime parsing is Ajv against those schemas. See `src/contract/validate.ts`.
- Do not guess a newer major from an unknown field. Unknown fields fail the publisher's check before they are deployed. A `contract_version` whose major is not 1 is an update state.
- An additive optional field can stay on major 1. A removal, a rename, or a type change is a new major in endzone-mlops, then an app update.
- `.github/workflows/contract-drift.yml` runs on demand and every Monday. It fetches the live JSON and fails if the files no longer match the vendored schemas.

## Design

Colors, type, and spacing follow the site tokens (cream, black, blue, crimson, yellow, dark surfaces). `src/theme/tokens.ts` is the typed copy. The app follows the system color scheme and defaults to dark, which is the site default. The icon and splash are the mark on `#1B1F23`. The wordmark in the header is the horizontal logo. The light wordmark is the same drawing with cream ink swapped to `#151515` so it can sit on the cream surface.

## Release

Semantic versions. The app version in `package.json` and `app.json` is `0.2.0`, and `android.versionCode` is `2`. A GitHub release tag `vX.Y.Z` builds signed Android APKs split by CPU. See [docs/release.md](docs/release.md). The signing keystore is created by hand and stored as GitHub Actions secrets. It is never generated or committed here.

## License

MIT. See [LICENSE](LICENSE).
