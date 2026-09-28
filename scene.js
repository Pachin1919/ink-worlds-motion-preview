const outer = document.querySelector('#outer');
const inner = document.querySelector('#inner');
const canvas = document.querySelector('#world');
const art = document.querySelector('#art');
const frame = document.querySelector('#frame');
const retry = document.querySelector('#retry');
const hint = document.querySelector('#hint');
const pauseButton = document.querySelector('#pause');
const modeButtons = [...document.querySelectorAll('[data-mode]')];
const revealButton = document.querySelector('[data-mode="interactive"]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const touchDevice = matchMedia('(hover: none)').matches;
const events = new AbortController();
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));

let context;
let ready = false;
let preparing = false;
let destroyed = false;
let visible = !document.hidden;
let inView = true;
let playing = !reduced.matches;
let mode = reduced.matches ? 'outer' : 'interactive';
let frameId = 0;
let last = performance.now();
let time = 0;
let touchActive = false;
let previousPoint = null;
let failures = 0;
let retryTimer = 0;
let marks = [];
const keyboardPoint = { x: .5, y: .5 };

// This is an alpha brush only. The visible pixels always come from the two real images.
function makeBrush() {
  const brush = document.createElement('canvas');
  brush.width = brush.height = 128;
  const brushContext = brush.getContext('2d');
  const image = brushContext.createImageData(128, 128);
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const dx = (x - 63.5) / 64;
      const dy = (y - 63.5) / 64;
      const angle = Math.atan2(dy, dx);
      const distance = Math.hypot(dx, dy);
      const edge = .78 + .075 * Math.sin(5 * angle + .4)
        + .043 * Math.sin(11 * angle - 1.1)
        + .026 * Math.sin(23 * angle + 2.2);
      const opacity = distance < .47 ? 1 : clamp((edge - distance) / .18, 0, 1);
      const index = (y * 128 + x) * 4;
      image.data[index + 3] = Math.round(opacity * 255);
    }
  }
  brushContext.putImageData(image, 0, 0);
  return brush;
}
const brush = makeBrush();

function fitCanvas() {
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 1.5);
  const width = Math.max(1, Math.round(bounds.width * ratio));
  const height = Math.max(1, Math.round(bounds.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height };
}

function drawOuterCover(width, height) {
  const sourceWidth = outer.naturalWidth;
  const sourceHeight = outer.naturalHeight;
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = width / height;
  let sx = 0, sy = 0, sw = sourceWidth, sh = sourceHeight;
  if (targetRatio < sourceRatio) {
    sw = sourceHeight * targetRatio;
    sx = (sourceWidth - sw) / 2;
  } else {
    sh = sourceWidth / targetRatio;
    sy = (sourceHeight - sh) / 2;
  }
  context.drawImage(outer, sx, sy, sw, sh, 0, 0, width, height);
}

function activeMarks() {
  return marks.some(mark => time - mark.born < 2800);
}

function draw() {
  if (!ready || mode !== 'interactive' || reduced.matches) return;
  const { width, height } = fitCanvas();
  context.globalCompositeOperation = 'source-over';
  context.globalAlpha = 1;
  context.clearRect(0, 0, width, height);
  drawOuterCover(width, height);
  context.globalCompositeOperation = 'destination-out';
  const radius = clamp(Math.min(width, height) * .105, 45, 90);
  for (const mark of marks) {
    const age = time - mark.born;
    if (age >= 2800) continue;
    const fade = age < 1050 ? 1 : 1 - (age - 1050) / 1750;
    const size = radius * mark.scale;
    context.globalAlpha = clamp(fade, 0, 1);
    context.save();
    context.translate(mark.x * width, mark.y * height);
    context.rotate(mark.angle);
    context.drawImage(brush, -size, -size, size * 2, size * 2);
    context.restore();
  }
  context.globalCompositeOperation = 'source-over';
  context.globalAlpha = 1;
}

function stop() {
  cancelAnimationFrame(frameId);
  frameId = 0;
  last = performance.now();
}
function resume() {
  if (frameId || !ready || !playing || !visible || !inView || mode !== 'interactive' || reduced.matches || !activeMarks()) return;
  last = performance.now();
  frameId = requestAnimationFrame(tick);
}
function tick(now) {
  frameId = 0;
  time += Math.min(50, Math.max(0, now - last));
  last = now;
  marks = marks.filter(mark => time - mark.born < 2800);
  draw();
  resume();
}

function setMode(next) {
  if (next === 'interactive' && (!ready || reduced.matches)) return;
  mode = next;
  modeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.mode === next)));
  art.classList.toggle('fallback-inner', next === 'inner');
  art.classList.toggle('fallback-outer', next !== 'inner');
  art.classList.toggle('mask-ready', next === 'interactive' && ready && !reduced.matches);
  if (next !== 'interactive') {
    marks = [];
    previousPoint = null;
    stop();
  } else {
    draw();
    resume();
  }
}

function addMark(x, y) {
  const index = marks.length;
  marks.push({ x, y, born: time, scale: .86 + .13 * Math.sin(index * 2.37), angle: index * 1.37 });
  if (marks.length > 28) marks.shift();
}
function paint(clientX, clientY) {
  if (!ready || mode !== 'interactive' || reduced.matches) return;
  const bounds = frame.getBoundingClientRect();
  const x = clamp((clientX - bounds.left) / bounds.width, 0, 1);
  const y = clamp((clientY - bounds.top) / bounds.height, 0, 1);
  const distance = previousPoint
    ? Math.hypot((x - previousPoint.x) * bounds.width, (y - previousPoint.y) * bounds.height)
    : 0;
  const steps = Math.min(16, Math.max(1, Math.ceil(distance / 28)));
  for (let step = 1; step <= steps; step++) {
    const part = step / steps;
    addMark(
      previousPoint ? previousPoint.x + (x - previousPoint.x) * part : x,
      previousPoint ? previousPoint.y + (y - previousPoint.y) * part : y
    );
  }
  previousPoint = { x, y };
  keyboardPoint.x = x;
  keyboardPoint.y = y;
  draw();
  resume();
}

function scroll() {
  const stage = document.querySelector('.stage');
  const bounds = stage.getBoundingClientRect();
  inView = bounds.bottom > 0 && bounds.top < innerHeight;
  if (!inView) stop(); else resume();
  if (reduced.matches) return;
  const distance = Math.max(1, stage.offsetHeight - innerHeight);
  const progress = clamp(-bounds.top / distance, 0, 1);
  const width = document.documentElement.clientWidth;
  const height = innerHeight;
  const frameWidth = width <= 700 ? width : Math.min(width * .86, height * .84 * 16 / 9);
  const frameHeight = width <= 700 ? height : frameWidth * 9 / 16;
  document.documentElement.style.setProperty('--p', progress.toFixed(4));
  document.documentElement.style.setProperty('--w', `${(width + (frameWidth - width) * progress).toFixed(2)}px`);
  document.documentElement.style.setProperty('--h', `${(height + (frameHeight - height) * progress).toFixed(2)}px`);
  document.body.classList.toggle('settling', progress > .02);
  if (inView) draw();
}

function fallback(error) {
  console.warn('Two-layer mask unavailable; showing the original image.', error);
  ready = false;
  stop();
  art.classList.remove('mask-ready');
  revealButton.disabled = true;
  setMode('outer');
  hint.textContent = 'Static preview · choose Dark or Light';
}
async function prepare() {
  if (ready || preparing || destroyed || !outer.naturalWidth || !inner.naturalWidth) return;
  preparing = true;
  try {
    await Promise.all([outer.decode(), inner.decode()]);
    if (destroyed) return;
    context = canvas.getContext('2d', { alpha: true });
    if (!context) throw Error('Canvas is unavailable');
    ready = true;
    retry.hidden = true;
    revealButton.disabled = reduced.matches;
    setMode(mode);
  } catch (error) {
    fallback(error);
    retry.hidden = false;
  } finally {
    preparing = false;
  }
}
function imageFailure(event) {
  const image = event.currentTarget;
  ready = false;
  stop();
  art.classList.remove('mask-ready');
  revealButton.disabled = true;
  setMode('outer');
  if (failures < 2) {
    failures++;
    clearTimeout(retryTimer);
    retryTimer = setTimeout(() => {
      image.src = `./assets/${image.id === 'outer' ? 'outer' : 'inner'}-world.png?retry=${failures}`;
    }, 400);
  } else {
    retry.hidden = false;
    hint.textContent = 'Artwork could not load. Retry to continue.';
  }
}

outer.addEventListener('load', prepare, { signal: events.signal });
inner.addEventListener('load', prepare, { signal: events.signal });
outer.addEventListener('error', imageFailure, { signal: events.signal });
inner.addEventListener('error', imageFailure, { signal: events.signal });
if (outer.complete && !outer.naturalWidth) imageFailure({ currentTarget: outer });
if (inner.complete && !inner.naturalWidth) imageFailure({ currentTarget: inner });
prepare();

if (touchDevice) hint.textContent = 'Drag to uncover the image beneath';
if (reduced.matches) {
  hint.textContent = 'Choose Dark or Light';
  revealButton.disabled = true;
  pauseButton.disabled = true;
  pauseButton.textContent = 'Paused';
  pauseButton.setAttribute('aria-pressed', 'true');
}
modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode), { signal: events.signal }));
pauseButton.addEventListener('click', () => {
  playing = !playing && !reduced.matches;
  pauseButton.textContent = playing ? 'Pause' : 'Play';
  pauseButton.setAttribute('aria-pressed', String(!playing));
  if (playing) resume(); else stop();
}, { signal: events.signal });
frame.addEventListener('pointermove', event => {
  if (event.pointerType !== 'touch' || touchActive) paint(event.clientX, event.clientY);
}, { signal: events.signal });
frame.addEventListener('pointerdown', event => {
  if (mode !== 'interactive') return;
  if (event.pointerType === 'touch') {
    touchActive = true;
    frame.setPointerCapture(event.pointerId);
  }
  paint(event.clientX, event.clientY);
}, { signal: events.signal });
frame.addEventListener('pointerup', event => {
  touchActive = false;
  if (event.pointerType === 'touch') previousPoint = null;
}, { signal: events.signal });
frame.addEventListener('pointercancel', () => { touchActive = false; previousPoint = null; }, { signal: events.signal });
frame.addEventListener('pointerleave', () => { if (!touchActive) previousPoint = null; }, { signal: events.signal });
frame.addEventListener('keydown', event => {
  if (mode !== 'interactive' || !event.key.startsWith('Arrow')) return;
  event.preventDefault();
  keyboardPoint.x = clamp(keyboardPoint.x + (event.key === 'ArrowRight' ? .06 : event.key === 'ArrowLeft' ? -.06 : 0), 0, 1);
  keyboardPoint.y = clamp(keyboardPoint.y + (event.key === 'ArrowDown' ? .06 : event.key === 'ArrowUp' ? -.06 : 0), 0, 1);
  const bounds = frame.getBoundingClientRect();
  paint(bounds.left + keyboardPoint.x * bounds.width, bounds.top + keyboardPoint.y * bounds.height);
}, { signal: events.signal });
retry.addEventListener('click', () => {
  failures = 0;
  retry.hidden = true;
  hint.textContent = touchDevice ? 'Drag to uncover the image beneath' : 'Move to uncover the image beneath';
  outer.src = `./assets/outer-world.png?retry=${Date.now()}`;
  inner.src = `./assets/inner-world.png?retry=${Date.now()}`;
}, { signal: events.signal });
addEventListener('scroll', scroll, { passive: true, signal: events.signal });
addEventListener('resize', scroll, { passive: true, signal: events.signal });
document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) resume(); else stop(); }, { signal: events.signal });
reduced.addEventListener('change', () => {
  playing = !reduced.matches;
  revealButton.disabled = reduced.matches || !ready;
  pauseButton.disabled = reduced.matches;
  pauseButton.textContent = playing ? 'Pause' : 'Paused';
  pauseButton.setAttribute('aria-pressed', String(!playing));
  if (reduced.matches) { stop(); setMode('outer'); hint.textContent = 'Choose Dark or Light'; }
  else { setMode('interactive'); hint.textContent = touchDevice ? 'Drag to uncover the image beneath' : 'Move to uncover the image beneath'; }
  scroll();
}, { signal: events.signal });
addEventListener('pagehide', stop, { signal: events.signal });
addEventListener('pageshow', resume, { signal: events.signal });

window.InkWorldsDemo = {
  diagnostics: () => ({ ready, mode, playing, visible, inView, reducedMotion: reduced.matches,
    layers: { inner: inner.complete && inner.naturalWidth > 0, outer: outer.complete && outer.naturalWidth > 0 },
    maskReady: art.classList.contains('mask-ready'), size: [canvas.width, canvas.height] }),
  destroy() {
    destroyed = true;
    stop();
    clearTimeout(retryTimer);
    events.abort();
  }
};
scroll();
