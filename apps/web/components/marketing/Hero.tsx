"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { InboxMockup } from "./InboxMockup";

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
});

export function Hero() {
  return (
    <section className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pt-40 pb-20 text-center">
      <motion.span
        {...fade(0)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-[12px] text-text-secondary"
      >
        <span className="size-1.5 rounded-full bg-brand" />
        Now in private beta
      </motion.span>

      <motion.h1
        {...fade(0.1)}
        className="font-serif text-[44px] font-bold leading-[1.05] tracking-tight text-text-primary sm:text-[64px]"
      >
        Email at the speed
        <br />
        of thought.
      </motion.h1>

      <motion.p
        {...fade(0.2)}
        className="mt-6 max-w-xl text-[17px] leading-relaxed text-text-secondary"
      >
        Chai Combinator is the AI-native email client for founders and high-velocity teams.
        Triage, write, and organize in a fraction of the time — saving you 4 hours every week.
      </motion.p>

      <motion.div {...fade(0.3)} className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/signup"
          className="rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-[#1C1C1C] transition-colors hover:bg-brand/90"
        >
          Get early access
        </Link>
        <Link
          href="#features"
          className="rounded-full border border-border bg-surface px-6 py-3 text-[15px] font-medium text-text-primary transition-colors hover:bg-surface-elevated"
        >
          See how it works
        </Link>
      </motion.div>

      <motion.div {...fade(0.35)} className="mt-16 w-full max-w-4xl">
        <InboxMockup />
      </motion.div>
    </section>
  );
}
