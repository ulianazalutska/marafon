"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessFinaleSection() {
  const t = useTranslations("ProcessFinale");
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div
        ref={imageRef}
        className="absolute -top-[10%] left-0 h-[120%] w-full will-change-transform"
      >
        <Image
          src={images.processFinale}
          alt={t("alt")}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/85 via-brown-950/25 to-brown-950/35" />

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
        <h2 className="w-[571px] max-w-full text-[clamp(32px,8vw,64px)] leading-[1.2] font-semibold tracking-[0.02em] text-white">
          {t("line1")}
          <br />
          {t("line2Prefix")}<span className="italic">{t("line2Italic")}</span>
          <br />
          {t("line3")}
        </h2>
        <a
          href="#contact"
          className="group inline-flex items-center gap-3 rounded-full bg-accent py-[8px] pr-[10px] pl-[16px] text-[19px] font-light tracking-[0.02em] text-white transition-opacity hover:opacity-90"
        >
          {t("cta")}
          <span className="flex h-[31px] w-[31px] items-center justify-center overflow-hidden rounded-full bg-white">
            <svg
              width="13.67"
              height="13.67"
              viewBox="0 0 9 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
            >
              <path d="M0.5 7.64L7.64 0.5M7.64 5.9264V0.5H2.2136" stroke="var(--color-accent)" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
