"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://pinterest.com", label: "Pinterest" },
  { href: "https://tiktok.com", label: "TikTok" },
  { href: "https://facebook.com", label: "Facebook" },
];

export default function Footer() {
  const t = useTranslations("Footer");
  const footerLinks = [
    { href: "/#production", label: t("linkAbout") },
    { href: "/privacy", label: t("linkPrivacy") },
    { href: "/terms", label: t("linkTerms") },
  ];

  const introRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const newsletterHoneypotRef = useRef<HTMLInputElement>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [newsletterError, setNewsletterError] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          introRef.current,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );

        const cols = navRef.current ? Array.from(navRef.current.children) : [];
        gsap.fromTo(
          cols,
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            delay: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: navRef.current,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-cream text-ink">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-y-12 px-6 py-16 md:py-20 lg:flex-row lg:items-start lg:justify-between">
        <div ref={introRef} className="w-full lg:w-[520px] lg:shrink-0">
          <h2 className="relative text-[clamp(28px,5vw,45px)] leading-[1.2] font-normal tracking-[0.04em] text-brown-850">
            <span className="relative -ml-1 inline-block">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 -left-3 font-serif text-2xl text-accent select-none"
              >
                &#10077;
              </span>
              {t("headlinePrefix")}
            </span>
            <br />
            {t("headlineSuffix")}
            <span
              aria-hidden
              className="pointer-events-none ml-1 font-serif text-2xl text-accent select-none"
            >
              &#10078;
            </span>
          </h2>

          <ul className="mt-8 flex flex-col">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-[18px] leading-[42px] font-light tracking-[0.04em] text-brown-850 transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={navRef}
          className="flex flex-col flex-wrap gap-12 sm:flex-row sm:gap-[120px]"
        >
          <ul className="flex flex-col gap-[20px]">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[18px] font-light tracking-[0.04em] text-brown-850 transition-colors hover:text-ink"
                >
                  {s.label}
                  <span className="sr-only"> {t("opensInNewTab")}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="w-[192px] max-w-full text-ink">
            <p className="text-[16px] leading-[19px] font-light tracking-[0.04em] text-brown-850">
              {t("address")}
            </p>
            <p className="mt-[43px] text-[21px] font-medium tracking-[0em] text-brown-850">
              <a
                href="tel:+380442001515"
                className="block transition-opacity hover:opacity-80"
              >
                +380 44 200 15 15
              </a>
              <a
                href="mailto:hello@armadero.ua"
                className="mt-1 block transition-opacity hover:opacity-80"
              >
                hello@armadero.ua
              </a>
            </p>
          </div>

          <div className="w-[261px] max-w-full">
            <h3 className="text-[clamp(22px,3.5vw,30px)] leading-[1.15] font-normal tracking-[0.02em] text-brown-850">
              {t("newsletterHeading")}
            </h3>
            <p className="mt-2 text-[12px] font-light tracking-[0.04em] text-brown-850">
              {t("newsletterSubtitle")}
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (newsletterSending) return;
                // Honeypot: bots fill every field, real users never see or
                // touch this one — same field name the server checks for.
                if (newsletterHoneypotRef.current?.value.trim()) {
                  setNewsletterEmail("");
                  setNewsletterSent(true);
                  return;
                }
                setNewsletterSending(true);
                setNewsletterError(false);
                try {
                  const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      type: "newsletter",
                      email: newsletterEmail,
                      website: newsletterHoneypotRef.current?.value ?? "",
                    }),
                  });
                  if (!res.ok) throw new Error("request failed");
                  setNewsletterEmail("");
                  setNewsletterSent(true);
                } catch {
                  setNewsletterError(true);
                } finally {
                  setNewsletterSending(false);
                }
              }}
              className="mt-[30px] flex items-center gap-2 rounded-[40px] border border-transparent bg-brown-100 py-1.5 pr-1.5 pl-4 transition-colors duration-300 focus-within:border-ink"
            >
              <input
                ref={newsletterHoneypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <label htmlFor="newsletter-email" className="sr-only">
                {t("newsletterEmailLabel")}
              </label>
              <input
                id="newsletter-email"
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t("newsletterPlaceholder")}
                autoComplete="off"
                required
                className="w-full bg-transparent text-[13px] font-normal tracking-[0em] text-ink outline-none placeholder:text-brown-200"
              />
              <button
                type="submit"
                disabled={newsletterSending}
                aria-label={t("newsletterAriaLabel")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 9 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5 7.64L7.64 0.5M7.64 5.9264V0.5H2.2136"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
            {newsletterSent && (
              <p role="status" className="mt-2 text-[12px] font-light tracking-[0.04em] text-accent">
                {t("newsletterThanks")}
              </p>
            )}
            {newsletterError && (
              <p role="alert" className="mt-2 text-[12px] font-light tracking-[0.04em] text-red-600">
                {t("newsletterError")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col-reverse items-center justify-between gap-3 border-t border-brown-300/60 py-6 text-xs text-ink md:flex-row">
        <span className="text-center text-[15px] font-light tracking-[0em] text-brown-850">
          {t("copyrightLine1")} <br className="md:hidden" />
          {t("copyrightLine2")}
        </span>
        <span className="text-[15px] font-light tracking-[0em] text-brown-850">
          {t("designCredit")}
        </span>
      </div>

      <div className="relative h-[clamp(60px,15vw,280px)] overflow-hidden bg-brown-100">
        <p className="absolute top-[10px] left-1/2 -translate-x-1/2 whitespace-nowrap font-logo text-[26vw] leading-[0.8] font-semibold tracking-[-0.04em] text-white">
          Armadero
        </p>
      </div>
    </footer>
  );
}
