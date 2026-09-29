# Де використовується framer-motion

Решта анімацій на сайті — GSAP + ScrollTrigger (скрол-ефекти) або без анімацій.

## Секції сторінки

| Секція | Файл | Що саме |
|---|---|---|
| Contact | `src/components/ContactSection.tsx` | `motion` + `AnimatePresence`: перехід між формою і станом «надіслано» |
| FAQ | `src/components/FaqSection.tsx` | `motion`, плюс `ui/interactive-accordion.tsx` (`motion` + `AnimatePresence`) для відкривання питань |
| Technology | `src/components/TechnologySection.tsx` | `useScroll`, `useSpring`, `useTransform`: анімація, привʼязана до скролу |
| Testimonials | `src/components/TestimonialsSection.tsx` | Через `ui/testimonial.tsx` → `ui/timeline-animation.tsx` (`motion`, `useInView`): поява відгуків при прокручуванні |

## Не секції, а елементи сторінки

- **Header** (`src/components/Header.tsx`): `motion`, `useScroll`, `useTransform`.
- **MobileMenu** (`src/components/MobileMenu.tsx`): `motion` + `AnimatePresence` з варіантами (`Variants`).
- **`src/app/page.tsx`**: лише `MotionConfig reducedMotion="user"` — загальне налаштування, яке вимикає анімації, якщо в користувача в системі увімкнено «зменшити рух».

## Без framer-motion

Hero, CreateForYou, Catalog, Panorama, Portfolio, Process, ProcessFinale, Production, Footer.
