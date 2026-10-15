import BuyWidget from "./BuyWidget";
import Countdown from "./Countdown";
import { links, sale, site } from "@/config";

const compactUsd = (n: number) =>
  `$${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(n)}`;

export default function Hero() {
  const stats = [
    { label: "Raised so far", value: compactUsd(sale.raisedUsd) },
    { label: "Stage price", value: `$${sale.tokenPriceUsd}` },
    { label: "Network", value: `${site.network} · ${site.tokenStandard}` },
  ];

  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-36">
      {/* backdrop */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="animate-glow pointer-events-none absolute -top-44 left-1/2 h-[560px] w-[720px] -translate-x-1/2 rounded-full bg-flame-500/20 blur-[160px]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-gold-400/10 blur-[140px]" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr]">
        {/* left column */}
        <div>
          <div className="rise inline-flex items-center gap-2 rounded-full border border-line bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-flame-500" />
            </span>
            {sale.stageLabel} — live on {site.network}
          </div>

          <h1
            className="rise mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
            style={{ animationDelay: "0.08s" }}
          >
            The <span className="gradient-text">{site.ticker}</span> presale
            is live on TRON
          </h1>

          <p
            className="rise mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
            style={{ animationDelay: "0.16s" }}
          >
            {site.description}
          </p>

          <p
            className="rise mt-9 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500"
            style={{ animationDelay: "0.24s" }}
          >
            Stage ends in
          </p>
          <div
            className="rise mt-3 max-w-md"
            style={{ animationDelay: "0.28s" }}
          >
            <Countdown />
          </div>

          <div
            className="rise mt-6 inline-flex max-w-full items-center gap-2.5 rounded-xl border border-line bg-ink-900/70 px-4 py-2.5 text-xs text-slate-400"
            style={{ animationDelay: "0.36s" }}
          >
            <span className="font-semibold uppercase tracking-wider text-slate-500">
              {site.tokenStandard} contract
            </span>
            <span className="truncate font-mono text-gold-300">
              {links.contractAddress}
            </span>
          </div>

          <div
            className="rise mt-8 flex flex-wrap gap-x-10 gap-y-5"
            style={{ animationDelay: "0.44s" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {s.label}
                </div>
                <div className="mt-1 text-lg font-bold text-white">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* right column */}
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/coin.png"
            alt={`${site.tokenName} coin`}
            className="animate-float pointer-events-none absolute -top-28 right-4 z-0 hidden w-52 select-none lg:block xl:w-60"
          />
          <div className="rise flex justify-center lg:justify-end" style={{ animationDelay: "0.2s" }}>
            <BuyWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
