import Reveal from "./Reveal";

const CARDS = [
  {
    n: "01",
    title: "Gaming activity",
    text: "Intended for use across casino-style games and sports wagering inside the ecosystem.",
    bg: "bg-[#8d949d]",
    fg: "text-[#15171b]",
    chip: "bg-white/25 text-white",
  },
  {
    n: "02",
    title: "Token buyback",
    text: "A recurring repurchase program buys tokens back from the open market on a schedule.",
    bg: "bg-[#4a7fd8]",
    fg: "text-white",
    chip: "bg-white/20 text-white",
  },
  {
    n: "03",
    title: "Token burning",
    text: "A portion of tokens is permanently removed from circulation, tightening available supply over time.",
    bg: "bg-[#c9a26b]",
    fg: "text-[#241708]",
    chip: "bg-black/15 text-[#241708]",
  },
  {
    n: "04",
    title: "Value growth",
    text: "Ongoing buyback-and-burn plus real platform demand are designed to support long-term token economics.",
    bg: "bg-[#1e9e76]",
    fg: "text-white",
    chip: "bg-white/20 text-white",
  },
];

export default function PricingDeck() {
  return (
    <section id="pricing" className="relative py-16 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Pricing
          </h2>
        </Reveal>

        {/* mobile deck (overlapping) / desktop grid */}
        <div className="mt-10 space-y-[-1.2rem] sm:space-y-[-1.4rem] lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0 xl:grid-cols-4">
          {CARDS.map((c, i) => (
            <Reveal key={c.n} delay={i * 90}>
              <div
                className={`relative overflow-hidden rounded-3xl p-7 pb-16 shadow-xl transition-transform duration-300 hover:-translate-y-1.5 sm:p-8 sm:pb-20 ${c.bg} ${c.fg}`}
              >
                <span
                  className={`absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full text-xs font-extrabold ${c.chip}`}
                >
                  {c.n}
                </span>
                <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {c.title}
                </h3>
                <p className="mt-3 max-w-[85%] text-sm font-medium leading-relaxed opacity-85">
                  {c.text}
                </p>
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
