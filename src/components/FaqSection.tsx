const faq = [
  {
    q: "Скільки коштує виїзд заміру?",
    a: "У межах Києва — безкоштовно. По Україні — уточнюємо при заявці залежно від відстані.",
  },
  {
    q: "Чи можна замовити нестандартну кількість місць?",
    a: "Так, модульна система дозволяє від 2 до 10+ місць у будь-якій розкладці.",
  },
  {
    q: "Який термін гарантії на електропривід?",
    a: "2 роки на електроніку та механізми, 5 років на каркас.",
  },
  {
    q: "Чи можна замовити тільки оббивку без функцій?",
    a: "Так, серія Lite — без електроприводу, з ручним механізмом розкладання.",
  },
  {
    q: "Доставка по Україні/ЄС — скільки коштує?",
    a: "Розраховується індивідуально залежно від регіону та кількості крісел.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6 md:px-10">
        <h2 className="mb-14 text-3xl font-medium md:text-4xl">FAQ</h2>
        <div className="divide-y divide-brown-300/40">
          {faq.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between text-lg font-medium">
                {item.q}
                <span className="ml-4 text-brown-500 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-brown-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
