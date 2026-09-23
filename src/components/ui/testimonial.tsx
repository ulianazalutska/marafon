"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import type { Variants } from "framer-motion";

// Photos are local stock portraits (originally from randomuser.me, free for
// demo use) — this landing is a portfolio case study for a fictional brand,
// no real ARMADERO clients exist. tone/photo don't change per locale, so
// they stay here; name/role/text come from messages/*.json ("Testimonials").
const testimonialMeta = [
  { tone: "light" as const, photo: "/testimonials/olena-kovalchuk.webp" },
  { tone: "accent" as const, photo: "/testimonials/ihor-tarasenko.webp" },
  { tone: "dark" as const, photo: "/testimonials/maryna-bondar.webp" },
  { tone: "dark" as const, photo: "/testimonials/dmytro-savchuk.webp" },
  { tone: "dark" as const, photo: "/testimonials/oleh-petrenko.webp" },
  { tone: "accent" as const, photo: "/testimonials/nataliia-hrytsenko.webp" },
  { tone: "light" as const, photo: "/testimonials/andrii-melnyk.webp" },
];

const revealVariants: Variants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
  hidden: {
    filter: "blur(10px)",
    y: -20,
    opacity: 0,
  },
};

const toneClasses = {
  dark: "bg-brown-850 text-cream",
  accent: "bg-accent text-cream",
  light: "bg-cream text-ink border border-accent",
};

function Avatar({ name, photo }: { name: string; photo: string }) {
  return (
    <Image
      src={photo}
      alt={name}
      width={64}
      height={64}
      className="h-16 w-16 shrink-0 rounded-xl object-cover"
    />
  );
}

type Testimonial = {
  name: string;
  role: string;
  text: string;
  tone: "light" | "accent" | "dark";
  photo: string;
};

function Card({
  t,
  i,
  col,
  row,
  timelineRef,
}: {
  t: Testimonial;
  i: number;
  col: number;
  row: string;
  timelineRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <TimelineContent
      as="div"
      animationNum={i}
      customVariants={revealVariants}
      timelineRef={timelineRef}
      style={{ gridColumn: col, gridRow: row }}
      className={`relative flex flex-col justify-between overflow-hidden rounded-lg p-5 ${toneClasses[t.tone]}`}
    >
      {t.tone === "light" && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#AF957C4d_1px,transparent_1px),linear-gradient(to_bottom,#AF957C4d_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      )}
      <article className="relative mt-auto">
        <p>&ldquo;{t.text}&rdquo;</p>
        <div className="flex items-end justify-between pt-5">
          <div>
            <h3 className="font-semibold">{t.name}</h3>
            <p className={t.tone === "light" ? "text-ink" : "text-cream/60"}>
              {t.role}
            </p>
          </div>
          <Avatar name={t.name} photo={t.photo} />
        </div>
      </article>
    </TimelineContent>
  );
}

export default function ClientFeedback() {
  const t = useTranslations("Testimonials");
  const testimonialRef = useRef<HTMLDivElement>(null);

  const names = t.raw("list") as { name: string; role: string; text: string }[];
  const testimonials: Testimonial[] = names.map((n, i) => ({ ...n, ...testimonialMeta[i] }));
  const layout = [
    { t: testimonials[0], col: 1, row: "1 / span 2" },
    { t: testimonials[1], col: 1, row: "3" },
    { t: testimonials[2], col: 2, row: "1" },
    { t: testimonials[3], col: 2, row: "2" },
    { t: testimonials[4], col: 2, row: "3" },
    { t: testimonials[5], col: 3, row: "1" },
    { t: testimonials[6], col: 3, row: "2 / span 2" },
  ];

  return (
    <section ref={testimonialRef} className="relative z-10 mb-[225px] bg-cream pt-16 md:pt-20">
      <div className="mx-auto max-w-[1440px] px-6">
        <article className="mx-auto max-w-screen-md space-y-3 text-center">
          <TimelineContent
            as="h2"
            animationNum={0}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
            className="text-[45px] font-normal tracking-[0.02em]"
          >
            {t("heading")}
          </TimelineContent>
          <TimelineContent
            as="p"
            animationNum={1}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
            className="mb-6 text-[20px] font-normal tracking-[0.02em] text-brown-850"
          >
            {t("subtitle")}
          </TimelineContent>
        </article>

        <div className="flex flex-col gap-4 pt-[50px] pb-4 md:grid md:grid-cols-3 md:gap-4 md:pt-[50px] md:pb-10">
          {layout.map(({ t: testimonial, col, row }, i) => (
            <Card key={testimonial.name} t={testimonial} i={i} col={col} row={row} timelineRef={testimonialRef} />
          ))}
        </div>
      </div>
    </section>
  );
}
