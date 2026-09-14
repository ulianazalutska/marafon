"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StackedIntro({ children }: { children: ReactNode }) {
  const [pinned, overlay] = Children.toArray(children);
  const pinnedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: pinnedRef.current,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
      });
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
