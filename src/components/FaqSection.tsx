import { UniqueAccordion } from "@/components/ui/interactive-accordion";

const faq = [
  {
    id: "visit",
    q: "Скільки коштує виїзд заміру?",
    a: "У межах Києва — безкоштовно. По Україні — уточнюємо при заявці залежно від відстані.",
  },
  {
    id: "seats",
    q: "Чи можна замовити нестандартну кількість місць?",
    a: "Так, модульна система дозволяє від 2 до 10+ місць у будь-якій розкладці.",
  },
  {
    id: "warranty",
    q: "Який термін гарантії на електропривід?",
    a: "2 роки на електроніку та механізми, 5 років на каркас.",
  },
  {
    id: "lite",
    q: "Чи можна замовити тільки оббивку без функцій?",
    a: "Так, серія Lite — без електроприводу, з ручним механізмом розкладання.",
  },
  {
    id: "delivery",
    q: "Доставка по Україні/ЄС — скільки коштує?",
    a: "Розраховується індивідуально залежно від регіону та кількості крісел.",
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
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="mb-14 text-3xl font-medium md:text-4xl">FAQ</h2>
        <UniqueAccordion items={items} />
      </div>
    </section>
  );
}
