# Arati Patil — Portfolio

Personal portfolio for **Arati Patil** — *Build. Lead. Create.*

A single-page React application built with Vite and TypeScript. Motion is driven
by GSAP, and the signature visuals (hero signal field, leadership sculpture,
skill constellation) are hand-written Canvas 2D + SVG — no 3D or animation
runtime beyond the existing dependencies.

## Tech stack

- **Vite** + **React 19** + **TypeScript**
- **GSAP** for motion
- Hand-written **Canvas 2D / SVG** for the interactive scenes
- `@fontsource` self-hosted fonts (Manrope, Space Grotesk)

No backend, database, or API — content is authored as typed data in
`src/content/` and `src/data/`.

## Requirements

- Node.js 18+ (developed on Node 24)
- npm

## Getting started

```bash
npm install
npm run dev      # start the Vite dev server
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run build` | Type-check, then build for production into `dist/` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
index.html            App entry
src/
  App.tsx             Page composition
  main.tsx            React bootstrap
  components/
    layout/           Site nav, mobile nav, footer
    sections/         Page sections (Hero, Work, About, Skills, Contact, …)
    ui/               Shared UI (cursor, reveal, section heading)
  experience/         Interactive scenes (canvas/SVG) + command palette
  hooks/              Reusable React hooks
  content/            Typed site content (profile, projects, roles, …)
  data/             Links and navigation data
  motion/             GSAP setup and motion tokens
  styles/             Design tokens and CSS
public/               Static assets (favicon, og image, project media)
```

## Notes

- The site is a client-rendered SPA; with JavaScript disabled it renders blank
  (expected for this architecture).
- Content data (`src/content/`) is the single source of truth for profile facts;
  items still awaiting confirmation are flagged in that data.

## Contact

- Email: aratipatil9380@gmail.com
- GitHub: https://github.com/aratipatil9380-max
- LinkedIn: https://www.linkedin.com/in/arati-patil-3a580b389
