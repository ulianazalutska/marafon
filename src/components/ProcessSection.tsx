import Image from "next/image";
import { images } from "@/lib/images";

const steps = [
  {
    n: "01",
    title: "Заміряємо кімнату",
    text: "Самостійно за нашою інструкцією або виїзд майстра для точних замірів простору — врахуємо кожен виступ, двері й вентиляцію, щоб гардеробна стала як улита, до міліметра.",
    image: images.process.measure,
  },
  {
    n: "02",
    title: "Збираєте конфігурацію",
    text: "Серія, кількість секцій, розкладка модулів, оздоблення та функції — все під ваш інтер'єр і бюджет.",
    image: images.process.materials,
  },
  {
    n: "03",
    title: "Отримуєте готову гардеробну",
    text: "Виготовлення і монтаж під ключ — привозимо, збираємо на місці та показуємо, як користуватися всіма механізмами гардеробної.",
    image: images.process.install,
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-cream py-20 md:pt-[159px] md:pb-0">
      <div className="w-full px-6 pb-16 md:pr-[100px] md:pl-10 md:pb-[115px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <h2 className="max-w-3xl text-6xl leading-[1.05] font-bold text-[#362F2B] md:text-[96px] md:leading-[1.04] md:font-medium md:tracking-[0.02em]">
            Як це працює покроково
          </h2>
          <p className="max-w-lg text-lg text-brown-700 md:w-[422px] md:max-w-[422px] md:pt-3 md:text-[32px] md:leading-[38px] md:font-normal md:tracking-[0.02em]">
            Від виміру кімнати до готової гардеробної — три прості кроки, які
            ми проходимо разом із вами
          </p>
        </div>
      </div>

      <div className="relative">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className={`relative flex w-full flex-col overflow-hidden border-t border-[#AF957C] bg-cream pt-10 pb-8 md:pt-[102px] ${
              i === steps.length - 1 ? "md:pb-[325px]" : "md:pb-[140px]"
            }`}
          >
            <div className="flex w-full flex-col px-6 md:px-10">
              <div className="grid gap-4 md:grid-cols-2 md:gap-10">
                <h3 className="text-2xl font-medium text-[#362F2B] md:text-[43px] md:tracking-[0.02em]">
                  {s.title}
                </h3>
                <p className="max-w-md text-base text-brown-700 md:w-[598px] md:max-w-[598px] md:text-[22px] md:font-normal md:tracking-[0.02em]">
                  {s.text}
                </p>
              </div>

              <div className="mt-10 grid items-end gap-4 md:mt-[70px] md:grid-cols-2 md:gap-10">
                <span className="text-8xl leading-none font-semibold text-[#AF957C]/46 tracking-[0.02em] md:translate-y-[70px] md:self-end md:text-[170px]">
                  {s.n}
                </span>

                <div className="relative aspect-[8/5] w-[55%] max-w-sm overflow-hidden md:aspect-auto md:h-[261px] md:w-[365px] md:max-w-none">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(min-width: 768px) 34vw, 45vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
