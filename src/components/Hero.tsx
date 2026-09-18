"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { images } from "@/lib/images";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

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
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/8" />

      {/* Деталі, що формують ваш простір */}
      <p
        className="absolute text-left text-[25px] leading-[1.3] font-medium tracking-[0.02em] text-white"
        style={{ left: "57%", top: "3.5%", width: "20vw" }}
      >
        Деталі, що формують
        <br />
        ваш простір
      </p>

      {/* Від першого заміру до монтажу */}
      <p
        className="absolute text-[19px] leading-[1.5] font-medium tracking-[0.02em] text-white"
        style={{ left: "68.4%", top: "34%", width: "16vw" }}
      >
        Від першого заміру до монтажу — проєкт, матеріали та деталі в одному
        рішенні
      </p>

      {/* Відео-прев'ю картка */}
      <div
        className="absolute rounded-[1.75rem] bg-white p-[9px] pb-[17px] shadow-[0_20px_45px_-15px_rgba(0,0,0,0.3)]"
        style={{ left: "79.2%", top: "43.2%", width: "9vw" }}
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
        <p className="mt-3 text-center text-[13px] text-brown-850">
          Світло. Рух. Комфорт.
        </p>
      </div>

      {/* Гардеробна, створена під ваш простір */}
      <div className="absolute" style={{ left: "15%", top: "48%" }}>
        <p className="text-[19px] leading-[1.35] font-medium tracking-[0.02em] text-white">
          Гардеробна, створена під
          <br />
          ваш простір і спосіб життя
        </p>
        <a
          href="#contact"
          className="mt-6 ml-23 inline-flex items-center gap-3 rounded-full bg-accent py-[8px] pr-[7px] pl-[10px] text-[19px] font-normal text-white transition-opacity hover:opacity-90"
        >
          Підібрати гардеробну
          <span className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-white">
            <svg width="13.67" height="13.67" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.5 7.64L7.64 0.5M7.64 5.9264V0.5H2.2136" stroke="#AF957C" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>
    </section>
  );
}
