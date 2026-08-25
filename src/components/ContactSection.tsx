export default function ContactSection() {
  return (
    <section id="contact" className="bg-brown-950 py-24 text-cream md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-2 md:px-10">
        <div>
          <h2 className="max-w-md text-3xl font-medium md:text-4xl">
            Готові побачити свій зал?
          </h2>
          <p className="mt-6 max-w-sm text-cream/70">
            Залиште контакти — надішлемо 3D-візуалізацію конфігурації
            безкоштовно протягом 2 днів.
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Ім'я"
            className="rounded-full border border-cream/20 bg-transparent px-5 py-3 text-cream placeholder:text-cream/40 focus:border-cream/60 focus:outline-none"
          />
          <input
            type="tel"
            placeholder="Телефон"
            className="rounded-full border border-cream/20 bg-transparent px-5 py-3 text-cream placeholder:text-cream/40 focus:border-cream/60 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Метраж кімнати (опційно)"
            className="rounded-full border border-cream/20 bg-transparent px-5 py-3 text-cream placeholder:text-cream/40 focus:border-cream/60 focus:outline-none"
          />
          <button
            type="submit"
            className="mt-2 rounded-full bg-cream px-6 py-3 text-sm tracking-wide text-ink transition-colors hover:bg-white"
          >
            Отримати візуалізацію
          </button>
        </form>
      </div>
    </section>
  );
}
