import Image from "next/image";
import { images } from "@/lib/images";

export default function ProductionSection() {
  return (
    <section id="production" className="relative overflow-hidden bg-brown-950 py-24 text-cream md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2 md:px-10">
        <div>
          <p className="mb-4 text-sm tracking-[0.3em] text-brown-300 uppercase">
            Про виробництво
          </p>
          <h2 className="mb-6 text-3xl font-medium md:text-4xl">
            Цех, а не конвеєр
          </h2>
          <p className="max-w-md text-cream/70">
            VELLARO — команда столярів і оббивників у Києві. Кожне крісло
            робимо під конкретне замовлення: каркас із масиву бука, механізми
            сертифікованих європейських постачальників, оббивка вручну, шов за
            швом. Кожна модель проходить тест на 20 000 циклів розкладання.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
          <Image
            src={images.production.main}
            alt="Майстер VELLARO за роботою"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
