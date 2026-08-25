import { images } from "@/lib/images";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-brown-950">
      <video
        src="/hero-video.mp4"
        poster={images.hero}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brown-950/70 via-transparent to-brown-950/30" />
    </section>
  );
}
