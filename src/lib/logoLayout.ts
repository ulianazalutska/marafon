// Shared by Header (permanent scroll-driven hero→header position) and
// IntroOverlay (its one-shot arrival animation) so the intro's typed
// wordmark always lands exactly on top of Header's real logo — required
// for the handoff between them to read as one continuous object rather
// than a cut from one element to another.
export function getHeroLogoLayout(viewportWidth: number, viewportHeight: number) {
  const fontSize = viewportWidth * 0.135;
  const left = viewportWidth * 0.086;
  const top = viewportHeight - fontSize;
  const trackingRatio = 0.18;
  return { fontSize, left, top, trackingRatio, tracking: fontSize * trackingRatio };
}
