import Reveal from "./Reveal";
import { companyStats } from "@/config";

// simple rising area curve across the 2022–2026 axis
const CHART_D =
  "M0,84 C30,80 55,74 85,66 C115,58 140,56 170,47 C200,38 225,34 255,26 C285,18 310,14 330,10";

export default function Leader() {
  return (
    <section id="about" className="relative py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              {companyStats.headline}
            </h2>
            <p className="mt-3 text-slate-400">{companyStats.subline}</p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {companyStats.cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 90}>
              <div className="card card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-flame-500/10 blur-2xl" />
                <div className="text-4xl font-black tracking-tight text-white sm:text-5xl">
                  {c.value}
                </div>
                <div className="mt-2 text-sm leading-snug text-slate-400">{c.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* growth chart card (light panel, like the reference) */}
        <Reveal delay={120}>
          <div className="mt-4 overflow-hidden rounded-3xl bg-[#eceef1] p-6 text-ink-950 sm:p-8">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black tracking-tight sm:text-5xl">
                {companyStats.chart.value}
              </span>
              <span className="text-sm font-medium leading-snug text-slate-600">
                {companyStats.chart.label}
              </span>
            </div>
            <svg viewBox="0 0 330 100" className="mt-4 w-full" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#00dc6e" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#00dc6e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${CHART_D} L330,100 L0,100 Z`} fill="url(#area)" />
              <path d={CHART_D} fill="none" stroke="#0e0e11" strokeOpacity="0.25" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="330" cy="10" r="5" fill="none" stroke="#00dc6e" strokeWidth="3" />
            </svg>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500">
              {companyStats.chart.years.map((y) => (
                <span key={y}>{y}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
