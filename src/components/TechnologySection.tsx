"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const swatches = [
  { name: "Оксамит Cognac", color: "#a15c2e" },
  { name: "Шкіра Espresso", color: "#3b2417" },
  { name: "Тканина Sand", color: "#cdb28a" },
  { name: "Оксамит Forest", color: "#3a4a3a" },
  { name: "Шкіра Chestnut", color: "#6b3a26" },
  { name: "Тканина Stone", color: "#8c8577" },
];

const panels = [
  {
    eyebrow: "01",
    title: "Технології в кожному кріслі",
    text: "Плавний електропривід, підігрів і масаж керуються одним дотиком — усе сховано в оббивці, нічого зайвого на очах.",
    body: (
      <ul className="mt-8 grid grid-cols-2 gap-3">
        {["Електропривід", "Підігрів", "Масаж", "Підсвітка"].map((f) => (
          <li
            key={f}
            className="rounded-xl border border-brown-300/50 px-4 py-3 text-sm text-brown-800"
          >
            {f}
          </li>
        ))}
      </ul>
    ),
  },
  {
    eyebrow: "02",
    title: "Продумано для комфорту",
    text: "Бездротова зарядка та столик-підсклянник під рукою — крісло само підлаштовується під вечір перегляду.",
    body: (
      <ul className="mt-8 grid grid-cols-2 gap-3">
        {["Бездротова зарядка", "Столик-підсклянник"].map((f) => (
          <li
            key={f}
            className="rounded-xl border border-brown-300/50 px-4 py-3 text-sm text-brown-800"
          >
            {f}
          </li>
        ))}
      </ul>
    ),
  },
  {
    eyebrow: "03",
    title: "Матеріали преміумкласу",
    text: "Шкіра, оксамит і тканина — кожна фактура підібрана так, щоб залишатися бездоганною роками.",
    body: (
      <div className="mt-8 grid grid-cols-2 gap-3">
        {swatches.map((s) => (
          <div
            key={s.name}
            className="flex items-center gap-3 rounded-xl bg-brown-800/5 px-3 py-3 text-xs text-brown-800"
          >
            <span
              className="h-5 w-5 shrink-0 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: s.color }}
            />
            {s.name}
          </div>
        ))}
      </div>
    ),
  },
  {
    eyebrow: "04",
    title: "Кожне крісло — під ваш інтер'єр",
    text: "40+ варіантів оздоблення дають змогу зібрати кінозал, що виглядає так, ніби його створювали саме під вашу кімнату.",
    body: (
      <p className="mt-8 inline-block rounded-full border border-brown-300/60 px-5 py-2 text-sm tracking-wide text-brown-700 uppercase">
        40+ варіантів оздоблення
      </p>
    ),
  },
];

export default function TechnologySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        panels.forEach((_, i) => {
          if (i === 0) return;
          gsap.fromTo(
            imageRefs.current[i],
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: panelRefs.current[i],
                start: "top 80%",
                end: "top 20%",
                scrub: true,
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="technology"
      ref={sectionRef}
      className="bg-cream py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="max-w-md text-3xl font-medium md:text-4xl">
          Технології та оздоблення
        </h2>

        <div className="mt-14 grid gap-14 md:grid-cols-2 md:items-start md:gap-16">
          <div>
            {panels.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  panelRefs.current[i] = el;
                }}
                className="flex min-h-[70vh] flex-col justify-center py-10 md:min-h-[85vh]"
              >
                <span className="text-sm tracking-wide text-brown-500">
                  {p.eyebrow}
                </span>
                <h3 className="mt-3 text-2xl font-medium text-ink md:text-3xl">
                  {p.title}
                </h3>
                <p className="mt-4 max-w-md text-brown-700">{p.text}</p>

                {/* Мобільна версія: фото одразу під текстом панелі */}
                <div className="relative mt-8 aspect-[4/5] w-full overflow-hidden rounded-2xl md:hidden">
                  <Image
                    src={images.technology[i]}
                    alt={p.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {p.body}
              </div>
            ))}
          </div>

          {/* Desktop: sticky overlapping image stack */}
          <div className="hidden md:sticky md:top-24 md:block md:h-[70vh]">
            <div className="relative h-full w-full overflow-hidden rounded-2xl">
              {panels.map((p, i) => (
                <div
                  key={p.title}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute inset-0 overflow-hidden"
                  style={{ zIndex: i + 1 }}
                >
                  <Image
                    src={images.technology[i]}
                    alt={p.title}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
