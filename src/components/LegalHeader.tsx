import Link from "next/link";

export default function LegalHeader() {
  return (
    <header className="border-b border-brown-300/60 bg-cream">
      <div className="mx-auto flex h-20 max-w-[1000px] items-center justify-between px-6">
        <Link
          href="/"
          className="font-logo text-[22px] font-medium tracking-[0.08em] text-ink"
        >
          ARMADERO
        </Link>
        <Link
          href="/"
          className="text-[15px] tracking-[0.02em] text-brown-850 transition-opacity hover:opacity-70"
        >
          ← На головну
        </Link>
      </div>
    </header>
  );
}
