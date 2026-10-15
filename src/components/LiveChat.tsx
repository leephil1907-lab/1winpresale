"use client";

import { useState } from "react";
import { links } from "@/config";

const CHANNELS = [
  {
    label: "Telegram",
    sub: "Fastest response",
    href: links.telegram,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.9 3.3 18.8 20c-.2 1.1-.9 1.4-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-5 9.2-8.3c.4-.3-.1-.5-.6-.2L6.3 13.2 1.6 11.7c-1-.3-1-1 .2-1.6l18.5-7.1c.9-.3 1.7.2 1.6 1.3z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    sub: "Community chat",
    href: links.discord,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.3 5.5A16.6 16.6 0 0 0 15.2 4l-.2.4c1.5.4 2.6 1 3.8 1.9a12.5 12.5 0 0 0-13.6 0c1.2-.9 2.4-1.5 3.8-1.9L8.8 4a16.6 16.6 0 0 0-4.1 1.5C2.2 9.2 1.6 12.7 1.9 16.2a16.8 16.8 0 0 0 5.1 2.6l.7-1.2c-.9-.3-1.7-.8-2.5-1.4l.4-.3a11.8 11.8 0 0 0 10.8 0l.4.3c-.8.6-1.6 1.1-2.5 1.4l.7 1.2a16.8 16.8 0 0 0 5.1-2.6c.4-4-.6-7.5-2.8-10.7zM9 13.9c-.9 0-1.7-.8-1.7-1.8s.7-1.8 1.7-1.8 1.7.8 1.7 1.8-.8 1.8-1.7 1.8zm6 0c-.9 0-1.7-.8-1.7-1.8s.8-1.8 1.7-1.8 1.7.8 1.7 1.8-.7 1.8-1.7 1.8z" />
      </svg>
    ),
  },
  {
    label: "Email",
    sub: "Detailed questions",
    href: `mailto:${links.supportEmail}`,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
  },
];

/**
 * Floating live-chat launcher. Opens a lightweight support panel with direct
 * channels (Telegram / Discord / Email). To embed a full chat agent instead
 * (e.g. Tawk.to / Crisp), paste their snippet just before </body> in
 * src/app/layout.tsx and remove this component.
 */
export default function LiveChat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          className="modal-card fixed bottom-40 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-line bg-ink-800 shadow-2xl lg:bottom-24 lg:right-6"
          role="dialog"
          aria-label="Live chat"
        >
          <div className="flex items-center gap-3 border-b border-line bg-ink-700/70 px-5 py-4">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-flame-400 to-flame-500 text-sm font-black text-ink-950">
              1W
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-800 bg-emerald-400" />
            </span>
            <div className="flex-1">
              <div className="text-sm font-bold text-white">1win Support</div>
              <div className="text-[11px] font-medium text-emerald-400">Online now</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            </button>
          </div>

          <div className="space-y-3 px-5 py-5">
            <div className="max-w-[85%] rounded-2xl rounded-tl-md bg-ink-700 px-4 py-3 text-sm leading-relaxed text-slate-200">
              Hey there! Need a hand with the token sale, claiming, or anything
              else? Pick a channel — we usually reply within minutes.
            </div>

            <div className="space-y-2 pt-1">
              {CHANNELS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.03] px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-flame-400/40 hover:bg-white/[0.06]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-flame-500/15 text-flame-300">
                    {c.icon}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-white">{c.label}</span>
                    <span className="block text-[11px] text-slate-500">{c.sub}</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-slate-600">
                    <polyline points="9 6 15 12 9 18" />
                  </svg>
                </a>
              ))}
            </div>

            <p className="pt-1 text-center text-[10px] leading-relaxed text-slate-600">
              Support will never DM you first or ask for seed phrases.
              Sale questions? Check the FAQ above.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close live chat" : "Open live chat"}
        aria-expanded={open}
        className="btn-primary fixed bottom-24 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_12px_36px_-8px_rgba(0,220,110,0.7)] lg:bottom-6 lg:right-6"
      >
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-ink-950 bg-emerald-500" />
          </span>
        )}
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </>
  );
}
