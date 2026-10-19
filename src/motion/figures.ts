// Case-study figures run their system while they are on screen, on the one GSAP clock:
//   agentprobe    the ten runs land one after another, then the verdicts appear
//   stockpilot    a query is typed, and the stages that answer it light up
//   investorlens  the guards tick one by one before the finding is approved
//   canvaslint    the scrubber walks the recorded frames and the log follows
// Paused off screen; skipped under reduced motion (the static figure is complete).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onPage, prefersReducedMotion } from '../engine';

type Run = (t: number) => void;

function agentprobe(svg: SVGSVGElement): Run {
  const dots = [...svg.querySelectorAll<SVGCircleElement>('[data-run]')];
  const verdicts = [...svg.querySelectorAll<SVGTextElement>('[data-verdict]')];
  let last = -1;
  return (t) => {
    const step = Math.floor((t % 7) / 0.4); // a run every 0.4 s, then 3 s to read the verdicts
    if (step === last) return;
    last = step;
    for (const d of dots) d.style.opacity = +d.dataset.run! <= step ? '1' : '0';
    for (const v of verdicts) v.style.opacity = step >= 10 ? '1' : '0';
  };
}

function stockpilot(svg: SVGSVGElement): Run {
  const qs = [...svg.querySelectorAll<SVGGElement>('[data-q]')];
  let shown = -1;
  let typed = '';
  return (t) => {
    const k = Math.floor(t / 4.5) % qs.length; // one query every 4.5 s
    const local = t % 4.5;
    if (k !== shown) {
      qs.forEach((g, i) => g.setAttribute('visibility', i === k ? 'visible' : 'hidden'));
      shown = k;
    }
    const q = qs[k];
    const text = q.querySelector<SVGTextElement>('[data-text]')!;
    const full = text.dataset.text!;
    const value = full.slice(0, Math.floor(local / 0.045));
    if (value !== typed) { text.textContent = value; typed = value; }
    q.classList.toggle('is-parsed', value.length === full.length);
  };
}

function investorlens(svg: SVGSVGElement): Run {
  const checks = [...svg.querySelectorAll<SVGGElement>('[data-check]')];
  let last = -1;
  return (t) => {
    const step = Math.floor((t % 5) / 0.9); // a guard every 0.9 s, then a pause
    if (step === last) return;
    last = step;
    checks.forEach((c, i) => c.classList.toggle('is-done', i < step));
  };
}

function canvaslint(svg: SVGSVGElement): Run {
  const scrub = svg.querySelector<SVGGElement>('.pfig__scrub')!;
  const label = svg.querySelector<SVGTextElement>('[data-frame]')!;
  const lines = [...svg.querySelectorAll<SVGTextElement>('[data-log]')];
  let last = -1;
  return (t) => {
    const f = Math.floor(t / 0.22) % 40; // one recorded frame every 0.22 s
    if (f === last) return;
    last = f;
    scrub.setAttribute('transform', `translate(${f * 15 + 5} 0)`);
    label.textContent = `frame ${f + 1} of 40`;
    lines.forEach((l, i) => l.classList.toggle('is-on', i === f % lines.length));
  };
}

const kinds: Record<string, (svg: SVGSVGElement) => Run> = { agentprobe, stockpilot, investorlens, canvaslint };

export function startFigures() {
  if (prefersReducedMotion()) return;
  onPage(() => {
    const fig = document.querySelector<HTMLElement>('[data-live]');
    const svg = fig?.querySelector('svg');
    const make = fig ? kinds[fig.dataset.live!] : undefined;
    if (!fig || !svg || !make) return;
    const run = make(svg);
    const t0 = gsap.ticker.time;
    const tick = () => run(gsap.ticker.time - t0);
    const st = ScrollTrigger.create({
      trigger: fig,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (s) => (s.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
    });
    if (st.isActive) gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); st.kill(); };
  });
}
