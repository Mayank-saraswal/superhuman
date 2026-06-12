"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function FinalCTA() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-surface px-6 py-16 text-center"
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
        <h2 className="relative font-serif text-[40px] font-bold leading-tight text-text-primary">
          Reclaim 4 hours every week
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[17px] text-text-secondary">
          Join the founders and teams who&apos;ve made email feel effortless. Early access is open.
        </p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-full bg-brand px-7 py-3 text-[15px] font-semibold text-[#1C1C1C] transition-colors hover:bg-brand/90"
          >
            Get early access
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border bg-background px-7 py-3 text-[15px] font-medium text-text-primary transition-colors hover:bg-surface-elevated"
          >
            Log in
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
