import type { Metadata } from "next";
import { Exo_2, Rajdhani } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { buildStructuredData } from "@/lib/structuredData";
import "./globals.css";

const exo2 = Exo_2({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-logo",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Meta");
  const title = t("title");
  const description = t("description");
  const ogImage = {
    url: "/og-image.jpg",
    width: 1200,
    height: 630,
    alt: t("ogImageAlt"),
  };

  return {
    metadataBase: new URL("https://armadero.ua"),
    title,
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: "Armadero",
      locale: locale === "en" ? "en_US" : "uk_UA",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();
  const tMeta = await getTranslations("Meta");
  const tFaq = await getTranslations("Faq");
  const structuredData = buildStructuredData({
    locale,
    description: tMeta("description"),
    faqItems: tFaq.raw("items") as { q: string; a: string }[],
  });

  return (
    <html
      lang={locale}
      className={`h-full antialiased ${exo2.variable} ${rajdhani.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          // JSON.stringify саме перед вставкою: без сторонніх/користувацьких
          // даних всередині (усе з наших же messages/*.json), тому XSS-ризику
          // немає, але екрануємо "<" про всяк випадок, щоб браузер не
          // сплутав вміст з кінцем тега <script>.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {/*
          <html> has suppressHydrationWarning because the script below sets
          a style attribute on it before React hydrates — without that prop,
          React flags the resulting mismatch as a hydration error.

          Must run synchronously before the browser's own scroll-restoration-
          on-reload kicks in (which happens before hydration, so doing this
          in a React effect is too late). Without it, the browser restores
          the reload's old scroll position itself — and since globals.css
          sets scroll-behavior:smooth on <html>, that native restore animates
          as a visible scroll-past of the whole page instead of landing
          instantly.

          Disabling native restoration alone still leaves a gap: the page
          paints at scrollY 0 for a frame or two before StackedIntro's effect
          (which runs the real restore) gets its turn, which reads as its own
          brief flash/jump. So when a saved position exists, this also hides
          the page up front — nothing is visible until StackedIntro reveals
          it again right after the jump, whichever position that ends up
          being. The timeout is a safety net (e.g. a JS error) so the page
          can never get stuck invisible.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function () {
              try {
                if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }
                if (Number(sessionStorage.getItem("armadero-scroll-y")) > 0) {
                  document.documentElement.style.visibility = "hidden";
                  setTimeout(function () { document.documentElement.style.visibility = ""; }, 2000);
                }
                // Consumed here (once, synchronously, before React even
                // mounts) rather than inside Hero's effect: dev-mode
                // StrictMode double-invokes effects, so a sessionStorage
                // .removeItem in the effect body itself gets called on the
                // first (discarded) invocation, leaving nothing for the
                // second (real) one to find — the animation it's gating
                // silently never plays. window.__armadero is a plain global,
                // immune to that double-invoke.
                if (sessionStorage.getItem("armadero-lang-switch") === "true") {
                  window.__armadero = { langSwitch: true };
                  sessionStorage.removeItem("armadero-lang-switch");
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
