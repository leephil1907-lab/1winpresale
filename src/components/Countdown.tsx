"use client";

import { useEffect, useState } from "react";
import { publicSale } from "@/config";

function getRemaining() {
  const end = new Date(publicSale.saleEndDate).getTime();
  const diff = Math.max(0, end - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

const pad = (v?: number) => (v === undefined ? "--" : String(v).padStart(2, "0"));

/** Pill-box countdown matching the reference widget (DD : HH : MM : SS). */
export default function Countdown({ compact = false }: { compact?: boolean }) {
  const [t, setT] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setT(getRemaining());
    const id = setInterval(() => setT(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = [t?.days, t?.hours, t?.minutes, t?.seconds];

  return (
    <div className="flex items-center justify-center gap-1.5" role="timer" aria-label="Time remaining">
      {parts.map((v, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="font-bold text-slate-600">:</span>}
          <span
            className={`tick-pop inline-block rounded-lg bg-ink-700 font-bold tabular-nums text-white ${
              compact ? "px-2 py-1 text-sm" : "px-3 py-2 text-lg sm:px-3.5 sm:text-2xl"
            }`}
            key={`${i}-${v ?? "x"}`}
          >
            {pad(v)}
          </span>
        </span>
      ))}
    </div>
  );
}
