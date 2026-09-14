import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroOverlay from "@/components/IntroOverlay";
import CreateForYouSection from "@/components/CreateForYouSection";
import StackedIntro from "@/components/StackedIntro";
import PanoramaSection from "@/components/PanoramaSection";
import CatalogSection from "@/components/CatalogSection";
import PortfolioSection from "@/components/PortfolioSection";
import TechnologySection from "@/components/TechnologySection";
import ProcessSection from "@/components/ProcessSection";
import ProcessFinaleSection from "@/components/ProcessFinaleSection";
import ProductionSection from "@/components/ProductionSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { images } from "@/lib/images";

export default function Home() {
  return (
    <>
      <Header />
      <IntroOverlay />
      <main>
        <StackedIntro>
          <Hero />
          <CreateForYouSection />
        </StackedIntro>
        <CatalogSection />
        <PanoramaSection />
        <PortfolioSection />
        <TechnologySection />
        <ProcessSection />
        <ProcessFinaleSection />
        <ProductionSection />
        <TestimonialsSection />
        <FaqSection />
        <ContactSection />
        <PanoramaSection
          image={images.panorama2}
          alt="Домашній кінозал VELLARO у деталях"
          title={null}
        />
      </main>
      <Footer />
    </>
  );
}
