# Historical Lovable build evidence

Original Lovable-managed preview, before GitHub Pages adaptation. Current deployment: docs/GITHUB-PAGES.md.

# Ink Worlds — Delivery

## Source reference

- Authorized source repository: https://github.com/Pachin1919/ink-worlds-motion-preview
- Requested source commit: 99daa42d4738f436e268184e2281cb3cc5cdc8d8
- Supplied source ZIP SHA-256: 38937fabe2ebdeb1a9fc5ca48556b5afa6a5703c336dbf884301066009145347
- Original painting checksums:
  - a830d729b66d0eb5d36710c11034963065290b8a402b520ed9d4fc62dfcec29b  outer-world.png
  - 32d9a0bc22ab7bae4c34292d14dbde8e7538d4fcdbf09175ee3cdf2de10264c7  inner-world.png

## Implemented routes

- `/` — immersive exhibition entrance and full scroll narrative
- `/works` — concise catalogue with one complete work and two explicitly labelled viewing studies
- `/works/two-worlds` — large interactive work, process, light-state studies and credits
- `/about` — visual and interaction approach with restrained maker credit

## Preserved interaction

The original dark and light paintings remain as aligned image layers. The Reveal mode uses a Canvas alpha brush copied from the source logic: irregular marks erase the temporary dark-layer Canvas and expose the real light painting beneath, then fade over 2.8 seconds. Dark, Reveal, Light, Pause/Play, pointer movement, touch drag, arrow keys, fallback and retry are retained.

## Asset provenance and portability

- `public/assets/outer-world.png` and `public/assets/inner-world.png`: copied unchanged from the owner-supplied source archive. Portable binary files; not Lovable asset pointers.
- Barlow Condensed 600 and IBM Plex Sans 400: copied from the supplied archive with their original license notices. Portable binary webfonts.
- Noto Sans SC exhibition subset: generated from Noto Sans CJK SC Regular, covering every Chinese character used in the exhibition copy. The SIL Open Font License notice is retained. Portable binary webfont; not a Lovable asset pointer.
- The uploaded screenshot was used as a visual reference only and is not embedded in the site.

## Verification artifacts

See `QA.md` and `QA-screenshots/` for actual route, interaction, language, overflow, resource, reduced-motion and lifecycle results.

## Known gaps

- The generated Noto Sans SC file is deliberately subset to the current exhibition copy. Future Chinese copy must regenerate the subset to add new characters.
- No production publish was performed, as requested.
- The implementation revision captured immediately before this delivery note correction is recorded below.

## Resulting project revision

be2ef829b9852555adfb82ce8b80c5ee861884cd
