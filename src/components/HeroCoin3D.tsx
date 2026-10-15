"use client";

import { useCallback, useRef } from "react";

const SEGMENTS = 52;

/* emerald-chrome facet gradients for the coin's milled edge */
const FACET_A =
  "linear-gradient(180deg,#052e1c 0%,#019e5c 22%,#7bf1b1 40%,#00dc6e 55%,#00a55c 72%,#06371f 100%)";
const FACET_B =
  "linear-gradient(180deg,#042a1a 0%,#00b562 22%,#5feaa0 40%,#00c968 55%,#019050 72%,#052e1b 100%)";

/**
 * Live 3D hero element: a real CSS-3D coin (front/back faces + 52 faceted
 * edge segments) spinning continuously inside gyro rings, bobbing above a
 * glowing pedestal, with pointer parallax tilt and drifting particles.
 * Pure CSS/DOM — no canvas/WebGL dependency. Respects prefers-reduced-motion
 * via the global media query.
 */
export default function HeroCoin3D() {
  const tiltRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--ry", `${(px * 22).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${(-py * 18).toFixed(2)}deg`);
    });
  }, []);

  const onLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  }, []);

  return (
    <div
      className="coin-stage select-none"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="img"
      aria-label="1win Token gold coin with emerald rim spinning above its pedestal"
    >
      {/* halo glow */}
      <div className="coin-halo" aria-hidden />

      {/* bobbing + tilting + spinning 3D coin */}
      <div className="coin-float" aria-hidden>
        <div ref={tiltRef} className="coin-tilt">
          <div className="coin-spin">
            {Array.from({ length: SEGMENTS }, (_, i) => {
              const a = (360 / SEGMENTS) * i;
              const light = 0.8 + 0.32 * Math.abs(Math.cos((a * Math.PI) / 180));
              return (
                <i
                  key={i}
                  className="coin-seg"
                  style={{
                    transform: `rotateY(${a}deg) translateZ(calc(var(--coin) / 2 - 1px))`,
                    background: i % 2 ? FACET_A : FACET_B,
                    filter: `brightness(${light.toFixed(3)})`,
                  }}
                />
              );
            })}
            <div className="coin-face coin-face-front" />
            <div className="coin-face coin-face-back" />
          </div>

          {/* gyro rings with an orbiting ember */}
          <div className="gyro gyro-1">
            <span className="gyro-dot" />
          </div>
          <div className="gyro gyro-2" />
        </div>
      </div>

      {/* glowing pedestal */}
      <div className="coin-pedestal" aria-hidden />

      {/* drifting spark particles */}
      {[
        { left: "10%", top: "30%", d: "0s", gold: false, s: 6 },
        { left: "18%", top: "66%", d: "-1.4s", gold: true, s: 5 },
        { left: "84%", top: "28%", d: "-0.8s", gold: false, s: 5 },
        { left: "78%", top: "62%", d: "-2.1s", gold: true, s: 6 },
        { left: "30%", top: "10%", d: "-3s", gold: false, s: 4 },
        { left: "66%", top: "8%", d: "-1s", gold: false, s: 4 },
        { left: "7%", top: "50%", d: "-2.6s", gold: true, s: 4 },
        { left: "92%", top: "46%", d: "-1.8s", gold: false, s: 5 },
      ].map((p, i) => (
        <span
          key={i}
          aria-hidden
          className={`p-dot ${p.gold ? "p-dot-gold" : ""}`}
          style={
            {
              left: p.left,
              top: p.top,
              width: p.s,
              height: p.s,
              "--d": p.d,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
