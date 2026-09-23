import type { Metadata } from "next";
import LegalHeader from "@/components/LegalHeader";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Політика конфіденційності — Armadero",
  description:
    "Як Armadero збирає, використовує та захищає персональні дані відвідувачів сайту й клієнтів.",
};

export default function PrivacyPage() {
  return (
    <>
      <LegalHeader />
      <main className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
        <h1 className="text-4xl font-medium tracking-[0.01em] text-ink md:text-5xl">
          Політика конфіденційності
        </h1>
        <p className="mt-3 text-[15px] text-brown-850/70">
          Останнє оновлення: 23 вересня 2026 р.
        </p>

        <div className="mt-10 space-y-8 text-[16px] leading-[1.7] text-brown-850">
          <section>
            <h2 className="text-xl font-medium text-ink">1. Загальні положення</h2>
            <p className="mt-3">
              Ця Політика конфіденційності визначає, як ARMADERO (далі — «ми»,
              «Компанія») обробляє персональні дані відвідувачів сайту
              armadero.ua та клієнтів, які залишають заявку на замовлення
              гардеробної системи. Ми керуємось Законом України «Про захист
              персональних даних» № 2297-VI та іншим чинним законодавством
              України у сфері захисту персональних даних.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">2. Які дані ми збираємо</h2>
            <p className="mt-3">
              Через форму заявки та форму підписки на розсилку в футері ми
              можемо збирати: ім&apos;я, номер телефону, адресу електронної
              пошти та текст повідомлення, яке ви залишаєте добровільно.
              Сайт не використовує аналітичні чи рекламні cookie-файли —
              технічно необхідний sessionStorage браузера служить лише для
              того, щоб не повторювати вступну анімацію під час одного
              сеансу, і не передає жодних даних третім сторонам.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">3. Мета обробки</h2>
            <p className="mt-3">
              Дані з форми заявки використовуються виключно для того, щоб
              зв&apos;язатися з вами, обговорити параметри замовлення,
              узгодити виїзд заміру та підготувати комерційну пропозицію.
              Дані з форми розсилки використовуються для надсилання новин і
              підбірок про продукцію Armadero. Ми не продаємо і не
              передаємо ваші персональні дані третім особам для маркетингових
              цілей.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">
              4. Правова підстава та зберігання
            </h2>
            <p className="mt-3">
              Підставою обробки є ваша згода, надана під час заповнення
              форми. Дані зберігаються протягом строку, необхідного для
              виконання замовлення та комунікації з вами, але не довше 3
              років з моменту останнього звернення, після чого видаляються
              або знеособлюються.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">5. Ваші права</h2>
            <p className="mt-3">Відповідно до чинного законодавства ви маєте право:</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              <li>дізнатись, чи обробляються ваші персональні дані;</li>
              <li>отримати доступ до своїх даних та їх копію;</li>
              <li>вимагати виправлення неточних даних;</li>
              <li>відкликати згоду та вимагати видалення даних;</li>
              <li>заперечити проти обробки даних для розсилки в будь-який момент.</li>
            </ul>
            <p className="mt-3">
              Для реалізації цих прав напишіть нам на{" "}
              <a href="mailto:hello@armadero.ua" className="underline">
                hello@armadero.ua
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">6. Контакти</h2>
            <p className="mt-3">
              ARMADERO, м. Київ, вул. Антоновича, 51, 01015, Україна.
              Електронна пошта:{" "}
              <a href="mailto:hello@armadero.ua" className="underline">
                hello@armadero.ua
              </a>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
