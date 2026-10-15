import { links, site } from "@/config";

const EXPLORE = [
  { label: "About", href: "#about" },
  { label: "How to buy", href: "#how-to-buy" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const RESOURCES = [
  { label: "Whitepaper", href: links.whitepaper },
  { label: "Audit", href: links.audit },
  { label: "Contract", href: "#" },
];

const SOCIALS = [
  { label: "X (Twitter)", href: links.twitter },
  { label: "Telegram", href: links.telegram },
  { label: "Discord", href: links.discord },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, #ff2433 0%, #8f0018 100%)",
                }}
              >
                1W
              </span>
              <span className="text-sm font-bold text-white">
                {site.tokenName}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              {site.tagline}. Built on {site.network} as a {site.tokenStandard}{" "}
              token.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-500 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {RESOURCES.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-500 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Community
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {SOCIALS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-slate-500 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-[11px] leading-relaxed text-slate-600">
            Disclaimer: {site.ticker} is a utility token. Nothing on this
            website constitutes financial, investment, legal or tax advice, or
            an offer to sell securities. Crypto assets are volatile and involve
            substantial risk of loss — always do your own research and never
            spend more than you can afford to lose. Participation may be
            restricted in certain jurisdictions. Where the token is used in
            gaming products, play responsibly — 18+ only.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <span>
              © {new Date().getFullYear()} {site.tokenName}. All rights
              reserved.
            </span>
            <span className="font-semibold tracking-wider text-slate-500">
              BUILT ON {site.network.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
