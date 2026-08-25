export default function Footer() {
  return (
    <footer className="bg-cream py-10 text-sm text-brown-700">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row md:px-10">
        <span className="tracking-[0.3em]">VELLARO</span>
        <div className="flex gap-6">
          <a href="tel:+380000000000">+38 (000) 000-00-00</a>
          <a href="#contact">Шоурум у Києві</a>
        </div>
        <span className="text-brown-500">© 2026 VELLARO</span>
      </div>
    </footer>
  );
}
