import Reveal from "./Reveal";

const STATUS = [
  { value: "TRON", label: "Target network" },
  { value: "TRC-20", label: "Token standard" },
  { value: "Pending", label: "Sale contract" },
  { value: "Pending", label: "Independent audit" },
];

export default function Leader() {
  return (
    <section id="about" className="relative py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">Project overview</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              A TRON adaptation built around <span className="gradient-text">transparent status</span>
            </h2>
            <p className="mt-3 leading-relaxed text-slate-400">
              This independent implementation mirrors the reference site's information architecture while keeping sale activity, contract verification and audit claims unpublished until they can be checked.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS.map((item, i) => (
            <Reveal key={item.label} delay={i * 80}>
              <div className="card card-hover relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-flame-500/10 blur-2xl" />
                <div className="text-2xl font-black tracking-tight text-white sm:text-3xl">{item.value}</div>
                <div className="mt-2 text-sm leading-snug text-slate-400">{item.label}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-4 grid gap-6 rounded-3xl bg-[#eceef1] p-6 text-ink-950 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Launch readiness</p>
              <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">Contract first. Sale second.</h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                Before contributions can be enabled, the project needs a deployed TRON contract, published sale and claim terms, verified payment-token configuration, and independent security review.
              </p>
            </div>
            <a href="#verification" className="inline-flex w-fit items-center gap-2 rounded-xl bg-ink-950 px-5 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5">
              View verification status
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
