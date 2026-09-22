// Фіксовані позиції плиток колажу (vw/vh) — детерміновано, без Math.random(),
// щоб уникнути розбіжностей SSR/CSR. Індекс 0 відповідає mosaicImages[0] (hero).
export const mosaicLayout = [
  { left: 38, top: 28, width: 24, height: 32 }, // 0 — hero
  { left: 4, top: 8, width: 14, height: 18 },
  { left: 21, top: 4, width: 12, height: 15 },
  { left: 66, top: 6, width: 13, height: 17 },
  { left: 82, top: 10, width: 14, height: 20 },
  { left: 6, top: 34, width: 12, height: 16 },
  { left: 68, top: 30, width: 12, height: 18 },
  { left: 84, top: 40, width: 13, height: 17 },
  { left: 10, top: 57, width: 13, height: 18 },
  { left: 72, top: 56, width: 14, height: 19 },
  { left: 88, top: 64, width: 11, height: 15 },
  { left: 24, top: 64, width: 12, height: 16 },
  { left: 50, top: 70, width: 12, height: 14 },
  { left: 44, top: 5, width: 14, height: 17 }, // 13 — top-center gap
  { left: 91, top: 80, width: 9, height: 14 }, // 14 — bottom-right corner
  { left: 64, top: 78, width: 11, height: 15 }, // 15 — bottom-center gap
  { left: 1, top: 78, width: 11, height: 16 }, // 16 — bottom-left corner
] as const;
