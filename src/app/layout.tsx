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
  title: "Armadero — гардеробні системи на замовлення",
  description:
    "Модульні гардеробні системи ручної роботи під розмір вашої кімнати. Український цех, гарантія 5 років.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`h-full antialiased ${exo2.variable} ${rajdhani.variable}`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
