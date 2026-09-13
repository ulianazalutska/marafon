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

    return () => ctx.revert();
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
