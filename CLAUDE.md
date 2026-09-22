# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## What this is

ARMADERO — a single-page portfolio landing site for a fictional premium custom closet/wardrobe storage-systems brand (Next.js/React/TypeScript/Tailwind, content in Ukrainian). It is one long `page.tsx` composed of section components, not a multi-page app. `PROJECT.md` documents the *original* home-cinema-seating concept and section-by-section brief (target 10-block structure and the reasoning behind it, e.g. why the product catalog is section 2) — the page structure it describes is still accurate, but its copy/niche is not; treat it as structural, not content, reference.

**Repositioning status:** `REPOSITIONING.md` is a working log from a 2026-09-15 decision to pivot the site from home-cinema seating to wardrobe/closet systems. That pivot has since been carried out in code — brand name is Armadero, copy/photos are wardrobe-specific, and the base palette moved to a white background (see `globals.css` below) — but the log file itself was never updated afterward and still describes the pivot as pending/undecided (brand name and accent color "not finalized," "no code changes yet"). Don't trust its status checklist; treat it only as historical rationale for *why* the niche changed, and prefer reading the actual code for current state. Internal-only identifiers (e.g. `INTRO_SEEN_KEY = "vellaro-intro-seen"` in `src/lib/intro.ts`) still carry the old "vellaro" name — harmless since they're not user-visible, but don't take them as a sign the rename is incomplete.

## Commands

- `npm run dev` — start dev server (Turbopack via Next 16)
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint (flat config, `eslint-config-next` core-web-vitals + typescript)
- `npx tsc --noEmit` — typecheck only (no dedicated test suite exists in this repo; this is the standard verification step used alongside manual browser checks)

No test runner is configured. Verify UI changes by running the dev server and checking in a browser (this project's history uses the `claude-in-chrome` MCP tool for that) rather than assuming a green typecheck means the feature works.

## Architecture

- `src/app/page.tsx` — the entire site is one composition of section components rendered in order inside `<main>`. To reorder/add/remove a section, edit this file; each section is a self-contained component in `src/components/`. Current order: `StackedIntro` (wrapping `Hero` + `CreateForYouSection`), `CatalogSection`, `PanoramaSection` (`title={null}`), `PortfolioSection`, `TechnologySection`, `ProcessSection`, `ProcessFinaleSection`, `ProductionSection`, `TestimonialsSection`, `FaqSection`, `ContactSection`, `Footer`.
- `src/components/*Section.tsx` — one file per landing-page block. `Header` and `IntroOverlay`/`StackedIntro` are page chrome/intro, not content sections. `PanoramaSection` takes an optional `title` prop and an image (via `images.ts`) so it can be reused for other panorama placements without code changes.
- `src/components/ui/` — reusable pieces adapted from 21st.dev-sourced components (e.g. `testimonial.tsx`, `interactive-accordion.tsx`, `timeline-animation.tsx`). When integrating a new 21st.dev component, recolor it to the site's brand palette (CSS vars below) — these components often ship with generic shadcn color variables (`var(--foreground)`, etc.) that don't exist in this project.
- `src/lib/images.ts` — single source of truth for all image paths (`public/...`) and remote placeholder URLs, grouped by section (`images.catalog`, `images.portfolio`, `images.production`, etc.), plus `mosaicImages` used by the intro animation. Add new image assets here rather than inlining paths in components.
- `src/lib/mosaicLayout.ts` — layout math for the intro mosaic grid. `src/lib/logoLayout.ts` (`getHeroLogoLayout`) computes the shared logo position/size so `IntroOverlay`'s typed-wordmark animation lands pixel-identical to `Header`'s real logo at handoff. `src/lib/intro.ts` holds the sessionStorage key and custom event names (`INTRO_DONE_EVENT`, `LOGO_ARRIVED_EVENT`) that `IntroOverlay` dispatches and `Header`/`Hero` listen for to gate their entrance animations to first load only.
- Animation stack: **GSAP + ScrollTrigger** drives scroll-linked effects (parallax, the stacking-cards effect in `ProcessSection.tsx`, reveal-on-scroll in `ProductionSection.tsx`), **framer-motion** is used for simpler mount/interaction animations (e.g. `ContactSection`'s submitted/success state swap). Components using either must be `"use client"` and register GSAP plugins once (`gsap.registerPlugin(ScrollTrigger)`) inside the module, with effects set up in `useEffect` via `gsap.context(...)` and torn down on cleanup.
- Styling: Tailwind v4 (`@import "tailwindcss"` in `globals.css`, no `tailwind.config` — theme tokens are declared inline via `@theme inline` in `src/app/globals.css`). Brand palette is `--color-cream` (white base), `--color-cream-dim`, `--color-ink`, `--color-brown-950/900/850/800/700/500/300`, `--color-accent` (`#af957c`, muted brass — the wardrobe-hardware-inspired CTA/accent color); use these tokens instead of arbitrary hex values or default Tailwind grays.
- Path alias: `@/*` → `src/*`.

## Scroll-driven "stacking panels" pattern

`ProcessSection.tsx` implements a reusable-looking but currently one-off pattern: full-viewport panels in normal document flow, each riding up over the previous one via a synchronized GSAP `y`-transform (see `OVERLAP_VH` constant and per-panel `ScrollTrigger`s keyed off the first panel's start). Known gotcha already fixed once: the **last** panel must not receive the same "ride up and get covered" treatment as interior panels (condition `i > 0 && i < TOTAL_PANELS - 1`), otherwise it exits the viewport before the next real section arrives, leaving a visible gap. Reuse this pattern (rather than reinventing it) if another section needs the same stacked-scroll effect.

## Known environment quirk (debugging note)

If GSAP ScrollTrigger scrub animations appear frozen while driving the page through the `claude-in-chrome` browser automation tool, check `document.hidden` in the console first — a background/inactive automated tab can cause Chrome to pause `requestAnimationFrame`, stalling GSAP's ticker even though the underlying trigger state (`start`/`end`/`progress`, checkable via a forced `ScrollTrigger.update()`) is correct. This is a test-environment artifact, not necessarily a real bug — confirm with an actual manual scroll before changing animation logic.
