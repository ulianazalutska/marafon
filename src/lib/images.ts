// Тимчасові фото з Unsplash (безкоштовні, для шаблону) — лишились тільки
// для hero. Решта вже реальні згенеровані фото VELLARO.
export const images = {
  hero: "/hero/hero-img.png",
  catalog: {
    lite: "/catalog/lite.png",
    comfort: "/catalog/comfort.png",
    signature: "/catalog/signature.png",
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
