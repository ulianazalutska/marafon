"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { motion, useScroll, useTransform } from "framer-motion";
import { INTRO_SEEN_KEY, INTRO_DONE_EVENT, LOGO_ARRIVED_EVENT } from "@/lib/intro";
import { getHeroLogoLayout } from "@/lib/logoLayout";

const links = [
  { href: "#catalog", label: "Каталог" },
  { href: "#portfolio", label: "Портфоліо" },
  { href: "#production", label: "Виробництво" },
  { href: "#contact", label: "Контакти" },
];

export default function Header() {
  const { scrollY } = useScroll();
  const [viewportHeight, setViewportHeight] = useState(900);
  const [viewportWidth, setViewportWidth] = useState(1440);

  // Gates the nav entrance: stays hidden while IntroOverlay is still
  // covering the page, then slides in once it's gone — but only on the
  // actual first-load intro. On repeat visits within the session there's no
  // intro to hand off from, so the nav should just sit in place with no
  // animation at all rather than replaying the slide-in on every reload.
  //
  // This is done imperatively via GSAP on a ref (like Hero.tsx's entrance
  // animations), not with framer-motion's declarative initial/animate: a
  // declarative `initial` prop is a mount-time-only decision, evaluated
  // once at first render — a value that depends on sessionStorage can't be
  // read early enough server-side, and correcting it client-side one render
  // later is already too late for `initial` to pick up, plus doing it via
  // a dynamic React-controlled style is a real server/client hydration
  // mismatch (proven by the Next.js hydration error this exact approach
  // triggered). GSAP acting on a ref sidesteps all of it: the rendered
  // markup never claims any particular opacity/position, so there's
  // nothing to mismatch, and hiding only ever happens as a deliberate,
  // skippable imperative step after mount.
  const navRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === "true") return;

    const targets = [navRef.current, langRef.current];
    gsap.set(targets, { opacity: 0, y: -20 });
    const reveal = () =>
      gsap.to(targets, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
    window.addEventListener(INTRO_DONE_EVENT, reveal, { once: true });
    return () => window.removeEventListener(INTRO_DONE_EVENT, reveal);
  }, []);

  // Gates the logo specifically: it stays invisible until the intro's own
  // typed wordmark finishes morphing into this exact spot/size/color (see
  // IntroOverlay + lib/logoLayout). At that instant the two are pixel-
  // identical, so popping this one in with no animation of its own is what
  // makes the handoff read as one continuous object instead of a swap.
  //
  // Unlike `nav` below, this starts at a plain `false` (matching SSR, no
  // hydration mismatch) and is corrected in an ordinary effect after mount:
  // safe here because it's a bare opacity flip with no `transition` — there
  // is no "locked-in at mount" animation decision for a later state update
  // to arrive too late for, so a one-frame-after-mount correction is
  // unnoticeable rather than a replayed animation.
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    const reveal = () => setLogoReady(true);
    if (sessionStorage.getItem(INTRO_SEEN_KEY) === "true") {
      reveal();
    } else {
      window.addEventListener(LOGO_ARRIVED_EVENT, reveal, { once: true });
    }
    return () => window.removeEventListener(LOGO_ARRIVED_EVENT, reveal);
  }, []);

  useEffect(() => {
    const setViewport = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    setViewport();
    window.addEventListener("resize", setViewport);
    return () => window.removeEventListener("resize", setViewport);
  }, []);

  // Дистанція скролу, за яку лого доїжджає з hero в хедер — без pin,
  // без spacer, лише pure transform на одному елементі (дешево, не лагає).
  // 0.85 — логотип має "доїхати" й стати на місце шапки саме тоді, коли
  // наступна секція (CreateForYouSection) заїхала на 85% дистанції пінінгу
  // Hero (StackedIntro пінить Hero на висоту viewportHeight).
  const threshold = Math.max(viewportHeight * 0.85, 320);

  // Лого — це той самий великий білий напис ARMADERO, що на hero (лівий
  // нижній кут, 14.5vw, tracking 0.18em): він і "їде" в хедер, а не окрема
  // копія, що з'являється поверх нього. Позиція/розмір інтерпольовані як
  // пікселі (не transform: scale) — так рядок лишається чітким на будь-
  // якому кроці й точно приземляється по центру h-20 шапки.
  const heroLogoLayout = getHeroLogoLayout(viewportWidth, viewportHeight);
  const heroFontSize = heroLogoLayout.fontSize;
  const heroLeft = heroLogoLayout.left;
  const heroTop = heroLogoLayout.top;
  const heroTrackingRatio = heroLogoLayout.trackingRatio;

  const headerFontSize = 27;
  // На маленькому розмірі (20px) той самий em-трекінг, що на величезному
  // hero-написі, виглядає розхлябано — літери надто дрібні для такого
  // проміжку. У шапці лого має бути компактним логотипом, тож тут
  // помітно менший коефіцієнт (0.08em), а не пропорція hero.
  const headerTrackingRatio = 0.08;
  const headerWidth = 8 * headerFontSize * 0.9; // наближена ширина "ARMADERO" при цьому трекінгу
  const headerCenterOffset = 100; // трохи правіше від точного центру шапки
  const headerLeft = viewportWidth / 2 - headerWidth / 2 + headerCenterOffset;
  const headerTop = 40 - headerFontSize / 2;

  const logoFontSize = useTransform(scrollY, [0, threshold], [heroFontSize, headerFontSize]);
  const logoLeft = useTransform(scrollY, [0, threshold], [heroLeft, headerLeft]);
  const logoTop = useTransform(scrollY, [0, threshold], [heroTop, headerTop]);
  // Трекінг інтерполюється як em-коефіцієнт (не сирі px): лінійна
  // інтерполяція двох крайніх px-значень трималась ближче до hero-
  // пропорції майже всю дистанцію й "стрибала" вузько лише в останні
  // кадри. Інтерполяція коефіцієнта тримає відносний проміжок між
  // літерами пропорційним fontSize на кожному кроці.
  const logoTrackingRatio = useTransform(
    scrollY,
    [0, threshold],
    [heroTrackingRatio, headerTrackingRatio]
  );
  // Framer Motion не додає "px" автоматично до letterSpacing (на відміну
  // від fontSize/width/top) — без явної одиниці браузер відкидає значення
  // як невалідне й трекінг лишається "замороженим" на дефолтному, тому тут
  // рядок формується вручну.
  const logoTracking = useTransform(
    () => `${logoFontSize.get() * logoTrackingRatio.get()}px`
  );

  // Білий оверлей (CreateForYouSection) насправді наїжджає на Hero ще ПІД
  // ЧАС пінінгу (0 → viewportHeight), а не після нього: pinSpacing:false
  // в StackedIntro означає, що поки Hero візуально "застряг", сторінка
  // далі скролиться і оверлей підповзає знизу, накриваючи Hero саме в цьому
  // діапазоні. Тому текст шапки має стати темним ДО того, як оверлей
  // дістанеться смуги хедера (headerHeight px від верху), інакше він
  // лишається білим на вже білому фоні секції під ним.
  const headerHeight = 80;
  const bgRangeStart = threshold + 100;
  // Діапазон в 1px замість плавного fade — колір/фон перемикаються
  // миттєво (без анімації-переходу), щойно scrollY проходить цю точку.
  const bgThreshold = bgRangeStart + 1;
  const textRangeStart = bgRangeStart;
  const textThreshold = bgThreshold;
  const uiColor = useTransform(
    scrollY,
    [textRangeStart, textThreshold],
    ["#ffffff", "#362f2b"]
  );

  // Лого лишається білим всю дорогу під час переїзду (воно на темному/
  // світлому Hero, але завжди поверх фотографії, тому білий колір читається
  // скрізь) і темніє лише синхронно з навтекстом — коли вже стоїть в шапці
  // й під ним реально білий фон наступної секції.
  const logoColor = uiColor;
  const headerBg = useTransform(
    scrollY,
    [bgRangeStart, bgThreshold],
    ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]
  );
  const phoneOpacity = useTransform(scrollY, [textRangeStart, textThreshold], [0, 1]);

  return (
    <motion.header
      style={{ backgroundColor: headerBg }}
      className="fixed inset-x-0 top-0 z-50 h-20"
    >
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-6">
        <nav
          ref={navRef}
          className="hidden items-center gap-8 text-[19px] tracking-[0.02em] md:flex"
        >
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              style={{ color: uiColor }}
              className="transition-opacity hover:opacity-80"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>

        <motion.p
          id="header-logo"
          style={{
            fontSize: logoFontSize,
            left: logoLeft,
            top: logoTop,
            letterSpacing: logoTracking,
            color: logoColor,
            opacity: logoReady ? 1 : 0,
          }}
          className="pointer-events-none fixed z-50 leading-none font-medium whitespace-nowrap font-logo"
        >
          ARMADERO
        </motion.p>

        <div ref={langRef} className="flex items-center gap-5">
          <motion.a
            href="tel:+380000000000"
            style={{ color: uiColor, opacity: phoneOpacity }}
            className="hidden items-center gap-2 text-[19px] tracking-[0.02em] md:flex"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="shrink-0"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            +380 00 000 00 00
          </motion.a>
          <motion.div
            style={{ color: uiColor }}
            className="hidden items-center gap-1 text-[19px] tracking-[0.02em] md:flex"
          >
            <button className="opacity-100">UA</button>
            <span>/</span>
            <button className="opacity-50 transition-opacity hover:opacity-100">
              EN
            </button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
