"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const stepMeta = [
  { n: "01", image: images.process.measure },
  { n: "02", image: images.process.materials },
  { n: "03", image: images.process.install },
];

// Кожна картка (крім останньої) — окремий position:sticky елемент у
// звичайному document flow, як у референсі: перекриття наступною карткою
// відбувається природно через порядок DOM, без ручного слайду поверх.
// Висоту "обгортки" (буфер скролу, поки картка стоїть запінена, перш ніж
// наступна її закриє) рахуємо динамічно від реальної висоти картки —
// фіксований vh давав або зайвий порожній простір, або занадто довге
// "зависання" на місці залежно від висоти екрана/контенту.
const CARD_MIN_VH = 75;
const BUFFER_RATIO = 0.01; // частка висоти вʼюпорта, додана як буфер

export default function ProcessSection() {
  const t = useTranslations("Process");
  const stepText = t.raw("steps") as { title: string; text: string }[];
  const steps = stepMeta.map((m, i) => ({ ...m, ...stepText[i] }));

  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopTopRefs = useRef<(HTMLDivElement | null)[]>([]);
  const desktopBottomRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const setWrapperHeights = () => {
      const buffer = window.innerHeight * BUFFER_RATIO;
      stepMeta.forEach((_, i) => {
        if (i === stepMeta.length - 1) return;
        const card = cardRefs.current[i];
        const wrapper = wrapperRefs.current[i];
        if (!card || !wrapper) return;
        wrapper.style.height = `${card.offsetHeight + buffer}px`;
      });
      ScrollTrigger.refresh();
    };

    setWrapperHeights();
    window.addEventListener("resize", setWrapperHeights);
    return () => window.removeEventListener("resize", setWrapperHeights);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          headingRef.current,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          subtitleRef.current,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            delay: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
        stepMeta.forEach((_, i) => {
          gsap.fromTo(
            mobileContentRefs.current[i],
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: mobileContentRefs.current[i],
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );

          gsap.fromTo(
            [desktopTopRefs.current[i], desktopBottomRefs.current[i]],
            { autoAlpha: 0, y: 30 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: cardRefs.current[i] ?? wrapperRefs.current[i],
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          stepMeta.forEach((_, i) => {
            if (i === stepMeta.length - 1) return;

            // Лише затемнення попередньої картки, без дрейфу y — дрейф
            // рухав увесь вміст картки (текст+фото) як одне ціле й давав
            // помітне "випливання" при скролі назад, коли анімація
            // програвалась у зворотному напрямку.
            gsap.fromTo(
              overlayRefs.current[i],
              { opacity: 0 },
              {
                opacity: 0.4,
                ease: "none",
                scrollTrigger: {
                  trigger: wrapperRefs.current[i],
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.3,
                },
              }
            );
          });
        }
      );

      return () => mm.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-cream py-20 md:pt-[159px] md:pb-0">
      <div className="w-full px-6 pb-16 md:pr-[100px] md:pl-10 md:pb-[115px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h2
            ref={headingRef}
            className="max-w-3xl text-[48px] leading-[1.1] font-medium text-ink min-[768px]:text-[68px] min-[768px]:leading-[1.04] min-[768px]:font-medium min-[768px]:tracking-[0.02em] min-[1341px]:text-[96px]"
          >
            {t("heading")}
          </h2>
          <p
            ref={subtitleRef}
            className="max-w-lg w-full text-lg text-ink min-[768px]:max-w-none min-[768px]:flex-1 min-[768px]:pt-3 min-[768px]:text-[24px] min-[768px]:leading-[29px] min-[768px]:font-normal min-[768px]:tracking-[0.02em] min-[1249px]:max-w-[380px] min-[1249px]:flex-none min-[1249px]:w-[380px] min-[1341px]:w-[422px] min-[1341px]:max-w-[422px] min-[1341px]:text-[32px] min-[1341px]:leading-[38px]"
          >
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Мобільна версія: звичайний потік без наїзду карток одна на одну. */}
      <div className="relative md:hidden">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="relative flex w-full flex-col overflow-hidden border-t border-accent bg-cream pt-10 pb-8"
          >
            <div
              ref={(el) => {
                mobileContentRefs.current[i] = el;
              }}
              className="flex w-full flex-col px-6"
            >
              <div className="grid gap-4">
                <h3 className="text-2xl font-medium text-ink">
                  {s.title}
                </h3>
                <p className="max-w-md text-base text-ink">{s.text}</p>
              </div>

              <div className="mt-10 grid items-end gap-4">
                <span className="text-8xl leading-none font-semibold text-accent/46 tracking-[0.02em]">
                  {s.n}
                </span>

                <div className="relative aspect-[8/5] w-[55%] max-w-sm overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Десктоп: кожна картка — власний sticky-елемент у звичайному flow,
          наступна природно перекриває попередню порядком DOM. */}
      <div className="relative hidden md:block">
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;

          return (
            <div
              key={s.n}
              ref={(el) => {
                wrapperRefs.current[i] = el;
              }}
              className="relative"
            >
              <div
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={`relative flex flex-col justify-between overflow-hidden border-t border-accent bg-cream px-10 py-16 ${
                  isLast ? "" : "sticky top-24"
                }`}
                style={{ minHeight: `${CARD_MIN_VH}vh` }}
              >
                <div
                  ref={(el) => {
                    desktopTopRefs.current[i] = el;
                  }}
                  className="mx-auto grid w-full max-w-[1800px] gap-10 md:grid-cols-2"
                >
                  <h3 className="text-[34px] font-medium tracking-[0.02em] text-ink min-[1341px]:text-[46px]">
                    {s.title}
                  </h3>
                  <p className="max-w-[520px] text-[18px] font-normal tracking-[0.02em] text-ink min-[1341px]:text-[23px]">
                    {s.text}
                  </p>
                </div>

                <div
                  ref={(el) => {
                    desktopBottomRefs.current[i] = el;
                  }}
                  className="mx-auto grid w-full max-w-[1800px] items-end gap-10 md:grid-cols-2"
                >
                  <span className="text-[120px] leading-none font-semibold text-accent/46 tracking-[0.02em] min-[1341px]:text-[190px]">
                    {s.n}
                  </span>

                  <div className="relative h-[320px] w-[460px] overflow-hidden">
                    <Image
                      src={s.image}
                      alt={s.title}
                      fill
                      sizes="35vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {!isLast && (
                  <div
                    ref={(el) => {
                      overlayRefs.current[i] = el;
                    }}
                    className="pointer-events-none absolute inset-0 bg-black opacity-0"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
