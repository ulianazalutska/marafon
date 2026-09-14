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

  // Один прогрес-колір (світлий над темним hero → темний над світлим
  // контентом) — використовується і для лого, і для лінків/кнопки.
  const progressColor = useTransform(
    scrollY,
    [0, threshold],
    ["#faf6f0", "#1c140d"]
  );
  const progressColorInverse = useTransform(
    scrollY,
    [0, threshold],
    ["#1c140d", "#faf6f0"]
  );

  const uiColor = scrollingUp ? "#faf6f0" : progressColor;
  const ctaBg = scrollingUp ? "#faf6f0" : progressColor;
  const ctaText = scrollingUp ? "#1c140d" : progressColorInverse;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-20 transition-colors duration-300 ${
        scrollingUp ? "bg-brown-900" : "bg-transparent"
      }`}
    >
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
              color: uiColor,
              WebkitTextStrokeWidth: strokeWidth,
              WebkitTextStrokeColor: uiColor,
            }}
            className="pointer-events-none text-center text-xl leading-none font-light tracking-[0.3em] whitespace-nowrap"
          >
            VELLARO
          </motion.p>
        </div>

        <div className="flex items-center gap-5">
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
          <motion.a
            href="#contact"
            style={{ backgroundColor: ctaBg, color: ctaText }}
            className="rounded-full px-5 py-2 text-sm tracking-wide transition-opacity hover:opacity-90"
          >
            Підібрати крісла
          </motion.a>
        </div>
      </div>
    </header>
  );
}
