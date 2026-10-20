// The driver: one magnetic field, every needle on the site.
// Each needle is a damped spring that wants to point northeast (045°). It is pulled toward:
//   1. a hovered or focused [data-attract] element (all needles on screen point at it; on touch,
//      the project row nearest the middle of the screen), else
//   2. its waypoint's [data-aim] text while that text is on screen (inner pages: the needle turns
//      toward what you are reading), else
//   3. the pointer, if it is within the needle's reach (data-reach, in dial radii).
// Scroll velocity and page transitions kick it; a slow two-sine sway keeps it alive at rest.
// The readouts ([data-bearing="<needle>"]) print the live bearing and what the needle points at.
// Reduced motion: none of this runs; CSS holds every needle at 045° (or 200° on the 404).
import { gsap } from 'gsap';
import { isTouch, onPage, onScroll, prefersReducedMotion } from '../engine';

const HOME = 45;
const K = 70; // stiffness
const C = 8.5; // damping (about 0.5 of critical: one clear overshoot, then settle)
const MAX_VEL = 900; // deg/s

type State = { angle: number; vel: number };
type Needle = { el: HTMLElement; s: State; reach: number; phase: number; aim: HTMLElement | null };
type Readout = { value: HTMLElement; label: HTMLElement | null; s: State; format: string };

const states = new Map<string, State>();
let needles: Needle[] = [];
let readouts: Readout[] = [];
let held = true; // first load: point north until the intro releases the needle
let lost = false;
let pointer: { x: number; y: number } | null = null;
let attract: HTMLElement | null = null;

const norm = (a: number) => ((a % 360) + 360) % 360;
const diff = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180;
const bearing = (dx: number, dy: number) => norm((Math.atan2(dx, -dy) * 180) / Math.PI);
const POINTS = 'N NNE NE ENE E ESE SE SSE S SSW SW WSW W WNW NW NNW'.split(' ');
const compassPoint = (a: number) => POINTS[Math.round(norm(a) / 22.5) % 16];
const formatBearing = (a: number) => `${norm(a).toFixed(1).padStart(5, '0')}°`;

/** The header needle: where it sits on screen and where it points (the page transition sweeps from it). */
export function heading() {
  const el = document.querySelector<HTMLElement>('.header [data-needle]');
  const r = el?.getBoundingClientRect();
  return { x: r ? r.left + r.width / 2 : 40, y: r ? r.top + r.height / 2 : 36, angle: states.get('header')?.angle ?? HOME };
}

/** Jolt every needle (page transitions). */
export function kick(v = 420) {
  for (const s of states.values()) s.vel += v;
}

function tick(time: number, deltaMs: number) {
  const dt = Math.min(deltaMs / 1000, 1 / 30);
  const a = attract?.isConnected ? attract.getBoundingClientRect() : null;
  for (const n of needles) {
    const r = n.el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || !r.width) continue; // off screen: rests where it is
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let target = HOME;
    let sway = true;
    if (held) { target = 0; sway = false; }
    else if (a) target = bearing(a.left + a.width / 2 - cx, a.top + a.height / 2 - cy);
    else if (lost) { target = n.s.angle + 7 + Math.sin(time * 0.6 + n.phase) * 9; sway = false; } // nothing to find: it wanders
    else if (n.aim) {
      const m = n.aim.getBoundingClientRect();
      const y = gsap.utils.clamp(Math.max(m.top, 0), Math.min(m.bottom, innerHeight), m.top + m.height / 2);
      target = bearing(m.left + m.width / 2 - cx, y - cy);
    }
    else if (pointer && n.reach) {
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const R = r.width / 2;
      const w = gsap.utils.clamp(0, 1, (R * n.reach - Math.hypot(dx, dy)) / (R * n.reach - R));
      target = HOME + diff(HOME, bearing(dx, dy)) * w;
    }
    if (sway) target += Math.sin(time * 0.8 + n.phase) * 0.9 + Math.sin(time * 2.1 + n.phase * 2) * 0.35;
    const acc = K * diff(n.s.angle, target) - C * n.s.vel;
    n.s.vel = gsap.utils.clamp(-MAX_VEL, MAX_VEL, n.s.vel + acc * dt);
    n.s.angle += n.s.vel * dt;
    if (Math.abs(n.s.angle) > 7200) n.s.angle = norm(n.s.angle);
    n.el.style.rotate = `${n.s.angle.toFixed(2)}deg`;
  }
  for (const r of readouts) {
    const value = r.format === 'point' ? compassPoint(r.s.angle) : formatBearing(r.s.angle);
    if (r.value.textContent !== value) r.value.textContent = value;
    if (!r.label) continue;
    const label = attract?.dataset.attract ?? (lost ? 'lost' : compassPoint(r.s.angle));
    if (r.label.textContent !== label) r.label.textContent = label;
  }
}

export function startCompass() {
  if (prefersReducedMotion()) return;

  // Pointer: a mouse pulls continuously; a finger pulls while it is down, then lets go.
  let release = 0;
  addEventListener('pointermove', (e) => { pointer = { x: e.clientX, y: e.clientY }; }, { passive: true });
  addEventListener('pointerdown', (e) => { clearTimeout(release); pointer = { x: e.clientX, y: e.clientY }; }, { passive: true });
  const letGo = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') release = window.setTimeout(() => { pointer = null; }, 700);
  };
  addEventListener('pointerup', letGo);
  addEventListener('pointercancel', letGo);
  document.documentElement.addEventListener('pointerleave', () => { pointer = null; attract = null; });

  // Attraction: whatever the visitor points at or tabs to.
  const find = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>('[data-attract]') : null);
  document.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse') attract = find(e.target); });
  document.addEventListener('focusin', (e) => { attract = find(e.target); });
  document.addEventListener('focusout', () => { attract = null; });

  // Moving the page jolts the needle, like moving a real compass. On touch there is no hover, so the
  // project row nearest the middle of the screen does the pulling.
  const touch = isTouch();
  onScroll(({ velocity }) => {
    for (const s of states.values()) s.vel += gsap.utils.clamp(-40, 40, velocity * 0.7);
    if (!touch) return;
    let best: HTMLElement | null = null;
    let bestD = innerHeight * 0.22;
    for (const row of document.querySelectorAll<HTMLElement>('.index [data-attract]')) {
      const r = row.getBoundingClientRect();
      const d = Math.abs(r.top + r.height / 2 - innerHeight / 2);
      if (d < bestD) { bestD = d; best = row; }
    }
    if (best !== attract) {
      attract?.classList.remove('is-aimed');
      best?.classList.add('is-aimed');
    }
    attract = best;
  });

  gsap.ticker.add(tick);

  onPage(({ intro }) => {
    lost = !!document.querySelector('[data-compass="lost"]');
    attract = null;
    needles = [...document.querySelectorAll<HTMLElement>('[data-needle]')].map((el, i) => {
      const name = el.dataset.needle!;
      let s = states.get(name);
      if (!s) states.set(name, (s = { angle: 0, vel: 0 })); // a needle seen for the first time starts at north
      el.style.rotate = `${s.angle}deg`;
      const aim = el.closest('[data-waypoint]')?.querySelector<HTMLElement>('[data-aim]') ?? null;
      return { el, s, reach: Number(el.dataset.reach || 0), phase: i * 1.7, aim };
    });
    readouts = [...document.querySelectorAll<HTMLElement>('[data-bearing]')].flatMap((value) => {
      const name = value.dataset.bearing!;
      const s = states.get(name);
      const format = value.dataset.format ?? '';
      const label = format ? null : document.querySelector<HTMLElement>(`[data-bearing-label="${name}"]`);
      return s ? [{ value, label, s, format }] : [];
    });
    // The dial draws itself around the ring, then the needle is let go and swings to the northeast.
    const ticks = document.querySelectorAll('.compass:not(.compass--mini) .dial__tick');
    if (ticks.length) intro.from(ticks, { autoAlpha: 0, duration: 0.3, stagger: 0.008, ease: 'none' }, 0);
    if (held) intro.add(() => { held = false; }, 0.25);
    return () => { needles = []; readouts = []; attract = null; };
  });
}
