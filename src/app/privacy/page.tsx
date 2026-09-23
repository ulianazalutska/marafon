import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import LegalHeader from "@/components/LegalHeader";
import Footer from "@/components/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Privacy");
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("Privacy");
  const rightsItems = t.raw("s5items") as string[];

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
            <p className="mt-3">{t("s1body")}</p>
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
            <p className="mt-3">{t("s5intro")}</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5">
              {rightsItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3">
              {t("s5outro")}{" "}
              <a href="mailto:hello@armadero.ua" className="underline">
                hello@armadero.ua
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-medium text-ink">{t("s6heading")}</h2>
            <p className="mt-3">
              {t("s6prefix")}{" "}
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
