# portfolio-v3

The portfolio of **Ishan Sharma**, a final-year Computer Science Engineering student at Chitkara University looking for a
software engineer role (backend / full-stack).

**Live:** https://alfredbateman.github.io/portfolio-v3/

The site is built around a compass: a damped needle that rests at 045° (northeast), turns toward whatever you point at
or tab to, sweeps across the screen between pages, and spins lost on the 404. It covers four projects (AgentProbe,
StockPilot, InvestorLens and CanvasLint), each with a live diagram of how it works, and a downloadable résumé.

## Stack

- [Astro](https://astro.build) 7: static output, page transitions through the ClientRouter
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering): one animation clock, smooth scroll
- Plain CSS with design tokens (`src/styles/tokens.css`); Archivo and Anek Devanagari, self-hosted
- No trackers, no cookies. About 60 KB of JS (gzipped) per page.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321/portfolio-v3/
npm run build      # static site in dist/
npm run preview
npm run check      # type-check
```

## Edit the content

Everything visible lives in **`src/data/site.ts`**: name, links, email, the four projects (summary, pipeline steps,
problem, idea, numbers, outcome, repo and live links), education, toolbox and certifications. The résumé served for
download is `public/ishan-sharma-resume.pdf`; replace that file to update it.

## Deploy (GitHub Pages)

The workflow in `.github/workflows/deploy.yml` builds and publishes the site on every push to `main`.

1. Create an empty public repository named `portfolio-v3` under `AlfredBateman` on GitHub.
2. Push this repository:
   ```bash
   git remote add origin https://github.com/AlfredBateman/portfolio-v3.git
   git push -u origin main
   ```
3. In the repository on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The site appears at https://alfredbateman.github.io/portfolio-v3/ when the workflow finishes (Actions tab).

Using a custom domain later? In `astro.config.mjs`, set `site` to the domain and remove `base`, then update
`site.url` in `src/data/site.ts` and the sitemap line in `public/robots.txt`.

## Structure

```
src/data/site.ts          all content
src/pages/                home, about, work/[slug], 404
src/components/           compass, header, footer, loader, project figures, waypoints
src/motion/compass.ts     the needle: one spring-driven driver for every compass on the site
src/motion/figures.ts     the live project diagrams
src/motion/setup.ts       loader, page transition (the needle sweep)
src/engine/               scroll, reveals, loader and page lifecycle
DESIGN.md                 concept, art direction and the decisions behind them
```
