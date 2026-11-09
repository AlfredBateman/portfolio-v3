// Global motion: runs once on the client, before the first page initializes.
import { gsap } from 'gsap';
import { ease, neOffset, onPage, onScroll, prefersReducedMotion, setLoaderExit, setLoaderFormat, setTransition } from '../engine';
import { heading, kick, startCompass } from './compass';
import { startFigures } from './figures';
import { startTrueNE } from './true-ne';

// Transitions are a needle swinging over the page: ink fills the wedge between two bearings, pivoting
// on the header compass. From there the whole viewport lies between about 80° and 195°. The moving edge always turns
// from END back to START (counter-clockwise): across the middle of the screen it travels toward 045°, so the ink
// arrives from the SW and leaves to the NE.
const START = 75;
const END = 212;
function wedge(trail: number, lead: number) {
  const { x, y } = heading();
  const R = Math.hypot(innerWidth, innerHeight) * 1.6;
  const steps = Math.max(1, Math.ceil((lead - trail) / 8));
  const pts = [`${x}px ${y}px`];
  for (let i = 0; i <= steps; i++) {
    const b = ((trail + ((lead - trail) * i) / steps) * Math.PI) / 180;
    pts.push(`${(x + R * Math.sin(b)).toFixed(1)}px ${(y - R * Math.cos(b)).toFixed(1)}px`);
  }
  return `polygon(${pts.join(',')})`;
}

function sweep(el: HTMLElement, from: [number, number], to: [number, number], duration: number) {
  const s = { trail: from[0], lead: from[1] };
  el.style.clipPath = wedge(s.trail, s.lead);
  return gsap.to(s, {
    trail: to[0],
    lead: to[1],
    duration,
    ease: ease.inOut,
    onUpdate: () => { el.style.clipPath = wedge(s.trail, s.lead); },
  });
}

export function setupMotion() {
  startCompass();
  startFigures();
  startTrueNE();

  // Loader: the counter is a bearing, 000° to 045°.
  setLoaderFormat((p) => `${String(Math.round(p * 0.45)).padStart(3, '0')}°`);
  setLoaderExit((root) =>
    gsap.timeline()
      .to(root.querySelectorAll('[data-loader-out]'), { x: (_: number, el: Element) => neOffset(el), y: (_: number, el: Element) => -neOffset(el), duration: 0.3, ease: ease.inOut, stagger: 0.03 })
      .add(sweep(root, [START, END], [START, START], 0.6), '-=0.15'),
  );

  // Page transition: an ink band sweeps across carrying the destination's name, set where the next title will sit.
  let dest = '';
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest<HTMLElement>('a') : null;
    if (a) dest = a.dataset.dest ?? '';
  }, true);
  addEventListener('popstate', () => { dest = ''; });

  setTransition({
    leave: (c) => {
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      const label = c.querySelector<HTMLElement>('[data-curtain-label]')!;
      label.textContent = dest;
      label.style.fontSize = `min(15vw, ${(88 / Math.max(1, dest.length * 0.86)).toFixed(2)}vw)`;
      kick();
      return gsap.timeline()
        .set(c, { autoAlpha: 1 })
        .add(sweep(panel, [END, END], [START, END], 0.8))
        .set(panel, { clipPath: 'none' }) // the wedge leaves a sliver behind the pivot: close it once covered
        .from(label, { x: -neOffset(label), y: neOffset(label), duration: 0.7, ease: ease.out }, 0.25);
    },
    enter: (c) => {
      const panel = c.querySelector<HTMLElement>('.curtain__panel')!;
      return gsap.timeline()
        .add(sweep(panel, [START, END], [START, START], 0.85))
        .set(c, { autoAlpha: 0 });
    },
  });

  // Case title: widens toward the east, scrubbed to the scroll as the case hero leaves.
  if (!prefersReducedMotion()) {
    onPage(() => {
      const title = document.querySelector('.case__title');
      if (title) gsap.to(title, { fontStretch: '125%', ease: 'none', scrollTrigger: { trigger: '.case__hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
  }

  // Header hairline once the page moves.
  onScroll(({ y }) => document.documentElement.classList.toggle('is-scrolled', y > 8));
}
