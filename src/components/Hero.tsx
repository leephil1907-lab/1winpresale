import Reveal from "./Reveal";
import HeroCoin3D from "./HeroCoin3D";
import { site } from "@/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* animated grid + glow backdrop */}
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="animate-glow pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-flame-500/10 blur-[160px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <h1 className="rise text-shimmer text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl">
          Token Sale
        </h1>
        <p
          className="rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          style={{ animationDelay: "0.12s" }}
        >
          {site.tagline}
        </p>
      </div>

      {/* live 3D coin visual (spins, bobs, gyro rings, pointer-tilt) */}
      <Reveal className="relative mt-2" delay={180}>
        <div className="mx-auto w-full max-w-3xl px-4 pb-4 pt-8 sm:pt-12">
          <HeroCoin3D />
        </div>
      </Reveal>
    </section>
  );
}
