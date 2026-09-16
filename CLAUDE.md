# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

VELLARO — a single-page portfolio landing site for a fictional premium home-cinema seating brand (Next.js/React/TypeScript/Tailwind, content in Ukrainian). It is one long `page.tsx` composed of section components, not a multi-page app. Full concept, copy, and section-by-section brief live in `PROJECT.md` — read it before making content or structural changes; it documents the target 10-block structure and the reasoning behind it (e.g. why the product catalog is section 2, not deeper in the page).

**In-progress repositioning (not yet applied to code):** `REPOSITIONING.md` is a working log of a decision, still pending, to pivot the site's niche from home-cinema seating to custom closet/wardrobe storage systems, keeping the page structure and mostly the code as-is but rewriting copy, photos, and possibly brand name/accent color. Check it before assuming current copy/branding is final, and update it as decisions land.

## Commands

- `npm run dev` — start dev server (Turbopack via Next 16)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — typecheck only (no dedicated test suite exists in this repo; this is the standard verification step used alongside manual browser checks)

No test runner is configured. Verify UI changes by running the dev server and checking in a browser (this project's history uses the `claude-in-chrome` MCP tool for that) rather than assuming a green typecheck means the feature works.

## Architecture

- `src/app/page.tsx` — the entire site is one composition of section components rendered in order inside `<main>`. To reorder/add/remove a section, edit this file; each section is a self-contained component in `src/components/`. Current order: `StackedIntro` (wrapping `Hero` + `CreateForYouSection`), `CatalogSection`, `PanoramaSection`, `PortfolioSection`, `TechnologySection`, `ProcessSection`, `ProcessFinaleSection`, `ProductionSection`, `TestimonialsSection`, `FaqSection`, `ContactSection`, then a second `PanoramaSection` call (different image, `title={null}`) before `Footer`.
- `src/components/*Section.tsx` — one file per landing-page block. `Header` and `IntroOverlay`/`StackedIntro` are page chrome/intro, not content sections. `PanoramaSection` is reused twice with different props (see above), and `images.ts` is the only place that needs updating to swap either panorama's photo.
- `src/components/ui/` — reusable pieces adapted from 21st.dev-sourced components (e.g. `testimonial.tsx`, `interactive-accordion.tsx`, `timeline-animation.tsx`). When integrating a new 21st.dev component, recolor it to the site's brand palette (CSS vars below) — these components often ship with generic shadcn color variables (`var(--foreground)`, etc.) that don't exist in this project.
- `src/lib/images.ts` — single source of truth for all image paths (`public/...`) and remote placeholder URLs, grouped by section (`images.catalog`, `images.portfolio`, `images.production`, etc.), plus `mosaicImages` used by the intro animation. Add new image assets here rather than inlining paths in components.
- `src/lib/mosaicLayout.ts` — layout math for the intro mosaic grid.
- Animation stack: **GSAP + ScrollTrigger** drives scroll-linked effects (parallax, the stacking-cards effect in `ProcessSection.tsx`, reveal-on-scroll in `ProductionSection.tsx`), **framer-motion** is used for simpler mount/interaction animations. Components using either must be `"use client"` and register GSAP plugins once (`gsap.registerPlugin(ScrollTrigger)`) inside the module, with effects set up in `useEffect` via `gsap.context(...)` and torn down on cleanup.
- Styling: Tailwind v4 (`@import "tailwindcss"` in `globals.css`, no `tailwind.config` — theme tokens are declared inline via `@theme inline` in `src/app/globals.css`). Brand palette is `--color-cream`, `--color-cream-dim`, `--color-ink`, `--color-brown-950/900/800/700/500/300`; use these tokens instead of arbitrary hex values or default Tailwind grays.
- Path alias: `@/*` → `src/*`.

## Scroll-driven "stacking panels" pattern

`ProcessSection.tsx` implements a reusable-looking but currently one-off pattern: full-viewport panels in normal document flow, each riding up over the previous one via a synchronized GSAP `y`-transform (see `OVERLAP_VH` constant and per-panel `ScrollTrigger`s keyed off the first panel's start). Known gotcha already fixed once: the **last** panel must not receive the same "ride up and get covered" treatment as interior panels (condition `i > 0 && i < TOTAL_PANELS - 1`), otherwise it exits the viewport before the next real section arrives, leaving a visible gap. Reuse this pattern (rather than reinventing it) if another section needs the same stacked-scroll effect.

## Known environment quirk (debugging note)

If GSAP ScrollTrigger scrub animations appear frozen while driving the page through the `claude-in-chrome` browser automation tool, check `document.hidden` in the console first — a background/inactive automated tab can cause Chrome to pause `requestAnimationFrame`, stalling GSAP's ticker even though the underlying trigger state (`start`/`end`/`progress`, checkable via a forced `ScrollTrigger.update()`) is correct. This is a test-environment artifact, not necessarily a real bug — confirm with an actual manual scroll before changing animation logic.
