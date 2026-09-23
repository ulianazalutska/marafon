// Shared between IntroOverlay (dispatcher) and Hero/Header (listeners) so
// their entrance animations can start exactly when the intro overlay is
// gone — on first load, once its GSAP timeline completes; on repeat visits
// within the same session, immediately (the overlay never mounts visibly).
export const INTRO_SEEN_KEY = "vellaro-intro-seen";
// Fires when the whole overlay is gone (nav links + Hero's side texts wait
// for this).
export const INTRO_DONE_EVENT = "vellaro:intro-done";
// Fires earlier, the instant the intro's typed wordmark finishes morphing
// into Header's hero-logo position/size/color — Header's own (until then
// invisible) logo can pop in right then with zero animation of its own,
// since by that moment it's pixel-identical to what's already on screen.
export const LOGO_ARRIVED_EVENT = "vellaro:logo-arrived";
// Where StackedIntro stashes scrollY across a reload — see its own comment
// for why the browser's native scroll restoration can't be trusted here.
export const SCROLL_Y_KEY = "vellaro-scroll-y";
