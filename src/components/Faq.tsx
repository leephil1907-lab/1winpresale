"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { site } from "@/config";

const QA = [
  {
    q: `What is ${site.ticker}?`,
    a: `${site.tokenName} (${site.ticker}) is a ${site.tokenStandard} utility token on the ${site.network} network. It is designed to power rewards, cashback, staking and exclusive access across the ecosystem.`,
  },
  {
    q: "Why build on TRON?",
    a: "TRON offers fast confirmations and very low transaction fees, which makes it well suited for high-frequency reward and cashback mechanics. TRC-20 is also supported by most major wallets and exchanges.",
  },
  {
    q: "How do I buy in the presale?",
    a: "Once the sale opens, connect a TRON-compatible wallet (e.g. TronLink) in the widget above and swap TRX or USDT for $1WIN. Only use the contract address published on this site.",
  },
  {
    q: "When do I receive my tokens?",
    a: "Tokens are distributed at the Token Generation Event (TGE), shortly after the presale ends. Exact claim instructions will be published on this page before TGE.",
  },
  {
    q: "Is there a vesting schedule?",
    a: "Yes — team and advisor allocations are locked and released on a published vesting schedule. Final vesting terms will be detailed in the whitepaper.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Nothing on this website is financial, legal or investment advice. Crypto assets are volatile and high risk — only spend what you can afford to lose and always do your own research.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative border-t border-line bg-ink-900/40 py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Questions, <span className="gradient-text">answered</span>
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 space-y-3">
          {QA.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 70}>
                <div
                  className={`card overflow-hidden transition-colors duration-300 ${
                    open ? "border-flame-400/30" : ""
                  }`}
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span className="font-semibold text-white">{item.q}</span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-flame-400 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${
                      open
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
