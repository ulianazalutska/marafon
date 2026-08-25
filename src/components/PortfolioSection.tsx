import Image from "next/image";
import { images } from "@/lib/images";

const projects = [
  { area: "28 м²", seats: "5 місць", series: "Comfort", note: "Сім'я з двома дітьми" },
  { area: "18 м²", seats: "3 місця", series: "Signature", note: "Квартира-студія" },
  { area: "34 м²", seats: "7 місць", series: "Signature", note: "Будинок під Києвом" },
  { area: "22 м²", seats: "4 місця", series: "Comfort", note: "Пентхаус" },
  { area: "16 м²", seats: "2 місця", series: "Lite", note: "Холостяцька квартира" },
  { area: "40 м²", seats: "10 місць", series: "Signature", note: "Приватний кінозал" },
];

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="bg-brown-950 py-24 text-cream md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 className="max-w-xl text-3xl font-medium md:text-4xl">
            Понад 120 реалізованих кінозалів по Україні
          </h2>
          <p className="max-w-sm text-cream/60">
            Кожен проєкт — індивідуальна конфігурація під кімнату клієнта.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div
              key={i}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <Image
                src={images.portfolio[i]}
                alt={`Кінозал ${p.area}, ${p.seats}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brown-950/90 via-brown-950/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-sm text-cream/70">{p.note}</p>
                <p className="mt-1 text-sm tracking-wide">
                  {p.area} · {p.seats} · {p.series}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
