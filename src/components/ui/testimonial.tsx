"use client";

import { TimelineContent } from "@/components/ui/timeline-animation";
import Image from "next/image";
import { useRef } from "react";
import type { Variants } from "framer-motion";

// Стокові портрети (randomuser.me, безкоштовні для демо) — цей лендинг є
// портфоліо-кейсом вигаданого бренду, реальних клієнтів VELLARO не існує.
const testimonials = [
  {
    name: "Олена Ковальчук",
    role: "Київ",
    text: "Замовляли крісла-стадіум на 5 місць у власний будинок. Прийшли за 5 тижнів, зібрали за день. Діти тепер не вилазять із кінозали.",
    tone: "light" as const,
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Ігор Тарасенко",
    role: "Львів",
    text: "Довго підбирали оздоблення — команда VELLARO надіслала зразки додому, щоб побачити колір наживо. Результат перевершив очікування.",
    tone: "accent" as const,
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
  },
  {
    name: "Марина Бондар",
    role: "Одеса",
    text: "Електропривід працює безшумно, підігрів — саме те, чого не вистачало взимку. Рекомендую серію Signature.",
    tone: "dark" as const,
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
  },
  {
    name: "Дмитро Савчук",
    role: "Дніпро",
    text: "Виїзд майстра для заміру зробили безкоштовно й швидко. Конфігуратор на сайті допоміг одразу побачити, як зал виглядатиме.",
    tone: "dark" as const,
    photo: "https://randomuser.me/api/portraits/men/76.jpg",
  },
  {
    name: "Олег Петренко",
    role: "Запоріжжя",
    text: "Замовили друге крісло через рік, щоб доповнити комплект. Колір і оздоблення підібрали ідентично — різниці зовсім не видно.",
    tone: "dark" as const,
    photo: "https://randomuser.me/api/portraits/men/23.jpg",
  },
  {
    name: "Наталія Гриценко",
    role: "Харків",
    text: "Обрали серію Comfort — якість оббивки на рівні імпортних брендів, але з локальним сервісом і гарантією.",
    tone: "accent" as const,
    photo: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Андрій Мельник",
    role: "Вінниця",
    text: "Монтаж зробили за один візит, показали, як користуватись усіма функціями. Через рік — жодних нарікань до механізмів.",
    tone: "light" as const,
    photo: "https://randomuser.me/api/portraits/men/91.jpg",
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
  dark: "bg-brown-950 text-cream",
  accent: "bg-brown-700 text-cream",
  light: "bg-cream-dim text-brown-950 border border-brown-300/40",
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
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8a6b4d1a_1px,transparent_1px),linear-gradient(to_bottom,#8a6b4d1a_1px,transparent_1px)] bg-[size:50px_56px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      )}
      <article className="relative mt-auto">
        <p>&ldquo;{t.text}&rdquo;</p>
        <div className="flex items-end justify-between pt-5">
          <div>
            <h3 className="font-semibold">{t.name}</h3>
            <p className={t.tone === "light" ? "text-brown-700" : "text-cream/60"}>
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
          {layout.map(({ t, col, row }, i) => (
            <Card key={t.name} t={t} i={i} col={col} row={row} timelineRef={testimonialRef} />
          ))}
        </div>
      </div>
    </section>
  );
}
