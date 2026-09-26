import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    // 85 — sweet spot for hero/intro full-bleed photos: JPEG/WebP quality
    // curves are nearly flat between 75-90 in file size, but 75 alone
    // visibly softens large photographic banners on high-DPI phones.
    qualities: [75, 85],
  },
  // Файли з public/<фото-теки>/ і корінна mp4-прев'юшка не проходять через
  // next/image (напряму по <video src>/og:image/PWA-іконках), тому без цього
  // заголовка на них не діє автоматичне immutable-кешування Next.js — лише
  // *_next/static* і оптимізовані /_next/image отримують його з коробки.
  async headers() {
    const staticAssetDirs = [
      "hero",
      "catalog",
      "create-for-you",
      "production",
      "process",
      "panorama",
      "portfolio-carousel",
      "technology",
      "testimonials",
      "icons",
    ];
    return [
      ...staticAssetDirs.map((dir) => ({
        source: `/${dir}/:path*`,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      })),
      {
        source: "/og-image.jpg",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
