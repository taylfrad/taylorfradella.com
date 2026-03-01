# taylorfradella.com

Portfolio site built with Vite + React 18 + React Router.

## Stack

- React 18
- React Router 6
- Tailwind CSS + shadcn/ui primitives
- `liquid-glass-react` for selective glass surfaces
- `ogl` for the Balatro hero shader

## Theme

- CSS-variable theming with `.dark` overrides in `src/styles/globals.css`
- Default theme is `dark` on first load
- User theme choice is persisted in `localStorage`
- Theme/effects controls are in the navbar (`ModeToggle`)

## Effects and Accessibility

- Glass is applied selectively (hero navbar/panel, cards) via `GlassSurface`
- `GlassSurface` auto-falls back to `GlassFallback` when reduced effects are active
- `prefers-reduced-motion` is respected
- "Reduce Effects" can be toggled from the appearance menu

## Hero Background

- Balatro shader is loaded only for the hero page path (`/`) through lazy imports
- `HeroBackground` uses `React.lazy` + `Suspense` with a static gradient fallback
- If reduced motion/effects is enabled, Balatro is not mounted

## GitHub Pages Routing

This project uses `BrowserRouter` with a static SPA fallback file.

- `npm run build` creates `dist/index.html`
- `npm run postbuild` runs `scripts/copy-404.js` to copy `index.html` to `dist/404.html`
- GitHub Pages serves `404.html` for unknown paths, allowing React Router to rehydrate and route client-side

## Scripts

- `npm run dev`
- `npm run lint`
- `npm run build`
- `npm run deploy`
