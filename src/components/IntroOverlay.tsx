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

    // Block scrolling by intercepting the input events themselves rather
    // than toggling overflow:hidden — overflow:hidden collapses the
    // scrollbar, and scrollbar-gutter:stable (globals.css) keeps that
    // column's width reserved as an empty strip the whole time it's hidden,
    // then pops the real scrollbar into it the instant overflow is restored.
    // Leaving overflow untouched keeps the scrollbar always rendered in that
    // column, so there's nothing to pop in.
    const preventScrollKeys = new Set([
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " ",
    ]);
    const blockWheel = (e: WheelEvent) => e.preventDefault();
    const blockTouchMove = (e: TouchEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (preventScrollKeys.has(e.key)) e.preventDefault();
    };
    // Backstop for dragging the scrollbar thumb itself: that moves scrollY
    // directly, without ever firing wheel/touchmove/keydown, so it isn't
    // caught by the preventDefault listeners above. Snapping back to 0 on
    // every scroll event closes that hole; checking scrollY first avoids
    // this scrollTo call re-triggering itself forever.
    const blockScrollDrag = () => {
      if (window.scrollY !== 0) window.scrollTo(0, 0);
    };
    window.addEventListener("wheel", blockWheel, { passive: false });
    window.addEventListener("touchmove", blockTouchMove, { passive: false });
    window.addEventListener("keydown", blockKeys);
    window.addEventListener("scroll", blockScrollDrag, { passive: true });

    // This overlay is opaque and covers the whole viewport, but Header/main
    // underneath aren't otherwise hidden from assistive tech — without this,
    // Tab during the ~2-3s animation reaches links a sighted user can't see
    // (the overlay visually covers them). `inert` pulls them out of both the
    // tab order and the accessibility tree until the intro hands off.
    const inertTargets = [document.querySelector("header"), document.querySelector("main")];
    inertTargets.forEach((el) => el?.setAttribute("inert", ""));

    const unblockScroll = () => {
      window.removeEventListener("wheel", blockWheel);
      window.removeEventListener("touchmove", blockTouchMove);
      window.removeEventListener("keydown", blockKeys);
      window.removeEventListener("scroll", blockScrollDrag);
      inertTargets.forEach((el) => el?.removeAttribute("inert"));
    };

    const ctx = gsap.context(() => {
      const letters = typeRef.current?.querySelectorAll("span") ?? [];
      const tiles = mosaicRefs.current.filter(Boolean) as HTMLDivElement[];
      const heroTile = tiles[0];
      const otherTiles = tiles.slice(1);

      // mosaicLayout's `height` is authored in vh, which only reads as
      // intended on desktop's wide-relative-to-tall viewports. On a phone
      // (narrow but very tall) 1vh is several times larger than 1vw, so the
      // same numbers stretch every tile into a tall, narrow sliver. Using
      // vw for height too — same value, different unit — keeps each tile's
      // originally authored aspect ratio instead of it being distorted by
      // the viewport's own aspect ratio.
      if (window.innerWidth <= 596) {
        mosaicRefs.current.forEach((tile, i) => {
          if (!tile) return;
          tile.style.height = `${mosaicLayout[i].height}vw`;
        });
      }

      const tl = gsap.timeline({
        paused: true,
        delay: 0.3,
        onComplete: () => {
          unblockScroll();
          sessionStorage.setItem(SEEN_KEY, "true");
          setVisible(false);
          window.dispatchEvent(new Event(INTRO_DONE_EVENT));
        },
      });

      // Wait for the custom font (Rajdhani, loaded in layout.tsx) before
      // starting: the "ARMADERO" wordmark fades in via opacity almost
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
      const isMobile = window.innerWidth <= 596;
      // On narrow phones the 0.045 ratio renders barely-legible text (e.g.
      // ~17px at 390px wide) — a separate, larger ratio for mobile that
      // still stays close to the final header-logo size (32px, see
      // getHeaderLogoLayout) it morphs into at the end of the animation.
      const typingFontSize = isMobile
        ? Math.min(window.innerWidth * 0.075, 32)
        : Math.min(window.innerWidth * 0.045, 64);
      // Same tracking RATIO as the hero-state logo (0.18em), just at the
      // smaller typing font-size — not the 0.4em it used to be. That match
      // matters once the flight step below fixes font-size/letter-spacing
      // and animates `scale` instead: scaling a box uniformly preserves the
      // ratio it already has, so starting at the same ratio the hero logo
      // ends at means nothing needs to visibly "snap tighter" mid-flight.
      const typingTrackingRatio = heroLogoLayout.trackingRatio;
      gsap.set(typeRef.current, {
        fontSize: typingFontSize,
        // GSAP (like Framer Motion, see the same gotcha noted in
        // Header.tsx) doesn't auto-append "px" to letterSpacing the way it
        // does for fontSize/width/top — a bare number is an invalid CSS
        // value the browser silently drops, so letter-spacing does nothing
        // without the explicit unit.
        letterSpacing: `${typingFontSize * typingTrackingRatio}px`,
        color: "#362f2b",
      });
      // Centered via a concrete measured px box, not left:50%+xPercent:-50:
      // xPercent is recalculated against the element's CURRENT width every
      // frame, and that width is itself being animated (fontSize grows
      // through this same tween) — the two compounding non-linearly is what
      // made the text visibly overshoot left before snapping into place.
      // Plain left/top numbers sidestep that entirely.
      const startRect = typeRef.current!.getBoundingClientRect();
      const startLeft = window.innerWidth / 2 - startRect.width / 2;
      const startTop = window.innerHeight / 2 - startRect.height / 2;
      gsap.set(typeRef.current, { left: startLeft, top: startTop });

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
        .call(
          // Right as the flight starts: swap the per-letter <span> markup
          // (needed only for the typing stagger) for a plain text node, and
          // switch from animating fontSize/letterSpacing directly to
          // animating `scale` instead (see the .to() below). Two different
          // sources of the same symptom, fixed together here:
          //
          // 1) 8 independent inline-block boxes each round their own width
          //    to the nearest pixel while fontSize/letterSpacing change —
          //    those roundings don't stay in lockstep, showing as a faint
          //    tremor in the word's shape. A single text node has only one
          //    box to round.
          // 2) Even with one text node, animating fontSize directly still
          //    re-shapes the glyphs (kerning/hinting) at every discrete
          //    size the tween passes through, and that re-shaping isn't
          //    perfectly linear between sizes — a residual left-right
          //    jitter. Fixing font-size/letter-spacing at their final
          //    values now and compensating with a `scale` transform (set
          //    below to the equivalent shrink factor, then animated back
          //    to 1) means the glyphs are shaped once and the "growth" is
          //    purely a GPU compositing scale — no reshaping, no jitter.
          //
          // `transformOrigin: "0 0"` keeps the box's top-left corner (i.e.
          // `left`/`top`) exactly where it already is through this swap, so
          // none of this is visible — same visual size and position as the
          // instant before, just represented differently underneath.
          () => {
            const el = typeRef.current;
            if (!el) return;
            el.textContent = LOGO_TEXT;
            gsap.set(el, {
              transformOrigin: "0 0",
              fontSize: heroLogoLayout.fontSize,
              letterSpacing: `${heroLogoLayout.tracking}px`,
              scale: typingFontSize / heroLogoLayout.fontSize,
            });
          },
          [],
          "<"
        )
        .to(
          // The typed wordmark morphs into Header's hero-logo spot instead
          // of fading away — same start/duration/ease as the photo's expand
          // above, so both "arrive" together.
          typeRef.current,
          {
            left: heroLogoLayout.left,
            top: heroLogoLayout.top,
            scale: 1,
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
      unblockScroll();
      ctx.revert();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-[100] overflow-hidden bg-cream">
      <div
        ref={typeRef}
        aria-hidden="true"
        className="absolute z-10 leading-none font-logo font-medium whitespace-nowrap text-ink"
      >
        {LOGO_TEXT.split("").map((ch, i) => (
          <span key={i} className="inline-block opacity-0">
            {ch}
          </span>
        ))}
      </div>

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
