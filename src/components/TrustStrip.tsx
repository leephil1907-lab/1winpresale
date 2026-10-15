import { auditors } from "@/config";

/**
 * Auditor trust strip — renders only when real audit partners are configured
 * (never display auditor names you do not hold reports from).
 */
export default function TrustStrip() {
  if (auditors.length === 0) return null;

  return (
    <section className="px-4 pb-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xl font-extrabold tracking-wide text-slate-500">
          {auditors.map((a) => (
            <span key={a} className="uppercase">
              {a}
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-600">
          Audited by {auditors.join(" and ")}
        </p>
      </div>
    </section>
  );
}
