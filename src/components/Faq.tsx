"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { site } from "@/config";

const QA = [
  {
    q: `What is ${site.tokenName}?`,
    a: `${site.tokenName} (${site.ticker}) is a ${site.tokenStandard} utility token on the ${site.network} network, designed for use across the 1win ecosystem — from in-game utility to rewards and perks.`,
  },
  {
    q: `How can I claim ${site.tokenName}?`,
    a: "Deposit during the token sale using TRX, USDT or USDC. Your allocation is recorded on the sale contract, and after the sale ends you claim your tokens on this site once claims open (TGE).",
  },
  {
    q: "Where can I use tokens?",
    a: "The token is intended for in-game utility within the ecosystem — games, sports wagering benefits, rewards tiers and future features on the roadmap.",
  },
  {
    q: "Do the tokens have a vesting period?",
    a: "Sale allocations are unlocked at TGE. Team and partner allocations follow a separate long-term vesting schedule, which will be detailed in the token documentation.",
  },
  {
    q: "What is token burning, and how does it affect value?",
    a: "Burning permanently removes tokens from circulation, reducing available supply. Combined with steady demand, burning is designed to support healthier token economics over time — it is not a price guarantee.",
  },
  {
    q: "What is token BuyBack?",
    a: "BuyBack is a recurring treasury program that repurchases tokens from the open market on a schedule. A share of repurchased tokens can then be burned, further managing circulating supply.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-16 sm:py-24">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-flame-400">Support</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Frequently asked questions</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400">Answers about token utility, participation, distribution and network details.</p>
          </div>
        </Reveal>
        <div className="space-y-3">
          {QA.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    open
                      ? "border-flame-400/30 bg-ink-700"
                      : "border-line bg-ink-800 hover:border-white/15"
                  }`}
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                  >
                    <span className="text-base font-bold text-white sm:text-lg">
                      {item.q}
                    </span>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-slate-500 transition-transform duration-300 ${
                        open ? "rotate-180 text-flame-400" : ""
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
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400 sm:px-6">
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
