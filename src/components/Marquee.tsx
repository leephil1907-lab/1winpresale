import { publicSale, site } from "@/config";

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
  oversub: "Sale activity",
  price: "Reference price",
  bonus: "Stage bonus",
  supply: "Reference supply",
  network: "Network",
  ends: "Sale date",
};

/**
 * Infinite ticker for stable sale details. Activity values are withheld until
 * a verified contract/indexer is connected; never synthesize participant data.
 */
export default function Marquee() {
  const statsAvailable = false;
  const oversub = statsAvailable && publicSale.goalUsd > 0
    ? (publicSale.raisedUsd / publicSale.goalUsd).toFixed(2)
    : null;
  const ends = "Not announced";

  const value = (id: ItemId) => {
    switch (id) {
      case "participants":
        return (
          <b className="font-semibold text-slate-400">Awaiting verified data</b>
        );
      case "pool":
        return <b className="font-semibold text-slate-400">{statsAvailable ? usd(publicSale.raisedUsd) : "Awaiting verified data"}</b>;
      case "oversub":
        return <b className="font-semibold text-slate-400">{oversub ? `×${oversub}` : "Not available"}</b>;
      case "price":
        return <b className="font-semibold text-white">${publicSale.priceUsd.toFixed(2)} reference</b>;
      case "bonus":
        return <b className="font-semibold text-slate-400">Not announced</b>;
      case "supply":
        return <b className="font-semibold text-slate-300">{publicSale.supplyOnSale} (reference)</b>;
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
        Participants and pool totals are awaiting verified data. Price reference ${publicSale.priceUsd.toFixed(2)}. Network {site.network} TRC-20.
      </span>
    </div>
  );
}
