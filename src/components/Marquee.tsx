const ITEMS = [
  "$1WIN",
  "TRON NETWORK",
  "TRC-20",
  "PRESALE LIVE",
  "STAKING REWARDS",
  "CASHBACK",
  "EXCLUSIVE DROPS",
  "FAST · LOW-FEE",
];

export default function Marquee() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span
          key={`${key}-${i}`}
          className="flex items-center text-sm font-bold tracking-[0.18em] text-slate-500"
        >
          <span className="px-6">{item}</span>
          <span className="text-flame-500">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee relative overflow-hidden border-y border-line bg-ink-900/50 py-3.5">
      <div className="animate-marquee flex w-max">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
