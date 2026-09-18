// Тимчасові фото з Unsplash (безкоштовні, для шаблону) — лишились тільки
// для hero. Решта вже реальні згенеровані фото VELLARO.
export const images = {
  hero: "/hero/hero-img-2.png",
  heroPreviewVideo: "/hero/preview.mp4",
  heroPreviewPoster: "/hero/preview-poster.jpg",
  catalog: {
    lite: "/catalog/lite-2.png",
    comfort: "/catalog/comfort-2.png",
    signature: "/catalog/signature-2.png",
  },
  createForYou: {
    wardrobes: "/create-for-you/wardrobes.png",
    corner: "/create-for-you/corner.png",
    systems: "/create-for-you/systems.png",
    projects: "/create-for-you/projects.png",
  },
  portfolio: [
    "/portfolio/1.png",
    "/portfolio/2.png",
    "/portfolio/3.png",
    "/portfolio/4.png",
    "/portfolio/5.png",
    "/portfolio/6.png",
  ],
  production: {
    main: "/production/main.png",
    detail: "/production/detail.png",
  },
  panorama: "/panorama/panorama-hero.png",
  panorama2: "/panorama/panorama-2.png",
  processFinale: "/process/finale.png",
  technology: [
    "/technology/1.png",
    "/technology/2.png",
    "/technology/3.png",
    "/technology/4.png",
  ],
  technologyBanner: "/technology/banner.png",
  technologySketch: "/technology/sketch.png",
  portfolioCarousel: [
    "/portfolio-carousel/wardrobe-1.png",
    "/portfolio-carousel/wardrobe-2.png",
    "/portfolio-carousel/wardrobe-3.png",
    "/portfolio-carousel/wardrobe-4.png",
    "/portfolio-carousel/wardrobe-5.png",
    "/portfolio-carousel/wardrobe-6.png",
  ],
  material: "https://images.unsplash.com/photo-1708962000105-849e984e69a8",
};

// Мозаїка для вхідної анімації: [0] — наше hero-фото (розкривається на весь
// екран), решта — фон-колаж навколо лого, що друкується.
export const mosaicImages = [
  images.hero,
  images.production.detail,
  images.catalog.lite,
  images.catalog.comfort,
  images.catalog.signature,
  images.portfolio[0],
  images.portfolio[1],
  images.portfolio[2],
  images.portfolio[3],
  images.portfolio[4],
  images.portfolio[5],
  images.production.main,
  images.material,
];
