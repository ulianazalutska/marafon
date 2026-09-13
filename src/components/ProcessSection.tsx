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
    text: "Самостійно за інструкцією або виїзд майстра для точних замірів простору.",
    image: images.portfolio[3],
    bg: "bg-cream",
  },
  {
    n: "02",
    title: "Збираєте конфігурацію",
    text: "Серія, кількість місць, оздоблення, функції — все під ваш інтер'єр.",
    image: images.production.detail,
    bg: "bg-cream-dim",
  },
  {
    n: "03",
    title: "Отримуєте готовий зал",
    text: "Виготовлення і монтаж за 4–6 тижнів, під ключ.",
    image: images.portfolio[0],
    bg: "bg-cream",
  },
];

const TOTAL_PANELS = steps.length + 1;

export default function ProcessSection() {
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
        // consistent no matter how many panels are stacked. The very last
        // panel is excluded: it has no successor to hide its overshoot, so
        // giving it the same ride-up would scroll it fully out of view
        // before the next section arrives, leaving a bare gap between them.
        if (i > 0 && i < TOTAL_PANELS - 1) {
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
                scrub: true,
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
              scrub: true,
            },
          });
        }
      });

      // Final panel's text/button rise in gently once it takes over the screen.
      if (finalTextRef.current) {
        gsap.fromTo(
          finalTextRef.current,
          { yPercent: 30, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: panels[TOTAL_PANELS - 1],
              start: "top 60%",
              end: "top 10%",
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-cream py-24 md:pt-32 md:pb-0">
      <div className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className="grid gap-6 md:grid-cols-2 md:items-start md:gap-10">
          <h2 className="text-3xl font-medium md:text-4xl">Як це працює</h2>
          <p className="text-lg text-brown-700 md:max-w-md md:justify-self-end md:text-right md:text-xl">
            Від виміру кімнати до готового кінозалу — три прості кроки.
          </p>
        </div>
      </div>

      <div className="w-full border-t border-gray-300" />

      <div className="relative mt-14">
        {steps.map((s, i) => (
          <div
            key={s.n}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className={`relative flex h-screen w-full flex-col justify-center gap-10 overflow-hidden px-6 py-14 will-change-transform md:flex-row md:items-center md:px-10 ${s.bg}`}
            style={{ zIndex: i + 1 }}
          >
            <div className="md:w-2/5">
              <span className="text-7xl leading-none font-medium text-brown-300/40 md:text-9xl">
                {s.n}
              </span>
              <h3 className="mt-6 text-2xl font-medium md:text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-sm text-brown-700">{s.text}</p>
            </div>

            <div className="relative h-[45vh] flex-1 overflow-hidden rounded-2xl md:h-[60vh]">
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
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                />
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

        <div
          ref={(el) => {
            panelRefs.current[steps.length] = el;
          }}
          className="relative flex h-screen w-full items-center justify-center overflow-hidden will-change-transform"
          style={{ zIndex: TOTAL_PANELS }}
        >
          <div
            ref={(el) => {
              imageRefs.current[steps.length] = el;
            }}
            className="absolute -top-[10%] left-0 h-[120%] w-full will-change-transform"
          >
            <Image
              src={images.processFinale}
              alt="Домашній кінозал VELLARO на заході сонця"
              fill
              sizes="100vw"
              className="object-cover"
              priority={false}
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-brown-950/20" />

          <div
            ref={finalTextRef}
            className="relative flex flex-col items-center gap-8 px-6 text-center"
          >
            <h3 className="max-w-3xl text-4xl leading-[1.05] font-medium text-cream md:text-6xl lg:text-7xl">
              Кінозал, який
              <br />
              <span className="italic">відчувається</span> як вдома
            </h3>
            <a
              href="#contact"
              className="rounded-full bg-cream px-8 py-4 text-sm tracking-wide text-brown-950 transition-colors hover:bg-white"
            >
              Замовити дзвінок
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
