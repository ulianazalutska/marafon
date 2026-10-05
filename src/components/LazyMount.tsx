"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { INTRO_SEEN_KEY, INTRO_DONE_EVENT } from "@/lib/intro";
import { runWhenIdle } from "@/lib/deferredEffect";

// Renders nothing (both on the server and on the client's first paint) until
// its wrapper div is within `rootMargin` of the viewport — at which point it
// mounts `children` for good (IntersectionObserver disconnects after the
// first hit, no need to track further). Since `visible` starts false on
// both server and client, the very first client render matches the SSR
// output exactly — no hydration mismatch — and because React never
// reconciles `children` into the tree before that, a below-fold section
// wrapped in this never triggers its `next/dynamic` import() (and the
// network fetch that comes with it) until it's actually about to be
// scrolled into view.
//
// Trade-off (accepted deliberately, see the LCP work this came out of): the
// wrapped section's content isn't in the initial server HTML at all, so a
// crawler that doesn't execute JS won't see it. Google does execute JS, and
// this site's SEO score was already 100 with nothing riding on that content
// being present pre-hydration.
//
// Попереднє монтування (premount нижче): монтаж секції — це import() чанка,
// рендер і GSAP-сетап, і коли він стається від IntersectionObserver, то
// завжди посеред скролу — на телефоні це помітний провал кадрів на кожній
// lazy-секції. Тому, щойно сторінка повністю завантажилась (load) і інтро
// закінчилось, решта секцій монтується заздалегідь — по одній, у порядку
// на сторінці, кожна в окремий idle-проміжок і лише коли користувач не
// скролить. LCP це не зачіпає (стартує після load), а IntersectionObserver
// лишається як був: доскролив раніше — секція монтується одразу.
const SCROLL_QUIET_MS = 300;

// Кожна ще не змонтована LazyMount тримає тут свою mount-функцію і сама
// прибирає її, щойно змонтувалась (хоч від черги, хоч від observer).
const premountQueue: Array<() => void> = [];
let premountStarted = false;

function startPremount() {
  if (premountStarted) return;
  premountStarted = true;

  let lastScrollTime = 0;
  const onScroll = () => {
    lastScrollTime = performance.now();
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  let mountedAny = false;
  const next = () => {
    const mount = premountQueue.shift();
    if (!mount) {
      window.removeEventListener("scroll", onScroll);
      // Секції вище за ContactSection/ProductionSection (вони не lazy і
      // свої тригери створили ще при завантаженні) щойно виросли з 1px до
      // повної висоти — без перерахунку їхні start/end лишились би від
      // старої, коротшої сторінки. refresh(true) — "safe" режим GSAP: якщо
      // зараз скролять, чекає scrollEnd.
      if (mountedAny) ScrollTrigger.refresh(true);
      return;
    }
    const sinceScroll = performance.now() - lastScrollTime;
    if (sinceScroll < SCROLL_QUIET_MS) {
      premountQueue.unshift(mount);
      setTimeout(() => runWhenIdle(next), SCROLL_QUIET_MS - sinceScroll);
      return;
    }
    mount();
    mountedAny = true;
    runWhenIdle(next);
  };

  const afterLoad = () => runWhenIdle(next);
  const afterIntro = () => {
    if (document.readyState === "complete") afterLoad();
    else window.addEventListener("load", afterLoad, { once: true });
  };
  // Десктопне інтро (IntroOverlay) — це ~2-3с GSAP-анімації; монтаж
  // посеред неї рвав би її кадри. INTRO_SEEN_KEY уже стоїть на телефоні
  // (інтро пропускається) і на повторних візитах.
  if (sessionStorage.getItem(INTRO_SEEN_KEY) === "true") afterIntro();
  else window.addEventListener(INTRO_DONE_EVENT, afterIntro, { once: true });
}

export default function LazyMount({
  children,
  rootMargin = "800px 0px",
}: {
  children: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Секція, яку швидким скролом (напр. кнопка → #contact) проскочили
        // повз rootMargin, лишається висотою 1px над вʼюпортом — і при
        // скролі назад її "пропускає". Тому монтуємо і все, що вже вище.
        const isAbove =
          !!entry && !!entry.rootBounds && entry.boundingClientRect.bottom < entry.rootBounds.top;
        if (entry?.isIntersecting || isAbove) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  // Реєстрація в черзі попереднього монтування. Ефекти сусідів виконуються
  // в порядку JSX, тож черга йде в порядку секцій на сторінці.
  useEffect(() => {
    if (visible) return;
    const mount = () => setVisible(true);
    premountQueue.push(mount);
    startPremount();
    return () => {
      const i = premountQueue.indexOf(mount);
      if (i !== -1) premountQueue.splice(i, 1);
    };
  }, [visible]);

  // minHeight: 1px — a 0×0 element is an unreliable IntersectionObserver
  // target (Chrome measured found it never fires for a genuinely empty
  // rect), so the wrapper needs *some* area even while empty.
  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : 1 }}>
      {visible ? children : null}
    </div>
  );
}
