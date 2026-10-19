# Ishan, portfolio: design record

## Brief

- **Subject:** Ishan, final-year B.E. Computer Science student (class of 2027). No work experience yet.
- **Audience:** recruiters and engineers hiring new graduates; senior students and professors who see the link.
- **Job:** get a first full-time software engineering role (and internship conversations before that).
- **Assets:** none. Name only.
- **Content:** all real, from the résumé (public/ishan-sharma-resume.pdf): Ishan Sharma, Chitkara University (expected
  Aug 2027), projects AgentProbe, StockPilot, InvestorLens and CanvasLint with their real numbers, skills and
  certifications. Hosted at alfredbateman.github.io/portfolio-v3 (GitHub Pages, `base: /portfolio-v3`).
- **Owner's direction (Oct 2026):** no section explaining the meaning of the name. The compass stays as the design
  system; ईशान appears only as the NE mark on the dial, unexplained. The phone number stays in the PDF, off the pages.

## Concept

| | A. Heading northeast (name) | B. Commit graph (material) | C. Release candidate (formal/process) |
|---|---|---|---|
| Idea | ईशान is the Hindi word for the northeast. The site is a compass that always points northeast and turns toward whatever you point at | Four years as a git history: semesters are branches, projects merge into main | The person as `v0.9-rc`: changelog of skills, known issues, ships July 2027 |
| Anchor | the literal meaning of the name | studies CS | final year of the degree |
| Signature | a needle on a spring that swings to the pointer and to hovered links, then settles back on 045° | the graph draws itself on scroll | a build log that compiles the hero |
| Screenshot | the huge dial with the red needle on NE, "ISHAN" across the bottom | the branching graph | terminal frame |
| O / F / Fe / P | 5 / 5 / 4 / 1 | 2 / 3 / 4 / 5 | 3 / 4 / 5 / 3 |

**Pick A.** It only works for someone called Ishan, it gives a whole rule system (diagonals, bearings, needle physics), and it has
a quiet honest reading for a student: a direction, not a track record yet.
Steal from C for copy tone only (the "0 internships" line, ships in 2027).

```
Idea:        Ishan means northeast. The site is a compass: it always points northeast, and it turns toward whatever you point at.
Metaphor:    a hand compass: dial, magnetic needle, bearings in degrees, headings.
Signature:   the needle (hero dial + the compass logo in the header) is pulled by the pointer and by any hovered/focused
             project or CTA, swings with real spring physics, and settles back on 045°. The header readout shows the live bearing
             and names what it points at. Implemented as one driver module: src/motion/compass.ts.
Emotion:     the click of a compass settling: calm, precise, a little playful.
Motion verb: swing and settle. Things travel northeast: enter from the lower left, leave to the upper right.
Screenshot:  the hero: a 60vh dial, red needle on NE, ईशान at the NE mark, "ISHAN" set expanded across the bottom.
```

## Art direction

**Palette** (a baseplate compass: printed black scale on pale acrylic, one red needle)
- `ground` #EDEEEA, "chart": cool paper white, not cream
- `ink` #121315, "graphite"
- `muted` #575B61, secondary text (6.1:1 on ground)
- `line` rgb(18 19 21 / 0.14), hairlines and dial ticks
- `accent` #C4221A, "needle red", only the needle's north half, the NE mark and the focus ring. Never body text.
- `curtain` = ink. Footer is an ink field with ground text.
Red on near-black/near-white is close to an AI default; here it is literal: compass needles are red at the north end.

**Type:** Archivo variable (wdth 62 to 125, wght 100 to 900), one family, two personalities.
- Display: wdth 125, wght 800, uppercase only for the name and project titles, tracking -0.045em, leading 0.82.
- Headings: wdth 112, wght 650, sentence case, tracking -0.03em.
- Text: wdth 100, wght 400, 17 to 18 px, leading 1.55. UI: 13 to 14 px, wght 500.
- Bearings and years: tabular figures.
- Accent: Anek Devanagari 800 (subset to the four glyphs of ईशान), only for the name in Devanagari.

**Grid:** 12 columns, fluid gutter. Hang lines at column 1, 5 and 9. Compositions run from the lower left (SW) to the
upper right (NE): titles anchor bottom-left, meta sits top-right, pipeline figures climb to the right.
Section rhythm: hero full viewport, statement airy (28u), work normal (16u), facts tight (8u), footer full.

**Shape:** zero radius everywhere. The only circles on the site are compass dials.

**Motion language:** engine `ease.out` (expo.out) for entrances, `ease.inOut` for curtains. Reveals rise and drift right
(from the southwest). The needle never tweens: it is a damped spring (k 70, c 8.5, about 0.5 damping ratio) so every move
overshoots once and settles. Page transition: an ink band sweeps diagonally from the SW corner to the NE corner, carrying
the destination's name; the needle gets a kick and resettles on the new page.

**Interaction treatments (one per role)**
- Primary (project rows, CTAs, next project): ink floods diagonally from the bottom-left corner, the arrow leaves to the NE and
  comes back from the SW, and the compass needle swings to point at the target while the readout names it.
- Nav: diagonal roll (label exits NE, copy enters from SW); current page keeps an underline.
- Inline links: underline at rest that thickens.
- Utility (footer socials): underline draws.

**Idle state:** the needle never fully freezes. A slow two-sine sway of about 1° (a real needle trembles) runs on the GSAP
ticker; the readout digits follow. Off under reduced motion (needle fixed at 045°).
Inner pages: every section label is a waypoint, a small compass whose needle turns toward the text beside it with a
live bearing. Case-study hero figures run their own system at rest (the bus laps the route, Raft heartbeats, the type
checker walking the tree, a radar-style forecast loop). The About hero shows the live header bearing.

**Composition plan**
```
HOME
[hero / poster]   Ishan◎ 045.0° NE ................ Work About Contact
                  intro text (col 1-4)        ( DIAL, needle NE, ईशान at NE )
                  ISHAN ISHAN ISHAN (full width, expanded, bottom)
                  class of 2027                        See the work ↗
[index list]      Work (h2)
                  Pluvial ........ one line ........ Major project 2026 ↗
                  Shuttle / Tarka / Quorum
[facts]           7 of 8 | 4 | 0   tiny labels
[footer finale]   ink field: "Point me somewhere." + giant email + links

CASE  hero: live project diagram (cols 1-7) + meta and summary (cols 9-12), TITLE across the bottom
      figure: pipeline steps climbing NE (phone: vertical with indents)
      problem / idea / outcome: waypoint compass in the label column, text cols 5-11
      in numbers: real metrics from the résumé as display numerals, ruled rows
      next project: full-width flood row
ABOUT statement hero with live heading, then education / toolbox / certifications / looking for / elsewhere / colophon,
      each a waypoint row; lists set as ruled display type
404   the needle spins with nothing to point at: "Off the map."
```

**Genericness test.** A generic model given "portfolio for a CS student" lands on: dark terminal theme, mono everywhere,
typing animation, skill bars, a projects card grid. Changed: light chart palette, one grotesk family at extremes,
no skill bars (an honest toolbox list), projects as an index list, code only inside case studies where it is evidence.
Also rejected the "up and to the right growth chart" reading of northeast: the diagonal is a bearing, not a graph.

**Explainer figure:** each case study has one "how it works" pipeline figure (inline, from data). The `anatomy` skill is not
installed; the figures are built by hand.

**Theatre:** a first-visit loader (ink field, bearing counter 000° → 045°), no WebGL. Timed from navigation start; if the
script boots after 1.2 s (slow phone) it skips the count and only sweeps away, so it never exceeds 2.6 s.
