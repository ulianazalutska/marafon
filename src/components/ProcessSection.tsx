"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "Заміряємо кімнату",
    text: "Самостійно за нашою інструкцією або виїзд майстра для точних замірів простору — врахуємо кожен виступ, двері й вентиляцію, щоб гардеробна стала як улита, до міліметра.",
    image: images.process.measure,
  },
  {
    n: "02",
    title: "Збираєте конфігурацію",
    text: "Серія, кількість секцій, розкладка модулів, оздоблення та функції — все під ваш інтер'єр і бюджет.",
    image: images.process.materials,
  },
  {
    n: "03",
    title: "Отримуєте готову гардеробну",
    text: "Виготовлення і монтаж під ключ — привозимо, збираємо на місці та показуємо, як користуватися всіма механізмами гардеробної.",
    image: images.process.install,
  },
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const setWrapperHeights = () => {
      const buffer = window.innerHeight * BUFFER_RATIO;
      steps.forEach((_, i) => {
        if (i === steps.length - 1) return;
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

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          steps.forEach((_, i) => {
            if (i === steps.length - 1) return;

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
          <h2 className="max-w-3xl text-6xl leading-[1.05] font-bold text-[#362F2B] md:text-[96px] md:leading-[1.04] md:font-medium md:tracking-[0.02em]">
            Як це працює покроково
          </h2>
          <p className="max-w-lg text-lg text-[#362F2B] md:w-[422px] md:max-w-[422px] md:pt-3 md:text-[32px] md:leading-[38px] md:font-normal md:tracking-[0.02em]">
            Від виміру кімнати до готової гардеробної — три прості кроки, які
            ми проходимо разом із вами
          </p>
        </div>
      </div>

      {/* Мобільна версія: звичайний потік без наїзду карток одна на одну. */}
      <div className="relative md:hidden">
        {steps.map((s) => (
          <div
            key={s.n}
            className="relative flex w-full flex-col overflow-hidden border-t border-[#AF957C] bg-cream pt-10 pb-8"
          >
            <div className="flex w-full flex-col px-6">
              <div className="grid gap-4">
                <h3 className="text-2xl font-medium text-[#362F2B]">
                  {s.title}
                </h3>
                <p className="max-w-md text-base text-[#362F2B]">{s.text}</p>
              </div>

              <div className="mt-10 grid items-end gap-4">
                <span className="text-8xl leading-none font-semibold text-[#AF957C]/46 tracking-[0.02em]">
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
                className={`relative flex flex-col justify-between overflow-hidden border-t border-[#AF957C] bg-cream px-10 py-16 ${
                  isLast ? "" : "sticky top-24"
                }`}
                style={{ minHeight: `${CARD_MIN_VH}vh` }}
              >
                <div className="grid gap-10 md:grid-cols-2">
                  <h3 className="text-[46px] font-medium tracking-[0.02em] text-[#362F2B]">
                    {s.title}
                  </h3>
                  <p className="max-w-[520px] text-[23px] font-normal tracking-[0.02em] text-[#362F2B]">
                    {s.text}
                  </p>
                </div>

                <div className="grid items-end gap-10 md:grid-cols-2">
                  <span className="text-[190px] leading-none font-semibold text-[#AF957C]/46 tracking-[0.02em]">
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
