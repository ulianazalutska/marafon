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
  const [scrollingUp, setScrollingUp] = useState(false);

  useEffect(() => {
    const setVh = () => setViewportHeight(window.innerHeight);
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
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
  const travel = Math.max(viewportHeight * 0.78 - 24, 260);

  const scale = useTransform(scrollY, [0, threshold], [9, 1]);
  const logoY = useTransform(scrollY, [0, threshold], [travel, 0]);
  // The stroke is meant to keep the small header-size logo (scale: 1)
  // crisp — at scale: 9 it's scaled up right along with the text and
  // reads as a heavy, bold outline, so it must be ~0 there instead.
  const strokeWidth = useTransform(scrollY, [0, threshold], [0, 1.2]);

  // Один прогрес-колір для лого й лінків — hero тепер світлий (не темний
  // кінозал), тож і над hero, і над білим контентом текст лишається темним
  // (#362f2b), просто трохи глибшає до #1c140d, коли сторінка проскролена.
  const progressColor = useTransform(
    scrollY,
    [0, threshold],
    ["#362f2b", "#1c140d"]
  );

  const uiColor = scrollingUp ? "#362f2b" : progressColor;

  // Лого й телефон з'являються в шапці лише після того, як прокручено
  // hero — на самому hero бренд вже показаний окремим написом ARMADERO
  // внизу секції, тож дублювати його великим по центру не потрібно.
  const chromeOpacity = useTransform(scrollY, [0, threshold * 0.4], [0, 1]);

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

        <div className="pointer-events-none fixed inset-x-0 top-0 flex h-20 items-center justify-center">
          <motion.p
            id="header-logo"
            style={{
              scale,
              y: logoY,
              opacity: chromeOpacity,
              color: uiColor,
              WebkitTextStrokeWidth: strokeWidth,
              WebkitTextStrokeColor: uiColor,
            }}
            className="pointer-events-none text-center font-logo text-xl leading-none font-light tracking-[0.3em] whitespace-nowrap"
          >
            ARMADERO
          </motion.p>
        </div>

        <div className="flex items-center gap-5">
          <motion.a
            href="tel:+380000000000"
            style={{ color: uiColor, opacity: chromeOpacity }}
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
