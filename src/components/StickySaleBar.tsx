"use client";

import { useEffect, useState } from "react";
import { publicSale, saleIntegration } from "@/config";

const pad = (v?: number) => (v === undefined ? "--" : String(v).padStart(2, "0"));

function useRemaining() {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, new Date(publicSale.saleEndDate).getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86_400_000),
        h: Math.floor(diff / 3_600_000) % 24,
        m: Math.floor(diff / 60_000) % 60,
        s: Math.floor(diff / 1_000) % 60,
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Fixed bottom sale bar on mobile (like the reference). */
export default function StickySaleBar() {
  const t = useRemaining();
  const live = saleIntegration.live && Boolean(saleIntegration.contractAddress);

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="card flex items-center justify-between gap-3 rounded-2xl px-4 py-3 shadow-2xl">
        <div className="min-w-0">
          <div className="truncate text-[11px] font-medium text-slate-500">
            {live ? "Token Sale ends in" : "Sale status"}
          </div>
          <div className="mt-0.5 font-mono text-sm font-bold tabular-nums text-white">
            {live ? `${pad(t?.d)} : ${pad(t?.h)} : ${pad(t?.m)} : ${pad(t?.s)}` : "Not configured"}
          </div>
        </div>
        <a href="#buy" className="btn-primary shrink-0 px-5 py-2.5 text-sm">
          View status
        </a>
      </div>
    </div>
  );
}
