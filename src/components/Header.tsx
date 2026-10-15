"use client";

import { useEffect, useState } from "react";
import { saleIntegration, site } from "@/config";
import { useTronWallet } from "@/components/WalletProvider";
import { shortenAddress } from "@/lib/tron";

const NAV = [
  { label: "Sale", href: "#buy" },
  { label: "About", href: "#about" },
  { label: "Why us", href: "#why-token" },
  { label: "Pricing", href: "#pricing" },
  { label: "Tokenomics", href: "#tokenomics" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#" className="flex items-end gap-1.5 leading-none" aria-label={site.tokenName}>
      <span
        className={`font-black italic tracking-tight text-white ${
          compact ? "text-xl" : "text-2xl"
        }`}
      >
        1win
      </span>
      <span
        className={`rounded-md bg-white px-1.5 py-0.5 font-extrabold tracking-widest text-ink-950 ${
          compact ? "text-[9px]" : "text-[10px]"
        }`}
      >
        TOKEN
      </span>
    </a>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wallet = useTronWallet();
  const live = saleIntegration.live && Boolean(saleIntegration.contractAddress);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const label =
    wallet.installed === false
      ? "Install TronLink"
      : wallet.status === "connecting"
        ? "Connecting…"
        : "Connect wallet";

  const action =
    wallet.installed === false
      ? () => window.open("https://www.tronlink.org", "_blank", "noreferrer")
      : wallet.connect;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-line bg-ink-950/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />

        <nav className="hidden items-center gap-6 xl:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-medium text-slate-400 transition-colors hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!live ? (
            <a href="#buy" className="btn-primary hidden px-5 py-2 text-sm sm:inline-block">
              Connect wallet
            </a>
          ) : wallet.status === "connected" && wallet.address ? (
            <div className="hidden items-center gap-2 sm:flex">
              <a
                href="#buy"
                className="flex items-center gap-2 rounded-xl border border-line bg-white/[0.04] px-3.5 py-2 font-mono text-xs text-slate-200 transition-colors hover:border-flame-400/40"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                {shortenAddress(wallet.address)}
              </a>
              <button
                onClick={wallet.disconnect}
                aria-label="Disconnect wallet"
                title="Disconnect"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-slate-500 transition-colors hover:border-flame-400/40 hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={action}
              disabled={wallet.status === "connecting"}
              className="btn-primary hidden px-5 py-2 text-sm sm:inline-block"
            >
              {label}
            </button>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-slate-300 xl:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="menu-in border-t border-line px-4 py-4 sm:px-6 xl:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {n.label}
              </a>
            ))}
            {!live ? (
              <a
                href="#buy"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 px-5 py-2.5 text-center text-sm"
              >
                Connect wallet
              </a>
            ) : wallet.status === "connected" && wallet.address ? (
              <div className="mt-2 flex items-center gap-2">
                <a
                  href="#buy"
                  onClick={() => setOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-white/[0.04] px-3.5 py-2.5 font-mono text-xs text-slate-200"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {shortenAddress(wallet.address)}
                </a>
                <button
                  onClick={() => {
                    wallet.disconnect();
                    setOpen(false);
                  }}
                  className="rounded-xl border border-line px-3.5 py-2.5 text-xs font-semibold text-slate-400"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  action();
                  setOpen(false);
                }}
                className="btn-primary mt-2 px-5 py-2.5 text-sm"
              >
                {label}
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
