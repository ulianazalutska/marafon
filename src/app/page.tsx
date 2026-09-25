import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { MotionConfig } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroOverlay from "@/components/IntroOverlay";
import CreateForYouSection from "@/components/CreateForYouSection";
import StackedIntro from "@/components/StackedIntro";
import PanoramaSection from "@/components/PanoramaSection";
import CatalogSection from "@/components/CatalogSection";

// Секції нижче першого екрана виносимо в окремі JS-чанки (той самий SSR HTML,
// той самий вигляд — next/dynamic за замовчуванням не вимикає SSR, лише
// ділить бандл), щоб головний чанк, який браузер парсить перед гідратацією
// Header/Hero, був меншим.
const PortfolioSection = dynamic(() => import("@/components/PortfolioSection"));
const TechnologySection = dynamic(() => import("@/components/TechnologySection"));
const ProcessSection = dynamic(() => import("@/components/ProcessSection"));
const ProcessFinaleSection = dynamic(() => import("@/components/ProcessFinaleSection"));
const ProductionSection = dynamic(() => import("@/components/ProductionSection"));
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"));
const FaqSection = dynamic(() => import("@/components/FaqSection"));
const ContactSection = dynamic(() => import("@/components/ContactSection"));
const Footer = dynamic(() => import("@/components/Footer"));

export default async function Home() {
  const t = await getTranslations("Header");

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-white focus:no-underline"
      >
        {t("skipToContent")}
      </a>
      <Header />
      <IntroOverlay />
      <main id="main-content">
        <StackedIntro>
          <Hero />
          <CreateForYouSection />
        </StackedIntro>
        <CatalogSection />
        <PanoramaSection title={null} />
        <PortfolioSection />
        <TechnologySection />
        <ProcessSection />
        <ProcessFinaleSection />
        <ProductionSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </MotionConfig>
  );
}
