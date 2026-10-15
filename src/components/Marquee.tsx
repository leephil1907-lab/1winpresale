"use client";

import { useEffect, useState } from "react";
import { publicSale } from "@/config";

const usd = (n: number) => `$${new Intl.NumberFormat("en-US").format(n)}`;

const IDS = [
  "participants",
  "pool",
  "oversub",
  "price",
  "bonus",
  "supply",
  "network",
  "ends",
] as const;
type ItemId = (typeof IDS)[number];

const LABELS: Record<ItemId, string> = {
  participants: "Participants",
  pool: "Pool",
  oversub: "Oversubscription",
  price: "Price",
  bonus: "Stage bonus",
  supply: "Supply",
  network: "Network",
  ends: "Sale ends",
};

/**
 * Infinite sale-stats ticker. Numbers stay alive: the participants counter
 * ticks up periodically (with a pop animation), and the strip loops
 * seamlessly with edge fading. Hover pauses; reduced-motion freezes it.
 */
export default function Marquee() {
  const [participants, setParticipants] = useState(publicSale.participants);

  useEffect(() => {
    const id = window.setInterval(() => {
      setParticipants((p) => p + Math.floor(Math.random() * 3));
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  const oversub = (publicSale.raisedUsd / publicSale.goalUsd).toFixed(2);
  const ends = new Date(publicSale.saleEndDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const value = (id: ItemId) => {
    switch (id) {
      case "participants":
        return (
          <b key={participants} className="tick-pop font-semibold text-flame-300">
            {participants.toLocaleString("en-US")}
          </b>
        );
      case "pool":
        return <b className="font-semibold text-flame-300">{usd(publicSale.raisedUsd)}</b>;
      case "oversub":
        return <b className="font-semibold text-white">×{oversub}</b>;
      case "price":
        return <b className="font-semibold text-white">${publicSale.priceUsd.toFixed(2)} USDC</b>;
      case "bonus":
        return <b className="font-semibold text-gold-300">+{publicSale.stageBonusPct}%</b>;
      case "supply":
        return <b className="font-semibold text-white">{publicSale.supplyOnSale}</b>;
      case "network":
        return <b className="font-semibold text-white">TRON · TRC-20</b>;
      case "ends":
        return <b className="font-semibold text-white">{ends}</b>;
    }
  };

  const chip = (id: ItemId, key: string) => (
    <span key={key} className="flex shrink-0 items-center">
      <span className="flex items-center gap-2.5 px-5 text-[13px] text-slate-500">
        <span className="font-medium uppercase tracking-widest">{LABELS[id]}</span>
        {value(id)}
      </span>
      <span className="h-1.5 w-1.5 rotate-45 bg-flame-500/60" aria-hidden />
    </span>
  );

  // repeat the item set 3× per half so the -50% loop covers ultra-wide screens
  const seq = (suffix: string, hidden: boolean) =>
    [0, 1, 2].map((r) => (
      <div
        key={`${suffix}-${r}`}
        className="flex shrink-0 items-center"
        aria-hidden={hidden || r > 0 || undefined}
      >
        {IDS.map((id) => chip(id, `${suffix}-${r}-${id}`))}
      </div>
    ));

  return (
    <div
      className="marquee relative overflow-hidden border-y border-line bg-white/[0.02] py-3.5"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)",
      }}
    >
      <div className="animate-marquee flex w-max">
        {seq("a", false)}
        {seq("b", true)}
      </div>
      <span className="sr-only" aria-live="off">
        Participants {participants.toLocaleString("en-US")}, pool {usd(publicSale.raisedUsd)},
        oversubscription ×{oversub}, price ${publicSale.priceUsd.toFixed(2)} USDC.
      </span>
    </div>
  );
}
