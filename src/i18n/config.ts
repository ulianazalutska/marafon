// Shared between request.ts (server-only, imports next/headers) and client
// components (the locale switcher) — kept separate so client bundles never
// pull in the server-only cookies() import.
export const LOCALES = ["uk", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "uk";
export const LOCALE_COOKIE = "locale";
