// Below-the-fold sections' GSAP/ScrollTrigger setup (gsap.context + its
// ScrollTrigger.create calls) reads geometry (getBoundingClientRect etc.)
// the instant it runs. Running that synchronously in useEffect means it
// fires during the very first paint pass, for every below-fold section at
// once — forced reflow + main-thread work competing with the browser for
// exactly the moment it wants to paint the LCP hero photo, even though none
// of this is visible or interactive yet (the user hasn't scrolled near it).
// Deferring the setup to requestIdleCallback lets the browser finish its
// initial paint first; ScrollTrigger's own scroll-position check still
// applies once the callback runs, so nothing about the animations
// themselves changes — only when the setup cost is paid.
//
// Safari has no requestIdleCallback — setTimeout is the standard fallback.
// The `timeout` option is a ceiling (not a delay): if the browser stays
// busy, the callback still fires by then rather than starving forever.
export function runWhenIdle(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 1000 });
    return () => window.cancelIdleCallback(id);
  }

  const id = setTimeout(callback, 200);
  return () => clearTimeout(id);
}
