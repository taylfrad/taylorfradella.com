# taylorfradella.com

Personal portfolio built with React + Vite, featuring a shader-based hero background, a physics-driven 3D lanyard, animated project previews, and a project detail experience.

## Tech Stack

- React 18
- Vite
- React Router 6 (`BrowserRouter`)
- Tailwind CSS (with CSS variables)
- Framer Motion
- Three.js + React Three Fiber + Drei + Rapier (lanyard/3D interactions)
- OGL (hero shader background)
- Lucide icons
- shadcn-style primitives (`Button`, `Slot`, shared `sx` wrappers)

## Current App Structure

- Route `/`:
  - `Hero`
  - `Skills`
  - `Projects`
  - `Footer`
- Route `/project/:id`:
  - `ProjectDetail`
  - Uses the same particle treatment as post-hero sections
  - Supports screenshot carousel/lightbox and rich project metadata

Entrypoints:

- [src/main.jsx](/c:/Users/taylo/source/repos/taylorfradella.com/src/main.jsx)
- [src/App.jsx](/c:/Users/taylo/source/repos/taylorfradella.com/src/App.jsx)

## Visual / Motion System

- Theme is fixed to dark mode.
- Effects can be reduced using `ModeToggle`.
- `ThemeProvider` combines:
  - OS `prefers-reduced-motion`
  - User-controlled `reduce-effects` toggle (persisted in `localStorage`)
- Hero background:
  - `HeroBackground` lazy-loads `Balatro` (OGL)
  - falls back to static gradients
  - disables heavy effects when reduced effects are active
- Selective glass styling is done with local surface components:
  - `GlassSurface`
  - `GlassFallback`

## 3D / Animated Components

- `Lanyard` is a procedural + physics-driven 3D component used in Hero and project preview contexts.
- `Projects` includes animated preview cards for:
  - Personal Portfolio
  - Lions Den Cinemas
  - SweetSpot
  - Workly
- `ProjectDetail` supports:
  - image optimization wrapper (`OptimizedImage`)
  - swipe/keyboard-enabled carousels
  - fullscreen lightbox behavior

## Routing Notes

The app uses `BrowserRouter` and includes a GitHub Pages SPA fallback:

- `npm run build` outputs `dist/index.html`
- `npm run postbuild` runs [scripts/copy-404.js](/c:/Users/taylo/source/repos/taylorfradella.com/scripts/copy-404.js)
- `dist/404.html` is a copy of `index.html` for SPA route rehydration on GitHub Pages

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run preview` - preview local build
- `npm run preview:prod` - build + preview on port `4173`
- `npm run lint` - ESLint checks
- `npm run optimize-images` - convert PNG assets to WebP via Sharp
- `npm run deploy` - publish `dist` to GitHub Pages (`gh-pages`)

## Local Development

1. Install dependencies:
   `npm install`
2. Start dev server:
   `npm run dev`
3. Open:
   `http://localhost:5173`

## Build and Deploy

1. Build:
   `npm run build`
2. Deploy to GitHub Pages:
   `npm run deploy`

The `homepage` field in [package.json](/c:/Users/taylo/source/repos/taylorfradella.com/package.json) is configured for `https://taylorfradella.com`.
