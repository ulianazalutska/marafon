"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { mosaicImages } from "@/lib/images";
import { mosaicLayout } from "@/lib/mosaicLayout";

const LOGO_TEXT = "VELLARO";
const SEEN_KEY = "vellaro-intro-seen";

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLHeadingElement>(null);
  const mosaicRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    // Only the first load of a browser session sees the intro. Reloads and
    // in-session navigation (including landing on a #hash URL, where the
    // browser's own scroll-to-anchor can otherwise race this overlay's
    // scroll lock) skip straight to the page. This hides it by directly
    // mutating the DOM (not React state) so it happens synchronously
    // before paint without triggering a server/client hydration mismatch
    // — the server has no sessionStorage to know this in advance, so it
    // always renders the overlay markup; this is what removes it again on
    // repeat visits.
    if (sessionStorage.getItem(SEEN_KEY) === "true") {
      if (overlayRef.current) overlayRef.current.style.display = "none";
      return;
    }

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const letters = typeRef.current?.querySelectorAll("span") ?? [];
      const tiles = mosaicRefs.current.filter(Boolean) as HTMLDivElement[];
      const heroTile = tiles[0];
      const otherTiles = tiles.slice(1);

      const tl = gsap.timeline({
        paused: true,
        delay: 0.3,
        onComplete: () => {
          document.body.style.overflow = "";
          sessionStorage.setItem(SEEN_KEY, "true");
          setVisible(false);
        },
      });

      // Wait for the custom font (Ranade, loaded in layout.tsx) before
      // starting: the "VELLARO" wordmark fades in via opacity almost
      // immediately, and without this it can render in the browser's bold
      // fallback font for a moment before swapping to the intended thin,
      // letter-spaced style once the font finishes downloading — a visible
      // jump. document.fonts.ready resolves immediately if fonts are
      // already cached, so repeat loads aren't delayed by this.
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => tl.play());
      } else {
        tl.play();
      }

      tl.to(letters, { opacity: 1, duration: 0.04, stagger: 0.06 })
        .to({}, { duration: 0.3 })
        .to(
          otherTiles,
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            stagger: { each: 0.04, from: "random" },
            ease: "power2.out",
          },
          "+=0.1"
        )
        .to(heroTile, { opacity: 1, scale: 1, duration: 0.5 }, "<")
        .to({}, { duration: 0.6 })
        .to(letters, { opacity: 0, duration: 0.4 }, "<")
        .to(
          heroTile,
          {
            left: 0,
            top: 0,
            width: "100vw",
            height: "100vh",
            borderRadius: 0,
            duration: 1.1,
            ease: "power3.inOut",
          },
          ">-0.1"
        )
        .to(otherTiles, { opacity: 0, duration: 0.5 }, "<")
        .to(overlayRef.current, { opacity: 0, duration: 0.6 }, "+=0.2");
    }, overlayRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] overflow-hidden bg-cream">
      <h1
        ref={typeRef}
        className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-4xl font-light tracking-[0.4em] text-ink md:text-6xl"
      >
        {LOGO_TEXT.split("").map((ch, i) => (
          <span key={i} className="inline-block opacity-0">
            {ch}
          </span>
        ))}
      </h1>

      {mosaicImages.map((src, i) => {
        const layout = mosaicLayout[i];
        return (
          <div
            key={i}
            ref={(el) => {
              mosaicRefs.current[i] = el;
            }}
            className="absolute overflow-hidden rounded-md opacity-0"
            style={{
              left: `${layout.left}vw`,
              top: `${layout.top}vh`,
              width: `${layout.width}vw`,
              height: `${layout.height}vh`,
              transform: "scale(0.9)",
            }}
          >
            <Image src={src} alt="" fill sizes="24vw" className="object-cover" />
          </div>
        );
      })}
    </div>
  );
}
