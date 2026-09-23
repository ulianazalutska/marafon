"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { UniqueAccordion } from "@/components/ui/interactive-accordion";

export default function FaqSection() {
  const t = useTranslations("Faq");
  const faq = t.raw("items") as { q: string; a: string }[];
  const items = faq.map((item, i) => ({
    id: `faq-${i}`,
    number: String(i + 1).padStart(2, "0"),
    title: item.q,
    content: item.a,
  }));

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
          {t("heading")}
        </h2>
        <UniqueAccordion items={items} />
      </motion.div>
    </section>
  );
}
