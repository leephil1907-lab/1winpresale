import Reveal from "./Reveal";

/** Litepaper access panel; the action remains unavailable until a real document URL is configured. */
export default function Litepaper() {
  return (
    <section className="px-4 pb-6 sm:px-6">
      <Reveal>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-3xl border border-line bg-gradient-to-r from-white/[0.035] to-transparent p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">Project document</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white">LitePaper</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
              Token mechanics, distribution terms and TRON contract details should be documented before the sale is opened.
            </p>
          </div>
          <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-xl border border-line bg-white/[0.04] px-5 py-3 text-sm font-bold text-slate-400" aria-disabled="true">
            Document not published
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M14 3h7v7M10 14 21 3"/><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></svg>
          </span>
        </div>
      </Reveal>
    </section>
  );
}
