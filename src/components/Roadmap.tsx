import Reveal from "./Reveal";

const PHASES = [
  {
    phase: "Phase 01",
    quarter: "Q4 2026",
    title: "Presale & TGE",
    status: "live" as const,
    items: [
      "Multi-stage public presale",
      "Independent smart-contract audit",
      "Token generation event (TGE)",
      "TRC-20 distribution to buyers",
    ],
  },
  {
    phase: "Phase 02",
    quarter: "Q1 2027",
    title: "Listings",
    status: "next" as const,
    items: [
      "DEX liquidity on SunSwap",
      "First CEX listings",
      "Price & market data integrations",
    ],
  },
  {
    phase: "Phase 03",
    quarter: "Q2 2027",
    title: "Utility rollout",
    status: "next" as const,
    items: [
      "Staking vaults go live",
      "Cashback integration",
      "Token-gated tournaments & tiers",
    ],
  },
  {
    phase: "Phase 04",
    quarter: "H2 2027",
    title: "Expansion",
    status: "next" as const,
    items: [
      "Community governance",
      "Strategic partnerships",
      "New product rollout",
    ],
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">
              Roadmap
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Where <span className="gradient-text">$1WIN</span> is headed
            </h2>
          </div>
        </Reveal>

        <div className="relative mt-12">
          <div className="absolute bottom-6 left-[22px] top-2 w-px bg-gradient-to-b from-flame-500/60 via-line to-transparent sm:left-1/2" />
          <div className="space-y-8">
            {PHASES.map((p, i) => (
              <Reveal
                key={p.phase}
                from={i % 2 === 0 ? "left" : "right"}
                delay={i * 80}
              >
                <div
                  className={`relative flex flex-col gap-4 pl-14 sm:w-1/2 sm:pl-0 ${
                    i % 2 === 0
                      ? "sm:pr-14 sm:text-right"
                      : "sm:ml-auto sm:pl-14"
                  }`}
                >
                  <span
                    className={`absolute left-[13px] top-1.5 h-5 w-5 rounded-full border-4 border-ink-950 sm:top-2 ${
                      i % 2 === 0
                        ? "sm:left-auto sm:-right-2.5"
                        : "sm:-left-2.5"
                    } ${
                      p.status === "live"
                        ? "animate-pulse bg-flame-500"
                        : "bg-slate-600"
                    }`}
                  />
                  <div className="card card-hover p-6">
                    <div
                      className={`flex items-center gap-3 ${
                        i % 2 === 0 ? "sm:justify-end" : ""
                      }`}
                    >
                      <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        {p.phase} · {p.quarter}
                      </span>
                      {p.status === "live" ? (
                        <span className="rounded-full bg-flame-500/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-flame-300">
                          Live
                        </span>
                      ) : (
                        <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-bold text-white">
                      {p.title}
                    </h3>
                    <ul className="mt-3 space-y-1.5 text-sm text-slate-400">
                      {p.items.map((it) => (
                        <li key={it}>{it}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
