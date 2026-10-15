"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface RevealProps {
  children: ReactNode;
  /** stagger delay in ms */
  delay?: number;
  /** slide direction: up (default), left, or right */
  from?: "up" | "left" | "right";
  className?: string;
}

/**
 * Framer Motion scroll reveal. Runs once when entering the viewport, supports
 * stagger delays and respects the user's reduced-motion accessibility setting.
 */
export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const offset =
    from === "left"
      ? { x: -38, y: 0 }
      : from === "right"
        ? { x: 38, y: 0 }
        : { x: 0, y: 30 };

  const variants = {
    hidden: {
      opacity: 0,
      ...offset,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.72,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion ? "visible" : undefined}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -40px 0px" }}
    >
      {children}
    </motion.div>
  );
}
