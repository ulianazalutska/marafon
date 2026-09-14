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
  { area: "28 м²", seats: "5 місць", series: "Comfort", note: "Сім'я з двома дітьми" },
  { area: "18 м²", seats: "3 місця", series: "Signature", note: "Квартира-студія" },
  { area: "34 м²", seats: "7 місць", series: "Signature", note: "Будинок під Києвом" },
  { area: "22 м²", seats: "4 місця", series: "Comfort", note: "Пентхаус" },
  { area: "16 м²", seats: "2 місця", series: "Lite", note: "Холостяцька квартира" },
  { area: "40 м²", seats: "10 місць", series: "Signature", note: "Приватний кінозал" },
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
      ? { x: "108%", scale: 1, opacity: 1, zIndex: 20 }
      : { x: "-260%", scale: 1, opacity: 1, zIndex: 20 },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    zIndex: 20,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (dir: "next" | "prev") => ({
    x: dir === "next" ? "-260%" : "108%",
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
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
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
      <Image
        src={images.portfolioCarousel[index]}
        alt={`Кінозал ${p.area}, ${p.seats}`}
        fill
        draggable={false}
        sizes="(min-width: 768px) 55vw, 90vw"
        className="pointer-events-none object-cover"
      />
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
              toggleActions: "play none none reverse",
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
              toggleActions: "play none none reverse",
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

  const current = projects[index];

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-24 text-ink md:py-32"
    >
      <div className="flex flex-col gap-10 md:flex-row">
        {/* Фіксований текстовий блок зліва */}
        <div
          ref={textRef}
          className="relative z-30 flex shrink-0 flex-col justify-between gap-10 px-6 md:h-[517px] md:w-[515px] md:px-0 md:pl-10"
        >
          <div>
            <h2 className="max-w-xl text-3xl font-medium md:text-4xl">
              Понад 120 реалізованих кінозалів по Україні
            </h2>
            <p className="mt-4 max-w-sm text-brown-700">
              Кожен проєкт — індивідуальна конфігурація під кімнату клієнта.
            </p>
          </div>
          <p className="text-sm tabular-nums text-brown-500">
            {String(index + 1).padStart(2, "0")} з {String(total).padStart(2, "0")}
          </p>
        </div>

        {/* Фото тримається праворуч, у своєму блоці. При переході вилітає вліво. */}
        <div className="min-w-0 flex-1 px-6 md:px-0">
          <div
            ref={stageRef}
            className="relative h-[58vh] w-[90%] md:h-[517px] md:w-[787px]"
          >
            {/* Наступне фото визирає статичною смужкою праворуч */}
            {index + 1 < total && (
              <div className="absolute inset-0 z-0 translate-x-[108%] overflow-hidden">
                <Image
                  src={images.portfolioCarousel[index + 1]}
                  alt=""
                  fill
                  draggable={false}
                  sizes="200px"
                  className="pointer-events-none object-cover"
                />
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

          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-sm text-brown-700"
            >
              {current.note} · {current.area} · {current.seats} · {current.series}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
