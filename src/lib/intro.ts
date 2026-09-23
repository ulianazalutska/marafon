// Shared between IntroOverlay (dispatcher) and Hero/Header (listeners) so
// their entrance animations can start exactly when the intro overlay is
// gone — on first load, once its GSAP timeline completes; on repeat visits
// within the same session, immediately (the overlay never mounts visibly).
export const INTRO_SEEN_KEY = "armadero-intro-seen";
// Fires when the whole overlay is gone (nav links + Hero's side texts wait
// for this).
export const INTRO_DONE_EVENT = "armadero:intro-done";
// Fires earlier, the instant the intro's typed wordmark finishes morphing
// into Header's hero-logo position/size/color — Header's own (until then
// invisible) logo can pop in right then with zero animation of its own,
// since by that moment it's pixel-identical to what's already on screen.
export const LOGO_ARRIVED_EVENT = "armadero:logo-arrived";
// Where StackedIntro stashes scrollY across a reload — see its own comment
// for why the browser's native scroll restoration can't be trusted here.
export const SCROLL_Y_KEY = "armadero-scroll-y";
// Set by Header right before a locale-switch reload, so Hero can play its
// entrance animation again on that one reload even though INTRO_SEEN_KEY is
// already set — without replaying the full IntroOverlay mosaic/logo sequence.
export const LANG_SWITCH_KEY = "armadero-lang-switch";
