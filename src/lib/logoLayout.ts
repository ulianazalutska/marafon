// Shared by Header (permanent scroll-driven hero→header position) and
// IntroOverlay (its one-shot arrival animation) so the intro's typed
// wordmark always lands exactly on top of Header's real logo — required
// for the handoff between them to read as one continuous object rather
// than a cut from one element to another.
let measureCanvas: HTMLCanvasElement | null = null;

// Only used to center the wordmark on the ≤1066 breakpoint — actual glyph
// widths vary enough (vs. a fixed 0.086 left offset) that centering needs
// the real rendered text width, not an estimate.
export function measureLogoWidth(fontSize: number, tracking: number): number | null {
  if (typeof document === "undefined") return null;
  measureCanvas ??= document.createElement("canvas");
  const ctx = measureCanvas.getContext("2d");
  if (!ctx) return null;
  const text = "ARMADERO";
  ctx.font = `500 ${fontSize}px Rajdhani, sans-serif`;
  return ctx.measureText(text).width + tracking * (text.length - 1);
}

// Шапкова (кінцева, компактна) позиція лого — та сама формула, що раніше
// жила прямо в Header.tsx. Винесена сюди, бо тепер на ≤596 це водночас і
// ЄДИНА позиція лого (hero-стан на цій ширині — це той самий header-стан,
// без "подорожі" знизу вгору, див. getHeroLogoLayout нижче).
export function getHeaderLogoLayout(viewportWidth: number) {
  const fontSize = viewportWidth <= 1066 ? 32 : 27;
  const trackingRatio = 0.08;
  const tracking = fontSize * trackingRatio;
  const width = measureLogoWidth(fontSize, tracking) ?? 8 * fontSize * 0.9;
  // На ≤596 UA/EN і телефон приховані — в шапці лишається тільки "Меню"
  // (притиснуте ml-auto праворуч), тож лого стоїть зліва (той самий
  // відступ, що й контейнер шапки, px-6 = 24px), а не по центру.
  // На 597-1066 лого по центру шапки; на ширших екранах — трохи правіше
  // від центру, щоб не тиснутись до правого блоку (телефон/UA-EN).
  const left =
    viewportWidth <= 596 ? 24 : viewportWidth / 2 - width / 2 + (viewportWidth <= 1066 ? 0 : 100);
  const top = 40 - fontSize / 2;
  return { fontSize, left, top, trackingRatio, tracking };
}

export function getHeroLogoLayout(viewportWidth: number, viewportHeight: number) {
  // На мобільному (≤596) немає місця для великого "мандрівного" напису —
  // лого одразу стоїть в шапці, без hero-стану й без анімації зі скролом
  // (Header інтерполює hero→header, а тут обидва кінці однакові — по суті
  // interpolation-noop). Тому hero-стан тут = header-стан.
  if (viewportWidth <= 596) {
    return getHeaderLogoLayout(viewportWidth);
  }

  const fontSizeRatio = viewportWidth <= 1066 ? 0.15 : 0.135;
  // Hero content lives in a max-w-[1600px] centered box on wide screens
  // (matches Header's container) so the wordmark doesn't keep growing
  // unbounded on ultra-wide monitors — sized/positioned off that capped
  // width, not the raw viewport, past 1600px.
  const effectiveWidth = Math.min(viewportWidth, 1600);
  const fontSize = effectiveWidth * fontSizeRatio;
  const top = viewportHeight - fontSize;
  const trackingRatio = 0.18;
  const tracking = fontSize * trackingRatio;

  const sideMargin = (viewportWidth - effectiveWidth) / 2;
  let left = sideMargin + effectiveWidth * 0.086;
  if (viewportWidth <= 1066) {
    const textWidth = measureLogoWidth(fontSize, tracking);
    if (textWidth !== null) {
      left = (viewportWidth - textWidth) / 2;
    }
  }

  return { fontSize, left, top, trackingRatio, tracking };
}
