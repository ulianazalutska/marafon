"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

type PanoramaSectionProps = {
  image?: string;
  alt?: string;
  title?: React.ReactNode;
};

export default function PanoramaSection({
  image = images.panorama,
  alt = "Атмосфера домашнього кінозалу VELLARO",
  title = (
    <>
      Атмосфера <span className="italic">вашого</span>
      <br />
      кінозалу
    </>
  ),
}: PanoramaSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageWrapRef.current,
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
      className="relative h-[60vh] w-full overflow-hidden"
    >
      <div ref={imageWrapRef} className="absolute inset-0 h-[124%] -top-[12%]">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-brown-950/20" />

      {title && (
        <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10 md:pb-12">
          <p className="max-w-2xl text-2xl leading-tight font-light text-cream md:text-4xl">
            {title}
          </p>
        </div>
      )}
    </section>
  );
}
