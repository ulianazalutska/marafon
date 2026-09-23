"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

// Series names (Lite/Comfort/Signature) are product names, kept identical
// across locales — only description/features live in messages/*.json.
const series = [
  {
    key: "lite",
    name: "Lite",
    image: images.catalog.lite,
    dotTop: "37%",
    dotLeft: "27%",
  },
  {
    key: "comfort",
    name: "Comfort",
    image: images.catalog.comfort,
    dotTop: "78%",
    dotLeft: "33%",
  },
  {
    key: "signature",
    name: "Signature",
    image: images.catalog.signature,
    dotTop: "24%",
    dotLeft: "82%",
  },
] as const;

export default function CatalogSection() {
  const t = useTranslations("Catalog");
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          headingRef.current,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 82%",
              toggleActions: "play none none none",
            },
          }
        );

        const cards = gridRef.current
          ? Array.from(gridRef.current.children)
          : [];
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 78%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="catalog"
      ref={sectionRef}
      className="relative z-10 mb-[225px] bg-cream pt-16 md:pt-20"
    >
      <div className="mx-auto max-w-[1600px] px-6">
        <div
          ref={headingRef}
          className="mb-[48px] flex flex-col justify-between gap-4 md:flex-row md:items-center"
        >
          <h2
            className="max-w-xl font-normal text-ink"
            style={{
              fontSize: "45px",
              lineHeight: "54px",
              letterSpacing: "0.04em",
            }}
          >
            {t("heading")}
          </h2>
          <p
            className="font-normal text-ink md:mr-48"
            style={{
              width: "460px",
              fontSize: "24px",
              lineHeight: "29px",
              letterSpacing: "0.04em",
            }}
          >
            {t("subtitleLine1")}
            <br />
            {t("subtitleLine2")}
            <br />
            {t("subtitleLine3")}
          </p>
        </div>

        <div ref={gridRef} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((item) => (
            <div key={item.key} className="flex flex-col">
              <a
                href="#contact"
                className="group relative flex aspect-[4/5] flex-col text-cream"
              >
                <div className="absolute inset-0 overflow-hidden bg-brown-950">
                  <Image
                    src={item.image}
                    alt={`${t("altPrefix")} ${item.name}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-transparent to-transparent" />
                </div>

                {/* Пульсуюча точка + інфо-блок на hover */}
                <div
                  className="group/dot absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
                  style={{ top: item.dotTop, left: item.dotLeft }}
                >
                  <span className="pulse-ring absolute inline-flex h-11 w-11 rounded-full border border-cream/70" />
                  <span
                    className="pulse-ring absolute inline-flex h-11 w-11 rounded-full border border-cream/70"
                    style={{ animationDelay: "1.5s" }}
                  />
                  <span
                    className="pulse-ring absolute inline-flex h-11 w-11 rounded-full border border-cream/70"
                    style={{ animationDelay: "3s" }}
                  />
                  <span className="relative flex h-[33px] w-[33px] items-center justify-center rounded-full bg-cream shadow-md transition-all duration-300 group-hover/dot:h-2.5 group-hover/dot:w-2.5">
                    <Image
                      src="/icons/plus.svg"
                      alt=""
                      width={15}
                      height={16}
                      className="transition-opacity duration-150 group-hover/dot:opacity-0"
                    />
                  </span>

                  <div
                    className={`pointer-events-none absolute top-1/2 w-56 -translate-y-1/2 bg-[#FFFFFF] p-4 opacity-0 shadow-xl transition-opacity duration-200 group-hover/dot:opacity-100 md:w-64 ${
                      item.key === "signature"
                        ? "right-full mr-3"
                        : "left-full ml-3"
                    }`}
                    style={{ borderRadius: "10px" }}
                  >
                    <span
                      className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 bg-[#FFFFFF] ${
                        item.key === "signature" ? "-right-2" : "-left-2"
                      }`}
                    />
                    <h4
                      className="font-medium"
                      style={{ fontSize: "14px", letterSpacing: "0.04em", color: "var(--color-ink)" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="mt-2 font-normal leading-relaxed"
                      style={{ fontSize: "10px", letterSpacing: "0.04em", color: "var(--color-ink)" }}
                    >
                      {t(`series.${item.key}.description`)}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {(t.raw(`series.${item.key}.features`) as string[]).map((f) => (
                        <li
                          key={f}
                          className="px-2 py-0.5 text-[11px] tracking-wide text-white"
                          style={{ backgroundColor: "var(--color-accent)", borderRadius: "2px" }}
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </a>

              {/* Підпис під карткою */}
              <div className="pt-3">
                <h3
                  className="font-medium text-ink"
                  style={{ fontSize: "27px", lineHeight: "32px", letterSpacing: "0.04em" }}
                >
                  {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
