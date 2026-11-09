// Work list previews: hover or focus a row and that project's case figure floats northeast of the pointer, following it
// with a slight lag. One panel holds all four figures (ProjectFigure, rendered hidden); showing a row unhides its figure and
// starts its runner (figures.ts) on the ticker, hiding stops it, so only the visible preview ever runs.
// The panel is decorative (aria-hidden, no pointer events): each case page has the real figure and its caption.
// Fine pointers only; touch gets nothing. Reduced motion: the figure's last frame, placed once, no follow, no tweens.
import { gsap } from 'gsap';
import { ease, neOffset, onPage, prefersReducedMotion } from '../engine';
import { figure, type Figure } from './figures';

const GAP = 28; // px from the pointer to the panel's SW corner
const MARGIN = 16; // px kept clear of the viewport edge

export function startPeek() {
  onPage(() => {
    const panel = document.querySelector<HTMLElement>('.peek');
    const list = document.querySelector<HTMLElement>('.index');
    if (!panel || !list || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const card = panel.firstElementChild as HTMLElement; // moves in and out; the panel itself follows the pointer
    const slots = [...panel.querySelectorAll<HTMLElement>('[data-peek-for]')];
    const still = prefersReducedMotion();
    const runners = new Map<string, Figure | undefined>(); // built on first hover
    const qx = gsap.quickTo(panel, 'x', { duration: 0.5, ease: ease.soft });
    const qy = gsap.quickTo(panel, 'y', { duration: 0.5, ease: ease.soft });
    let row: HTMLElement | null = null;
    let run: Figure | undefined;
    let w = 0;
    let h = 0;
    let top = 0;

    // Northeast of (x, y), kept inside the viewport and below the header.
    const at = (x: number, y: number) => [
      gsap.utils.clamp(MARGIN, innerWidth - w - MARGIN, x + GAP),
      gsap.utils.clamp(top, innerHeight - h - MARGIN, y - GAP - h),
    ];

    const show = (next: HTMLElement, x: number, y: number) => {
      if (next === row) return;
      const fresh = !row;
      const slug = next.dataset.peek!;
      row = next;
      run?.stop();
      for (const s of slots) s.hidden = s.dataset.peekFor !== slug;
      if (!runners.has(slug)) runners.set(slug, figure(panel.querySelector<HTMLElement>(`[data-peek-for="${slug}"] [data-live]`)!));
      run = runners.get(slug);
      if (still) run?.end();
      else run?.start();
      w = panel.offsetWidth;
      h = panel.offsetHeight;
      top = (document.querySelector('.header')?.getBoundingClientRect().bottom ?? 0) + MARGIN / 2;
      const [px, py] = at(x, y);
      if (fresh) { qx(px, px); qy(py, py); } // (value, start): jump there, then follow
      else if (!still) { qx(px); qy(py); }
      if (!fresh) return;
      if (still) return void gsap.set(card, { autoAlpha: 1 });
      const d = neOffset(card);
      gsap.fromTo(card, { x: -d, y: d, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.6, ease: ease.out, overwrite: true });
    };

    const hide = () => {
      if (!row) return;
      row = null;
      run?.stop();
      run = undefined;
      if (still) return void gsap.set(card, { autoAlpha: 0 });
      const d = neOffset(card);
      gsap.to(card, { x: d, y: -d, autoAlpha: 0, duration: 0.18, ease: ease.soft, overwrite: true });
    };

    const rowOf = (t: EventTarget | null) => (t instanceof Element ? t.closest<HTMLElement>('.row[data-peek]') : null);
    list.addEventListener('pointerover', (e) => {
      if (e.pointerType === 'touch') return;
      const r = rowOf(e.target);
      if (r) show(r, e.clientX, e.clientY);
      else hide();
    });
    list.addEventListener('pointermove', (e) => {
      if (!row || still) return;
      const [x, y] = at(e.clientX, e.clientY);
      qx(x);
      qy(y);
    });
    list.addEventListener('pointerleave', hide);
    list.addEventListener('click', hide); // the page transition is about to take over
    // Keyboard: the row's centre stands in for the pointer. A mouse click also focuses a row, so only focus-visible counts.
    list.addEventListener('focusin', (e) => {
      const r = rowOf(e.target);
      if (!r?.matches(':focus-visible')) return;
      const b = r.getBoundingClientRect();
      show(r, b.left + b.width / 2, b.top + b.height / 2);
    });
    list.addEventListener('focusout', (e) => { if (!rowOf(e.relatedTarget)) hide(); });

    return () => run?.stop();
  });
}
