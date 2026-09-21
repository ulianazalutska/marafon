"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { images } from "@/lib/images";

gsap.registerPlugin(ScrollTrigger);

const fields = [
  {
    name: "name",
    label: "Ім'я",
    type: "text",
    placeholder: "Андрій Мельник",
  },
  {
    name: "phone",
    label: "Телефон",
    type: "tel",
    placeholder: "+380688580048",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "andriymel@gmail.com",
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

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

      gsap.fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
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
      id="contact"
      ref={sectionRef}
      className="relative mt-[255px] aspect-[1916/821] w-full overflow-hidden"
    >
      <div ref={imageWrapRef} className="absolute inset-0 -top-[12%] h-[124%]">
        <Image
          src={images.panoramaContact}
          alt="Гардеробна система VELLARO"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-brown-950/20" />

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 min-h-[466px] w-[336px] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={cardRef}
            className="h-full min-h-[466px] w-[336px] rounded-[20px] bg-white px-[38px] py-[44px] shadow-[0_30px_60px_-15px_rgba(28,20,13,0.45)]"
          >
            <h2 className="text-center text-[20px] font-normal tracking-[0.04em] text-ink">
              Зв&apos;яжіться з нами
            </h2>

            <form className="mt-6 flex flex-col gap-[10px]">
              {fields.map((field) => (
                <label key={field.name} className="block">
                  <span className="block text-[14px] font-normal tracking-normal text-[#AF957C]">
                    {field.label}
                  </span>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    required
                    className="mt-2 w-full rounded-[10px] bg-[#F6F6F6] pt-[9px] pr-[17px] pb-[9px] pl-[17px] text-[11px] font-normal text-[#CAC4BF] outline-none placeholder:text-[#CAC4BF]"
                  />
                </label>
              ))}

              <label className="block">
                <span className="block text-[14px] font-normal tracking-normal text-[#AF957C]">
                  Повідомлення
                </span>
                <textarea
                  name="message"
                  placeholder="Пишіть тут"
                  rows={2}
                  className="mt-2 w-full resize-none rounded-[10px] bg-[#F6F6F6] pt-[9px] pr-[17px] pb-[42px] pl-[17px] text-[11px] font-normal text-[#CAC4BF] outline-none placeholder:text-[#CAC4BF]"
                />
              </label>

              <p className="text-[8px] leading-tight tracking-normal text-brown-850 uppercase">
                By submitting, you agree to our{" "}
                <a href="#" className="underline">
                  terms
                </a>{" "}
                and privacy policy
              </p>

              <button
                type="submit"
                className="mt-2 inline-flex items-center gap-3 self-center rounded-full bg-accent py-[4px] pr-[7px] pl-[10px] text-sm font-normal text-white transition-opacity hover:opacity-90"
              >
                Отримати візуалізацію
                <span className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full bg-white">
                  <svg width="13.67" height="13.67" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 7.64L7.64 0.5M7.64 5.9264V0.5H2.2136" stroke="#AF957C" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
