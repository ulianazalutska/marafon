"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { LANG_SWITCH_KEY } from "@/lib/intro";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.45 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Вихід швидший за вхід (типове правило UX для оверлеїв): штора
// розкривається довше (0.65s), закривається помітно швидше (0.35s).
const panelVariants: Variants = {
  hidden: {
    clipPath: "inset(0% 0% 100% 0%)",
    transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] },
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 0.65, ease: [0.65, 0, 0.35, 1] },
  },
};

const LOGO_LETTERS = "ARMADERO".split("");
// Кожна літера — свій overflow-hidden контейнер (маска), що ховає надлишок
// висоти, поки внутрішній span зсунутий вниз і розтягнутий по вертикалі
// (scaleY(1.4) translateY(100%)). Відкриття меню знімає transform — літери
// одночасно "виїжджають" на місце і стискаються до нормальної висоти.
// Стагер по 15ms/літеру, стартуючи з 0.6s (щоб фон штори встиг розкритись).
function LogoReveal({ open }: { open: boolean }) {
  // LogoReveal лише монтується, коли open вже true (батько рендерить його
  // всередині `{open && (...)}`) — тобто на першому кадрі inline-стиль вже
  // застав би transform: none, і браузеру не було б із чого анімувати.
  // revealed стартує false і на наступному тіку переключається на true,
  // щоб дати браузеру зафіксувати "закритий" кадр перед стартом transition.
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setRevealed(open));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  return (
    <span className="flex overflow-hidden font-logo text-[30px] font-medium tracking-[0.08em] text-white">
      {LOGO_LETTERS.map((letter, i) => (
        <span key={i} className="inline-block overflow-hidden leading-none">
          <span
            className="inline-block leading-none"
            style={{
              transform: revealed ? "none" : "scaleY(1.4) translateY(100%)",
              transformOrigin: "bottom",
              transitionProperty: "transform",
              transitionDuration: "0.7s",
              transitionTimingFunction: "cubic-bezier(0.4, 0.5, 0.1, 1)",
              transitionDelay: revealed ? `${0.3 + i * 0.015}s` : "0s",
            }}
          >
            {letter}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const t = useTranslations("Header");
  const locale = useLocale();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000`;
    sessionStorage.setItem(LANG_SWITCH_KEY, "true");
    window.location.reload();
  };

  useEffect(() => {
    if (!open) return;
    // Скрол-контейнер тут — <html>, не <body> (globals.css лише глушить
    // overflow-x на html); блокування лише body лишало колесо миші й touch
    // здатними скролити сторінку крізь відкрите меню.
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[60] flex flex-col bg-ink px-6 pt-6 pb-8 min-[1067px]:hidden"
        >
          <div className="flex items-center justify-between">
            <LogoReveal open={open} />
            <button
              type="button"
              onClick={onClose}
              className="text-[19px] tracking-[0.02em] text-white transition-opacity hover:opacity-80"
            >
              {t("close")}
            </button>
          </div>

          <motion.nav
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="mt-16 flex flex-col gap-8"
          >
            {links.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                variants={itemVariants}
                className="text-[29px] font-medium tracking-[0.02em] text-white transition-opacity hover:opacity-80"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>

          <div className="mt-auto flex items-center justify-between text-white">
            <a
              href="tel:+380442001515"
              className="flex items-center gap-2 text-[17px] tracking-[0.02em] transition-opacity hover:opacity-80"
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
              +380 44 200 15 15
            </a>
            <div className="hidden items-center gap-1 text-[17px] tracking-[0.02em] max-[596px]:flex">
              <button
                type="button"
                onClick={() => switchLocale("uk")}
                aria-current={locale === "uk"}
                className={locale === "uk" ? "opacity-100" : "opacity-50 transition-opacity hover:opacity-100"}
              >
                UA
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => switchLocale("en")}
                aria-current={locale === "en"}
                className={locale === "en" ? "opacity-100" : "opacity-50 transition-opacity hover:opacity-100"}
              >
                EN
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
