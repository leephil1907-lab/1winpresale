import Reveal from "./Reveal";
import { links, site } from "@/config";

const STEPS = [
  {
    title: "Get a TRON wallet",
    text: "Install TronLink or any TRC-20 compatible wallet, and back up your recovery phrase offline. Never share it with anyone.",
  },
  {
    title: "Fund it",
    text: "Buy TRX or USDT (TRC-20) on any major exchange and withdraw it to your wallet address.",
  },
  {
    title: "Connect & swap",
    text: "When the sale opens, connect your wallet in the presale widget above and swap TRX or USDT for $1WIN.",
  },
  {
    title: "Claim at TGE",
    text: "Your $1WIN is distributed to the same wallet after the presale ends. Claim instructions will be published here.",
  },
];

export default function HowToBuy() {
  return (
    <section id="how-to-buy" className="relative py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">
              How to buy
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Four steps to <span className="gradient-text">{site.ticker}</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 100}>
              <div className="card card-hover group relative h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-flame-400 to-flame-500 text-base font-extrabold text-white shadow-[0_8px_24px_-8px_rgba(229,9,20,0.7)] transition-transform duration-300 group-hover:scale-110">
                  {i + 1}
                </div>
                <h3 className="mt-5 font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-flame-500/30 bg-flame-500/[0.07] p-5 transition-transform duration-300 hover:-translate-y-1 sm:p-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-flame-500/15 text-flame-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white">Stay safe</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                The official {site.tokenStandard} contract address —{" "}
                <span className="font-mono text-gold-300">
                  {links.contractAddress}
                </span>{" "}
                — will only ever be published on this website. We will never DM
                you first, ask for your seed phrase, or request &quot;wallet
                verification&quot;.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
