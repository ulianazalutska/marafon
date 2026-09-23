import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LegalHeader from "@/components/LegalHeader";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Terms");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function TermsPage() {
  const t = await getTranslations("Terms");

  return (
    <>
      <LegalHeader />
      <main className="mx-auto max-w-[800px] px-6 py-16 md:py-24">
        <h1 className="text-4xl font-medium tracking-[0.01em] text-ink md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-[15px] text-brown-850/70">
          {t("updated")}
        </p>

        <div className="mt-10 space-y-8 text-[16px] leading-[1.7] text-brown-850">
          <section>
            <h2 className="text-xl font-medium text-ink">{t("s1heading")}</h2>
            <p className="mt-3">
              {t("s1prefix")}{" "}
              <a href="/privacy" className="underline">
                {t("s1linkText")}
              </a>
              {t("s1suffix")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">{t("s2heading")}</h2>
            <p className="mt-3">{t("s2body")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">{t("s3heading")}</h2>
            <p className="mt-3">{t("s3body")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">
              {t("s4heading")}
            </h2>
            <p className="mt-3">{t("s4body")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">{t("s5heading")}</h2>
            <p className="mt-3">{t("s5body")}</p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">{t("s6heading")}</h2>
            <p className="mt-3">
              {t("s6prefix")}{" "}
              <a href="mailto:hello@armadero.ua" className="underline">
                hello@armadero.ua
              </a>{" "}
              {t("s6suffix")}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
