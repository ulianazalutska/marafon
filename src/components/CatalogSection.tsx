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
    dotPosition: "top-10 left-10 md:top-12 md:left-12",
  },
  {
    key: "comfort",
    name: "Comfort",
    description: "Електропривід, підігрів, підсклянники з підсвіткою.",
    price: "від 48 900 грн",
    features: ["Електропривід", "Підігрів", "2–7 місць"],
    image: images.catalog.comfort,
    dotPosition: "top-1/2 -translate-y-1/2 right-10 md:right-14",
  },
  {
    key: "signature",
    name: "Signature",
    description: "Шкіра/оксамит, масаж, повний технологічний пакет.",
    price: "від 79 900 грн",
    features: ["Оксамит/шкіра", "Масаж", "До 10 місць"],
    image: images.catalog.signature,
    dotPosition: "bottom-24 left-1/2 -translate-x-1/2 md:bottom-28",
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((item) => (
            <div key={item.key} className="flex flex-col">
              <a
                href="#contact"
                className="group relative flex aspect-[3/4] flex-col text-cream"
              >
                <div className="absolute inset-0 overflow-hidden bg-brown-950">
                  <Image
                    src={item.image}
                    alt={`Крісло серії ${item.name}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-transparent to-transparent" />
                </div>

                {/* Пульсуюча точка + інфо-блок на hover */}
                <div
                  className={`group/dot absolute z-10 flex h-11 w-11 cursor-pointer items-center justify-center ${item.dotPosition}`}
                >
                  <span className="pulse-ring absolute inline-flex h-11 w-11 rounded-full border border-cream/70" />
                  <span
                    className="pulse-ring absolute inline-flex h-11 w-11 rounded-full border border-cream/70"
                    style={{ animationDelay: "1.5s" }}
                  />
                  <span
                    className="pulse-ring absolute inline-flex h-11 w-11 rounded-full border border-cream/70"
                    style={{ animationDelay: "3s" }}
                  />
                  <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-cream text-brown-950 shadow-md transition-all duration-300 group-hover/dot:h-2.5 group-hover/dot:w-2.5">
                    <span className="text-lg leading-none font-light transition-opacity duration-150 group-hover/dot:opacity-0">
                      +
                    </span>
                  </span>

                  <div className="pointer-events-none absolute top-1/2 left-full ml-3 w-56 -translate-y-1/2 bg-brown-950 p-4 opacity-0 shadow-xl transition-opacity duration-200 group-hover/dot:opacity-100 md:w-64">
                    <span className="absolute top-1/2 -left-1.5 h-3 w-3 -translate-y-1/2 rotate-45 bg-brown-950" />
                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="text-sm font-medium text-cream">{item.name}</h4>
                      <span className="text-xs text-brown-300">{item.price}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-cream/70">
                      {item.description}
                    </p>
                    <ul className="mt-3 flex flex-wrap gap-1.5 text-[11px] tracking-wide text-cream/60">
                      {item.features.map((f) => (
                        <li
                          key={f}
                          className="border border-cream/20 px-2 py-0.5"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </a>

              {/* Підпис під карткою */}
              <div className="pt-4">
                <h3 className="text-xl font-medium text-ink">{item.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
