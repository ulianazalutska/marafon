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
      <Image src={images.hero} alt="" fill priority className="object-cover" />

      {/* Деталі, що формують ваш простір */}
      <p
        className="absolute text-right text-[22px] leading-[1.3] font-medium text-white"
        style={{ left: "61%", top: "4.4%", width: "20vw" }}
      >
        Деталі, що формують
        <br />
        ваш простір
      </p>

      {/* Від першого заміру до монтажу */}
      <p
        className="absolute text-[15px] leading-[1.5] text-white"
        style={{ left: "68.4%", top: "47%", width: "21vw" }}
      >
        Від першого заміру до монтажу — проєкт, матеріали та деталі в одному
        рішенні
      </p>

      {/* Відео-прев'ю картка */}
      <div
        className="absolute"
        style={{ left: "79.2%", top: "53.2%", width: "18.4vw" }}
      >
        <button
          onClick={togglePlay}
          className="group relative block aspect-[265/195] w-full overflow-hidden rounded-[1.75rem] border-[6px] border-white bg-brown-900 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)]"
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
            className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity ${
              playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#362f2b">
                <path d="M3 1.5v13l11-6.5z" />
              </svg>
            </span>
          </span>
        </button>
        <p className="mt-3 text-center text-[15px] text-brown-850">
          Світло. Рух. Комфорт.
        </p>
      </div>

      {/* Гардеробна, створена під ваш простір */}
      <div className="absolute" style={{ left: "4.7%", top: "62.5%" }}>
        <p className="text-[20px] leading-[1.35] font-medium text-white">
          Гардеробна, створена під
          <br />
          ваш простір і спосіб життя
        </p>
        <a
          href="#contact"
          className="mt-6 inline-flex items-center gap-3 rounded-full bg-accent py-3.5 pr-3.5 pl-6 text-[15px] text-white transition-opacity hover:opacity-90"
        >
          Підібрати гардеробну
          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/70">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </span>
        </a>
      </div>

      {/* Вордмарк */}
      <p
        className="absolute font-logo leading-none font-medium whitespace-nowrap text-white"
        style={{
          left: "8.6%",
          bottom: "0%",
          fontSize: "14.5vw",
          letterSpacing: "0.18em",
        }}
      >
        ARMADERO
      </p>
    </section>
  );
}
