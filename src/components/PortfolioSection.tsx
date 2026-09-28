"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

type Project = { area: string; sections: string; series: string; note: string };

export default function PortfolioSection() {
  const t = useTranslations("Portfolio");
  const projects = t.raw("projects") as Project[];
  const [index, setIndex] = useState(0);
  const total = projects.length;

  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

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

  // Крок = відстань між лівими краями двох сусідніх слайдів (слайд вужчий за
  // трек, тому це не дорівнює clientWidth — саме так формується "підглядання"
  // наступного фото).
  const getStep = () => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return track?.clientWidth ?? 0;
    const a = track.children[0] as HTMLElement;
    const b = track.children[1] as HTMLElement;
    return b.offsetLeft - a.offsetLeft;
  };

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    const step = getStep();
    if (!track || !step) return;
    track.scrollTo({ left: i * step, behavior: "smooth" });
  };

  const handleScroll = () => {
    const track = trackRef.current;
    const step = getStep();
    if (!track || !step) return;
    setIndex(Math.round(track.scrollLeft / step));
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative mt-[225px] overflow-hidden bg-cream pb-[225px] text-ink"
    >
      <div className="mx-auto flex max-w-[1800px] flex-col gap-10 md:flex-row md:gap-10">
        {/* Фіксований текстовий блок зліва */}
        <div
          ref={textRef}
          className="relative z-30 flex shrink-0 flex-col justify-between gap-10 px-6 md:w-[40%] md:px-0 md:pl-10"
        >
          <div>
            <h2 className="max-w-xl text-[clamp(28px,5vw,45px)] leading-[1.2] font-normal tracking-[0.04em] text-ink mb-[21px] max-[1270px]:text-[26px] max-[767px]:text-[30px]">
              {t("heading")}
            </h2>
            <p className="mt-4 max-w-[429px] text-[clamp(17px,2.5vw,24px)] leading-[1.2] font-normal tracking-[0.04em] text-ink max-[1270px]:text-[16px] max-[767px]:text-[18px]">
              {t("subtitle")}
            </p>
          </div>
          <p
            aria-live="polite"
            className="text-[21px] leading-[25px] tracking-[0.04em] tabular-nums text-accent max-[1270px]:text-[17px] max-[767px]:text-[19px]"
          >
            {index + 1} {t("counterOf")} {total}
          </p>
        </div>

        {/* Фото тримається праворуч, у своєму блоці. На мобільному —
            full-bleed на всю ширину екрана (без px, на відміну від
            текстового блоку зліва), від md — у межах своєї колонки. */}
        <div className="min-w-0 flex-1 md:px-0">
          <div
            ref={stageRef}
            className="relative h-[calc(58vh+40px)] w-full lg:h-[532px]"
          >
            <div
              ref={trackRef}
              tabIndex={0}
              role="group"
              aria-label={t("heading")}
              onScroll={handleScroll}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" && index < total - 1) scrollToIndex(index + 1);
                else if (e.key === "ArrowLeft" && index > 0) scrollToIndex(index - 1);
              }}
              className="flex h-full w-full overflow-x-hidden scroll-smooth outline-none focus-visible:ring-2 focus-visible:ring-accent md:gap-4"
            >
              {projects.map((p, i) => (
                <div
                  key={i}
                  className="flex h-full w-full flex-none flex-col md:w-[calc(100%-70px)]"
                >
                  <div className="relative flex-1">
                    <Image
                      src={images.portfolioCarousel[i]}
                      alt={`${t("altPrefix")} ${p.area}, ${p.sections}`}
                      fill
                      draggable={false}
                      sizes="(min-width: 768px) 55vw, 90vw"
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                      className="pointer-events-none object-cover"
                    />
                  </div>
                  <p className="min-h-[70px] px-6 pt-[20px] text-[21px] leading-[25px] tracking-[0.04em] text-ink md:min-h-[65px] md:px-0 md:whitespace-nowrap max-[1270px]:text-[17px] max-[767px]:text-[19px]">
                    {p.area}, {p.sections}, {p.series} — {p.note}
                  </p>
                </div>
              ))}
            </div>

            {index > 0 && (
              <button
                type="button"
                onClick={() => scrollToIndex(index - 1)}
                aria-label={t("prev")}
                className="group absolute left-4 top-[calc((100%-70px)/2)] z-20 flex h-[31px] w-[31px] -translate-y-1/2 items-center justify-center rounded-full bg-cream shadow-md transition hover:bg-brown-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 21 16"
                  fill="none"
                  className="transition-transform duration-300 ease-out group-hover:-translate-x-[3px]"
                >
                  <path
                    d="M20.499863 7.84557H1.1681M8.5142 15.1916L1.1681 7.84557L8.5142 0.499498"
                    stroke="var(--color-accent)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}

            {index < total - 1 && (
              <button
                type="button"
                onClick={() => scrollToIndex(index + 1)}
                aria-label={t("next")}
                className="group absolute right-4 top-[calc((100%-70px)/2)] z-20 flex h-[31px] w-[31px] -translate-y-1/2 items-center justify-center rounded-full bg-cream shadow-md transition hover:bg-brown-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 21 16"
                  fill="none"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-[3px]"
                >
                  <path
                    d="M0.500137 7.84557H19.8319M12.4858 15.1916L19.8319 7.84557L12.4858 0.499498"
                    stroke="var(--color-accent)"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
