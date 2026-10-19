// All visible content lives here. Every fact comes from Ishan's résumé (public/ishan-sharma-resume.pdf).
// The project figures are labelled illustrations of how each system works, not screenshots.

export type Step = { label: string; note: string };
export type Detail = { stat: string; label: string; text: string };

export type Project = {
  slug: string;
  title: string;
  summary: string; // one sentence: what it is, for whom
  kind: string;
  role: string;
  stack: string[];
  status: string;
  pipeline: Step[]; // the "how it works" figure, read left to right
  context: string;
  idea: string;
  details: Detail[];
  outcome: string;
  repo: string;
  live?: string;
};

// Every internal URL goes through here: the site is served from /portfolio-v3/ on GitHub Pages.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const href = (path = '') => `${BASE}/${path.replace(/^\//, '')}`;

export const site = {
  name: 'Ishan Sharma',
  short: 'Ishan',
  devanagari: 'ईशान',
  role: 'Software engineer, backend and full-stack',
  url: 'https://alfredbateman.github.io/portfolio-v3',
  description:
    'Ishan Sharma is a final-year computer science student who builds and tests backend and full-stack software: four shipped projects, 1,000+ automated tests.',
  email: 'ishan.sh.1148@gmail.com',
  resume: 'ishan-sharma-resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/AlfredBateman' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ishansharma1247' },
  ],
  elsewhere: { label: 'Reject the null', href: 'https://alfredbateman.github.io/reject-the-null' },
};

export const projects: Project[] = [
  {
    slug: 'agentprobe',
    title: 'AgentProbe',
    summary: 'Regression testing for LLM agents: run each case again and again, judge the whole trace, and fail the build only when the change is real.',
    kind: 'Full-stack platform',
    role: 'Backend, statistics, dashboard and CI',
    stack: ['Python', 'FastAPI', 'Next.js', 'PostgreSQL', 'Docker', 'GitHub Actions'],
    status: 'Live on Vercel',
    pipeline: [
      { label: 'Test case', note: 'A task for the agent, with the tools it may call' },
      { label: 'Repeated runs', note: 'Ten runs per case in the shipped suites' },
      { label: 'Three judges', note: 'Rule-based, LLM rubric and consistency, on the full trace and tool calls' },
      { label: 'Statistics', note: 'Fisher exact per case, Tarone-Holm correction, paired sign-flip permutation test' },
      { label: 'Verdict on the PR', note: 'A comment on the pull request, and a failed build on a regression' },
    ],
    context:
      'LLM agents are flaky. The same case can pass on one run and fail on the next, so a suite that fails on any single bad run cries wolf, and people learn to ignore it.',
    idea:
      'Treat every case as an experiment. Run it repeatedly, judge the full trace and every tool call, then ask a statistical question: is the new version actually worse, or is this the agent’s usual noise?',
    details: [
      {
        stat: '70.6% → 0.9%',
        label: 'false regression alarms',
        text: 'Measured in simulation on unchanged flaky agents. The verdict statistics are computed in exact arithmetic.',
      },
      {
        stat: '1,145',
        label: 'pytest tests',
        text: 'Plus 184 web unit tests and 14 Playwright end-to-end specs, with 97% coverage on the core and the API.',
      },
      {
        stat: '3',
        label: 'judges per run',
        text: 'Rule-based, LLM-rubric and consistency judges read the whole trace and the tool calls, not only the final answer.',
      },
    ],
    outcome:
      'A FastAPI and PostgreSQL backend with JWT authentication, a Next.js dashboard, a CLI, an SSRF guard, and a GitHub Actions integration that comments on pull requests. CI/CD deploys it to Vercel, Render and Neon.',
    repo: 'https://github.com/AlfredBateman/AgentProbe',
    live: 'https://agent-probe-umber.vercel.app',
  },
  {
    slug: 'stockpilot',
    title: 'StockPilot',
    summary: 'A screener for about 100 NIFTY stocks that understands plain English, and keeps working when the network does not.',
    kind: 'Team project, full-stack',
    role: 'Team lead, team of two',
    stack: ['React', 'Node.js', 'Express', 'TypeScript', 'MongoDB Atlas', 'Render', 'GitHub Actions'],
    status: 'v1.2.0, live on Render',
    pipeline: [
      { label: 'Plain English', note: 'Type what you mean, typos included' },
      { label: 'Typo fixing', note: 'Words are corrected before anything parses them' },
      { label: 'Rule parser', note: 'Offline and deterministic: the floor search never drops below' },
      { label: 'Name search and LLM', note: 'Company names first, then a hosted model, schema-validated and cached' },
      { label: 'Results', note: 'With “why this matched”, and suggestions when nothing does' },
    ],
    context:
      'Screeners make you speak their language: dropdowns, field names, operators. Most people just want to type what they are looking for.',
    idea:
      'Put a deterministic rule parser at the bottom of the query pipeline, so search never depends on a network call. The hosted model only helps when the rules cannot, and its output is validated against a schema before it becomes a filter.',
    details: [
      {
        stat: '~100',
        label: 'NIFTY stocks',
        text: 'Filter, sort, search, watchlist, three-way compare and price-history metrics. A weekday GitHub Actions job refreshes end-of-day data into MongoDB Atlas, with a committed snapshot as the fallback.',
      },
      {
        stat: '80 / 81',
        label: 'parser expectations met',
        text: 'An 81-query evaluation harness checks the rule parser against self-authored expectations.',
      },
      {
        stat: '470+',
        label: 'Vitest unit tests',
        text: 'Plus “why this matched” explanations, and suggestions when a query matches nothing.',
      },
    ],
    outcome:
      'Released as v1.2.0 and deployed on Render. Answers are cached, and because the rule parser runs offline, search keeps working even when the hosted model does not answer.',
    repo: 'https://github.com/AlfredBateman/StockPilot',
    live: 'https://stockpilot-hw7d.onrender.com',
  },
  {
    slug: 'investorlens',
    title: 'InvestorLens',
    summary: 'A UX research workspace that links interviews to findings, personas and journey maps, with AI transcript analysis that has to show its quotes.',
    kind: 'Full-stack app',
    role: 'Design and build',
    stack: ['Next.js 16', 'TypeScript', 'Prisma', 'SQLite', 'Zod', 'Gemini API'],
    status: 'v1.0.0',
    pipeline: [
      { label: 'Transcript', note: 'An interview, linked to its study' },
      { label: 'Gemini extraction', note: 'Opt-in: up to 15 candidate pain points per transcript' },
      { label: 'Guards', note: 'Schema validation, verbatim quote checks, invalid finding IDs downgraded' },
      { label: 'Human approval', note: 'Nothing is saved until a person accepts it' },
      { label: 'One transaction', note: 'Approved findings land together, or not at all' },
    ],
    context:
      'Research notes sprawl. The link between what a participant actually said and the finding it supports gets lost, and once AI writes the summary, nobody can tell which quotes were real.',
    idea:
      'Model the whole study as linked records: interviews, findings, personas, journey maps and a recommendations board. Then make the AI propose, not write. Every quote is checked word for word against the transcript.',
    details: [
      {
        stat: '15',
        label: 'candidate pain points per transcript, at most',
        text: 'Each one is schema-validated, its quote must appear verbatim in the transcript, and invalid finding IDs are downgraded instead of trusted.',
      },
      {
        stat: '1',
        label: 'transaction per save',
        text: 'Approved findings are written in a single transaction, so a study is never left half updated.',
      },
      {
        stat: 'Every',
        label: 'Server Action validated',
        text: 'Zod checks every Server Action. URL-based filters, cross-entity search, a live dashboard and a printable report sit on top.',
      },
    ],
    outcome:
      'Released as v1.0.0 with a seeded sample study and a GitHub Actions pipeline that lints, type-checks, runs an AI self-check and builds.',
    repo: 'https://github.com/AlfredBateman/investorlens',
  },
  {
    slug: 'canvaslint',
    title: 'CanvasLint',
    summary: 'A Chrome DevTools extension that records every Canvas 2D call, replays it on a timeline, and lints it.',
    kind: 'Browser extension',
    role: 'Design and build',
    stack: ['TypeScript', 'React', 'Zustand', 'Vite', 'Chrome Manifest V3'],
    status: 'v1.1.0',
    pipeline: [
      { label: 'Page canvas', note: 'Any page drawing with Canvas 2D' },
      { label: 'Recorder', note: 'Every Canvas 2D call, captured as it happens' },
      { label: 'Per-frame batches', note: 'Grouped by frame, with a capped history per tab' },
      { label: 'DevTools timeline', note: 'Scrub to any frame and replay the command log, with a state inspector' },
      { label: 'Lint engine', note: 'Seven rules, plus export and import of recordings' },
    ],
    context:
      'Canvas is a black box. Once something is drawn there is no DOM to inspect, so when a frame looks wrong you are left guessing which of thousands of calls caused it.',
    idea:
      'Record the calls instead of the pixels. Batch them per frame, keep a capped history per tab, and give DevTools a timeline you can scrub, replaying the command log up to any point.',
    details: [
      {
        stat: '11.8 → <2 ms',
        label: 'worker CPU per page frame',
        text: 'With about 9% frame-time overhead on a 7,034-command benchmark page.',
      },
      {
        stat: '7',
        label: 'lint rules',
        text: 'A lint engine and a state inspector sit beside the timeline, and recordings can be exported and imported.',
      },
    ],
    outcome: 'Shipped as v1.1.0 on Manifest V3, with an end-to-end privacy test.',
    repo: 'https://github.com/AlfredBateman/CanvasLint',
  },
];

export const about = {
  education: {
    school: 'Chitkara University',
    degree: 'Bachelor of Engineering, Computer Science Engineering',
    place: 'Himachal Pradesh, India',
    when: 'Expected August 2027',
    core: ['Data structures and algorithms', 'Object-oriented programming', 'System design', 'Database management systems', 'Operating systems'],
  },
  toolbox: [
    { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'SQL'] },
    { group: 'Backend and databases', items: ['FastAPI', 'Node.js', 'Express.js', 'REST APIs', 'PostgreSQL', 'MongoDB', 'SQLite', 'Prisma ORM'] },
    { group: 'Frontend', items: ['React', 'Next.js', 'Zustand', 'Vite', 'Tailwind CSS', 'Chrome extensions (Manifest V3)'] },
    { group: 'DevOps and testing', items: ['CI/CD with GitHub Actions', 'Docker', 'Linux', 'AWS', 'Git', 'Unit, integration and end-to-end testing', 'Playwright', 'Vitest', 'pytest'] },
    { group: 'AI and LLMs', items: ['Gemini API', 'LiteLLM', 'Model Context Protocol (MCP)', 'LLM-agent evaluation', 'Schema validation with Zod'] },
  ],
  certifications: ['AWS Cloud Practitioner Essentials', 'AWS Cloud Quest', 'Nutanix NHCF', 'Infosys Springboard (Python, Testing)'],
  lookingFor:
    'A software engineer role, backend or full-stack. My projects lean the same way: typed APIs, real databases, CI on every push, and tests that catch a regression before anyone else does.',
};
