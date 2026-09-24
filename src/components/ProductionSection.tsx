"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export default function ProductionSection() {
  const t = useTranslations("Production");
  const sectionRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        collageRef.current,
        { autoAlpha: 0, x: -60 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        textRef.current,
        { autoAlpha: 0, x: 60 },
        {
          autoAlpha: 1,
          x: 0,
          duration: 1.4,
          delay: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="production"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-24 text-ink md:py-[300px]"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-start gap-32 px-6 md:flex-row md:items-center md:justify-between md:gap-0 md:px-10">
        <div ref={collageRef} className="relative w-[75%] max-w-[360px] md:w-[525px] md:max-w-full">
          <div className="relative aspect-[525/656] w-full max-w-full overflow-hidden rounded-[10px] md:aspect-auto md:h-[656px] md:w-[525px]">
            <Image
              src={images.production.main}
              alt={t("mainAlt")}
              fill
              sizes="525px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-[459/344] w-[87%] max-w-[459px] translate-x-[27%] translate-y-[40%] overflow-hidden rounded-[25px] border-[15px] border-white md:aspect-auto md:h-[344px] md:w-[459px]">
            <Image
              src={images.production.detail}
              alt={t("detailAlt")}
              fill
              sizes="459px"
              className="rounded-[10px] object-cover"
            />
          </div>
        </div>

        <div ref={textRef} className="w-full md:w-[38%]">
          <p className="mb-4 text-[18px] font-normal tracking-[0.06em] text-accent uppercase">
            {t("eyebrow")}
          </p>
          <h2 className="mb-6 text-[clamp(28px,4.5vw,43px)] leading-[1.1] font-medium tracking-[0.02em] text-ink">
            {t("heading")}
          </h2>
          <p className="w-[530px] max-w-full text-[clamp(16px,2.3vw,22px)] font-normal leading-[1.35] tracking-[0.02em] text-ink">
            {t("text")}
          </p>
        </div>
      </div>
    </section>
  );
}
