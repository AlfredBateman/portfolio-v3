// Case-study figures run their system while they are on screen, on the one GSAP clock:
//   agentprobe    the ten runs land one after another, then the verdicts appear
//   stockpilot    a query is typed, and the stages that answer it light up
//   investorlens  the guards tick one by one before the finding is approved
//   canvaslint    the scrubber walks the recorded frames and the log follows
// Case pages: paused off screen; skipped under reduced motion (the static figure is complete).
// The home work list (peek.ts) starts and stops the same runners on hover, through figure().
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

// Each kind: how to build its runner, and the length of its loop in seconds.
const kinds: Record<string, [(svg: SVGSVGElement) => Run, number]> = {
  agentprobe: [agentprobe, 7],
  stockpilot: [stockpilot, 13.5],
  investorlens: [investorlens, 5],
  canvaslint: [canvaslint, 8.8],
};

export type Figure = {
  start(): void; // from the first frame, on the ticker (no-op if already running)
  stop(): void; // off the ticker, frame left as is
  end(): void; // the last frame of the loop, static
};

/** The runner for a [data-live] figure, started and stopped on demand. Starting twice never doubles the ticker work. */
export function figure(fig: HTMLElement): Figure | undefined {
  const svg = fig.querySelector('svg');
  const kind = kinds[fig.dataset.live!];
  if (!svg || !kind) return;
  const [make, period] = kind;
  const run = make(svg);
  let t0 = 0;
  let on = false;
  const tick = () => run(gsap.ticker.time - t0);
  return {
    start() {
      if (on) return;
      on = true;
      t0 = gsap.ticker.time;
      gsap.ticker.add(tick);
    },
    stop() {
      on = false;
      gsap.ticker.remove(tick);
    },
    end: () => run(period - 0.01),
  };
}

export function startFigures() {
  if (prefersReducedMotion()) return;
  onPage(() => {
    const el = document.querySelector<HTMLElement>('.case__figure [data-live]');
    const f = el && figure(el);
    if (!el || !f) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (s) => (s.isActive ? f.start() : f.stop()),
    });
    if (st.isActive) f.start();
    return () => { f.stop(); st.kill(); };
  });
}
