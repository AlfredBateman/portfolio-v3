// Site checks: `npm run build && npm test`. Serves dist/ with `astro preview` and drives Chromium over every route.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const PORT = 4399;
const ORIGIN = `http://localhost:${PORT}`;
const SIZES = [[390, 844], [1440, 900]];
const axeSource = readFileSync(require.resolve('axe-core'), 'utf8');

const server = spawn(process.execPath, ['node_modules/astro/bin/astro.mjs', 'preview', '--port', String(PORT), '--ignore-lock'], {
  stdio: 'ignore',
});
const stop = () => server.kill();
process.on('exit', stop);

async function up() {
  for (let i = 0; i < 100; i++) {
    try { await fetch(ORIGIN); return; } catch { await new Promise((r) => setTimeout(r, 200)); }
  }
  throw new Error('astro preview did not start');
}

const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
paths.push(new URL('404.html', ORIGIN + paths[0]).pathname);

const rows = [];
const fail = [];
function record(path, mode, problems) {
  rows.push([path, mode, problems.length ? 'FAIL' : 'ok']);
  for (const p of problems) fail.push(`${path} [${mode}] ${p}`);
}

async function visit(browser, path, w, h, reducedMotion) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  const res = await page.goto(ORIGIN + path, { waitUntil: 'networkidle' });
  return { ctx, page, res, errors };
}

try {
  await up();
  const browser = await chromium.launch();
  for (const path of paths) {
    const is404 = path.endsWith('/404.html');
    for (const [w, h] of SIZES) {
      const { ctx, page, res, errors } = await visit(browser, path, w, h, 'no-preference');
      const problems = [...errors];
      if (!is404 && res.status() !== 200) problems.push(`HTTP ${res.status()}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 0) problems.push(`horizontal overflow ${overflow}px`);
      await page.waitForTimeout(3500); // ponytail: fixed settle for the intro animation; wait on a ready flag if it gets flaky
      await page.addScriptTag({ content: axeSource });
      const { violations } = await page.evaluate(() => axe.run());
      for (const v of violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')) {
        problems.push(`axe ${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(' ')}`);
      }
      record(path, `${w}x${h}`, problems);
      await ctx.close();
    }
    const { ctx, page } = await visit(browser, path, 390, 844, 'reduce');
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-split], [data-reveal]')]
        .filter((el) => !el.checkVisibility({ visibilityProperty: true, opacityProperty: true }))
        .map((el) => el.tagName.toLowerCase() + '[' + (el.hasAttribute('data-split') ? 'data-split' : 'data-reveal') + ']'),
    );
    record(path, 'reduced-motion', hidden.map((h) => `hidden: ${h}`));
    await ctx.close();
  }
  await browser.close();
} finally {
  stop();
}

const w = Math.max(...rows.map((r) => r[0].length));
for (const [p, m, s] of rows) console.log(`${p.padEnd(w)}  ${m.padEnd(14)}  ${s}`);
if (fail.length) console.log(`\n${fail.length} problem(s):\n` + fail.map((f) => '  ' + f).join('\n'));
console.log(`\n${rows.filter((r) => r[2] === 'ok').length}/${rows.length} passed`);
process.exit(fail.length ? 1 : 0);
