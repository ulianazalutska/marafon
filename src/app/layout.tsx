import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELLARO — крісла для домашнього кінотеатру",
  description:
    "Модульні крісла та дивани ручної роботи для домашнього кінотеатру. Український цех, гарантія 5 років.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="uk" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        {children}
      </body>
    </html>
  );
}
