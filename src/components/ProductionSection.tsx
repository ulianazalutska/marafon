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
      className="relative overflow-hidden bg-cream py-[300px] text-ink"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-14 px-6 md:flex-row md:items-center md:justify-between md:gap-0 md:px-10">
        <div ref={collageRef} className="relative w-[525px] max-w-full">
          <div className="relative h-[656px] w-[525px] max-w-full overflow-hidden rounded-[10px]">
            <Image
              src={images.production.main}
              alt="Майстер ARMADERO за роботою"
              fill
              sizes="525px"
              className="object-cover"
            />
          </div>
          <div className="absolute right-0 bottom-0 h-[344px] w-[459px] max-w-full translate-x-[27%] translate-y-[40%] overflow-hidden rounded-[25px] border-[15px] border-white">
            <Image
              src={images.production.detail}
              alt="Столяр обробляє дерев'яний брус у майстерні ARMADERO"
              fill
              sizes="459px"
              className="rounded-[10px] object-cover"
            />
          </div>
        </div>

        <div ref={textRef} className="w-full md:w-[38%]">
          <p className="mb-4 text-[18px] font-normal tracking-[0.06em] text-accent uppercase">
            Про виробництво
          </p>
          <h2 className="mb-6 text-[43px] leading-[1.05] font-medium tracking-[0.02em] text-[#362F2B]">
            Цех, а не конвеєр
          </h2>
          <p className="w-[530px] max-w-full text-[22px] font-normal leading-[30px] tracking-[0.02em] text-[#362F2B]">
            ARMADERO — команда столярів у Києві. Кожну гардеробну робимо під
            конкретне замовлення: каркас із вологостійкого ЛДСП або масиву
            дуба, фурнітура сертифікованих європейських постачальників,
            збірка вручну, стик у стик. Кожен механізм проходить тест на
            50 000 циклів відкривання.
          </p>
        </div>
      </div>
    </section>
  );
}
