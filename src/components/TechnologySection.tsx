import Image from "next/image";
import { images } from "@/lib/images";

const features = [
  "Електропривід",
  "Підігрів",
  "Масаж",
  "Підсвітка",
  "Бездротова зарядка",
  "Столик-підсклянник",
];

const swatches = [
  { name: "Оксамит Cognac" },
  { name: "Шкіра Espresso" },
  { name: "Тканина Sand" },
  { name: "Оксамит Forest" },
  { name: "Шкіра Chestnut" },
  { name: "Тканина Stone" },
];

export default function TechnologySection() {
  return (
    <section id="technology" className="bg-cream py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="max-w-md text-3xl font-medium md:text-4xl">
            Технології та оздоблення
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-4">
            {features.map((f) => (
              <li
                key={f}
                className="rounded-xl border border-brown-300/50 px-4 py-3 text-sm text-brown-800"
              >
                {f}
              </li>
            ))}
          </ul>

          <p className="mt-10 mb-4 text-sm tracking-wide text-brown-700 uppercase">
            40+ варіантів оздоблення
          </p>
          <div className="grid grid-cols-3 gap-3">
            {swatches.map((s) => (
              <div
                key={s.name}
                className="rounded-lg bg-brown-800/10 px-3 py-4 text-center text-xs text-brown-800"
              >
                {s.name}
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-auto">
          <Image
            src={images.material}
            alt="Текстура оздоблення VELLARO"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
