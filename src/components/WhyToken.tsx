import Reveal from "./Reveal";
import { site } from "@/config";

const CARDS = [
  {
    tag: "#UTILITY",
    title: "Gaming utility",
    text: "Designed for gaming activity, rewards and ecosystem experiences, subject to confirmed platform integrations.",
    gradient: "from-[#5b3df5]/25 via-[#3b2a86]/15 to-transparent",
  },
  {
    tag: "#BUYBACK",
    title: "Token buyback",
    text: "A buyback model is part of the reference token narrative. Execution schedules and on-chain proof should be published before it is represented as active.",
    gradient: "from-[#f5b03d]/20 via-[#8a5a1e]/10 to-transparent",
  },
  {
    tag: "#TOKENOMICS",
    title: "Token burning",
    text: "Burns can reduce circulating supply when executed on-chain and supported by verifiable transaction records.",
    gradient: "from-[#f5b03d]/20 via-[#8a5a1e]/10 to-transparent",
  },
  {
    tag: "#NETWORK",
    title: "TRON network",
    text: "This adaptation targets TRON and the TRC-20 token standard, with low-fee transfers subject to network and wallet conditions.",
    gradient: "from-[#00dc6e]/20 via-[#0a6b3d]/10 to-transparent",
  },
];

export default function WhyToken() {
  return (
    <section id="why-token" className="relative py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">
              Why {site.tokenName}?
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.tag} delay={i * 110}>
              <div
                className={`card card-hover relative h-full overflow-hidden p-7 sm:p-8 bg-gradient-to-b ${c.gradient}`}
              >
                <span className="inline-block rounded-full border border-line bg-white/[0.06] px-3 py-1 text-[11px] font-bold tracking-widest text-slate-300">
                  {c.tag}
                </span>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {c.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
