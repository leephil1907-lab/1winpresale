"use client";

import { useState } from "react";
import { auditors, links, site } from "@/config";
import { Wordmark } from "./Header";

const COLUMNS = [
  {
    title: "Navigation",
    links: [
      { label: "Token Sale", href: "#buy" },
      { label: "About", href: "#about" },
      { label: "Why us", href: "#why-token" },
      { label: "Pricing", href: "#pricing" },
      { label: "Tokenomics", href: "#tokenomics" },
      { label: "Roadmap", href: "#roadmap" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Useful links",
    links: [
      { label: "Whitepaper", href: links.whitepaper },
      { label: "Audit report", href: links.audit },
      { label: "Contract", href: "#" },
      { label: "Terms and Conditions", href: links.terms },
      { label: "Privacy Policy", href: links.privacy },
    ],
  },
  {
    title: "Auditors",
    links:
      auditors.length > 0
        ? auditors.map((a) => ({ label: a, href: links.audit }))
        : [{ label: "To be announced", href: "#" }],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: links.instagram,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: links.twitter,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.2l7.3-8.3L1.6 2H8l4.4 5.8L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z" />
      </svg>
    ),
  },
  {
    label: "Telegram",
    href: links.telegram,
    icon: (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.9 3.3 18.8 20c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.3-.1-.5-.6-.2L6.3 13.2 1.6 11.7c-1-.3-1-1 .2-1.6l18.5-7.1c.9-.3 1.7.2 1.6 1.3z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    href: links.discord,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.3 5.5A16.6 16.6 0 0 0 15.2 4l-.2.4c1.5.4 2.6 1 3.8 1.9a12.5 12.5 0 0 0-13.6 0c1.2-.9 2.4-1.5 3.8-1.9L8.8 4a16.6 16.6 0 0 0-4.1 1.5C2.2 9.2 1.6 12.7 1.9 16.2a16.8 16.8 0 0 0 5.1 2.6l.7-1.2c-.9-.3-1.7-.8-2.5-1.4l.4-.3a11.8 11.8 0 0 0 10.8 0l.4.3c-.8.6-1.6 1.1-2.5 1.4l.7 1.2a16.8 16.8 0 0 0 5.1-2.6c.4-4-.6-7.5-2.8-10.7zM9 13.9c-.9 0-1.7-.8-1.7-1.8s.7-1.8 1.7-1.8 1.7.8 1.7 1.8-.8 1.8-1.7 1.8zm6 0c-.9 0-1.7-.8-1.7-1.8s.8-1.8 1.7-1.8 1.7.8 1.7 1.8-.7 1.8-1.7 1.8z" />
      </svg>
    ),
  },
];

function Column({ title, items }: { title: string; items: typeof COLUMNS[number]["links"] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-line lg:border-none">
      <button
        className="flex w-full items-center justify-between py-4 text-left text-lg font-bold text-white lg:cursor-default lg:py-0 lg:text-sm lg:uppercase lg:tracking-wider lg:text-slate-400"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={`text-slate-500 transition-transform duration-300 lg:hidden ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 lg:grid-rows-[1fr] lg:opacity-100 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 lg:opacity-100"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="space-y-2.5 pb-5 pt-1 lg:pb-0 lg:pt-4">
            {items.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="text-sm text-slate-500 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-line pb-28 pt-10 lg:pb-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        {/* top row: wordmark + language + back to top */}
        <div className="flex items-center justify-between">
          <Wordmark />
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 rounded-xl border border-line bg-ink-800 px-3.5 py-2.5 text-sm font-semibold text-white">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-flame-500/20 text-[9px] font-extrabold text-flame-300">
                EN
              </span>
              EN
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-slate-500">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
            <a
              href="#"
              aria-label="Back to top"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-ink-800 text-slate-300 transition-all hover:-translate-y-0.5 hover:border-flame-400/40 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </a>
          </div>
        </div>

        {/* link columns — accordion on mobile, grid on desktop */}
        <div className="mt-8 lg:grid lg:grid-cols-3 lg:gap-10">
          {COLUMNS.map((c) => (
            <Column key={c.title} title={c.title} items={c.links} />
          ))}
        </div>

        {/* socials */}
        <div className="mt-8 flex gap-3 border-t border-line pt-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-700 text-slate-300 transition-all hover:-translate-y-0.5 hover:bg-ink-800 hover:text-white"
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* legal */}
        <p className="mt-8 text-xs leading-relaxed text-slate-600">
          © {new Date().getFullYear()} {site.tokenName}. By using this website
          you confirm your agreement with the{" "}
          <a href={links.terms} className="underline underline-offset-2 hover:text-slate-400">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href={links.privacy} className="underline underline-offset-2 hover:text-slate-400">
            Privacy Policy
          </a>
          . All rights reserved. {site.ticker} is a utility token; nothing here
          is financial advice. Where the token is used in gaming products, play
          responsibly — 18+ only.
        </p>
      </div>
    </footer>
  );
}
