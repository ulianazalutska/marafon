const testimonials = [
  {
    name: "Олена, Київ",
    text: "Замовляли крісла-стадіум на 5 місць у власний будинок. Прийшли за 5 тижнів, зібрали за день. Діти тепер не вилазять із кінозали.",
  },
  {
    name: "Ігор, Львів",
    text: "Довго підбирали оздоблення — команда VELLARO надіслала зразки додому, щоб побачити колір наживо. Результат перевершив очікування.",
  },
  {
    name: "Марина, Одеса",
    text: "Електропривід працює безшумно, підігрів — саме те, чого не вистачало взимку. Рекомендую серію Signature.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <h2 className="mb-14 text-3xl font-medium md:text-4xl">Відгуки</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-brown-800/5 p-8 text-brown-800"
            >
              <p className="mb-6 text-brown-800/90">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm tracking-wide text-brown-500">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
