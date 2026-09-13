"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import { useRef } from "react";
import type { Variants } from "framer-motion";

const testimonials = [
  {
    name: "Олена Ковальчук",
    role: "Київ",
    text: "Замовляли крісла-стадіум на 5 місць у власний будинок. Прийшли за 5 тижнів, зібрали за день. Діти тепер не вилазять із кінозали.",
    tone: "accent" as const,
    size: "lg" as const,
  },
  {
    name: "Ігор Тарасенко",
    role: "Львів",
    text: "Довго підбирали оздоблення — команда VELLARO надіслала зразки додому, щоб побачити колір наживо. Результат перевершив очікування.",
    tone: "dark" as const,
    size: "sm" as const,
  },
  {
    name: "Марина Бондар",
    role: "Одеса",
    text: "Електропривід працює безшумно, підігрів — саме те, чого не вистачало взимку. Рекомендую серію Signature.",
    tone: "dark" as const,
    size: "lg" as const,
  },
  {
    name: "Дмитро Савчук",
    role: "Дніпро",
    text: "Виїзд майстра для заміру зробили безкоштовно й швидко. Конфігуратор на сайті допоміг одразу побачити, як зал виглядатиме.",
    tone: "dark" as const,
    size: "sm" as const,
  },
  {
    name: "Наталія Гриценко",
    role: "Харків",
    text: "Обрали серію Comfort — якість оббивки на рівні імпортних брендів, але з локальним сервісом і гарантією.",
    tone: "light" as const,
    size: "sm" as const,
  },
  {
    name: "Андрій Мельник",
    role: "Вінниця",
    text: "Монтаж зробили за один візит, показали, як користуватись усіма функціями. Через рік — жодних нарікань до механізмів.",
    tone: "light" as const,
    size: "lg" as const,
  },
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
  accent: "bg-brown-950 text-cream",
  dark: "bg-brown-900 text-cream",
  light: "bg-cream-dim text-brown-950 border border-brown-300/40",
};

const sizeClasses = {
  lg: "lg:flex-[7] flex-[6]",
  sm: "lg:flex-[3] flex-[4] lg:h-fit lg:shrink-0",
};

function Avatar({ name, tone }: { name: string; tone: keyof typeof toneClasses }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("");
  return (
    <span
      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-lg font-medium ${
        tone === "light"
          ? "bg-brown-950 text-cream"
          : "bg-cream text-brown-950"
      }`}
    >
      {initials}
    </span>
  );
}

function Card({
  t,
  i,
  timelineRef,
}: {
  t: (typeof testimonials)[number];
  i: number;
  timelineRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <TimelineContent
      as="div"
      animationNum={i}
      customVariants={revealVariants}
      timelineRef={timelineRef}
      className={`relative flex flex-col justify-between overflow-hidden rounded-lg border border-brown-300/30 p-5 ${sizeClasses[t.size]} ${toneClasses[t.tone]}`}
    >
      {t.tone === "light" && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8a6b4d1a_1px,transparent_1px),linear-gradient(to_bottom,#8a6b4d1a_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      )}
      <article className="relative mt-auto">
        <p className={t.size === "sm" ? "2xl:text-base text-sm" : ""}>
          &ldquo;{t.text}&rdquo;
        </p>
        <div className="flex items-end justify-between pt-5">
          <div>
            <h3 className="font-semibold">{t.name}</h3>
            <p className={t.tone === "light" ? "text-brown-700" : "text-cream/60"}>
              {t.role}
            </p>
          </div>
          <Avatar name={t.name} tone={t.tone} />
        </div>
      </article>
    </TimelineContent>
  );
}

export default function ClientFeedback() {
  const testimonialRef = useRef<HTMLDivElement>(null);
  const columns = [
    [testimonials[0], testimonials[1]],
    [testimonials[2], testimonials[3]],
    [testimonials[4], testimonials[5]],
  ];

  return (
    <section ref={testimonialRef} className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <article className="mx-auto max-w-screen-md space-y-3 text-center">
          <TimelineContent
            as="h2"
            animationNum={0}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
            className="text-3xl font-medium md:text-4xl"
          >
            Що кажуть наші клієнти
          </TimelineContent>
          <TimelineContent
            as="p"
            animationNum={1}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
            className="text-brown-700"
          >
            Реальні відгуки власників кінозалів VELLARO
          </TimelineContent>
        </article>

        <div className="flex flex-col gap-2 pt-10 pb-4 md:grid md:grid-cols-3 md:gap-2 md:py-10">
          {columns.map((col, ci) => (
            <div key={ci} className="flex h-full flex-col gap-2">
              {col.map((t, ii) => (
                <Card key={t.name} t={t} i={ci * 2 + ii} timelineRef={testimonialRef} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
