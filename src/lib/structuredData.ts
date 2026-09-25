// Будує JSON-LD (Schema.org) граф для головної сторінки: організація,
// сайт і FAQ. Тримаємо це окремо від layout.tsx, щоб розмітку було
// легко перевірити/розширити, не чіпаючи сам компонент.
type FaqItem = { q: string; a: string };

export function buildStructuredData({
  locale,
  description,
  faqItems,
}: {
  locale: string;
  description: string;
  faqItems: FaqItem[];
}) {
  const baseUrl = "https://armadero.ua";

  const organization = {
    "@type": "HomeAndConstructionBusiness",
    "@id": `${baseUrl}/#organization`,
    name: "Armadero",
    url: baseUrl,
    image: `${baseUrl}/og-image.jpg`,
    logo: `${baseUrl}/icon.png`,
    telephone: "+380442001515",
    email: "hello@armadero.ua",
    address: {
      "@type": "PostalAddress",
      streetAddress: "вул. Антоновича, 51",
      addressLocality: "Київ",
      postalCode: "01015",
      addressCountry: "UA",
    },
    areaServed: "UA",
  };

  const website = {
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Armadero",
    description,
    inLanguage: locale === "en" ? "en-US" : "uk-UA",
    publisher: { "@id": `${baseUrl}/#organization` },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": `${baseUrl}/#faq`,
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, faqPage],
  };
}
