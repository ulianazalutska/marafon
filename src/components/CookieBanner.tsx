"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const DISMISSED_KEY = "armadero-cookie-notice-dismissed";

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reveal = () => setVisible(true);
    try {
      if (localStorage.getItem(DISMISSED_KEY) !== "true") {
        reveal();
      }
    } catch {
      reveal();
    }
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {}
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-brown-950 text-cream">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-3 px-6 py-4 text-sm sm:flex-row sm:justify-between">
        <p className="text-center leading-relaxed sm:text-left">
          {t("message")}{" "}
          <a href="/cookies" className="underline">
            {t("linkText")}
          </a>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-accent px-5 py-2 text-white transition-opacity hover:opacity-90"
        >
          {t("accept")}
        </button>
      </div>
    </div>
  );
}
