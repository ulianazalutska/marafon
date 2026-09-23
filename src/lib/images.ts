// Тимчасові фото з Unsplash (безкоштовні, для шаблону) — лишились тільки
// для hero. Решта вже реальні згенеровані фото ARMADERO.
export const images = {
  hero: "/hero/hero-img-2.webp",
  heroPreviewVideo: "/hero/preview.mp4",
  heroPreviewPoster: "/hero/preview-poster.jpg",
  catalog: {
    lite: "/catalog/lite-2.webp",
    comfort: "/catalog/comfort-2.webp",
    signature: "/catalog/signature-2.webp",
  },
  createForYou: {
    wardrobes: "/create-for-you/wardrobes.webp",
    corner: "/create-for-you/corner.webp",
    systems: "/create-for-you/systems.webp",
    projects: "/create-for-you/projects.webp",
  },
  production: {
    main: "/production/main-v2.webp",
    detail: "/production/detail-v2.webp",
  },
  process: {
    measure: "/process/step-1-measure.webp",
    materials: "/process/step-2-materials.webp",
    install: "/process/step-3-install.webp",
  },
  panorama: "/panorama/panorama-hero.webp",
  panorama2: "/panorama/panorama-2.webp",
  panoramaContact: "/panorama/panorama-contact.webp",
  processFinale: "/process/finale-wardrobe.webp",
  technology: [
    "/technology/rail-hanging-clothes.webp",
    "/technology/led-strip-shelf.webp",
    "/technology/door-damper-profile.webp",
    "/technology/drawer-usb-charging.webp",
  ],
  technologyBanner: "/technology/banner-oak-corner.webp",
  technologySketch: "/technology/sketch-wardrobe.webp",
  technologyMaterials: {
    dubCognac: "/technology/materials/dub-cognac.webp",
    horihEspresso: "/technology/materials/horih-espresso.webp",
    laminatSand: "/technology/materials/laminat-sand.webp",
    emalForest: "/technology/materials/emal-forest.webp",
    dubChestnut: "/technology/materials/dub-chestnut.webp",
    skloStone: "/technology/materials/sklo-stone.webp",
  },
  portfolioCarousel: [
    "/portfolio-carousel/wardrobe-1.webp",
    "/portfolio-carousel/wardrobe-2.webp",
    "/portfolio-carousel/wardrobe-3.webp",
    "/portfolio-carousel/wardrobe-4.webp",
    "/portfolio-carousel/wardrobe-5.webp",
    "/portfolio-carousel/wardrobe-6.webp",
  ],
  material: "/technology/materials/sample-fabric.webp",
};

// Мозаїка для вхідної анімації: [0] — наше hero-фото (розкривається на весь
// екран), решта — фон-колаж навколо лого, що друкується.
export const mosaicImages = [
  images.hero,
  images.production.detail,
  images.catalog.lite,
  images.catalog.comfort,
  images.catalog.signature,
  images.portfolioCarousel[0],
  images.portfolioCarousel[1],
  images.portfolioCarousel[2],
  images.portfolioCarousel[3],
  images.portfolioCarousel[4],
  images.portfolioCarousel[5],
  images.production.main,
  images.material,
  images.createForYou.wardrobes,
  images.createForYou.systems,
  images.process.install,
  images.technologySketch,
];
