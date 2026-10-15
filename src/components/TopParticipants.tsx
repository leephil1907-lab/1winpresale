import Reveal from "./Reveal";

/**
 * Participant leaderboard shell matching the reference page.
 * It deliberately shows an empty state until verified sale events are indexed.
 */
export default function TopParticipants() {
  return (
    <section id="top-participants" className="relative py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">
                Sale activity
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Top participants
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Contributions will appear here once a verified sale contract and
              public event index are available.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="card mt-8 overflow-hidden">
            <div className="grid grid-cols-[64px_1fr_auto] gap-4 border-b border-line bg-white/[0.025] px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500 sm:grid-cols-[80px_1fr_180px] sm:px-7">
              <span>Rank</span>
              <span>Participant</span>
              <span className="text-right">Contribution</span>
            </div>
            <div className="flex min-h-52 flex-col items-center justify-center px-6 py-10 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-white/[0.035] text-slate-400">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                  <path d="M8 21h8M12 17v4M7 4h10l2 4-7 4-7-4 2-4Z" />
                  <path d="M5 8v3a3 3 0 0 0 3 3M19 8v3a3 3 0 0 1-3 3" />
                </svg>
              </span>
              <h3 className="mt-4 text-base font-bold text-white">Ranking will appear when the sale opens</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                No participant addresses or contribution amounts are shown until
                they can be verified against on-chain records.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
