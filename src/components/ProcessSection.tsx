"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

// How much of the previous panel gets covered as the next one rides up,
// expressed in a fixed viewport-height unit so the overlap accumulates
// consistently no matter how many panels are stacked.
const OVERLAP_VH = 35;

const steps = [
  {
    n: "01",
    title: "Заміряємо кімнату",
    text: "Самостійно за нашою інструкцією або виїзд майстра для точних замірів простору — врахуємо кожен виступ, двері й вентиляцію, щоб крісла стали як влиті.",
    image: images.portfolio[3],
    bg: "bg-cream",
  },
  {
    n: "02",
    title: "Збираєте конфігурацію",
    text: "Серія, кількість місць, розкладка рядів, оздоблення та функції — все під ваш інтер'єр і бюджет, з живою консультацією дизайнера на кожному кроці.",
    image: images.production.detail,
    bg: "bg-cream-dim",
  },
  {
    n: "03",
    title: "Отримуєте готовий зал",
    text: "Виготовлення і монтаж за 4–6 тижнів, під ключ — привозимо, збираємо на місці та показуємо, як користуватися всіма функціями крісел.",
    image: images.portfolio[0],
    bg: "bg-cream",
  },
];

const TOTAL_PANELS = steps.length;

// Every panel after the first permanently rides up by cumulative overlap,
// but that translate doesn't shrink normal document flow — the stack's
// wrapper is still as tall as all panels stacked with no overlap at all.
// Without correcting for it, whatever comes right after the stack sits
// that leftover height too low, leaving a blank gap before it. Shrinking
// the wrapper by the final panel's total ride distance closes that gap.
const STACK_HEIGHT_VH = 100 + (TOTAL_PANELS - 1) * (100 - OVERLAP_VH);

export default function ProcessSection() {
  const introRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          introRef.current,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: introRef.current,
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      const panels = panelRefs.current;

      panels.forEach((panel, i) => {
        if (!panel) return;

        const img = imageRefs.current[i];
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        }

        // This panel rides up over the ones before it as it scrolls in.
        // The ramp spans from the very first panel's arrival all the way
        // to this panel's own arrival, so the touching edges stay
        // consistent no matter how many panels are stacked. Every panel
        // but the first gets the same treatment, including the last one.
        if (i > 0) {
          gsap.fromTo(
            panel,
            { y: 0 },
            {
              y: `-${i * OVERLAP_VH}vh`,
              ease: "none",
              scrollTrigger: {
                trigger: panels[0],
                start: "top top",
                endTrigger: panel,
                end: "top top",
                scrub: 0.7,
              },
            }
          );
        }

        // Darken this panel while the next one rides up and covers it.
        const nextPanel = panels[i + 1];
        const overlay = overlayRefs.current[i];
        if (nextPanel && overlay) {
          gsap.to(overlay, {
            opacity: 0.55,
            ease: "none",
            scrollTrigger: {
              trigger: nextPanel,
              start: "top bottom",
              end: "top top",
              scrub: 0.7,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-cream py-20 md:pt-24 md:pb-0">
      <div className="w-full px-6 pb-16 md:px-10 md:pb-24">
        <div
          ref={introRef}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-start"
        >
          <h2 className="max-w-3xl text-6xl leading-[1.05] font-bold md:text-8xl">
            Як це працює покроково
          </h2>
          <p className="max-w-lg text-lg text-brown-700 md:pt-3 md:text-2xl">
            Від виміру кімнати до готового кінозалу — три прості кроки, які
            ми проходимо разом із вами: точний замір простору, підбір
            конфігурації під ваш інтер&apos;єр і бюджет, а тоді виготовлення
            та монтаж під ключ.
          </p>
        </div>
      </div>

      <div className="relative" style={{ height: `${STACK_HEIGHT_VH}vh` }}>
        {steps.map((s, i) => (
          <div
            key={s.n}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={`relative flex h-screen w-full flex-col overflow-hidden border-t border-gray-300 pt-10 pb-8 will-change-transform md:pt-14 md:pb-12 ${s.bg}`}
            style={{ zIndex: i + 1 }}
          >
            <div className="flex h-full w-full flex-col justify-center px-6 md:px-10">
              <div className="grid gap-4 md:grid-cols-2 md:gap-10">
                <h3 className="text-3xl font-medium md:text-5xl">{s.title}</h3>
                <p className="max-w-2xl text-lg text-brown-700 md:text-2xl">
                  {s.text}
                </p>
              </div>

              <div className="mt-[15vh] grid items-end gap-4 md:grid-cols-2 md:gap-10">
                <span className="text-9xl leading-none font-medium text-brown-300/40 md:text-[13rem]">
                  {s.n}
                </span>

                <div className="relative aspect-[8/5] w-[70%] max-w-lg overflow-hidden md:w-[50%]">
                  <div
                    ref={(el) => {
                      imageRefs.current[i] = el;
                    }}
                    className="absolute -top-[10%] left-0 h-[120%] w-full will-change-transform"
                  >
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="(min-width: 768px) 34vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {i < TOTAL_PANELS - 1 && (
              <div
                ref={(el) => {
                  overlayRefs.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0 bg-brown-950 opacity-0"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
