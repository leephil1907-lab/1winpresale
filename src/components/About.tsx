import Reveal from "./Reveal";
import { site } from "@/config";

const FEATURES = [
  {
    title: "Rewards & cashback",
    text: "Earn $1WIN back on activity across the ecosystem, credited straight to your wallet.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="8" width="18" height="4" rx="1" />
        <path d="M12 8v13" />
        <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
        <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
      </svg>
    ),
  },
  {
    title: "Staking",
    text: "Lock your tokens in staking vaults to earn protocol rewards over time.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: "Exclusive access",
    text: "Token-gated tournaments, VIP tiers, airdrops and early product access.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

export default function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        {/* coin visual */}
        <Reveal from="left" className="relative order-2 lg:order-1">
          <div className="animate-glow pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame-500/25 blur-[110px]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/coin.png"
            alt={`${site.tokenName} on ${site.network}`}
            className="animate-float relative mx-auto w-full max-w-md select-none rounded-[2rem]"
          />
        </Reveal>

        {/* copy */}
        <Reveal from="right" className="order-1 lg:order-2">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">
            About
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            What is <span className="gradient-text">{site.ticker}</span>?
          </h2>
          <p className="mt-5 leading-relaxed text-slate-400">
            {site.description} Built as a {site.tokenStandard} token, it is
            designed for high throughput and negligible transaction costs —
            made for everyday use, not just holding.
          </p>

          <div className="mt-8 space-y-4">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 110}>
                <div className="card card-hover flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-flame-500/15 text-flame-300">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{f.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      {f.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
