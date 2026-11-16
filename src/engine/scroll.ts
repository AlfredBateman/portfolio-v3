// Smooth scroll on ONE clock: Lenis is driven by gsap.ticker, ScrollTrigger reads Lenis.
// Reduced motion → native scroll, no Lenis.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './env';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
const listeners = new Set<(s: ScrollState) => void>();

export type ScrollState = { y: number; velocity: number; progress: number };
const state: ScrollState = { y: 0, velocity: 0, progress: 0 };

export function initScroll() {
  if (lenis || prefersReducedMotion()) {
    // Still publish native scroll position for WebGL sync.
    if (!lenis) {
      addEventListener('scroll', nativeTick, { passive: true });
      ScrollTrigger.disable(); // no triggers exist under reduced motion; this stops its keep-alive rAF loop
    }
    return;
  }
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2 });
  // In-page links glide. Taken in the capture phase and cancelled, so the router's own instant hash jump never runs:
  // left to race, the two land on the wrong place. Focus follows, as it would on a native jump.
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    const target = a && document.getElementById(a.hash.slice(1));
    if (!lenis || !a || !target || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    history.replaceState(history.state, '', a.hash);
    if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    lenis.scrollTo(target);
  }, true);
  lenis.on('scroll', (l: Lenis) => {
    state.y = l.scroll;
    state.velocity = l.velocity;
    state.progress = l.limit > 0 ? l.scroll / l.limit : 0; // Lenis reports 1 on pages that cannot scroll
    ScrollTrigger.update();
    listeners.forEach((fn) => fn(state));
  });
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

function nativeTick() {
  const max = document.documentElement.scrollHeight - innerHeight;
  state.velocity = scrollY - state.y;
  state.y = scrollY;
  state.progress = max > 0 ? scrollY / max : 0;
  listeners.forEach((fn) => fn(state));
}

export const onScroll = (fn: (s: ScrollState) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const scrollState = () => state;
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else scrollTo(0, 0);
  state.y = 0;
  state.velocity = 0;
}
