# Site data contract v1

These schemas are a byte copy of `contracts/site-data/v1/` from [endzone-mlops](https://github.com/carloshgalvan95/endzone-mlops) at commit `b9f8342c4e24009ce74a942d82b285626259a43e`.

| File                       | Covers                                                            |
| -------------------------- | ----------------------------------------------------------------- |
| `slate.schema.json`        | `latest.json`, `predictions/<season>-w<week>.json`, `sample.json` |
| `teams.schema.json`        | `teams.json`                                                      |
| `track_record.schema.json` | `track_record.json`                                               |

`checksums.json` records the sha256 of each schema. `src/contract/checksum.test.ts` fails if a file changes without a new checksum. Do not reformat the schema files.

The app pins major version 1. A missing `contract_version` means 1. A different major shows an update state. Types live in `src/contract/types.ts` and are checked at runtime with these schemas.
