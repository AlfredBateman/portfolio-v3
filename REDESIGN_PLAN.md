# Redesign plan

An audit of the site as built on 16 Nov 2026 (commit `8b47065`), and the plan for the next pass. No code has changed yet.

**Goal.** Make the site feel more alive (motion, responsiveness, small surprises) without hiding information. Within five
seconds a recruiter or engineer must see who I am, what I build, my projects, my GitHub and the résumé download.

**What stays fixed.** The design language, "ishan" (northeast): the compass, the one red, Archivo at its extremes, zero
radius, the 45° line. This plan builds on it. DESIGN.md remains the record of the concept.

**Rules for every step.**

- Commit and push after each step, with a clear message. One author; no co-author or tool trailers.
- `prefers-reduced-motion` is respected everywhere: no step ships a motion without its still version.
- No new dependencies. GSAP and its plugins are the only animation code.
- Text never waits on animation to be readable (section 5).
- Screenshots and one-off scripts stay outside the repo.

**How this was measured.** The built site, driven in Chromium at 1440×900 and 390×844: screenshots at 0.4, 1.0, 1.6, 2.2,
3.0, 4.0 and 5.0 s after navigation, a scroll-through of every page type, a hovered work row, and the position of each
key element relative to the first screen.

---

## 1. What is generic, and what is already good

### Keep

| | Why it stays |
|---|---|
| The compass and its driver (`src/motion/compass.ts`) | One damped spring for every needle, on one clock, with shared state across pages. It only works for a site called northeast, and it is the best thing here. |
| The 45° rule | Entrances from the SW, exits to the NE, one offset token (`--ne`). A real system, not a set of effects. |
| The palette | Chart, graphite, one red, and a rule for the red ("red means northeast"). No gradients, no glass, no shadows. |
| Archivo on the width axis | One family at 62 to 125 %, titles fitted to their line from measured widths (`src/data/fit.ts`). |
| The project figures | Four hand-built diagrams that explain how each system works, drawn from data and run on the shared clock. The strongest explanation on the site. |
| Honest content | Real numbers, test counts linked to CI, illustrations labelled as illustrations, all of it in `src/data/site.ts`. |
| The ink flood, the NE arrow, the nav roll | One hover treatment per role, all on the 45° line. |
| The page transition | An ink wedge that pivots on the header needle and carries the destination's name. |
| The contact lock, real NE on phones, the lost needle on the 404 | The three existing surprises. All are the needle. |
| The foundations | Skip link, focus rings, a custom 404, JSON-LD, OG image, self-hosted subset fonts, about 63 KB of JS gzipped, and `npm test` gating the deploy. |

### Generic or templated

| # | What | Why it reads as a template | Plan |
|---|---|---|---|
| G1 | The first-visit loader (ink screen, `000°` counting to `045°`) | The counting preloader is the most copied opening on showcase sites. It also costs 1.6 s of the five. | Remove. The hero's own needle release is the opening. |
| G2 | "So far": three equal columns of giant numerals | The stat row. One of its three numbers is a giant `0`. | Remove the row; its facts move into copy (section 4). |
| G3 | The footer: a giant email on a dark field with a row of tiny links | The standard studio-portfolio ending, with about 250 px of empty ink between the title and the address. | Keep the ink field and the email; fill the gap with the arrival dial and give the links real size. |
| G4 | The About hero: a grey sentence with its keywords in ink | A familiar pattern, and it repeats the home intro. The first screen of About adds no information. | Replace with a short bio, facts and the four contact actions. |
| G5 | The toolbox: 35 skills in five ruled lists | A résumé skills section set large. Coursework ("Data structures and algorithms") is the loudest list on the page. | Tie tools to the projects that used them; set coursework at text size. |
| G6 | The preview card that follows the pointer over the work list | A well-known list trope. It covers the row above and the section intro while it is open, and touch never sees it. | Remove; the figure moves into the project block, always visible. |
| G7 | Case-study statements: one 40 px paragraph per screen | The standard problem / idea / outcome template, and it makes AgentProbe 6.9 screens long. | Tighten: smaller statements, less dead space, proof earlier. |
| G8 | Waypoint numerals (`135°`, `090°`) at display size | Unexplained decoration that outranks the label beside it ("So far" is 15 px under a 64 px `090°`). | Swap the weights: the label leads, the bearing is a small figure. |
| G9 | Smooth scroll (Lenis) | The default "premium" feel; engineers tend to dislike a hijacked wheel. | Decide in the performance step: remove unless the needle jolt reads worse on native scroll. |
| G10 | Line-by-line and letter-by-letter text reveals | Masked text reveals are on every showcase site, and they keep text hidden until a script runs. | Remove from all text (section 5). |

### Defects found on the way

- **Missing space in the hero:** it renders "the tests:1,500+ run in CI" (`src/pages/index.astro`, lines 13–14).
- **CanvasLint is presented as finished.** The site says "Shipped as v1.1.0"; it is still in development.
- **"4 full-stack projects, built and deployed" is not accurate.** Two are live (AgentProbe, StockPilot). CanvasLint is a
  browser extension; InvestorLens has no deployment.
- **The résumé PDF disagrees with the site.** It lists three projects (no InvestorLens), says "1,000+ automated tests"
  and gives AgentProbe as 1,145 / 184 / 14 tests; the site says four projects, 1,500+ and 1,173 / 353 / 49.
- **DESIGN.md's composition sketch is stale:** it still names placeholder projects (Pluvial, Shuttle, Tarka, Quorum).
- `text-size-adjust: none` in `engine.css` turns off text inflation on phones; it should be `100%`.
- The OG image still carries the old intro ("over a thousand across four shipped projects").

---

## 2. Information hierarchy

The five-second test, measured on a first desktop visit:

| Time | What is on screen |
|---|---|
| 0 – 1.6 s | The loader. Nothing about me. |
| 1.6 s | The dial and header. The intro paragraph is at about 5 % opacity; the name is still masked. |
| 2.2 s | Intro and name readable. No buttons yet. |
| 3.0 s | Résumé and "See the work" have faded in. |
| 5.0 s | No project name and no GitHub link has appeared. |

| The five | Today | Fix |
|---|---|---|
| **Who I am** | The visible H1 is the first name only. "Ishan Sharma" is a 15 px muted line at the bottom that fades in at about 3 s. The role sits inside a paragraph. | Full name and role as one plain line at the top of the hero, in the first paint. `ISHAN` stays as the poster. |
| **What I build** | One 37-word sentence at 28 px, with the spacing defect. | Two short sentences: what I build and the proof (tests in CI), then where I am and what I want. |
| **Projects** | None on the first screen. Work starts exactly at the fold (y = 900 of 900); the first row is at 1,210. | A four-item project strip along the bottom of the hero: name, five-word description, status. Each links to its block. |
| **GitHub** | One link on the whole home page, at y = 3,012 of 3,083, in 13 px type in the footer. Not in the header or hero. Repo links exist only inside case studies. | GitHub in the header on every page, in the hero actions, and a repo link on every project block. |
| **Résumé** | In the hero, but styled as the quiet button, delayed to about 3 s, and then gone until the footer. | The primary hero action, in the first paint, and in the header on every page. |

Other hierarchy problems:

| # | Problem | Fix |
|---|---|---|
| H1 | The loader and the staged intro spend 3 of the 5 seconds. | No loader. The hero paints complete; motion happens on the dial, not on the text. |
| H2 | A work row says what a project is, but not what I did, what it is built with, or where the code is. Status reads "v1.0.0", which tells a recruiter nothing. | Each project block carries: summary, my role, stack, status in words, and links to the case study, repo, live app and CI. |
| H3 | The best explanation (the figure) is hover-only on desktop and absent on touch. | The figure sits inside the block. |
| H4 | The hover preview covers its neighbours (G6). | Removed with the preview. |
| H5 | CanvasLint is indistinguishable from the shipped projects. | A plain "In development" label, last in the order, with what works today and what is next. |
| H6 | The bearings are louder than the section labels (G8), and nothing says what they mean. | Label leads; the header readout names the section the needle is on. |
| H7 | A giant `0` (internships) has the same weight as the two strengths beside it. | One sentence in About, same honest tone, text size. |
| H8 | Case study: real screenshots are the last thing on a seven-screen page; the pipeline figure has about 200 px of empty space above and below; "How it works" is a 13 px label. | Screenshots follow "How it works"; the staircase is tightened; section labels become headings. |
| H9 | About: the action buttons are in row 4 of 6 and GitHub / LinkedIn in row 5, three to four screens down. "Heading 043.8° NE" fills one of three fact slots. | Contact actions on the first screen of About. The heading fact goes; the header already shows it. |
| H10 | Footer: GitHub, LinkedIn and Résumé are 13 px beside a 100 px email. | Three full-size link rows with the flood treatment. |
| H11 | The header carries a decorative readout but neither GitHub nor the résumé. | Add both. On phones the readout gives way to them. |

---

## 3. The signature motion: one turn to northeast

**The idea.** Scrolling a page turns the needle. Each page starts off course and every section brings the needle 45°
closer, until it locks on 045° at Contact. The needle is the only thing that moves on its own. Point at something, tab to
it, or pull near the dial, and the needle swings to it, overshoots once, and settles back onto its course.

On the home page the course runs AgentProbe 225° → StockPilot 180° → InvestorLens 135° → CanvasLint 090° → Contact 045°.
225° is southwest: the page itself travels the same SW → NE line as everything on it.

**Why this one.**

1. **It is the name.** Ishan means northeast, and a compass has exactly one moving part. One idea, one object.
2. **It is already built, and already hidden.** The spring, the section bearings and the lock exist. What fails is
   legibility: the story is told by a 36 px icon, the big dial leaves after the first screen, the home page has only three
   stops, the bearings are unexplained, and the arrival is a tick that thickens for 0.7 s. Making one idea visible beats
   adding a second.
3. **It responds instead of performing.** The needle moves because the visitor scrolled, pointed or tabbed. That is what
   "alive" means here: the page answers. Nothing plays at the visitor and nothing gates content.
4. **It works the same on every input.** Scroll on touch, hover with a mouse, focus on a keyboard: one model.
5. **It costs almost nothing.** One ticker, transforms only, no new dependency, and it lets four other things be deleted
   (loader, text reveals, pointer preview, stat row).

**What changes to make it legible.**

| | Today | After |
|---|---|---|
| Scroll | The header needle jumps 45° when a section crosses the middle. | Its target is interpolated between the bearings above and below the middle of the screen, so it turns while the page moves and settles through the spring when it stops. The speed-change jolt stays. |
| Stops | Home has three (Work, So far, Contact). | Each project is a stop: five on the home page. |
| Readout | A compass point: `SE`. | The stop's name: `135.0° InvestorLens`. It tells you where you are. |
| Bearing labels | 64 px numerals. | A small tabular figure beside the mini dial; the section's name leads. |
| Arrival | A 36 px needle stops trembling. | A full-size dial in the footer turns the last 45° as Contact arrives and locks on 045°, and ईशान wipes on in red. The page ends on the picture the hero opened with. |
| Hero | The dial reacts to the pointer and to two buttons. | Every hero target (résumé, GitHub, email, the four projects) pulls the needle, and the readout names it. |

**Surprises, all of them the needle.** Kept: real NE on phones, the lost needle on the 404, the lock. New: (1) flick the
hero dial and the needle spins, the readout races, and it settles back on 045°; (2) the arrival dial. No others.

**Considered and rejected.**

- *Content that drifts up and right as the page scrolls.* Text would sit off its hang line whenever the page stopped
  mid-range, and it fights reading. It is also the stock parallax of showcase sites.
- *Type that leans or skews with scroll speed.* The same objection, and a dated one.
- *A route line drawn down the page.* A second motif competing with the needle, travelling the wrong way (down).
- *More reveal animations.* Every one of them makes text wait.

---

## 4. Section by section

### Header (every page)

```
◎ Ishan Sharma   135.0° InvestorLens        Work   About   GitHub ↗   Résumé ↓   Contact
```

- Brand shows the full name from 768 px up; "Ishan" below that.
- GitHub (external) and Résumé (download) join the nav. Both are needle targets.
- Phones: the readout goes, to make room for `Work · About · GitHub · Résumé`. Contact stays reachable from the hero's
  email action and the footer. Verify at 360 px; nothing wraps, every target at least 44 px tall.

### Hero

```
Ishan Sharma · Software engineer, backend and full-stack                 ( DIAL )
I build backends and full-stack apps, and I write the tests:               needle on NE
1,800+ across AgentProbe and StockPilot. Final-year computer               ईशान at the NE mark
science at Chitkara University, open to internships now and
full-time roles from 2027.
[ Résumé (PDF) ↓ ]  [ GitHub ↗ ]  [ Email ↗ ]

I S H A N   (full width, as now)

AgentProbe            StockPilot             InvestorLens            CanvasLint
LLM agent testing     Plain-English screener UX research workspace   Canvas 2D debugger
Live                  Live                   v1.0.0                  In development
```

- **No loader.** The first paint is the complete hero: name line, intro, actions, project strip, header. The dial is the
  only thing that performs: ticks draw round the ring, the needle is released from north, swings to 045°, overshoots,
  settles, and ईशान wipes on (all existing).
- `ISHAN` still unfolds along the width axis, but from visible: no mask, no offset, readable from its first frame.
- Résumé is the primary (filled) action. "See the work" goes; the project strip does that job and names the projects.
- The project strip is four links to the project blocks. Each is a needle target.
- New: flick the dial (pointer down or drag on it) to spin the needle.
- Phones: name line, intro, actions and `ISHAN` must fit the first screen at 360×640 and up; the dial takes the height
  that is left (as now). The strip is a 2×2 grid and may sit just under the fold on the shortest phones.
- Also check 1366×768 and 1280×720, the screens recruiters are most likely to have.

### Projects

The index rows and the pointer preview become four project blocks. Still a ruled list on the 12-column grid: no cards, no
alternating sides. Text sits to the southwest, the figure to the northeast.

```
◎ 225°  AgentProbe                                                         Live
AGENTPROBE ↗                                    ┌ live figure: six cases, ten runs ┐
Regression testing for LLM agents: run each     │ ● ● ● ○ ● ● ● ● ● ●   same       │
case again and again, judge the whole trace,    │ ● ○ ○ ○ ● ○ ○ ○ ○ ●   regression │
and fail the build only when the change is real.└ caption ─────────────────────────┘
My part  Backend, statistics, dashboard and CI
Stack    Python, FastAPI, Next.js, PostgreSQL, Docker, GitHub Actions
Tests    1,561, run in CI ↗
[ Case study ↗ ]   GitHub ↗   Live app ↗
```

- The title bar keeps the ink flood and links to the case study. Repo, live app and CI are separate visible links (never
  nested inside the title link).
- Every block shows the same five facts in the same order: what it is, my part, stack, status, links. No fact appears
  only on hover.
- The figure is in the block. It runs while its block is the one at the middle of the screen and holds its complete last
  frame otherwise, so only one figure is ever on the clock. `peek.ts` and the `.peek` panel are deleted; the four figures
  already ship in the HTML, so the DOM does not grow.
- Each block is a waypoint (225°, 180°, 135°, 090°). This is where the turn in section 3 happens.
- **CanvasLint** goes last with an "In development" label in plain text (square, not a pill), and one line each for
  what works today and what is next. Its copy stops saying "shipped".
- The Work intro line becomes accurate: four projects, two live, one in development.
- "So far" is removed. The test count is already in the hero; "two live" is in the Work intro; the internships line
  moves to About.
- Phones: title, summary, figure, facts, links, in that order.

### Case studies

- The hero composition stays (figure, facts, giant title). Its links become buttons, and the facts are in the first paint.
- Order: hero → How it works → screenshots (where a project has them) → In numbers → Problem and Idea → Where it ended up
  → next project.
- The pipeline staircase loses its dead space; section labels become real headings.
- Problem and Idea drop to about 24 px so both fit on one screen.
- Bearings follow the same rule as every page: the last section before Contact is 090°, each one before it 45° further
  back, and Contact is 045°.

### About

```
About                                                         Graduating   August 2027
Three or four sentences: who I am, what I like building       Looking for  SDE, backend or full-stack
(typed APIs, real databases, CI on every push), how I work    Based in     …
(team lead on StockPilot), what I want next.                  Email        ishan.sh.1148@gmail.com
[ Email me ↗ ]  [ Résumé (PDF) ↓ ]  [ GitHub ↗ ]  [ LinkedIn ↗ ]
```

- The first screen answers "who is this and how do I reach them". The grey statement and the "Heading" fact go.
- Order after that: Toolbox → Education → Certifications → Colophon.
- **Toolbox** is evidence, not a list: one row per project with the tools it used (from `projects[].stack`, which already
  exists), then one "Also" row for the rest. Text size, not display size.
- **Education**: school, degree and date lead; coursework is one line of text.
- The internships sentence lives here: "No internships yet. This site is part of fixing that."
- "Elsewhere" is removed: its links are now on the first screen, in the header and in the footer.

### Contact / footer

```
◎ 045°  Contact
Point me somewhere.                                              ( ARRIVAL DIAL )
Graduate roles, internships, or a problem                          locks on 045°
you think I would enjoy. Email reaches me fastest.                 ईशान in red

ishan.sh.1148@gmail.com ↗                                          [ Copy ]
GitHub ↗            LinkedIn ↗            Résumé (PDF) ↓
© 2026 Ishan Sharma. Set in Archivo and Anek Devanagari.
```

- The arrival dial fills the empty middle of the ink field. It reuses `Compass.astro`; the driver already locks every
  needle on screen.
- The email keeps its size and flood. A small Copy button sits beside it, because `mailto:` opens nothing on many work
  machines.
- GitHub, LinkedIn and Résumé become three full-size flood rows.
- "Open to software engineering roles" folds into the lede.
- Phones: the footer is as tall as its content, with a smaller dial above the title.

### 404

Unchanged.

---

## 5. Animation budget

**The rule.** Text is readable in the first paint of whatever screen it is on. No text starts hidden, transparent, masked
or off screen, and none waits for a script, a scroll position or a timeline. Motion belongs to the needle, to surfaces
(ink) and to figures.

### Moves

| Element | Motion | Trigger | Cost | Reduced motion |
|---|---|---|---|---|
| Needles: hero, header, waypoints, arrival | Damped spring: turns with scroll, swings to targets, sways about 1° at rest | Scroll, hover, focus, pointer | One ticker, `rotate` only | Fixed at 045° (200° on the 404) |
| Header readout | Digits and the stop's name | Follows the needle | Text node | Static `045.0° NE` |
| Hero dial ticks | Draw round the ring, about 0.9 s | Load, once | Opacity on SVG lines | Drawn |
| ईशान on a dial | 45° wedge wipe, 0.6 s | The needle first reaching 045° (hero), the lock (footer) | `clip-path` | Shown |
| `ISHAN` | Width 62 → 125 %, visible throughout | Load, once | One line of text | Static at 125 % |
| Flicked hero needle | Spin and settle | Pointer down or drag on the dial | The same spring | Off |
| Project and case titles | Widen 120 → 125 % and nudge NE by 0.08 em | Hover, focus, or the block at mid-screen | CSS transition | No change |
| Ink flood | Diagonal fill from the SW corner | Hover, focus, press | CSS `clip-path` | Instant |
| Arrows | Leave NE, return from SW | Hover, focus | CSS keyframes | Off |
| Nav labels | Diagonal roll | Hover, focus | CSS | Off |
| Link underlines | Thicken or draw | Hover, focus | CSS | Instant |
| Project figures | Run their loop | Block at mid-screen (home); on screen (case study) | One runner at a time | Complete last frame |
| Bearing tape between projects | Slides 45° under its index, from the last stop's bearing to the next one's | Scroll, scrubbed, while the next block crosses mid-screen: the same range as the header needle's turn | One transform per tape | At rest on the block's bearing |
| Page transition | Ink wedge on the header needle. The leave runs while the next page loads; the reveal is cut from 0.85 s to 0.5 s or less | Navigation | `clip-path` on one panel | 0.2 s fade |
| Lock pulse | NE tick and the email arrow, 0.7 s | Arriving at Contact | Two tweens | Off |
| Header hairline | Fades in | Scroll past 8 px | CSS | Instant |

### Stays still

- All body text, summaries, facts, lists, statistics, captions, labels and link text.
- Section headings and the hero intro. They paint in place.
- Layout. Nothing pins, nothing scroll-jacks, nothing moves on a parallax.
- Screenshots and images: placed with reserved dimensions, never faded in.

### Removed

- The loader and its counter.
- Line, word and letter reveals (`data-split`), and with them the SplitText plugin.
- Fade-in and slide-in of text blocks (`data-reveal`), including the hero intro, the hero foot and the case-study facts.
- The masked rise on the hero name and the case titles.
- The pointer-following preview.
- The rule `.motion [data-split], .motion [data-reveal] { visibility: hidden }`. After this pass no stylesheet rule hides
  content pending a script.

### Never

Count-up statistics, typing effects on real copy, cursor followers, marquees, scroll-jacking, autoplaying anything with
sound, more than one figure running at once.

---

## 6. Implementation checklist

Each step ends the same way: `npm run build`, `npm run check`, `npm test`, screenshots at 360×640, 390×844, 768×1024,
1366×768 and 1440×900 (kept outside the repo), a reduced-motion pass, then commit and push.

### Step 1 · Hero (and the header, which is part of the first screen)

- [x] Remove the loader: `Loader.astro`, `engine/loader.ts`, its hooks in `engine/index.ts` and `motion/setup.ts`, the
      `loader-seen` flag and the loader CSS.
- [x] Hero text in the first paint: drop `rise-block`, `data-reveal` and `data-intro` from the intro, foot and actions.
- [x] Name and role line; rewrite the intro (fixes the "tests:1,500+" defect).
- [x] Actions: Résumé (primary), GitHub, Email. Remove "See the work".
- [x] Project strip: four targets with a short description and status, from `site.ts`.
- [x] `ISHAN`: keep the width unfold, remove the mask and offset.
- [x] Header: full name from 768 px, GitHub and Résumé in the nav, phone layout without the readout.
- [x] Compass: hero targets carry `data-attract`; add the flick.
- [x] Verify the five-second test: at 1.0 s after navigation, name, role, four project names, GitHub and Résumé are
      visible in the first screen at 1366×768, 1440×900 and 390×844.

### Step 2 · Projects

- [x] Data (`site.ts`): CanvasLint status and copy; a short description per project for the strip; accurate Work intro.
- [x] Project blocks replace the index rows: title bar (flood, to the case study), summary, my part, stack, status,
      links, figure.
- [x] Figures run only for the block at mid-screen; reuse the runners in `motion/figures.ts`.
- [x] Delete `motion/peek.ts` and the `.peek` markup and styles.
- [x] Each block is a waypoint (225°, 180°, 135°, 090°); the bearing becomes a small figure and the label leads.
- [x] Compass: interpolate the header needle's target between waypoints; the readout names the stop.
- [x] Remove the "So far" section.
- [x] Phone order: title, summary, figure, facts, links. No horizontal overflow at 360 px.

### Step 3 · Other sections (case studies, About, Contact / footer)

- [ ] Reveal engine: remove `data-split` and `data-reveal` from every page, then delete `engine/reveal.ts`'s split path,
      the SplitText import and the hidden-until-revealed CSS. Keep `neOffset` if anything still uses it.
- [ ] Case studies: buttons for links, new section order, tightened pipeline, real headings, smaller statements,
      bearings by the shared rule, CanvasLint's in-development section.
- [ ] About: new first screen (bio, facts, four actions), toolbox by project, education, certifications, colophon.
- [ ] Footer: arrival dial, Copy button, full-size link rows, content height on phones.
- [ ] Page transition: reveal at 0.5 s or less.
- [ ] `text-size-adjust: 100%`.

### Step 4 · Review

- [ ] Walk the tables in sections 1 and 2 and tick every row or record why it was left.
- [ ] Extend `scripts/check.mjs` with one assertion: on first paint of the home page (both sizes, motion on and off),
      name, role, the four project names, a GitHub link and the résumé link are visible inside the viewport; and no
      element with text content is hidden. This keeps the five-second rule from regressing.
- [ ] Keyboard pass on every page: order, visible focus, and the needle answering focus.
- [ ] Reduced-motion pass on every page: nothing moves, nothing is missing.
- [ ] Copy pass: every number matches `site.ts`, the résumé PDF and the repos.
- [ ] Update DESIGN.md (bearings, removed loader, the budget above, the stale composition sketch) and the README.

### Step 5 · Performance

- [ ] JS budget: 50 KB gzipped or less per page, from 63 KB (SplitText, loader and preview are gone).
- [ ] Decide Lenis: measure the jolt and the scroll-linked turn on native scroll; remove it unless they read worse.
- [ ] The needle loop: skip off-screen needles without measuring them every frame (observe visibility instead), and
      cache the waypoint positions used for interpolation on refresh.
- [ ] Confirm one figure runner at most, and none while the tab is hidden.
- [ ] Phone, throttled: LCP at 1.2 s or better (today 1.1 s), CLS 0, no long task from the ticker.
- [ ] Regenerate `public/og.png` from the new hero.
- [ ] Remove tokens, styles and exports left unused by steps 1 to 3.

### Step 6 · Deploy

- [ ] Push to `main`; watch the Actions run: the test job gates the deploy.
- [ ] On the live URL: the résumé downloads, every external link resolves, the OG card renders, and the five-second
      test passes on a real phone and a laptop.
- [ ] Real NE on a real phone (the sensor needs HTTPS).

---

## Decisions (16 Nov 2026)

1. **CanvasLint status.** "In development · v1.1.0 on GitHub". The "works today" and "next" lines are drafted from its
   README and wait for my approval before step 2 uses them.
2. **The résumé PDF.** I export a fresh one; the current file stays until then.
3. **Test count.** Counted from the repositories on 17 Nov 2026, not taken from the résumé. AgentProbe: 1,174 pytest,
   353 Vitest and 49 Playwright (1,576), as collected by its CI on `main` at `e38db98`. StockPilot: 483 Vitest (170 web,
   313 server), from `vitest list` at `66ac528`. The hero total is their sum rounded down to the hundred, "2,000+",
   worded as a count of tests and not of tests run in CI.
4. **About.** Based in Chandigarh. Open to internships now and to full-time 2027-batch roles (SDE, full-stack, backend),
   remote or on-site in India. The bio is drafted from the résumé for me to edit.
5. **The internships line.** Dropped.
6. **Phone header.** `Work · About · GitHub · Résumé`.
7. **Lenis.** Removed in step 5 if native scroll reads as well.

Step 2 notes: in-page links (the hero strip, Work, Contact) glide to their target and move focus there. The pointer
preview and the "So far" row are gone. The CanvasLint lines are the ones I approved. The waypoint restyle (small
bearing, label leads) applies to every page already; the rest of the About and case-study work is step 3.

Step 2, second pass (17 Nov 2026): every block now reads in one order. Southwest: what it is (one line), the problem
(one or two sentences), two or three results with numbers, then the links (case study, GitHub, live app, tests in CI).
Northeast: the figure, the stack as square tags, my part, and for CanvasLint what works today and what is next. Status
is a square tag in the block's bar; CanvasLint's is printed in ink, "In development". Phones: title, summary, figure,
problem, results, stack and my part, links. Between two projects a bearing tape (the course, unrolled) slides 45° under
its index, scrubbed to the scroll and in step with the header needle. Nothing pins and no text moves: section 5 still
holds. The test counts stay as recounted in decision 3; AgentProbe's README and the résumé PDF still carry the older
1,145 / 184 / 14.

Step 1 notes: on 16:9 laptops under
750 px tall the name gives up width so the strip stays on the first screen; on phones under about 700 px tall the
strip's second row sits just below the fold.
