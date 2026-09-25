import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import LegalHeader from "@/components/LegalHeader";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return {
    title: t("metaTitle"),
  };
}

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <LegalHeader />
      <main className="mx-auto flex max-w-[800px] flex-col items-center px-6 py-24 text-center md:py-32">
        <p className="text-[15px] tracking-[0.04em] text-accent">404</p>
        <h1 className="mt-3 text-4xl font-medium tracking-[0.01em] text-ink md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-[16px] leading-[1.7] text-brown-850">
          {t("body")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-normal text-white transition-opacity hover:opacity-90"
        >
          {t("cta")}
        </Link>
      </main>
      <Footer />
    </>
  );
}
