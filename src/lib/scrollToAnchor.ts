// Нижні секції змонтовані ліниво (LazyMount, висота 1px), тож нативний якір
// #contact веде до позиції, яка ще не остаточна, і скрол зупиняється біля
// портфоліо. Тут скролимо одним рухом і щокадру перераховуємо позицію цілі —
// коли секції домонтовуються й форма зсувається вниз, скрол її наздоганяє.
const MIN_MS = 600;
const MAX_MS = 1400;
const MS_PER_1000PX = 180;
const MAX_TAIL_MS = 3000;

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function scrollToAnchor(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const targetY = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(Math.max(el.getBoundingClientRect().top + window.scrollY - pad, 0), max);
  };

  const startY = window.scrollY;
  const startTime = performance.now();
  const duration = Math.min(
    MAX_MS,
    Math.max(MIN_MS, (Math.abs(targetY() - startY) / 1000) * MS_PER_1000PX)
  );

  let raf = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("wheel", stop);
    window.removeEventListener("touchstart", stop);
    window.removeEventListener("keydown", stop);
  };

  const step = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const dest = targetY();
    const y = t < 1 ? startY + (dest - startY) * easeInOut(t) : dest;
    // html має scroll-behavior:smooth, тож "instant" обовʼязковий.
    window.scrollTo({ top: y, behavior: "instant" });

    const settled = t >= 1 && Math.abs(dest - window.scrollY) < 2;
    if (settled || elapsed > duration + MAX_TAIL_MS) return stop();
    raf = requestAnimationFrame(step);
  };

  // Користувач сам крутить сторінку — не боремося з ним.
  window.addEventListener("wheel", stop, { passive: true });
  window.addEventListener("touchstart", stop, { passive: true });
  window.addEventListener("keydown", stop);
  raf = requestAnimationFrame(step);
}
