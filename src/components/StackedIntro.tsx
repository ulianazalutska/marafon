"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SCROLL_Y_KEY } from "@/lib/intro";

gsap.registerPlugin(ScrollTrigger);

export default function StackedIntro({ children }: { children: ReactNode }) {
  const [pinned, overlay] = Children.toArray(children);
  const pinnedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Browser-native scroll restoration is disabled synchronously in
    // layout.tsx's <head> (before this ever mounts) — see its comment for
    // why. This effect only owns saving/restoring the position ourselves.
    const savedY = Number(sessionStorage.getItem(SCROLL_Y_KEY) ?? "");
    sessionStorage.removeItem(SCROLL_Y_KEY);

    const saveScrollY = () =>
      sessionStorage.setItem(SCROLL_Y_KEY, String(window.scrollY));
    window.addEventListener("beforeunload", saveScrollY);
    window.addEventListener("pagehide", saveScrollY);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });
    });

    // Restored right after the pin above has already collapsed Hero out of
    // flow (one rAF late, so the browser has painted that layout change) —
    // deliberately not gated on the image-loading below: most of the page's
    // images are natively lazy-loaded and never fire `load` until they're
    // scrolled near, which would deadlock restoration at scrollY 0 forever.
    // behavior:"instant" is required here — html has scroll-behavior:smooth
    // globally, which would otherwise animate this as a visible scroll-past
    // of the entire page rather than landing there directly.
    //
    // The page may still be hidden (layout.tsx's inline script, when a
    // saved position exists) precisely so none of this — including the
    // jump itself — is visible; revealing it right after is what makes the
    // whole thing read as "landed there directly" instead of "flashed the
    // top of the page, then jumped".
    requestAnimationFrame(() => {
      if (Number.isFinite(savedY) && savedY > 0) {
        window.scrollTo({ top: savedY, left: 0, behavior: "instant" });
      }
      document.documentElement.style.visibility = "";
    });

    // The overlay panel that covers the pinned Hero contains lazy-loaded
    // images; if any are still loading when the trigger above measures
    // its end position, the page grows after the fact and the pin release
    // point drifts out of sync — the pinned Hero briefly shows through at
    // the seam. Re-measuring once every image has settled keeps it exact.
    const images = Array.from(document.images);
    const pending = images.filter((img) => !img.complete);
    let remaining = pending.length;
    const onImageLoad = () => {
      remaining -= 1;
      if (remaining === 0) ScrollTrigger.refresh();
    };
    if (pending.length === 0) {
      ScrollTrigger.refresh();
    } else {
      pending.forEach((img) => img.addEventListener("load", onImageLoad, { once: true }));
    }

    return () => {
      ctx.revert();
      pending.forEach((img) => img.removeEventListener("load", onImageLoad));
      window.removeEventListener("beforeunload", saveScrollY);
      window.removeEventListener("pagehide", saveScrollY);
    };
  }, []);

  return (
    <>
      <div ref={pinnedRef} className="relative z-0">
        {pinned}
      </div>
      <div className="relative z-10 overflow-hidden rounded-t-[2.5rem] shadow-[0_-40px_60px_-20px_rgba(0,0,0,0.4)]">
        {overlay}
      </div>
    </>
  );
}
