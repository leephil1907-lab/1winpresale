import Reveal from "./Reveal";
import { site } from "@/config";

const CARDS = [
  {
    tag: "#UTILITY",
    title: "In-game utility",
    text: "Designed to be spent, not just held — the token powers gameplay, rewards and perks across the ecosystem.",
    gradient: "from-[#5b3df5]/25 via-[#3b2a86]/15 to-transparent",
  },
  {
    tag: "#BUYBACK",
    title: "Buyback & burn",
    text: "A recurring treasury program can repurchase tokens from the market and burn a share, aiming to balance circulating supply with demand.",
    gradient: "from-[#f5b03d]/20 via-[#8a5a1e]/10 to-transparent",
  },
  {
    tag: "#NETWORK",
    title: "Built on TRON",
    text: "TRC-20 transfers settle in seconds with negligible fees — practical for everyday rewards and cashback at scale.",
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

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
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
