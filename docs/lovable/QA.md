# Historical Lovable build evidence

Original Lovable-managed preview, before GitHub Pages adaptation. Current deployment: docs/GITHUB-PAGES.md.

# Ink Worlds QA

Verified against the local preview on 2026-10-06.

## Routes and resources

| Route | Direct response | Page errors | Failed resources | Horizontal overflow |
| --- | ---: | ---: | ---: | ---: |
| `/` | 200 | 0 | 0 | 0 px at 1440 and 390 |
| `/works` | 200 through navigation and direct route match | 0 | 0 | 0 px observed |
| `/works/two-worlds` | 200 direct entry | 0 | 0 | 0 px at 1440 |
| `/about` | 200 direct route match | 0 | 0 | 0 px observed |

All leaf routes define unique title, description, Open Graph title/description/type, and Twitter card metadata.

## Viewports and language

- Desktop: 1440×900. Home rendered at 1440 px content width with no overflow; Canvas backing size was bounded to 1440×900 at DPR 1.
- Mobile: 390×844 with touch enabled. Home rendered at 390 px content width with no overflow; Canvas backing size was 390×844.
- English home title: “INK WORLDS”.
- Switched to Chinese on `/`; home title changed to “水墨世界”.
- Navigated to `/works`; Chinese persisted and the catalogue remained Chinese (`lang=zh-CN`).
- Direct detail entry rendered Chinese when the persisted preference was Chinese; a fresh context rendered English.
- Full page copy was reviewed in route context in both languages. Chinese copy retains the same headings, claims, catalogue structure and controls without adding biography, awards, metrics, pricing or availability.

## Core interaction

- Pointer: moved across the home Canvas in Reveal mode; 27 sampled pixels became transparent in the dark-layer Canvas, exposing the aligned light painting underneath. This confirms a true alpha erase rather than brightness/filter treatment.
- Controls: Dark, Reveal and Light changed modes. Pause changed the Canvas state to `playing=false`.
- Keyboard: focused the artwork and used ArrowRight and ArrowDown; Reveal mode remained active and accepted keyboard painting.
- Touch: dispatched touch pointer down/move/up at 390×844; Reveal mode remained active and the page retained zero horizontal overflow.
- Reduced motion: direct detail entry with reduced motion selected rendered the outer still, disabled Reveal, set playing to false, and hid the Canvas.
- Fallback: both original image elements remain underneath the Canvas; image failure exposes a retry control.

## Lifecycle and cleanup

- The artwork component bounds DPR to 1.5 and mark history to 28 marks.
- RAF starts only for active fading marks and pauses when the page is hidden or the artwork leaves the viewport.
- Component cleanup aborts all pointer/keyboard/visibility/image listeners, disconnects the IntersectionObserver, removes the reduced-motion listener, cancels RAF, clears marks and clears the Canvas.
- Four `/` → `/works/two-worlds` → `/works` cycles completed without page errors or failed resources. Scene counts returned to zero on settled catalogue pages; transient counts during client navigation were observed only while the leaving view was still completing its transition. No duplicate Canvas loops or duplicate controls appeared.

## Saved screenshots

- `QA-screenshots/desktop-hero.png`
- `QA-screenshots/home-long-page.png`
- `QA-screenshots/mobile-home.png`
- `QA-screenshots/detail-desktop.png`
