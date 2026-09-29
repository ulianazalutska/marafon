# ARMADERO: мови сайту і як він створений

## Мови інтерфейсу (2)

- **Українська (`uk`)** — за замовчуванням.
- **Англійська (`en`)**.

Переклади лежать у `messages/uk.json` і `messages/en.json`. Мова обирається через **cookie `locale`**, а не через URL: `/en` не існує. Перемикач мови на сайті записує cookie. Якщо cookie немає або значення невірне, показується українська. Логіка в `src/i18n/request.ts` і `src/i18n/config.ts`.

## Мови програмування

- **TypeScript**: 42 файли (29 компонентів `.tsx` і 13 модулів `.ts`).
- **CSS**: 1 файл (`globals.css`), у якому Tailwind v4.
- **JSON**: файли перекладів.

## Технології

| Частина | Що використано |
|---|---|
| Фреймворк | Next.js 16 (App Router) + React 19.2 |
| Стилі | Tailwind CSS v4, теми задано в `globals.css` через `@theme inline` |
| Анімації | GSAP + ScrollTrigger (скрол-ефекти), framer-motion (прості анімації), див. `framer-motion-usage.md` |
| Переклади | next-intl |
| Форма зв'язку | API-роут `src/app/api/contact/route.ts`: Telegram-бот, Google Sheets, Upstash Redis для обмеження частоти запитів |
| Перевірки | ESLint 9, TypeScript (окремого набору тестів немає) |
| Хостинг | Vercel, автодеплой при пуші в `main` (репозиторій `ulianazalutska/marafon`) |

## Будова

Односторінковий лендінг: `src/app/page.tsx` складається з секцій-компонентів (Hero, каталог, портфоліо, технології, процес, виробництво, відгуки, FAQ, контакти, футер). Нижні секції підвантажуються ліниво через `next/dynamic` і `LazyMount`. Шляхи до всіх зображень зібрані в `src/lib/images.ts`.
