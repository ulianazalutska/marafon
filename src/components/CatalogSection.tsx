import Image from "next/image";
import { images } from "@/lib/images";

const series = [
  {
    key: "lite",
    name: "Lite",
    description: "Базова серія, тканина, ручний механізм розкладання.",
    price: "від 32 900 грн",
    features: ["Тканина", "Ручний механізм", "2–5 місць"],
    image: images.catalog.lite,
  },
  {
    key: "comfort",
    name: "Comfort",
    description: "Електропривід, підігрів, підсклянники з підсвіткою.",
    price: "від 48 900 грн",
    features: ["Електропривід", "Підігрів", "2–7 місць"],
    image: images.catalog.comfort,
  },
  {
    key: "signature",
    name: "Signature",
    description: "Шкіра/оксамит, масаж, повний технологічний пакет.",
    price: "від 79 900 грн",
    features: ["Оксамит/шкіра", "Масаж", "До 10 місць"],
    image: images.catalog.signature,
  },
];

export default function CatalogSection() {
  return (
    <section id="catalog" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl font-medium md:text-4xl">
            Три серії — під ваш зал і бюджет
          </h2>
          <p className="max-w-sm text-brown-700">
            Кожну модель адаптуємо під метраж кімнати та кількість глядачів.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {series.map((item) => (
            <a
              key={item.key}
              href="#contact"
              className="group flex flex-col overflow-hidden rounded-2xl bg-brown-950 text-cream"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={`Крісло серії ${item.name}`}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-medium">{item.name}</h3>
                  <span className="text-sm text-brown-300">{item.price}</span>
                </div>
                <p className="text-sm text-cream/70">{item.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2 pt-4 text-xs tracking-wide text-cream/60">
                  {item.features.map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-cream/20 px-3 py-1"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
