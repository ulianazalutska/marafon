"use client";

import { motion } from "framer-motion";
import { UniqueAccordion } from "@/components/ui/interactive-accordion";

const faq = [
  {
    id: "visit",
    q: "Скільки коштує виїзд заміру?",
    a: "У межах Києва — безкоштовно. По Україні — уточнюємо при заявці залежно від відстані.",
  },
  {
    id: "layout",
    q: "Чи можна замовити нестандартну конфігурацію гардеробної?",
    a: "Так, модульна система дозволяє скласти будь-яку розкладку — від кутової ніші до гардеробної кімнати на всю стіну.",
  },
  {
    id: "warranty",
    q: "Який термін гарантії на фурнітуру та механізми?",
    a: "2 роки на доводчики, електрокарниз та підсвітку, 5 років на каркас.",
  },
  {
    id: "lite",
    q: "Чи можна замовити гардеробну без підсвітки та електрокарниза?",
    a: "Так, серія Lite — ламінатні фасади зі стандартною фурнітурою, без технологічного пакета.",
  },
  {
    id: "delivery",
    q: "Доставка по Україні/ЄС — скільки коштує?",
    a: "Розраховується індивідуально залежно від регіону та метражу гардеробної.",
  },
];

const items = faq.map((item, i) => ({
  id: item.id,
  number: String(i + 1).padStart(2, "0"),
  title: item.q,
  content: item.a,
}));

export default function FaqSection() {
  return (
    <section className="bg-cream pb-24 md:pb-32">
      <motion.div
        className="mx-auto max-w-5xl px-6 md:px-10"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2
          className="mb-14 font-normal"
          style={{ fontSize: "45px", letterSpacing: "0.04em", color: "var(--color-ink)" }}
        >
          FAQ
        </h2>
        <UniqueAccordion items={items} />
      </motion.div>
    </section>
  );
}
