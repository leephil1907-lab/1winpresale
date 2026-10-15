"use client";

import { useEffect, useState } from "react";
import { sale } from "@/config";

function getRemaining() {
  const end = new Date(sale.saleEndDate).getTime();
  const diff = Math.max(0, end - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    setT(getRemaining());
    const id = setInterval(() => setT(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const items: Array<{ label: string; value?: number }> = [
    { label: "Days", value: t?.days },
    { label: "Hours", value: t?.hours },
    { label: "Min", value: t?.minutes },
    { label: "Sec", value: t?.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2.5">
      {items.map((i) => (
        <div key={i.label} className="card px-2 py-3 text-center">
          <div className="text-2xl font-extrabold tabular-nums text-white sm:text-3xl">
            <span
              key={`${i.label}-${i.value ?? "x"}`}
              className="tick-pop inline-block"
            >
              {i.value === undefined ? "--" : String(i.value).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            {i.label}
          </div>
        </div>
      ))}
    </div>
  );
}
