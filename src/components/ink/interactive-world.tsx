import { asset } from "@/lib/asset";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./language-provider";

type Mode = "outer" | "interactive" | "inner";
type Mark = { x: number; y: number; born: number; scale: number; angle: number };
const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(high, value));

function makeBrush() {
  const brush = document.createElement("canvas");
  brush.width = brush.height = 128;
  const context = brush.getContext("2d");
  if (!context) return brush;
  const image = context.createImageData(128, 128);
  for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
    const dx = (x - 63.5) / 64;
    const dy = (y - 63.5) / 64;
    const angle = Math.atan2(dy, dx);
    const distance = Math.hypot(dx, dy);
    const edge = .78 + .075 * Math.sin(5 * angle + .4) + .043 * Math.sin(11 * angle - 1.1) + .026 * Math.sin(23 * angle + 2.2);
    const opacity = distance < .47 ? 1 : clamp((edge - distance) / .18, 0, 1);
    image.data[(y * 128 + x) * 4 + 3] = Math.round(opacity * 255);
  }
  context.putImageData(image, 0, 0);
  return brush;
}

export function InteractiveWorld({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();
  const frameRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLImageElement>(null);
  const innerRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mode, setMode] = useState<Mode>("interactive");
  const [playing, setPlaying] = useState(true);
  const [reduced, setReduced] = useState(false);
  const modeRef = useRef<Mode>("interactive");
  const playingRef = useRef(true);

  useEffect(() => {
    const frame = frameRef.current, outer = outerRef.current, inner = innerRef.current, canvas = canvasRef.current;
    if (!frame || !outer || !inner || !canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) { setFailed(true); return; }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReduced = media.matches;
    setReduced(isReduced);
    if (isReduced) { setMode("outer"); setPlaying(false); }
    const brush = makeBrush();
    let marks: Mark[] = [], previous: { x: number; y: number } | null = null, time = 0, last = performance.now(), raf = 0;
    let visible = !document.hidden, inView = true, touchActive = false, loaded = false;
    modeRef.current = isReduced ? "outer" : modeRef.current;
    playingRef.current = !isReduced;
    const keyboard = { x: .5, y: .5 };
    const abort = new AbortController();
    const fit = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.round(bounds.width * ratio)), height = Math.max(1, Math.round(bounds.height * ratio));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      return { width, height };
    };
    const drawCover = (width: number, height: number) => {
      const sourceRatio = outer.naturalWidth / outer.naturalHeight, targetRatio = width / height;
      let sx = 0, sy = 0, sw = outer.naturalWidth, sh = outer.naturalHeight;
      if (targetRatio < sourceRatio) { sw = outer.naturalHeight * targetRatio; sx = (outer.naturalWidth - sw) / 2; }
      else { sh = outer.naturalWidth / targetRatio; sy = (outer.naturalHeight - sh) / 2; }
      context.drawImage(outer, sx, sy, sw, sh, 0, 0, width, height);
    };
    const draw = () => {
      if (!loaded || modeRef.current !== "interactive" || isReduced) return;
      const { width, height } = fit();
      context.globalCompositeOperation = "source-over"; context.globalAlpha = 1; context.clearRect(0, 0, width, height); drawCover(width, height);
      context.globalCompositeOperation = "destination-out";
      const radius = clamp(Math.min(width, height) * .105, 45, 90);
      for (const mark of marks) {
        const age = time - mark.born; if (age >= 2800) continue;
        const fade = age < 1050 ? 1 : 1 - (age - 1050) / 1750, size = radius * mark.scale;
        context.globalAlpha = clamp(fade, 0, 1); context.save(); context.translate(mark.x * width, mark.y * height); context.rotate(mark.angle); context.drawImage(brush, -size, -size, size * 2, size * 2); context.restore();
      }
      context.globalCompositeOperation = "source-over"; context.globalAlpha = 1;
    };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; last = performance.now(); };
    const tick = (now: number) => { raf = 0; time += Math.min(50, Math.max(0, now - last)); last = now; marks = marks.filter((mark) => time - mark.born < 2800); draw(); resume(); };
    const resume = () => { if (!raf && loaded && playingRef.current && visible && inView && modeRef.current === "interactive" && !isReduced && marks.length) { last = performance.now(); raf = requestAnimationFrame(tick); } };
    const paint = (clientX: number, clientY: number) => {
      if (!loaded || modeRef.current !== "interactive" || isReduced) return;
      const bounds = frame.getBoundingClientRect(), x = clamp((clientX - bounds.left) / bounds.width, 0, 1), y = clamp((clientY - bounds.top) / bounds.height, 0, 1);
      const distance = previous ? Math.hypot((x - previous.x) * bounds.width, (y - previous.y) * bounds.height) : 0;
      const steps = Math.min(16, Math.max(1, Math.ceil(distance / 28)));
      for (let step = 1; step <= steps; step++) { const part = step / steps, index = marks.length; marks.push({ x: previous ? previous.x + (x - previous.x) * part : x, y: previous ? previous.y + (y - previous.y) * part : y, born: time, scale: .86 + .13 * Math.sin(index * 2.37), angle: index * 1.37 }); }
      if (marks.length > 28) marks = marks.slice(-28); previous = { x, y }; keyboard.x = x; keyboard.y = y; draw(); resume();
    };
    const prepare = async () => {
      if (!outer.naturalWidth || !inner.naturalWidth) return;
      try { await Promise.all([outer.decode(), inner.decode()]); loaded = true; setReady(true); draw(); }
      catch { setFailed(true); setReady(false); }
    };
    outer.addEventListener("load", prepare, { signal: abort.signal }); inner.addEventListener("load", prepare, { signal: abort.signal });
    outer.addEventListener("error", () => setFailed(true), { signal: abort.signal }); inner.addEventListener("error", () => setFailed(true), { signal: abort.signal }); prepare();
    frame.addEventListener("pointermove", (event) => { if (event.pointerType !== "touch" || touchActive) paint(event.clientX, event.clientY); }, { signal: abort.signal });
    frame.addEventListener("pointerdown", (event) => { if (modeRef.current !== "interactive") return; touchActive = event.pointerType === "touch"; frame.setPointerCapture(event.pointerId); previous = null; paint(event.clientX, event.clientY); }, { signal: abort.signal });
    frame.addEventListener("pointerup", (event) => { touchActive = false; previous = null; if (frame.hasPointerCapture(event.pointerId)) frame.releasePointerCapture(event.pointerId); }, { signal: abort.signal });
    frame.addEventListener("pointerleave", () => { previous = null; }, { signal: abort.signal });
    frame.addEventListener("keydown", (event) => { const delta = event.shiftKey ? .1 : .045; if (event.key === "ArrowLeft") keyboard.x -= delta; else if (event.key === "ArrowRight") keyboard.x += delta; else if (event.key === "ArrowUp") keyboard.y -= delta; else if (event.key === "ArrowDown") keyboard.y += delta; else return; event.preventDefault(); keyboard.x = clamp(keyboard.x, 0, 1); keyboard.y = clamp(keyboard.y, 0, 1); const bounds = frame.getBoundingClientRect(); previous = null; paint(bounds.left + keyboard.x * bounds.width, bounds.top + keyboard.y * bounds.height); }, { signal: abort.signal });
    const onVisibility = () => { visible = !document.hidden; if (visible) resume(); else stop(); };
    document.addEventListener("visibilitychange", onVisibility, { signal: abort.signal });
    const observer = new IntersectionObserver(([entry]) => { inView = Boolean(entry?.isIntersecting); if (inView) resume(); else stop(); }); observer.observe(frame);
    const onMedia = () => { isReduced = media.matches; setReduced(isReduced); playingRef.current = !isReduced; setPlaying(!isReduced); modeRef.current = isReduced ? "outer" : "interactive"; setMode(modeRef.current); marks = []; stop(); draw(); };
    media.addEventListener("change", onMedia);
    return () => { abort.abort(); observer.disconnect(); media.removeEventListener("change", onMedia); stop(); marks = []; context.clearRect(0, 0, canvas.width, canvas.height); window.dispatchEvent(new CustomEvent("ink-worlds:scene-destroyed")); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.dataset['mode'] = mode; canvas.dataset['playing'] = String(playing);
    modeRef.current = mode;
    playingRef.current = playing;
    if (mode !== "interactive") {
      const context = canvas.getContext("2d");
      context?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [mode, playing]);

  const chooseMode = (next: Mode) => { modeRef.current = next; setMode(next); };
  // React state controls visible layers; the Canvas remains the exact fading alpha brush in Reveal mode.
  const showInner = mode === "inner" || mode === "interactive";
  const showOuter = mode !== "inner";
  return (
    <div className={compact ? "world world--compact" : "world"}>
      <div ref={frameRef} className="world__frame" tabIndex={0} aria-label={t.sceneLabel} data-scene-ready={ready}>
        <img ref={innerRef} className="world__image" src={asset("assets/inner-world.png")} alt={t.innerAlt} />
        <img ref={outerRef} className={`world__image ${showOuter ? "is-visible" : "is-hidden"}`} src={asset("assets/outer-world.png")} alt={t.outerAlt} />
        <canvas ref={canvasRef} className={`world__canvas ${mode === "interactive" && ready && !reduced ? "is-visible" : "is-hidden"}`} aria-hidden="true" />
        {!showInner && <span className="sr-only">{t.outerAlt}</span>}
        {failed && <Button variant="scene" onClick={() => window.location.reload()} className="world__retry">{t.controls.retry}</Button>}
      </div>
      <div className="world__controls" role="group" aria-label={t.controls.group}>
        {(["outer", "interactive", "inner"] as const).map((item) => <Button key={item} variant="scene" aria-pressed={mode === item} disabled={item === "interactive" && (!ready || reduced)} onClick={() => chooseMode(item)}>{item === "outer" ? t.controls.dark : item === "inner" ? t.controls.light : t.controls.reveal}</Button>)}
        <Button variant="scene" aria-pressed={!playing} disabled={reduced} onClick={() => setPlaying((value) => !value)}>{playing ? t.controls.pause : t.controls.play}</Button>
      </div>
    </div>
  );
}
