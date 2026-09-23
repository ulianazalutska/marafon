"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

type Item = {
  key: "wardrobes" | "corner" | "islands" | "systems" | "modules" | "projects";
  image: string | null;
  side?: "left" | "right";
  shape?: "pill" | "circle";
  compact?: boolean;
};

const items: Item[] = [
  { key: "wardrobes", image: images.createForYou.wardrobes, side: "right", shape: "pill" },
  { key: "corner", image: images.createForYou.corner, side: "left", shape: "pill", compact: true },
  { key: "islands", image: null },
  { key: "systems", image: images.createForYou.systems, side: "right", shape: "pill" },
  { key: "modules", image: null },
  { key: "projects", image: images.createForYou.projects, side: "left", shape: "circle" },
];

export default function CreateForYouSection() {
  const t = useTranslations("CreateForYou");
  const sectionRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          eyebrowRef.current,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );

        const rows = rowsRef.current
          ? Array.from(rowsRef.current.children)
          : [];
        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
              toggleActions: "play none none none",
            },
          }
        );

        const roundels = rowsRef.current
          ? rowsRef.current.querySelectorAll("[data-roundel]")
          : [];
        if (roundels.length) {
          gsap.fromTo(
            roundels,
            { autoAlpha: 0, scale: 0.92 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.1,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 72%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="create"
      ref={sectionRef}
      className="bg-cream py-24 md:py-32"
    >
      <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
        <p
          ref={eyebrowRef}
          className="mb-[73px] text-lg tracking-[0.25em] text-brown-850 uppercase"
        >
          {t("eyebrow")}
        </p>

        <div ref={rowsRef} className="flex flex-col items-center">
          {items.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-center gap-3 md:gap-5"
            >
              {item.image && item.side === "left" && (
                <span
                  data-roundel
                  className={`relative shrink-0 overflow-hidden bg-brown-300/30 ${
                    item.shape === "circle"
                      ? "h-14 w-14 rounded-full md:h-24 md:w-24"
                      : item.compact
                        ? "h-[52px] w-28 rounded-full md:h-[88px] md:w-48"
                        : "h-14 w-28 rounded-full md:h-24 md:w-48"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={t(item.key)}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </span>
              )}

              <h2 className="text-[13vw] leading-[0.98] font-medium tracking-tight text-accent sm:text-6xl md:text-[74px]">
                {t(item.key)}
              </h2>

              {item.image && item.side === "right" && (
                <span
                  data-roundel
                  className={`relative shrink-0 overflow-hidden bg-brown-300/30 ${
                    item.shape === "circle"
                      ? "h-14 w-14 rounded-full md:h-24 md:w-24"
                      : item.compact
                        ? "h-[52px] w-28 rounded-full md:h-[88px] md:w-48"
                        : "h-14 w-28 rounded-full md:h-24 md:w-48"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={t(item.key)}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
