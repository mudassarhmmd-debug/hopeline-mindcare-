# HopeLine MindCare

A front-end foundation for a mental health self-assessment platform, built with React + Vite.

Currently included: homepage, persistent emergency-help banner/modal, and a full PHQ-9
(depression screening) flow — intro, questions with progress bar, scoring, severity
interpretation, and report actions. Light/dark mode and an English/Urdu (RTL) toggle
are both wired up. This is a starting foundation, not the full platform described in
the original brief — see "What's not in here yet" below.

This is a self-assessment / educational screening tool only. It does not diagnose,
treat, or replace evaluation by a licensed clinician.

## Requirements

- Node.js 18 or later (Node 20 recommended)
- npm 9 or later

Check your versions:

```bash
node -v
npm -v
```

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

This outputs a static site to the `dist/` folder. Preview it locally with:

```bash
npm run preview
```

## Project structure

```
hopeline-mindcare/
├── index.html            # Vite entry HTML (loads src/main.jsx)
├── package.json
├── vite.config.js
├── vercel.json            # SPA rewrite rule for Vercel
├── netlify.toml            # Build command + SPA redirect for Netlify
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── main.jsx           # React root, mounts <App />
    ├── index.css          # Global styles / font import
    └── App.jsx            # Entire app: header, home page, PHQ-9 flow, footer
```

`App.jsx` is intentionally one file for now — it's structured into clearly named
components (`Header`, `Home`, `Assessment`, `EmergencyBanner`, etc.) inside that file
so it's easy to split into `src/components/*.jsx` as the project grows.

## Deploy — Vercel (free tier)

**Option A: via GitHub (recommended)**
1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com → New Project → import the repo.
3. Framework preset: Vite (auto-detected). Build command `npm run build`, output
   directory `dist` (auto-filled).
4. Click Deploy. You'll get a live `*.vercel.app` URL.

**Option B: via CLI**
```bash
npm install -g vercel
vercel login
vercel        # first deploy, follow prompts
vercel --prod # promote to production
```

## Deploy — Netlify (free tier)

**Option A: via GitHub**
1. Push this folder to a new GitHub repository.
2. Go to https://app.netlify.com → Add new site → Import an existing project.
3. Build command `npm run build`, publish directory `dist` (already set in
   `netlify.toml`).
4. Click Deploy site.

**Option B: drag and drop**
```bash
npm run build
```
Then drag the generated `dist/` folder onto https://app.netlify.com/drop.

**Option C: via CLI**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --build          # draft deploy
netlify deploy --build --prod   # production deploy
```

## What's not in here yet

This repo covers the front-end shell and one working assessment (PHQ-9). It does not
yet include: the other 18 assessments, a backend/API, database, authentication,
user dashboard with real data, mood tracker persistence, blog/CMS, therapist
directory, appointment booking, admin panel, or AI chatbot — those need a server,
a database, and (for the clinical instruments and health-data handling) a legal/
compliance review before going live. Ask for the next piece and it can be built
the same way this one was.

## License / clinical note

The PHQ-9 item text used here is a public-domain instrument. Some other screening
tools referenced in the broader project brief (e.g. certain PTSD or ADHD scales)
have publisher licensing terms — check those before adding them to a live product.
