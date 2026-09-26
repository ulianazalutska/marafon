"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";
import { LANG_SWITCH_KEY } from "@/lib/intro";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.45 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
};

// Телефон/UA-EN з'являються останніми, вже після того як штора (0.65s)
// повністю розкрилась — інакше вони показувались на середині розкриття.
const footerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

// Вихід швидший за вхід (типове правило UX для оверлеїв): штора
// розкривається довше (0.65s), закривається помітно швидше (0.35s).
//
// Анімується лише фон-"штора" (окремий елемент нижче, transform-origin:
// top), а не сама панель з контентом: clip-path на весь екран — layout-
// важка властивість, яку мобільні браузери часто не композитять на GPU,
// через що при відкритті смикались NAV-пункти. scaleY — суто transform,
// завжди на GPU-шарі.
// Контент фейдиться лише на ВИХОДІ (швидше за 0.35s закриття штори —
// інакше він лишався б статично видимим, поки штора стискається, і
// зникав різким стрибком в останньому кадрі). На вході власної анімації
// немає (opacity 1 одразу): NAV-пункти вже мають свій стагер нижче
// (listVariants/itemVariants) — накладена поверх нього ще й власна
// затримана поява контейнера подвоювала фейд і виглядала як миготіння.
const contentVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2, ease: [0.65, 0, 0.35, 1] } },
  visible: { opacity: 1 },
};

const curtainVariants: Variants = {
  hidden: {
    scaleY: 0,
    transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] },
  },
  visible: {
    scaleY: 1,
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

export default function MobileMenu({ open, onClose, links, triggerRef }: MobileMenuProps) {
  const t = useTranslations("Header");
  const locale = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

    // Фон (решта сторінки) лишається в DOM під панеллю — без цього Tab і
    // скрін-рідер віртуальний курсор все одно потрапляють у контент, який
    // візуально повністю накритий меню.
    const mainEl = document.querySelector("main");
    const footerEl = document.querySelector("footer");
    // Гамбургер-кнопка та лишений видимим (597–1067px) UA/EN-перемикач
    // сидять поруч із самою панеллю меню як діти <header> — inert саме на
    // їхньому спільному батьківському div, а не на всьому <header>, бо
    // <MobileMenu> — сестринський елемент цього div, а не його нащадок:
    // inert на <header> зробив би inert і саму щойно відкриту панель.
    const triggerEl = triggerRef.current;
    const headerContentEl = triggerEl?.parentElement ?? null;
    [mainEl, footerEl, headerContentEl].forEach((el) => el?.setAttribute("inert", ""));

    // Фокус іде в панель одразу при відкритті (на кнопку закриття — перший
    // логічний пункт), а при закритті повертається на гамбургер-кнопку, що
    // відкрила меню: інакше клавіатурний фокус лишається "висіти" в
    // елементі, якого вже нема в акцесибіліті-дереві.
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      [mainEl, footerEl, headerContentEl].forEach((el) => el?.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
      triggerEl?.focus();
    };
  }, [open, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col px-6 pt-6 pb-8 min-[1067px]:hidden"
        >
          <motion.div
            variants={curtainVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{ transformOrigin: "top" }}
            className="absolute inset-0 -z-10 bg-ink"
          />

          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-1 flex-col"
          >
          <div className="flex items-center justify-between">
            <LogoReveal open={open} />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="text-[19px] tracking-[0.02em] text-white transition-opacity hover:opacity-80"
            >
              {t("close")}
            </button>
          </div>

          <motion.nav
            aria-label={t("nav.ariaLabel")}
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

          <motion.div
            variants={footerVariants}
            initial="hidden"
            animate="visible"
            className="mt-auto flex items-center justify-between text-white"
          >
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
                aria-hidden="true"
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
          </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
