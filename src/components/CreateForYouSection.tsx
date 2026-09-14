"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

type Item = {
  label: string;
  image: string | null;
  side?: "left" | "right";
  shape?: "pill" | "circle";
};

const items: Item[] = [
  { label: "Дивани", image: images.catalog.lite, side: "right", shape: "pill" },
  { label: "Кутові", image: images.catalog.comfort, side: "left", shape: "pill" },
  { label: "Крісла", image: null },
  { label: "Кінозали", image: images.catalog.signature, side: "right", shape: "pill" },
  { label: "Модулі", image: null },
  { label: "Проєкти", image: images.portfolio[0], side: "left", shape: "circle" },
];

export default function CreateForYouSection() {
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
              toggleActions: "play none none reverse",
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
              toggleActions: "play none none reverse",
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
                toggleActions: "play none none reverse",
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
          className="mb-10 text-sm tracking-[0.3em] text-brown-700 uppercase"
        >
          Ми створимо для вас
        </p>

        <div ref={rowsRef} className="flex flex-col items-center">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center gap-3 md:gap-5"
            >
              {item.image && item.side === "left" && (
                <span
                  data-roundel
                  className={`relative shrink-0 overflow-hidden bg-brown-300/30 ${
                    item.shape === "circle"
                      ? "h-14 w-14 rounded-full md:h-24 md:w-24"
                      : "h-14 w-28 rounded-full md:h-24 md:w-48"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </span>
              )}

              <h2 className="text-[13vw] leading-[0.95] font-medium tracking-tight text-brown-800 sm:text-6xl md:text-8xl">
                {item.label}
              </h2>

              {item.image && item.side === "right" && (
                <span
                  data-roundel
                  className={`relative shrink-0 overflow-hidden bg-brown-300/30 ${
                    item.shape === "circle"
                      ? "h-14 w-14 rounded-full md:h-24 md:w-24"
                      : "h-14 w-28 rounded-full md:h-24 md:w-48"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
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
