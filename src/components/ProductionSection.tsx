"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

export default function ProductionSection() {
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
            toggleActions: "play none none reverse",
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
            toggleActions: "play none none reverse",
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
      className="relative overflow-hidden bg-cream py-24 text-ink md:py-32"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <div ref={collageRef} className="relative">
          <div className="relative aspect-[4/5] w-[78%] overflow-hidden">
            <Image
              src={images.production.main}
              alt="Майстер VELLARO за роботою"
              fill
              sizes="(min-width: 768px) 40vw, 78vw"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 aspect-[4/3] w-[58%] translate-x-[8%] translate-y-[12%] overflow-hidden shadow-2xl ring-8 ring-cream">
            <Image
              src={images.production.detail}
              alt="Інструменти та матеріали в майстерні VELLARO"
              fill
              sizes="(min-width: 768px) 28vw, 55vw"
              className="object-cover"
            />
          </div>
        </div>

        <div ref={textRef}>
          <p className="mb-4 text-sm tracking-[0.3em] text-brown-500 uppercase">
            Про виробництво
          </p>
          <h2 className="mb-6 text-3xl font-medium md:text-4xl">
            Цех, а не конвеєр
          </h2>
          <p className="max-w-md text-brown-700">
            VELLARO — команда столярів і оббивників у Києві. Кожне крісло
            робимо під конкретне замовлення: каркас із масиву бука, механізми
            сертифікованих європейських постачальників, оббивка вручну, шов за
            швом. Кожна модель проходить тест на 20 000 циклів розкладання.
          </p>
        </div>
      </div>
    </section>
  );
}
