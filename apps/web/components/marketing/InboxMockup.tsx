"use client";

import { motion } from "motion/react";

const rows = [
  { from: "Stripe", subject: "Your payout is on the way", tag: "Important", unread: true },
  { from: "Linear", subject: "12 issues assigned to you", tag: "Team", unread: true },
  { from: "Naval", subject: "Re: Seed round terms", tag: "VIP", unread: false },
  { from: "Vercel", subject: "Deployment succeeded", tag: "Team", unread: false },
];

const tagColor: Record<string, string> = {
  Important: "text-brand border-brand/40",
  Team: "text-text-secondary border-border",
  VIP: "text-success border-success/40",
};

export function InboxMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-elevated px-4 py-3">
        <span className="size-3 rounded-full bg-danger/70" />
        <span className="size-3 rounded-full bg-warning/70" />
        <span className="size-3 rounded-full bg-success/70" />
        <span className="ml-3 font-mono text-[11px] text-text-muted">Important · 4 unread</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.4fr]">
        {/* List */}
        <div className="divide-y divide-border/60 border-b border-border md:border-b-0 md:border-r">
          {rows.map((r, i) => (
            <div
              key={i}
              className={`relative px-4 py-3 ${i === 0 ? "bg-surface-elevated" : ""}`}
            >
              {r.unread && <span className="absolute left-0 top-0 h-full w-[2px] bg-white" />}
              <div className="mb-1 flex items-center justify-between">
                <span className={`text-[13px] ${r.unread ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                  {r.from}
                </span>
                <span className={`rounded-full border px-1.5 py-0.5 text-[10px] ${tagColor[r.tag] ?? "text-text-muted border-border"}`}>
                  {r.tag}
                </span>
              </div>
              <div className="truncate text-[13px] text-text-primary">{r.subject}</div>
            </div>
          ))}
        </div>

        {/* Reading pane */}
        <div className="p-5">
          <h3 className="font-serif text-[18px] font-bold text-text-primary">Your payout is on the way</h3>
          <p className="mt-1 font-mono text-[11px] text-text-muted">Stripe · now</p>

          <div className="mt-4 rounded-md border-l-2 border-white/30 bg-surface-elevated p-3">
            <span className="block font-serif text-[12px] font-semibold text-text-primary">✨ AI Summary</span>
            <p className="mt-1 text-[12px] leading-relaxed text-text-secondary">
              $24,500 payout initiated, arriving in 2 business days. No action needed.
            </p>
          </div>

          <div className="mt-4 rounded-md border border-border bg-background p-3">
            <span className="text-[12px] font-semibold text-text-primary">✨ AI suggests:</span>
            <p className="mt-1 text-[13px] text-text-secondary">
              Thanks for the heads up — I&apos;ll confirm once it lands. Appreciate the quick turnaround!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
