"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PanInfo, Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { area: "8 м²", sections: "6 секцій", series: "Comfort", note: "Сім'я з двома дітьми" },
  { area: "5 м²", sections: "4 секції", series: "Signature", note: "Квартира-студія" },
  { area: "12 м²", sections: "9 секцій", series: "Signature", note: "Будинок під Києвом" },
  { area: "7 м²", sections: "5 секцій", series: "Comfort", note: "Пентхаус" },
  { area: "4 м²", sections: "3 секції", series: "Lite", note: "Холостяцька квартира" },
  { area: "15 м²", sections: "12 секцій", series: "Signature", note: "Приватна гардеробна-острів" },
];

const SWIPE_DISTANCE = 100;
const SWIPE_VELOCITY = 450;

// Фото завжди сидить в межах свого блоку праворуч (без стрічки на всю
// ширину). "Наступне" завжди визирає статичною смужкою праворуч.
//
// Обидва напрямки — суцільний "штовхаючий" рух: нове фото заїжджає з того
// самого місця, де щойно було старе (або де визирала смужка-підгляд), а
// старе одночасно їде в протилежний бік і зникає геть за межі екрана. Рухи
// дзеркальні одне одному, тому вперед і назад виглядають однаково плавно.
const slideVariants: Variants = {
  enter: (dir: "next" | "prev") =>
    dir === "next"
      ? { x: "calc(100% + 45px)", scale: 1, opacity: 1, zIndex: 20 }
      : { x: "-260%", scale: 1, opacity: 1, zIndex: 20 },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    zIndex: 20,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: "next" | "prev") => ({
    x: dir === "next" ? "-260%" : "calc(100% + 45px)",
    scale: 1,
    opacity: 1,
    zIndex: 5,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
};

function Slide({
  index,
  total,
  direction,
  onCommit,
}: {
  index: number;
  total: number;
  direction: "next" | "prev";
  onCommit: (dir: "next" | "prev") => void;
}) {
  const p = projects[index];

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const goNext = info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY;
    const goPrev = info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY;

    if (goNext && index < total - 1) onCommit("next");
    else if (goPrev && index > 0) onCommit("prev");
  };

  return (
    <motion.div
      className="absolute inset-0 flex cursor-grab flex-col active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <div className="relative flex-1">
        <Image
          src={images.portfolioCarousel[index]}
          alt={`Гардеробна ${p.area}, ${p.sections}`}
          fill
          draggable={false}
          sizes="(min-width: 768px) 55vw, 90vw"
          className="pointer-events-none object-cover"
        />
      </div>
      <p className="pt-[20px] text-[21px] leading-[25px] tracking-[0.04em] whitespace-nowrap text-[#362F2B]">
        {p.area}, {p.sections}, {p.series} — {p.note}
      </p>
    </motion.div>
  );
}

export default function PortfolioSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const total = projects.length;

  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          textRef.current,
          { autoAlpha: 0, x: -40 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );

        gsap.fromTo(
          stageRef.current,
          { autoAlpha: 0, scale: 0.96 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1,
            delay: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCommit = (dir: "next" | "prev") => {
    setDirection(dir);
    setIndex((i) => (dir === "next" ? Math.min(i + 1, total - 1) : Math.max(i - 1, 0)));
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative mt-[225px] overflow-hidden bg-cream pb-[225px] text-ink"
    >
      <div className="flex flex-col gap-10 md:flex-row md:gap-6">
        {/* Фіксований текстовий блок зліва */}
        <div
          ref={textRef}
          className="relative z-30 flex shrink-0 flex-col justify-between gap-10 px-6 md:w-[40%] md:px-0 md:pl-10"
        >
          <div>
            <h2 className="max-w-xl text-[45px] leading-[54px] font-normal tracking-[0.04em] text-[#362F2B] mb-[21px]">
              Понад 120 реалізованих гардеробних по Україні
            </h2>
            <p className="mt-4 max-w-[429px] text-[24px] leading-[29px] font-normal tracking-[0.04em] text-[#362F2B]">
              Кожен проєкт — індивідуальна конфігурація під кімнату клієнта
            </p>
          </div>
          <p className="text-[21px] leading-[25px] tracking-[0.04em] tabular-nums text-accent">
            {index + 1} з {total}
          </p>
        </div>

        {/* Фото тримається праворуч, у своєму блоці. При переході вилітає вліво. */}
        <div className="min-w-0 flex-1 px-6 md:px-0">
          <div
            ref={stageRef}
            className="relative h-[calc(58vh+40px)] w-[90%] md:h-[532px] md:w-[655px]"
          >
            {/* Наступне фото визирає статичною смужкою праворуч, разом зі своїм підписом */}
            {index + 1 < total && (
              <div className="absolute inset-0 z-0 flex translate-x-[calc(100%+45px)] flex-col overflow-hidden">
                <div className="relative flex-1">
                  <Image
                    src={images.portfolioCarousel[index + 1]}
                    alt=""
                    fill
                    draggable={false}
                    sizes="787px"
                    className="pointer-events-none object-cover"
                  />
                </div>
                <p className="pt-[20px] text-[21px] leading-[25px] tracking-[0.04em] whitespace-nowrap text-[#362F2B]">
                  {projects[index + 1].area}, {projects[index + 1].sections},{" "}
                  {projects[index + 1].series} — {projects[index + 1].note}
                </p>
              </div>
            )}

            <AnimatePresence initial={false} custom={direction}>
              <Slide
                key={index}
                index={index}
                total={total}
                direction={direction}
                onCommit={handleCommit}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
