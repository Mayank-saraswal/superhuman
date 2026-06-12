"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

export interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  reverse?: boolean;
  /** Visual mock rendered on the media side. */
  visual?: React.ReactNode;
}

export function FeatureSection({
  eyebrow,
  title,
  description,
  bullets,
  reverse = false,
  visual,
}: FeatureSectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-brand">{eyebrow}</span>
          <h2 className="mt-3 font-serif text-[32px] font-bold leading-tight text-text-primary">{title}</h2>
          <p className="mt-4 text-[16px] leading-relaxed text-text-secondary">{description}</p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[15px] text-text-primary">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" />
                </span>
                {b}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: reverse ? -40 : 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-xl"
        >
          {visual ?? <div className="aspect-[4/3] w-full rounded-xl bg-surface-elevated" />}
        </motion.div>
      </div>
    </section>
  );
}
