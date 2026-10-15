"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** display string, e.g. "+520%", "8k+", "100M+", "96", "x6" */
  value: string;
  className?: string;
  durationMs?: number;
}

function parse(v: string) {
  const m = v.match(/^([^0-9]*)([0-9]+(?:\.[0-9]+)?)(.*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  return {
    prefix,
    n: parseFloat(num),
    decimals: num.includes(".") ? num.split(".")[1].length : 0,
    suffix,
  };
}

/**
 * Animates a stat number from 0 → target once scrolled into view.
 * SSR-safe: the server renders the final value; the count-up replays on the
 * client when observed. Falls back to static text for unparseable values or
 * when prefers-reduced-motion is set.
 */
export default function CountUp({
  value,
  className = "",
  durationMs = 1600,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(() => parse(value)?.n ?? 0);
  const played = useRef(false);

  useEffect(() => {
    const parts = parse(value);
    const el = ref.current;
    if (!parts || !el || played.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played.current) return;
        played.current = true;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / durationMs);
          const eased = 1 - Math.pow(1 - k, 3); // easeOutCubic
          setN(parts.n * eased);
          if (k < 1) requestAnimationFrame(tick);
          else setN(parts.n);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, durationMs]);

  const parts = parse(value);
  if (!parts) return <span className={className}>{value}</span>;

  return (
    <span ref={ref} className={className}>
      {parts.prefix}
      {n.toFixed(parts.decimals)}
      {parts.suffix}
    </span>
  );
}
