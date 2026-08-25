const steps = [
  {
    n: "01",
    title: "Заміряємо кімнату",
    text: "Самостійно за інструкцією або виїзд майстра.",
  },
  {
    n: "02",
    title: "Збираєте конфігурацію",
    text: "Серія, кількість місць, оздоблення, функції.",
  },
  {
    n: "03",
    title: "Отримуєте готовий зал",
    text: "Виготовлення і монтаж за 4–6 тижнів.",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="mb-14 text-3xl font-medium md:text-4xl">
          Як це працює
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="mb-4 text-sm text-brown-500">{s.n}</p>
              <h3 className="mb-2 text-xl font-medium">{s.title}</h3>
              <p className="text-brown-700">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
