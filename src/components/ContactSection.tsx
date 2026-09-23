"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

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
          alt="Гардеробна система ARMADERO"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brown-950/80 via-transparent to-brown-950/20" />

      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 min-h-[600px] w-[460px] -translate-x-1/2 -translate-y-1/2">
          <div
            ref={cardRef}
            className="h-full min-h-[600px] w-[460px] rounded-[24px] bg-white px-[52px] py-[56px] shadow-[0_30px_60px_-15px_rgba(28,20,13,0.45)]"
          >
            <h2 className="text-center text-[28px] font-normal tracking-[0.04em] text-ink">
              Зв&apos;яжіться з нами
            </h2>

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-16 flex flex-col items-center text-center"
                >
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 18 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-accent"
                  >
                    <motion.svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <motion.path
                        d="M4 10.5L8 14.5L16 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
                      />
                    </motion.svg>
                  </motion.span>
                  <p className="mt-6 text-[16px] leading-relaxed text-ink">
                    Дякуємо! Ваша заявка надіслана — ми зв&apos;яжемося з вами найближчим часом.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-[14px] font-normal tracking-normal text-[#AF957C] underline transition-opacity hover:opacity-70"
                  >
                    Повернутися до форми
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-8 flex flex-col gap-[16px]"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setError(false);
                    setSending(true);
                    const form = e.currentTarget;
                    const data = new FormData(form);
                    try {
                      const res = await fetch("/api/contact", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          type: "contact",
                          name: data.get("name"),
                          phone: data.get("phone"),
                          email: data.get("email"),
                          message: data.get("message"),
                          website: data.get("website"),
                        }),
                      });
                      if (!res.ok) throw new Error("request failed");
                      form.reset();
                      setSubmitted(true);
                    } catch {
                      setError(true);
                    } finally {
                      setSending(false);
                    }
                  }}
                >
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />
                  {fields.map((field) => (
                    <label key={field.name} className="block">
                      <span className="block text-[15px] font-normal tracking-normal text-[#AF957C]">
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        autoComplete="off"
                        required
                        className="mt-2 w-full rounded-[10px] border border-transparent bg-[#F6F6F6] pt-[13px] pr-[20px] pb-[13px] pl-[20px] text-[14px] font-normal text-[#CAC4BF] outline-none transition-colors duration-300 focus:border-[#362F2B] placeholder:text-[#CAC4BF]"
                      />
                    </label>
                  ))}

                  <label className="block">
                    <span className="block text-[15px] font-normal tracking-normal text-[#AF957C]">
                      Повідомлення
                    </span>
                    <textarea
                      name="message"
                      placeholder="Пишіть тут"
                      autoComplete="off"
                      rows={3}
                      className="mt-2 w-full resize-none rounded-[10px] border border-transparent bg-[#F6F6F6] pt-[13px] pr-[20px] pb-[42px] pl-[20px] text-[14px] font-normal text-[#CAC4BF] outline-none transition-colors duration-300 focus:border-[#362F2B] placeholder:text-[#CAC4BF]"
                    />
                  </label>

                  <p className="text-[10px] leading-tight tracking-normal text-brown-850 uppercase">
                    Надсилаючи форму, ви погоджуєтесь з{" "}
                    <a href="/terms" className="underline">
                      умовами використання
                    </a>{" "}
                    та{" "}
                    <a href="/privacy" className="underline">
                      політикою конфіденційності
                    </a>
                  </p>

                  {error && (
                    <p className="text-center text-[13px] text-red-600">
                      Не вдалося надіслати заявку. Спробуйте ще раз.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="group mt-2 inline-flex items-center gap-3 self-center rounded-full bg-accent py-[6px] pr-[8px] pl-[20px] text-base font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                  >
                    {sending ? "Надсилаємо..." : "Отримати візуалізацію"}
                    <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 9 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                      >
                        <path d="M0.5 7.64L7.64 0.5M7.64 5.9264V0.5H2.2136" stroke="#AF957C" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
