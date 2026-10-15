import { publicSale } from "@/config";

const usd = (n: number) =>
  `$${new Intl.NumberFormat("en-US").format(n)}`;

export default function Marquee() {
  const items = [
    ["Participants", publicSale.participants.toLocaleString("en-US")],
    ["Pool", usd(publicSale.raisedUsd)],
    ["Supply", publicSale.supplyOnSale],
    ["Price", `${publicSale.priceUsd} USDC`],
    ["Network", "TRON · TRC-20"],
  ] as const;

  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {items.map(([label, value], i) => (
        <span key={`${key}-${i}`} className="flex items-center text-sm text-slate-500">
          <span className="mx-5 flex items-center gap-2">
            <span>{label}</span>
            <b className="font-semibold text-white">{value}</b>
            <span className="inline-block h-3.5 w-3.5 rounded-full bg-flame-500/20 text-center text-[9px] font-bold leading-[14px] text-flame-400">
              $
            </span>
          </span>
          <span className="text-slate-700">•</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee relative overflow-hidden py-4">
      <div className="animate-marquee flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
