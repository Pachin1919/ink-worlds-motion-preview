# Publication QA — 2026-10-07

Independent Codex verification against the actual GitHub Actions production build artifact, served locally at the same repository base path.

- TypeScript check and production build: passed in GitHub Actions.
- Four direct-entry routes × two viewport sizes (1440×900, 390×844) × EN/ZH: 16 states checked.
- Page errors: 0. Recorded failed normal resources: 0. Horizontal overflow: 0. Broken settled images: 0.
- Chinese page language and visible translated content checked. CHROMA uses zh-Hans; the other sites use zh-CN. Brand headlines may remain proper English names.
- Desktop and mobile homepage screenshots reviewed; assets/preview.png updated from this actual build.

## Actual interaction evidence

{
  "canvas": {
    "width": 1440,
    "height": 900
  },
  "paused": 1,
  "lightHidesOuter": 1,
  "maskAlpha": 0
}

## Limits

Chromium automation and viewport emulation; physical touch devices, other browser engines, and formal screen-reader acceptance were not repeated. Historical Lovable lifecycle/reduced-motion evidence is preserved separately in docs/lovable/QA.md. Public deployment is verified separately after promotion to main.
