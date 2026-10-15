"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** stagger delay in ms */
  delay?: number;
  /** slide direction: up (default), left, or right */
  from?: "up" | "left" | "right";
  className?: string;
}

/**
 * Scroll-reveal wrapper. Fades/slides children in once when they enter the
 * viewport (IntersectionObserver). Purely cosmetic — content is present in
 * SSR HTML, and users with prefers-reduced-motion see it immediately.
 */
export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const dirClass =
    from === "left" ? "reveal-x-left" : from === "right" ? "reveal-x-right" : "";

  return (
    <div
      ref={ref}
      className={`reveal ${dirClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
