"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const columns = [
  {
    title: "Продукція",
    links: [
      { href: "#catalog", label: "Каталог" },
      { href: "#production", label: "Технології" },
      { href: "#production", label: "Виробництво" },
    ],
  },
  {
    title: "Компанія",
    links: [
      { href: "#portfolio", label: "Портфоліо" },
      { href: "#process", label: "Процес" },
      { href: "#contact", label: "Контакти" },
    ],
  },
  {
    title: "Соціальні мережі",
    links: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://pinterest.com", label: "Pinterest" },
    ],
  },
];

export default function Footer() {
  const introRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

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
              toggleActions: "play none none reverse",
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
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-cream text-ink">
      <div className="mx-auto flex max-w-7xl flex-col gap-12 border-b border-brown-300/60 px-6 py-16 md:flex-row md:items-start md:justify-between md:px-10 md:py-20">
        <div ref={introRef}>
          <h2 className="relative max-w-sm text-4xl leading-[1.15] font-medium md:text-5xl">
            <span className="relative -ml-1 inline-block">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-2 -left-3 font-serif text-2xl text-brown-500 select-none md:-top-3 md:-left-4 md:text-3xl"
              >
                &#10077;
              </span>
              Замовте своє
            </span>
            <br />
            крісло VELLARO.
            <span
              aria-hidden
              className="pointer-events-none ml-1 font-serif text-2xl text-brown-500 select-none md:text-3xl"
            >
              &#10078;
            </span>
          </h2>

          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm tracking-wide text-cream transition-opacity hover:opacity-90"
          >
            <span aria-hidden>&rarr;</span> Замовити консультацію
          </a>
        </div>

        <nav
          ref={navRef}
          className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 md:gap-x-16"
        >
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[11px] tracking-widest text-brown-500 uppercase">
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-brown-800 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="overflow-hidden border-b border-brown-300/60 py-6 md:py-10">
        <p className="text-center text-[22vw] leading-none font-medium tracking-tight whitespace-nowrap text-ink/10 sm:text-[20vw] md:text-[15vw]">
          VELLARO
        </p>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-3 px-6 py-6 text-xs text-brown-500 md:flex-row md:px-10">
        <span className="font-mono tracking-wide">
          VELLARO — студія гардеробних систем та інтер&apos;єру. Усі права
          захищено.
        </span>
        <div className="flex gap-6 font-mono tracking-wide">
          <a href="#" className="transition-colors hover:text-ink">
            Політика конфіденційності
          </a>
          <a href="#" className="transition-colors hover:text-ink">
            Умови використання
          </a>
        </div>
      </div>
    </footer>
  );
}
