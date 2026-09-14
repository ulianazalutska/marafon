"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessFinaleSection() {
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
          alt="Домашній кінозал VELLARO на заході сонця"
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-brown-950/20" />

      <div className="relative flex flex-col items-center gap-8 px-6 text-center">
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
    </section>
  );
}
