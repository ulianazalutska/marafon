import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Armadero — гардеробні системи на замовлення",
    short_name: "Armadero",
    description:
      "Модульні гардеробні системи ручної роботи під розмір вашої кімнати.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#af957c",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
