import Image from "next/image";
import { images } from "@/lib/images";

type Item = {
  label: string;
  image: string | null;
  side?: "left" | "right";
  shape?: "pill" | "circle";
};

const items: Item[] = [
  { label: "Дивани", image: images.catalog.lite, side: "right", shape: "pill" },
  { label: "Кутові", image: images.catalog.comfort, side: "left", shape: "pill" },
  { label: "Крісла", image: null },
  { label: "Кінозали", image: images.catalog.signature, side: "right", shape: "pill" },
  { label: "Модулі", image: null },
  { label: "Проєкти", image: images.portfolio[0], side: "left", shape: "circle" },
];

export default function CreateForYouSection() {
  return (
    <section id="create" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6 text-center md:px-10">
        <p className="mb-10 text-sm tracking-[0.3em] text-brown-700 uppercase">
          Ми створимо для вас
        </p>

        <div className="flex flex-col items-center">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-center gap-3 md:gap-5"
            >
              {item.image && item.side === "left" && (
                <span
                  className={`relative shrink-0 overflow-hidden bg-brown-300/30 ${
                    item.shape === "circle"
                      ? "h-14 w-14 rounded-full md:h-24 md:w-24"
                      : "h-14 w-28 rounded-full md:h-24 md:w-48"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </span>
              )}

              <h2 className="text-[13vw] leading-[0.95] font-medium tracking-tight text-brown-800 sm:text-6xl md:text-8xl">
                {item.label}
              </h2>

              {item.image && item.side === "right" && (
                <span
                  className={`relative shrink-0 overflow-hidden bg-brown-300/30 ${
                    item.shape === "circle"
                      ? "h-14 w-14 rounded-full md:h-24 md:w-24"
                      : "h-14 w-28 rounded-full md:h-24 md:w-48"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
