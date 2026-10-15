import Reveal from "./Reveal";
import { site } from "@/config";

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_0%,rgba(255,255,255,0.06),transparent)]" />
      <div className="animate-glow pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[680px] -translate-x-1/2 rounded-full bg-flame-500/10 blur-[160px]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 text-center sm:px-6">
        <h1
          className="rise text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl"
        >
          Token Sale
        </h1>
        <p
          className="rise mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          style={{ animationDelay: "0.12s" }}
        >
          {site.tagline}
        </p>
      </div>

      {/* pedestal visual */}
      <Reveal className="relative mt-2" delay={150}>
        <div className="relative mx-auto aspect-[16/9] w-full max-w-5xl overflow-hidden [mask-image:linear-gradient(to_bottom,#000_78%,transparent_99%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero.png"
            alt={`${site.tokenName} — gold coin above a pedestal`}
            className="animate-float h-full w-full select-none object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink-950 to-transparent" />
        </div>
      </Reveal>
    </section>
  );
}
