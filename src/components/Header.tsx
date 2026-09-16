"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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
  const [scrollingUp, setScrollingUp] = useState(false);

  useEffect(() => {
    const setViewport = () => {
      setViewportHeight(window.innerHeight);
      setViewportWidth(window.innerWidth);
    };
    setViewport();
    window.addEventListener("resize", setViewport);
    return () => window.removeEventListener("resize", setViewport);
  }, []);

  useEffect(() => {
    // lastY — це "зафіксована" точка відліку, вона зсувається лише коли
    // напрямок підтверджено (пройдено HYSTERESIS px). Порівняння з
    // попереднім event'ом (замість зафіксованої точки) на трекпадах/
    // інерційному скролі тремтить (+1/-1px між кадрами) і колір блимає.
    const HYSTERESIS = 8;
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      if (y <= 2) {
        // Біля самого верху скрол завжди трактуємо як "вгору" — інакше
        // пружний overscroll/незначний джиттер може випадково зчитатись
        // як рух вниз і колір зникне саме там, де він найпотрібніший.
        setScrollingUp(true);
        lastY = y;
      } else if (y < lastY - HYSTERESIS) {
        setScrollingUp(true);
        lastY = y;
      } else if (y > lastY + HYSTERESIS) {
        setScrollingUp(false);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Дистанція скролу, за яку лого доїжджає з hero в хедер — без pin,
  // без spacer, лише pure transform на одному елементі (дешево, не лагає).
  const threshold = Math.max(viewportHeight * 0.55, 320);

  // Лого — це той самий великий білий напис ARMADERO, що на hero (лівий
  // нижній кут, 14.5vw, tracking 0.18em): він і "їде" в хедер, а не окрема
  // копія, що з'являється поверх нього. Позиція/розмір інтерпольовані як
  // пікселі (не transform: scale) — так рядок лишається чітким на будь-
  // якому кроці й точно приземляється по центру h-20 шапки.
  const heroFontSize = viewportWidth * 0.145;
  const heroLeft = viewportWidth * 0.086;
  const heroTop = viewportHeight - heroFontSize * 1.1;
  const heroTracking = heroFontSize * 0.18;

  const headerFontSize = 20;
  const headerTracking = headerFontSize * 0.3;
  const headerWidth = 8 * headerFontSize * 0.9; // наближена ширина "ARMADERO" при цьому трекінгу
  const headerLeft = viewportWidth / 2 - headerWidth / 2;
  const headerTop = 40 - headerFontSize / 2;

  const logoFontSize = useTransform(scrollY, [0, threshold], [heroFontSize, headerFontSize]);
  const logoLeft = useTransform(scrollY, [0, threshold], [heroLeft, headerLeft]);
  const logoTop = useTransform(scrollY, [0, threshold], [heroTop, headerTop]);
  const logoTracking = useTransform(scrollY, [0, threshold], [heroTracking, headerTracking]);
  const logoColor = useTransform(scrollY, [0, threshold], ["#ffffff", "#362f2b"]);

  // Один прогрес-колір для навлінків/телефону — hero тепер світлий (не
  // темний кінозал), тож і над hero, і над білим контентом текст лишається
  // темним (#362f2b), просто трохи глибшає до #1c140d, коли сторінка
  // проскролена.
  const progressColor = useTransform(
    scrollY,
    [0, threshold],
    ["#362f2b", "#1c140d"]
  );

  const uiColor = scrollingUp ? "#362f2b" : progressColor;

  // Телефон з'являється в шапці лише після того, як лого доїхало на своє
  // місце — просте fade без зміни масштабу/позиції.
  const phoneOpacity = useTransform(scrollY, [0, threshold * 0.4], [0, 1]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-20 bg-transparent">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 md:px-10">
        <nav className="hidden items-center gap-8 text-sm tracking-wide md:flex">
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              style={{ color: uiColor }}
              className="opacity-80 transition-opacity hover:opacity-100"
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
          }}
          className="pointer-events-none fixed z-50 leading-none font-medium whitespace-nowrap font-logo"
        >
          ARMADERO
        </motion.p>

        <div className="flex items-center gap-5">
          <motion.a
            href="tel:+380000000000"
            style={{ color: uiColor, opacity: phoneOpacity }}
            className="hidden items-center gap-2 text-sm tracking-wide md:flex"
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
            className="hidden items-center gap-1 text-sm tracking-wide opacity-80 md:flex"
          >
            <button className="opacity-100">UA</button>
            <span>/</span>
            <button className="opacity-60 transition-opacity hover:opacity-100">
              EN
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
