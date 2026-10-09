# Ink Worlds — Art round 2

## Scope and source

Refinement of this existing preview, not a new brand or project. Published reference: `https://pachin1919.github.io/ink-worlds-motion-preview/`; supplied published revision: `375f572038fb7d91e955059d90e22c047ee55d52`. The original entrance, paintings, four routes and two-layer alpha reveal remain incumbent. No packages, lockfile changes, backend, new routes, deployment or GitHub integration were added.

Implementation revision inspected before writing these delivery documents: `fc0d3dfc6f05d9fc48f828aa2d4773e548f0647d`. Documentation/export will be captured by the project's subsequent managed revision; this is not a claim that a self-referential final commit contains this note.

## Asset provenance

The three new studies were created with image generation, guided by the original paintings' ink/mineral palette and painterly character. They are separate generated compositions, not repainted originals, hero crops, screenshots, stock images, SVG drawings or remote pointers. Prompts specified no characters, dragons, logos or baked-in text. Visible captions describe companion studies; these provenance notes record the generated origin. They are not additional hand-painted originals by PACHIN or claims of exhibition history.

| Portable file | Final dimensions | Generation direction / distinction |
| --- | --- | --- |
| `src/assets/basalt-stair-study.jpg` | 960×1200, 4:5 | Tall ink-blue basalt stair and fragmented ruin suspended over mist; portrait ascent, restrained mineral washes. Native generated raster, originally 1024×1280. |
| `src/assets/mineral-inlet-study.jpg` | 1600×800, 2:1 | Pale mineral inlet and shore, sparse floating rock forms, warm paper light; quiet broad horizon. Native generated raster, originally 1920×960. |
| `src/assets/stone-reeds-study.jpg` | 1200×900, 4:3 | Weathered stone ledge, reeds and distant suspended architectural fragment; close, quiet landscape. Native generated raster, originally 1440×1080. |
| `src/assets/outer-gate-detail.webp` | 600×534 | Purposeful detail crop of the original dark painting's gate and cliff; not a new generated artwork. |
| `src/assets/inner-gate-detail.webp` | 600×534 | Corresponding same-region detail crop of the original light painting; not a new generated artwork. |

Generated images were resized and saved as web-sized JPEGs at quality 88 using existing image tooling. Detail crops are WebP. The original `public/assets/outer-world.png` and `public/assets/inner-world.png` are unchanged; their existing provenance and checksums remain in DELIVERY.md. New images are bundled via ES imports, with lazy loading, explicit dimensions/reserved aspect ratios, and localized descriptive alt text. No platform-only media URLs are required.

## Chapter composition map

| Home chapter | Composition and scale |
| --- | --- |
| Entrance | Existing full-screen original interactive painting and sparse title; original controls preserved. |
| Statement | Warm-paper reading pause: small marginal label, compact editorial statement, no image or card grid. |
| Studio wall | Large asymmetric exhibition wall: dominant 4:5 portrait with smaller inset 4:3 study and restrained curatorial note. Mobile retains different image widths and staggered insets. |
| Mineral interlude | Full-bleed 2:1 panorama held by dark-blue framing; very little type, caption below rather than over the art. |
| Original comparison | Compact precision pairing of the original dark/light states, short heading and a real detail link; intentionally much shallower than the wall. |
| Close reading | Paper-toned ruled table: short explanatory header, note column and matched gate/cliff crops, with concise captions. Mobile note spans above two retained side-by-side crops. |
| Credits | Restrained factual attribution, then the existing footer. |

These are distinct skeletons, not repeated equally tall 50/50 panels. The original painting does not dominate three consecutive lower chapters. Existing ink/slate/paper palette and typefaces are retained; no new effect system, scroll hijacking or hidden essential content.

`/works` retains the complete Two Worlds entry and original viewing studies, then integrates the generated studio wall at `#studio-studies`, panorama and close-reading material. The home study link navigates to `/works#studio-studies`; home also has `#landscape-studies`. `/works/two-worlds` retains its original large interactive surface, process and original light-state studies, with close-reading crops added. `/about` remains the factual maker-approach page. No additional routes were introduced.

## Localization and fonts

New headings, captions, studio disclosure, links and image descriptions have EN/ZH equivalents in `src/lib/ink-copy.ts`. Browser checks used the actual language button, reloaded, and directly navigated through all four routes: `html lang` remained `en` or `zh-CN` as selected. Persistence uses the existing `ink-worlds-language` preference.

Regenerated `public/assets/fonts/noto-sans-sc-exhibition.woff2` from Noto Sans CJK SC Regular using fontTools. Coverage check over all TSX interface strings plus the centralized copy found **385 distinct CJK characters, all present in the resulting cmap**. Existing font licenses are retained; no new typefaces or npm dependencies. Temporary font tooling was outside the project. The font is deliberately not included in the image-only Base64 export: copy the changed binary font through a binary-safe source export, not a text-only connector. Future Chinese copy requires another subset update.

## Actual QA and evidence

Completed a bounded batched inspection and one confirmation after observed corrections. The preview harness reported **build OK**; the routing test passed **4/4**. No manual production deployment was performed.

- Chromium local preview: 1440×900 desktop and 390×844 mobile, EN and ZH, all four routes: **16 route/viewport/language combinations**.
- Full scroll inspection: HTTP 200 for every route, **0 page errors, 0 failed requests, 0 unloaded/broken images, 0 horizontal overflow**. Machine-readable observations: `docs/art-round2-evidence/qa-results.json`.
- Catalogue detail/back links and `/works#studio-studies` anchor succeeded in both languages and widths.
- Dark/Light/Reveal controls and Pause succeeded. Keyboard arrow exploration and pointer painting were exercised; mobile touch pointer down/move/up was dispatched. Sampled Canvas alpha pixels were 30,031 on desktop and 9,314 on mobile, confirming real transparent brush marks rather than brightness changes.
- Reduced-motion direct detail entry disabled Reveal and retained the still view.
- The bracket-notation Canvas dataset type error was fixed; subsequent harness build was clean.
- Original effect cleanup, bounded DPR/mark count, visibility pause and image fallback remain in the existing component; no duplicate effect implementation was introduced.

Repository evidence includes full-scroll home overviews in both languages at both widths (`home-full-*.jpg`), plus two representative lower chapters at each width/language (`wall-*.png`, `reading-*.png`). Overviews were stitched from viewport screenshots, not a hero-only capture. All are under `docs/art-round2-evidence/`.

Limits: Chromium emulation is not physical-device Safari testing. Mobile interaction used dispatched touch pointer events, not an OS-level finger gesture. This round did not re-run forced image-failure recovery, long-duration memory profiling, every footer link, or four repeated home/detail/back lifecycle cycles; prior QA records the earlier lifecycle checks. A focused skip-link overlay appears in some element captures due to screenshot/navigation focus handling; essential page content is not hidden in normal unfocused reading. No claim of testing the downstream GitHub Pages adapter or production deployment is made.

## Text-safe image export

`.export/art-round2/manifest.json` lists only new visual files: the three generated JPEGs, two original detail crops, and twelve new screenshot evidence images. Each entry includes exact repository path, byte size, SHA-256 and ordered chunk paths. The unchanged original paintings, existing room media and all fonts are excluded.

Chunks contain Base64 of the complete binary bytes as UTF-8/ASCII text, at most 32,000 characters each, split on multiples of four. A local decode validated byte-for-byte equality and SHA-256 roundtrips for all **17 images / 264 chunks**. Reconstruct each file by concatenating its listed chunks in order and Base64-decoding; compare the decoded length and SHA-256 to the manifest. This export directory is outside public, never imported by the app and must not be published. Normal source export remains necessary for frontend files and the changed binary font.
