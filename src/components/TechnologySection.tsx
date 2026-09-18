"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const swatches = [
  { name: "Дуб Cognac", image: images.technologyMaterials.dubCognac },
  { name: "Горіх Espresso", image: images.technologyMaterials.horihEspresso },
  { name: "Ламінат Sand", image: images.technologyMaterials.laminatSand },
  { name: "Емаль Forest", image: images.technologyMaterials.emalForest },
  { name: "Дуб Chestnut", image: images.technologyMaterials.dubChestnut },
  { name: "Скло Stone", image: images.technologyMaterials.skloStone },
];

const techSpecs = [
  { label: "Електрокарниз", value: "Плавний підйом штанги одним дотиком" },
  { label: "Підсвітка", value: "Автоматичне LED-освітлення при відкритті" },
  { label: "Доводчики", value: "Безшумне закривання дверей і шухляд" },
  { label: "Дзеркало", value: "Вбудоване, з регульованим світлом" },
  { label: "Гаджети", value: "Бездротова зарядка та розетка в шухляді" },
];

const SLIDE_VH = 115;

export default function TechnologySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);

  // Легкий пружинний "доганяючий" лаг для обох колонок — власне відчуття
  // плавної інерції в межах цієї секції, без підключення smooth-scroll на
  // весь сайт (це ризикувало б зламати pin-ефекти в StackedIntro/ProcessSection).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    mass: 0.4,
  });
  const leftLagY = useTransform(smoothProgress, [0, 1], [26, -26]);
  const rightLagY = useTransform(smoothProgress, [0, 1], [26, -26]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const rows = contentRef.current?.querySelectorAll(".spec-row");
      if (rows?.length) {
        gsap.fromTo(
          rows,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: "power2.out",
            delay: 0.15,
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          imageRefs.current[0],
          { autoAlpha: 0, scale: 1.05 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        images.technology.forEach((_, i) => {
          if (i === 0) return;
          gsap.fromTo(
            imageRefs.current[i],
            { yPercent: 100 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: triggerRefs.current[i],
                start: "top bottom",
                end: "top top",
                scrub: 0.6,
              },
            }
          );
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" ref={sectionRef} className="bg-white">
      {/* Банер-хіро: фото на всю ширину + великий заголовок поверх */}
      <div className="relative h-[38vh] min-h-[280px] w-full overflow-hidden md:h-[42vh]">
        <Image
          src={images.technologyBanner}
          alt="Технології та оздоблення VELLARO"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ borderRadius: "10px" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brown-950/70 via-brown-950/15 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pt-10 md:px-10 md:pb-14">
          <span className="text-sm tracking-[0.2em] text-cream/90 uppercase">
            Технології та оздоблення
          </span>
          <h2 className="mt-3 text-6xl leading-[0.95] font-medium text-cream md:text-8xl">
            Оздоблення
          </h2>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-16 md:px-10 md:pb-24">
        <div className="grid items-start gap-x-8 md:grid-cols-2">
          {/* Ліва колонка: спек-картка моделі. Зовнішній div лишається для
              GSAP fade-in (contentRef), внутрішній motion.div — для
              незалежного пружинного лагу від скролу. */}
          <div ref={contentRef} className="pt-12 pb-24 md:pt-16">
          <motion.div style={{ y: leftLagY }}>
            <h3 className="text-2xl font-medium text-ink md:text-3xl">
              Технології в кожному модулі
            </h3>
            <p className="mt-4 max-w-md text-brown-700">
              Електрокарниз, підсвітка і доводчики керуються одним дотиком —
              усе сховано у фасаді, нічого зайвого на очах.
            </p>

            <div className="mt-10">
              {techSpecs.map((s) => (
                <div
                  key={s.label}
                  className="spec-row flex items-baseline justify-between border-b border-brown-300/40 py-4"
                >
                  <span className="text-sm font-medium text-ink">
                    {s.label}
                  </span>
                  <span className="text-sm text-brown-700">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Технічне креслення модуля */}
            <div className="relative mt-10 aspect-[4/5] w-full overflow-hidden rounded-[10px]">
              <Image
                src={images.technologySketch}
                alt="Технічне креслення модуля VELLARO"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                style={{ borderRadius: "10px" }}
              />
            </div>

            {/* Мобільна версія: одне фото під текстом, без sticky-стеку */}
            <div className="relative mt-10 aspect-[4/5] w-full overflow-hidden rounded-[10px] md:hidden">
              <Image
                src={images.technology[0]}
                alt="Гардеробна VELLARO"
                fill
                sizes="100vw"
                className="object-cover"
                style={{ borderRadius: "10px" }}
              />
            </div>

            <h3 className="mt-16 text-2xl font-medium text-ink md:text-3xl">
              Матеріали та оздоблення
            </h3>
            <span className="mt-6 block text-sm text-brown-500">
              з чого зроблено:
            </span>
            <p className="mt-2 max-w-md text-brown-700">
              ЛДСП, шпон і масив дерева — кожна фактура підібрана так, щоб
              залишатися бездоганною роками. 40+ варіантів оздоблення дають
              змогу зібрати гардеробну, що виглядає так, ніби її створювали
              саме під вашу кімнату.
            </p>

            <div className="mt-10">
              {swatches.map((s) => {
                const active = activeSwatch === s.name;
                return (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setActiveSwatch(active ? null : s.name)}
                    className={`spec-row flex w-full items-center justify-between border-b border-brown-300/40 py-4 text-left transition-colors ${
                      active ? "text-ink" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-ink">
                      {s.name}
                    </span>
                    <span
                      className={`relative h-6 w-6 shrink-0 overflow-hidden ring-1 ring-black/10 transition-transform duration-200 ${
                        active ? "scale-110 ring-2 ring-ink/40" : ""
                      }`}
                    >
                      <Image
                        src={s.image}
                        alt={s.name}
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
          </div>

          {/* Права колонка: один sticky-контейнер, фото зсуваються одне
              поверх іншого через GSAP scrub. */}
          <div
            className="relative hidden md:-mt-32 md:block"
            style={{ height: `${images.technology.length * SLIDE_VH}vh` }}
          >
            {images.technology.map((_, i) => (
              <div
                key={`trigger-${i}`}
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                className="absolute inset-x-0"
                style={{ top: `${i * SLIDE_VH}vh`, height: `${SLIDE_VH}vh` }}
              />
            ))}

            <motion.div
              style={{ y: rightLagY }}
              className="sticky top-24 h-[70vh] w-full overflow-hidden rounded-[10px] shadow-xl"
            >
              {images.technology.map((src, i) => (
                <div
                  key={src}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute inset-0"
                  style={{ zIndex: i + 1 }}
                >
                  <Image
                    src={src}
                    alt={`Гардеробна VELLARO — ракурс ${i + 1}`}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    style={{ borderRadius: "10px" }}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
