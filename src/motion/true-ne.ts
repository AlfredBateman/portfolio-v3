// Real NE: on touch devices with an orientation sensor, the hero needle can point at the real northeast.
// Permission is asked inside the tap wherever the browser wants it (iOS, and newer Chrome too, so it says nothing
// about the platform). iOS gives webkitCompassHeading; Android gives alpha on deviceorientationabsolute (plain
// deviceorientation alpha there is relative to wherever the phone started, so it is ignored). The heading is
// corrected for the screen's rotation and handed to the driver as a target.
// Listening stops while the hero is off screen or the page is hidden, and for good when the page is swapped.
import { onPage } from '../engine';
import { pointTrue } from './compass';

const OFF = 'Point to real NE ↗';
const ON = 'Real NE · on';
const NONE = 'No compass on this device';
const WAIT = 1000; // ms for the first reading before deciding there is no compass

type Orientation = DeviceOrientationEvent & { webkitCompassHeading?: number | null };
type Permission = { requestPermission?: () => Promise<'granted' | 'denied'> };

export function startTrueNE() {
  if (!matchMedia('(pointer: coarse)').matches || !('DeviceOrientationEvent' in window)) return;
  const ask = (DeviceOrientationEvent as unknown as Permission).requestPermission;
  const types = ['deviceorientationabsolute', 'deviceorientation'];
  let seen = false; // a reading ever arrived (the sensor exists)

  onPage(() => {
    const btn = document.querySelector<HTMLButtonElement>('[data-true-ne]');
    const hero = btn?.closest('section');
    if (!btn || !hero) return;
    btn.hidden = false;
    let on = false;
    let listening = false;
    let inView = true;
    let timer = 0;

    const read = (e: Event) => {
      const o = e as Orientation;
      const h = typeof o.webkitCompassHeading === 'number' ? o.webkitCompassHeading
        : e.type === 'deviceorientationabsolute' && o.alpha !== null ? (360 - o.alpha) % 360 : null;
      if (typeof h !== 'number' || Number.isNaN(h)) return;
      seen = true;
      pointTrue(45 - (h + (screen.orientation?.angle ?? 0)));
    };
    const fail = () => {
      set(false);
      btn.textContent = NONE;
      btn.disabled = true;
    };
    // Listen only while it is on, the hero is on screen and the page is visible.
    const sync = () => {
      const want = on && inView && !document.hidden;
      if (want === listening) return;
      listening = want;
      clearTimeout(timer);
      if (want) {
        for (const t of types) addEventListener(t, read);
        if (!seen) timer = window.setTimeout(() => { if (!seen && listening) fail(); }, WAIT);
      } else {
        for (const t of types) removeEventListener(t, read);
        pointTrue(null);
      }
    };
    const set = (state: boolean) => {
      on = state;
      btn.textContent = on ? ON : OFF;
      btn.setAttribute('aria-pressed', String(on));
      sync();
    };
    const click = async () => {
      if (on) return set(false);
      if (ask) {
        // Called before any await: it is only granted inside the tap.
        const granted = await ask.call(DeviceOrientationEvent).then((r) => r === 'granted', () => false);
        if (!granted) return fail();
      }
      set(true);
    };

    btn.addEventListener('click', click);
    document.addEventListener('visibilitychange', sync);
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    io.observe(hero);
    return () => {
      on = false;
      sync();
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
      btn.removeEventListener('click', click);
    };
  });
}
