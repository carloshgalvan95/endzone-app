# ADR-001: Separate repository and versioned contract

Date: 2026-11-17

Status: Accepted

## Context

endzone-mlops trains a model and publishes a weekly NFL slate as static JSON on GitHub Pages. I want a native client, Android first, with its own version, its own signing key, and its own release. Putting Expo, Gradle, and store metadata inside the MLOps repo would mix a phone release with the training pipeline.

The MLOps repo already records the split in ADR-011. The public JSON is a read-only contract. Clients do not get a warehouse credential, a model file, or a private endpoint. This ADR records that decision from the app side.

## Decision

endzone-app is its own repository. It is not a package, a submodule, or a workflow in endzone-mlops.

The app reads only the Pages URLs:

- `https://carloshgalvan95.github.io/endzone-mlops/data/latest.json`
- `predictions/<season>-w<week>.json`
- `teams.json`
- `track_record.json` when a later screen needs it
- `sample.json` for the example slate

It pins site data contract major version 1. I copied the draft 2020-12 schemas from endzone-mlops commit `b9f8342c4e24009ce74a942d82b285626259a43e` into `contracts/v1/`. A missing `contract_version` means major 1, because archived week files were not rewritten. When the field is present and the major is not 1, the app shows an update state. It does not try to draw the new shape.

Semantic versioning of the contract stays in endzone-mlops:

- Patch: a description or a test change that does not change what validates.
- Minor: an additive optional field. Old clients still validate. The schema stays in `v1`.
- Major: a removal, a rename, or a type change. That is a new directory in the MLOps repo. This app keeps rejecting it until I ship an update that vendors the new major.

## Consequences

- An app release does not redeploy the model, and a model release does not ship a new APK.
- I can change screens without touching the training code.
- A breaking JSON change is visible: the live check fails, or the phone asks for an update instead of crashing.
- The vendored copy can lag the MLOps repo by a commit. The checksum test and the contract drift workflow are how I notice.
- v1 stays in this repo until I deliberately vendor a later major. I do not delete v1 in the same change that adds v2.
