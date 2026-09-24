"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { images } from "@/lib/images";
import { INTRO_SEEN_KEY, INTRO_DONE_EVENT } from "@/lib/intro";

export default function Hero() {
  const t = useTranslations("Hero");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const topTextRef = useRef<HTMLHeadingElement>(null);
  const rightTextRef = useRef<HTMLParagraphElement>(null);
  const videoCardRef = useRef<HTMLDivElement>(null);
  const leftBlockRef = useRef<HTMLDivElement>(null);

  // These elements sit underneath IntroOverlay while it plays, so revealing
  // them only once it's fully gone (rather than animating on mount) keeps
  // the two sequences from overlapping. This only ever runs on the actual
  // first-load intro: on repeat visits within the session (intro already
  // seen, so it never mounts) there's nothing to hand off from, so this
  // bails out entirely rather than replaying the entrance instantly on
  // every reload — the elements just render at rest, already in place.
  //
  // Exception: a locale switch (Header) sets LANG_SWITCH_KEY right before
  // its reload specifically so this plays once more — the full IntroOverlay
  // stays skipped (that'd be a lot to sit through just for a language
  // toggle), but replaying just the text entrance confirms the switch
  // visibly. Nothing to hand off from in that case, so it plays immediately
  // instead of waiting for INTRO_DONE_EVENT.
  useEffect(() => {
    const introSeen = sessionStorage.getItem(INTRO_SEEN_KEY) === "true";
    const langSwitch = Boolean(
      (window as unknown as { __armadero?: { langSwitch?: boolean } }).__armadero?.langSwitch
    );
    if (introSeen && !langSwitch) return;

    let tl: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ paused: true, delay: 0.1 });
      tl.from(topTextRef.current, { y: -28, opacity: 0, duration: 0.8, ease: "power3.out" })
        .from(rightTextRef.current, { x: 28, opacity: 0, duration: 0.8, ease: "power3.out" }, "<0.1")
        .from(videoCardRef.current, { x: 28, opacity: 0, duration: 0.8, ease: "power3.out" }, "<0.15")
        .from(leftBlockRef.current, { x: -28, opacity: 0, duration: 0.8, ease: "power3.out" }, "<0.1");
    });

    if (introSeen && langSwitch) {
      tl?.play();
      return () => ctx.revert();
    }

    const play = () => tl?.play();
    window.addEventListener(INTRO_DONE_EVENT, play, { once: true });

    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, play);
      ctx.revert();
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Image
        src={images.hero}
        alt=""
        fill
        priority
        quality={100}
        sizes="(min-width: 1600px) 1600px, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/8" />

      {/* Фото лишається full-bleed на всю ширину екрана, але текст/картка
          всередині обмежені тим самим max-w-[1600px], що й Header — інакше
          на 2560px+ монітори елементи розповзались би по всій ширині. */}
      <div className="absolute inset-y-0 left-1/2 w-full max-w-[1600px] -translate-x-1/2">
        {/* Деталі, що формують ваш простір — на мобільному (≤596) немає
            місця під цей блок, ховається повністю */}
        <h1
          ref={topTextRef}
          className="absolute hidden top-[3%] left-[48%] text-left text-[27px] leading-[32px] font-medium tracking-[0.02em] text-white min-[847px]:block min-[978px]:left-[54%] min-[1067px]:left-[58%] min-[1067px]:text-[25px] min-[1167px]:left-[50%]"
          style={{ width: "max-content" }}
        >
          {t("headlineLine1")}
          <br />
          {t("headlineLine2")}
        </h1>

        {/* Від першого заміру до монтажу — теж лише з 597px */}
        <p
          ref={rightTextRef}
          className="absolute hidden w-[38vw] left-[56%] top-[35%] text-[19px] leading-[23px] font-medium tracking-[0.02em] text-white min-[847px]:block min-[1006px]:left-[64%] min-[1006px]:w-[32vw] min-[1191px]:text-[21px] min-[1191px]:leading-[26px]"
        >
          {t("subtextLine1")}
          <br />
          {t("subtextLine2")}
          <br />
          {t("subtextLine3")}
        </p>

        {/* Відео-прев'ю картка */}
        <div
          ref={videoCardRef}
          className="absolute top-[63%] left-[60%] w-[150px] rounded-[33px] bg-white p-[9px] pb-[15px] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.3)] min-[597px]:top-[48%] min-[597px]:left-[75%] min-[597px]:w-[160px] min-[1006px]:left-[79.2%] min-[1067px]:top-[43.2%] min-[1067px]:w-[clamp(180px,11vw,220px)] min-[1067px]:rounded-[1.75rem] min-[1067px]:pb-[17px]"
        >
          <button
            onClick={togglePlay}
            className="group relative block aspect-[174/185] w-full cursor-pointer overflow-hidden rounded-[1.25rem] bg-brown-900"
          >
            <video
              ref={videoRef}
              src={images.heroPreviewVideo}
              poster={images.heroPreviewPoster}
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                playing ? "opacity-0" : "opacity-100"
              }`}
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <path
                  d="M14 10L32 22L14 34Z"
                  fill="white"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </button>
          <p className="mt-3 text-center text-[13px] whitespace-nowrap text-brown-850">
            {t("videoCaption")}
          </p>
        </div>

        {/* Гардеробна, створена під ваш простір */}
        <div
          ref={leftBlockRef}
          className="absolute top-[40%] left-[6%] min-[597px]:top-[48%] min-[597px]:left-[10%] min-[1067px]:left-[15%]"
        >
          <p className="max-w-[230px] text-[19px] leading-[1.35] font-medium tracking-[0.02em] text-white min-[597px]:max-w-none min-[1191px]:text-[21px]">
            {t("leftHeadlineLine1")}
            <br className="hidden min-[597px]:inline" /> {t("leftHeadlineLine2")}
          </p>
          <a
            href="#contact"
            className="group mt-6 ml-0 inline-flex items-center gap-2.5 rounded-full bg-accent py-[7px] pr-[6px] pl-[9px] text-[17px] font-normal text-white transition-opacity hover:opacity-90 min-[597px]:ml-23 min-[1067px]:gap-3 min-[1067px]:py-[8px] min-[1067px]:pr-[7px] min-[1067px]:pl-[10px] min-[1067px]:text-[19px]"
          >
            {t("cta")}
            <span className="flex h-[28px] w-[28px] items-center justify-center overflow-hidden rounded-full bg-white min-[1067px]:h-[31px] min-[1067px]:w-[31px]">
              <svg
                width="13.67"
                height="13.67"
                viewBox="0 0 9 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
              >
                <path d="M0.5 7.64L7.64 0.5M7.64 5.9264V0.5H2.2136" stroke="var(--color-accent)" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
