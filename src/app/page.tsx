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
import LazyMount from "@/components/LazyMount";

// Секції нижче першого екрана: код-спліт через next/dynamic (ssr: false) +
// LazyMount навколо кожної (див. LazyMount.tsx) означає їхній import() —
// і мережевий запит по чанк — не стається, поки секція не наблизиться до
// вʼюпорту, а не одразу при гідратації. На throttled мобільному зʼєднанні
// саме ці ~200 KB JS, які раніше вантажились одночасно з hero-фото,
// конкурували з ним за пропускну здатність і тримали LCP на позначці 5+с.
//
// PortfolioSection (#portfolio, Header nav), ProductionSection (#production,
// Header nav + Footer) і ContactSection (#contact, Header nav + CTAs in
// Hero/CatalogSection/ProcessFinaleSection) — NOT lazy: an anchor link
// clicked before IntersectionObserver has mounted its target just scrolls
// nowhere (no element with that id exists in the DOM yet). For the contact
// form especially, that's a straight-up broken conversion path.
//
// No `{ ssr: false }` on the rest: Next 16 disallows it directly in a
// Server Component (this file), and it's redundant anyway — LazyMount is
// itself a Client Component that renders `null` server-side (see its own
// comment), so these never run during SSR regardless of this flag.
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
      {/* Before Header: useLayoutEffect fires tree-wide in JSX/mount order,
          and IntroOverlay's is what sets the mobileIntroSkip flag Header's
          own entrance effect reads — it has to run first, or Header reads
          it one render too early (stale `false`) on phones. */}
      <IntroOverlay />
      <Header />
      <main id="main-content">
        <StackedIntro>
          <Hero />
          <CreateForYouSection />
        </StackedIntro>
        <CatalogSection />
        <PanoramaSection title={null} />
        <PortfolioSection />
        <LazyMount>
          <TechnologySection />
        </LazyMount>
        {/* ProcessSection's stacking-panel effect (see CLAUDE.md) needs
            ProcessFinaleSection already in the DOM as "the next real
            section" the instant its last panel finishes riding up — mounted
            together in one LazyMount so they never arrive on separate
            IntersectionObserver ticks and leave that gap. */}
        <LazyMount>
          <ProcessSection />
          <ProcessFinaleSection />
        </LazyMount>
        <ProductionSection />
        <LazyMount>
          <TestimonialsSection />
        </LazyMount>
        <LazyMount>
          <FaqSection />
        </LazyMount>
        <ContactSection />
      </main>
      <LazyMount>
        <Footer />
      </LazyMount>
    </MotionConfig>
  );
}
