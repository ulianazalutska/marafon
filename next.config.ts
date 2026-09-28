import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  experimental: {
    // Inlines the (small, Tailwind-atomic) CSS bundle into <style> in the
    // initial HTML instead of a blocking <link> — this is a one-page site
    // where most loads are first-time visitors, exactly the case this flag
    // is meant for (see inlineCss docs: "Enable if you use atomic CSS and
    // want to optimize first-load performance for new visitors"). Trade-off
    // is returning visitors re-download the CSS instead of hitting cache,
    // but that's a smaller cost here than the render-blocking request it
    // removes. Production builds only — no effect in `next dev`.
    inlineCss: true,
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
