import { saleIntegration, site } from "@/config";

/** Verification panel: show real status instead of unsupported audit badges. */
export default function TrustStrip() {
  const contractReady = saleIntegration.live && Boolean(saleIntegration.contractAddress);
  return (
    <section className="px-4 pb-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-4xl gap-3 sm:grid-cols-3">
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
          </span>
          <div><div className="text-sm font-bold text-white">Audit status</div><div className="mt-0.5 text-xs text-slate-400">Report not published</div></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6M7 16h4"/></svg>
          </span>
          <div><div className="text-sm font-bold text-white">Sale contract</div><div className="mt-0.5 text-xs text-slate-400">{contractReady ? "Configured" : "Not configured"}</div></div>
        </div>
        <div className="card flex items-center gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-slate-300" aria-hidden>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>
          </span>
          <div><div className="text-sm font-bold text-white">{site.network} · {site.tokenStandard}</div><div className="mt-0.5 text-xs text-slate-400">Network adaptation</div></div>
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-3xl text-center text-xs leading-relaxed text-slate-500">
        Audit providers, contract addresses and verification links will appear only after independently verifiable evidence is available.
      </p>
    </section>
  );
}
