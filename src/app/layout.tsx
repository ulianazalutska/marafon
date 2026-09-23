import type { Metadata } from "next";
import { Exo_2, Rajdhani } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://armadero.ua"),
  title: "Armadero — гардеробні системи на замовлення",
  description:
    "Модульні гардеробні системи ручної роботи під розмір вашої кімнати. Український цех, гарантія 5 років.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`h-full antialiased ${exo2.variable} ${rajdhani.variable}`}
      suppressHydrationWarning
    >
      <head>
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
                if (Number(sessionStorage.getItem("vellaro-scroll-y")) > 0) {
                  document.documentElement.style.visibility = "hidden";
                  setTimeout(function () { document.documentElement.style.visibility = ""; }, 2000);
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
