import Reveal from "./Reveal";
import { links, publicSale, sale, site, tokenomics } from "@/config";

const R = 80;
const C = 2 * Math.PI * R;

function Donut() {
  let acc = 0;
  return (
    <div className="relative transition-transform duration-500 hover:scale-[1.03]">
      <svg viewBox="0 0 200 200" className="w-full max-w-sm">
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="26"
        />
        {tokenomics.allocations.map((a, idx) => {
          const dash = (a.pct / 100) * C;
          const offset = (acc / 100) * C;
          acc += a.pct;
          return (
            <circle
              key={a.label}
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke={a.color}
              strokeWidth="26"
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 100 100)"
              strokeLinecap="butt"
              opacity="0.92"
              className="donut-seg"
              style={{ "--i": idx } as React.CSSProperties}
            />
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-extrabold text-white">1B</div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          total supply
        </div>
      </div>
    </div>
  );
}

export default function Tokenomics() {
  const facts = [
    {
      label: "Total supply",
      value: `${tokenomics.totalSupply.toLocaleString("en-US")} ${site.ticker}`,
      mono: false,
    },
    {
      label: "Network",
      value: `${site.network} (${site.tokenStandard})`,
      mono: false,
    },
    { label: "Reference sale price", value: `${sale.tokenPriceUsd}`, mono: false },
    { label: "Contract", value: links.contractAddress, mono: true },
  ];

  return (
    <section
      id="tokenomics"
      className="relative border-y border-line bg-ink-900/40 py-20 sm:py-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <Reveal from="left">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">
            Tokenomics
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            A supply built for{" "}
            <span className="gradient-text">the long game</span>
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-slate-400">
            Allocation categories and percentages follow the public reference layout. Confirm the TRON token issuer, legal terms, and final allocation documents before treating these figures as launch terms.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 90}>
                <div className="card card-hover h-full p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {f.label}
                  </div>
                  <div
                    className={`mt-1.5 truncate font-bold text-white ${
                      f.mono ? "font-mono text-sm text-gold-300" : ""
                    }`}
                  >
                    {f.value}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal from="right">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:justify-end lg:gap-12">
            <Donut />
            <ul className="w-full max-w-[220px] space-y-3">
              {tokenomics.allocations.map((a) => (
                <li
                  key={a.label}
                  className="flex items-center gap-3 text-sm transition-transform duration-200 hover:translate-x-1"
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: a.color }}
                  />
                  <span className="flex-1 text-slate-300">{a.label}</span>
                  <span className="font-bold text-white">{a.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
