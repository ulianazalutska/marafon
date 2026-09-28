"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const DISMISSED_KEY = "armadero-cookie-notice-dismissed";
const BANNER_ID = "cookie-banner";

export default function CookieBanner() {
  const t = useTranslations("CookieBanner");
  const [dismissed, setDismissed] = useState(false);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISSED_KEY, "true");
    } catch {}
  };

  return (
    <>
      {/*
        Rendered visible by default in the SSR HTML (no useEffect gate) so
        it paints immediately instead of waiting on hydration — that wait
        was showing up as ~2.5s of LCP render delay in Lighthouse, since
        this text was the largest content painted early in the page load.
        The inline script below runs synchronously during HTML parsing to
        hide it for returning visitors who already dismissed it — same
        technique as the scroll-restoration script in layout.tsx. It must
        come AFTER the div in markup order: the browser parses/executes
        script tags as it encounters them, so a script placed before the
        div would run before #cookie-banner exists and find nothing.
      */}
      <div
        id={BANNER_ID}
        suppressHydrationWarning
        className={
          dismissed
            ? "hidden"
            : "fixed inset-x-0 bottom-0 z-50 bg-brown-950 text-cream"
        }
      >
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
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
            try {
              if (localStorage.getItem(${JSON.stringify(DISMISSED_KEY)}) === "true") {
                var el = document.getElementById(${JSON.stringify(BANNER_ID)});
                if (el) el.style.display = "none";
              }
            } catch (e) {}
          })();`,
        }}
      />
    </>
  );
}
