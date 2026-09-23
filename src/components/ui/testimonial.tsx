"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { useRef } from "react";
import type { Variants } from "framer-motion";

// Стокові портрети (randomuser.me, безкоштовні для демо) — цей лендинг є
// портфоліо-кейсом вигаданого бренду, реальних клієнтів ARMADERO не існує.
const testimonials = [
  {
    name: "Олена Ковальчук",
    role: "Київ",
    text: "Замовляли гардеробну на всю стіну спальні. Прийшли за 5 тижнів, зібрали за день. Тепер усі речі мають своє місце.",
    tone: "light" as const,
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Ігор Тарасенко",
    role: "Львів",
    text: "Довго підбирали оздоблення фасадів — команда ARMADERO надіслала зразки додому, щоб побачити колір наживо. Результат перевершив очікування.",
    tone: "accent" as const,
    photo: "/testimonials/ihor-tarasenko.webp",
  },
  {
    name: "Марина Бондар",
    role: "Одеса",
    text: "Доводчики працюють безшумно, підсвітка полиць вмикається автоматично — саме те, чого не вистачало. Рекомендую серію Signature.",
    tone: "dark" as const,
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Дмитро Савчук",
    role: "Дніпро",
    text: "Виїзд майстра для заміру зробили безкоштовно й швидко. Конфігуратор на сайті допоміг одразу побачити, як гардеробна виглядатиме.",
    tone: "dark" as const,
    photo: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    name: "Олег Петренко",
    role: "Запоріжжя",
    text: "Замовили другий модуль через рік, щоб доповнити гардеробну. Колір і оздоблення підібрали ідентично — різниці зовсім не видно.",
    tone: "dark" as const,
    photo: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    name: "Наталія Гриценко",
    role: "Харків",
    text: "Обрали серію Comfort — якість фурнітури на рівні імпортних брендів, але з локальним сервісом і гарантією.",
    tone: "accent" as const,
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Андрій Мельник",
    role: "Вінниця",
    text: "Монтаж зробили за один візит, показали, як користуватись висувними системами. Через рік — жодних нарікань до механізмів.",
    tone: "light" as const,
    photo: "https://randomuser.me/api/portraits/men/85.jpg",
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
  dark: "bg-brown-850 text-cream",
  accent: "bg-[#AF957C] text-cream",
  light: "bg-cream text-[#362F2B] border border-[#AF957C]",
};

const layout = [
  { t: testimonials[0], col: 1, row: "1 / span 2" },
  { t: testimonials[1], col: 1, row: "3" },
  { t: testimonials[2], col: 2, row: "1" },
  { t: testimonials[3], col: 2, row: "2" },
  { t: testimonials[4], col: 2, row: "3" },
  { t: testimonials[5], col: 3, row: "1" },
  { t: testimonials[6], col: 3, row: "2 / span 2" },
];

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

function Card({
  t,
  i,
  col,
  row,
  timelineRef,
}: {
  t: (typeof testimonials)[number];
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
            <p className={t.tone === "light" ? "text-[#362F2B]" : "text-cream/60"}>
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
  const testimonialRef = useRef<HTMLDivElement>(null);

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
            Що кажуть наші клієнти
          </TimelineContent>
          <TimelineContent
            as="p"
            animationNum={1}
            customVariants={revealVariants}
            timelineRef={testimonialRef}
            className="mb-6 text-[20px] font-normal tracking-[0.02em] text-brown-850"
          >
            Реальні відгуки власників гардеробних ARMADERO
          </TimelineContent>
        </article>

        <div className="flex flex-col gap-4 pt-[50px] pb-4 md:grid md:grid-cols-3 md:gap-4 md:pt-[50px] md:pb-10">
          {layout.map(({ t, col, row }, i) => (
            <Card key={t.name} t={t} i={i} col={col} row={row} timelineRef={testimonialRef} />
          ))}
        </div>
      </div>
    </section>
  );
}
