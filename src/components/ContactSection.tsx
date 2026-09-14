"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "120+", label: "залів по Україні" },
  { value: "5 років", label: "гарантії на каркас" },
  { value: "5 тижнів", label: "середній термін виготовлення" },
];

const fields = [
  { name: "name", label: "Ім'я", type: "text", required: true },
  { name: "phone", label: "Телефон", type: "tel", required: true },
  {
    name: "room",
    label: "Метраж кімнати (опційно)",
    type: "text",
    required: false,
  },
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        introRef.current,
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
        formRef.current,
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
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden bg-cream py-24 text-ink md:py-32"
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2 md:gap-20 md:px-10">
        <div ref={introRef}>
          <p className="mb-4 text-sm tracking-[0.3em] text-brown-500 uppercase">
            Заявка
          </p>
          <h2 className="relative max-w-md text-4xl leading-[1.15] font-medium md:text-5xl">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-3 -left-4 font-serif text-3xl text-brown-500 select-none"
            >
              &#10077;
            </span>
            Готові побачити свій зал?
          </h2>
          <p className="mt-6 max-w-sm text-brown-700">
            Залиште контакти — надішлемо 3D-візуалізацію конфігурації
            безкоштовно протягом 2 днів.
          </p>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-brown-300/60 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl font-medium md:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-2 text-xs leading-snug text-brown-500 uppercase tracking-wide">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={formRef}>
          <form className="flex flex-col gap-8">
            {fields.map((field) => (
              <label key={field.name} className="group relative block">
                <input
                  type={field.type}
                  name={field.name}
                  placeholder=" "
                  required={field.required}
                  className="peer w-full border-b border-brown-300/60 bg-transparent py-2 text-ink outline-none transition-colors focus:border-ink"
                />
                <span className="pointer-events-none absolute top-2 left-0 text-brown-500 transition-all duration-200 peer-focus:-top-4 peer-focus:text-xs peer-focus:tracking-wide peer-focus:text-brown-700 peer-[&:not(:placeholder-shown)]:-top-4 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:tracking-wide peer-[&:not(:placeholder-shown)]:text-brown-700">
                  {field.label}
                </span>
                <span className="absolute bottom-0 left-0 h-px w-0 bg-ink transition-all duration-300 ease-out peer-focus:w-full" />
              </label>
            ))}

            <button
              type="submit"
              className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm tracking-wide text-cream transition-colors hover:bg-brown-800"
            >
              Отримати візуалізацію
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-1"
              >
                &rarr;
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
