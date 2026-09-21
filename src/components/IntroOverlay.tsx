"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { mosaicImages } from "@/lib/images";
import { mosaicLayout } from "@/lib/mosaicLayout";
import { INTRO_SEEN_KEY, INTRO_DONE_EVENT, LOGO_ARRIVED_EVENT } from "@/lib/intro";
import { getHeroLogoLayout } from "@/lib/logoLayout";

const LOGO_TEXT = "ARMADERO";
const SEEN_KEY = INTRO_SEEN_KEY;

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
      window.dispatchEvent(new Event(LOGO_ARRIVED_EVENT));
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
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
          window.dispatchEvent(new Event(INTRO_DONE_EVENT));
        },
      });

      // Wait for the custom font (Rajdhani, loaded in layout.tsx) before
      // starting: the "VELLARO" wordmark fades in via opacity almost
      // immediately, and without this it can render in the browser's bold
      // fallback font for a moment before swapping to the intended thin,
      // letter-spaced style once the font finishes downloading — a visible
      // jump. document.fonts.ready resolves immediately if fonts are
      // already cached, so repeat loads aren't delayed by this.
      //
      // Also wait for the hero tile's own <img> to finish loading: it later
      // stretches from a 24vw mosaic tile to the full viewport, and if that
      // stretch starts before the (now full-res, see the Image props below)
      // photo has actually downloaded, the browser scales up whatever
      // partial/low-res frame it has so far — a visible blur that only
      // clears once the file finishes loading mid-animation.
      const heroImg = heroTile?.querySelector("img");
      const heroImgReady =
        heroImg && !heroImg.complete
          ? new Promise<void>((resolve) =>
              heroImg.addEventListener("load", () => resolve(), { once: true })
            )
          : Promise.resolve();

      // Where/how big the wordmark must end up — exactly Header's hero-state
      // logo position, computed with the same shared formula it uses, so
      // the swap to Header's real (until now invisible) logo at the end is
      // pixel-identical instead of a visible jump.
      const heroLogoLayout = getHeroLogoLayout(window.innerWidth, window.innerHeight);
      const typingFontSize = Math.min(window.innerWidth * 0.045, 64);
      gsap.set(typeRef.current, {
        fontSize: typingFontSize,
        // GSAP (like Framer Motion, see the same gotcha noted in
        // Header.tsx) doesn't auto-append "px" to letterSpacing the way it
        // does for fontSize/width/top — a bare number is an invalid CSS
        // value the browser silently drops, so letter-spacing does nothing
        // without the explicit unit.
        letterSpacing: `${typingFontSize * 0.4}px`,
        color: "#1c140d",
      });
      // Centered via a concrete measured px box, not left:50%+xPercent:-50:
      // xPercent is recalculated against the element's CURRENT width every
      // frame, and that width is itself being animated (fontSize grows
      // through this same tween) — the two compounding non-linearly is what
      // made the text visibly overshoot left before snapping into place.
      // Plain left/top numbers sidestep that entirely.
      const startRect = typeRef.current!.getBoundingClientRect();
      gsap.set(typeRef.current, {
        left: window.innerWidth / 2 - startRect.width / 2,
        top: window.innerHeight / 2 - startRect.height / 2,
      });

      Promise.all([document.fonts?.ready ?? Promise.resolve(), heroImgReady]).then(() =>
        tl.play()
      );

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
        .to({}, { duration: 0.4 }, "<") // placeholder: keeps the ">-0.1" offset below identical to before
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
        .to(
          // The typed wordmark morphs into Header's hero-logo spot instead
          // of fading away — same start/duration/ease as the photo's expand
          // above, so both "arrive" together.
          typeRef.current,
          {
            left: heroLogoLayout.left,
            top: heroLogoLayout.top,
            fontSize: heroLogoLayout.fontSize,
            letterSpacing: `${heroLogoLayout.tracking}px`,
            color: "#ffffff",
            duration: 1.1,
            ease: "power3.inOut",
            onComplete: () => window.dispatchEvent(new Event(LOGO_ARRIVED_EVENT)),
          },
          "<"
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
        className="absolute z-10 leading-none font-logo font-medium whitespace-nowrap text-ink"
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
            {i === 0 ? (
              // Same src, sizes and quality as the real Hero photo (see
              // Hero.tsx) on purpose: matching optimizer params means the
              // browser resolves this to the identical cached URL, so the
              // tile is full-res from the first frame (no blur once it
              // later stretches to fullscreen) and the real Hero underneath
              // doesn't have to download a second copy.
              <Image src={src} alt="" fill priority quality={100} sizes="100vw" className="object-cover" />
            ) : (
              <Image src={src} alt="" fill sizes="24vw" className="object-cover" />
            )}
          </div>
        );
      })}
    </div>
  );
}
