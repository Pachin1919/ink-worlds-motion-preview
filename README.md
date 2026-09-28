# Ink Worlds — Motion Preview

A standalone, static preview of an interactive two-layer landscape. The English interface uses `XX` in place of personal details; the disabled language control preserves its position for a later localized version.

Open `index.html` from a local web server, for example:

```powershell
python -m http.server 4328 --bind 127.0.0.1 --directory .
```

Then visit `http://127.0.0.1:4328/`. The lighter painting stays underneath the darker painting; moving the pointer or dragging on touch erases a temporary mask from the darker layer. Dark and Light show the source layers directly. The scene pauses when the page is hidden or scrolled out of view and provides a still-image fallback for reduced-motion users or unavailable canvas rendering.

This preview requires no build step, backend, external assets, or third-party JavaScript. Font license files are included in `assets/fonts/`. The landscape artwork remains project-specific and is not offered for reuse.
