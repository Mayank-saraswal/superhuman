"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    cadence: "forever",
    desc: "For individuals testing the waters.",
    features: ["1 connected inbox", "AI summaries", "Smart inbox tabs", "Keyboard shortcuts"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$30",
    cadence: "per month",
    desc: "For founders and power users.",
    features: [
      "Unlimited inboxes",
      "AI compose in your voice",
      "Follow-up reminders",
      "Read receipts & snippets",
      "Calendar + Slack integration",
    ],
    cta: "Start free trial",
    highlight: true,
  },
  {
    name: "Team",
    price: "$24",
    cadence: "per seat / month",
    desc: "For high-velocity teams.",
    features: ["Everything in Pro", "Shared snippets", "Team analytics", "Priority support"],
    cta: "Contact sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-[36px] font-bold text-text-primary">Simple, honest pricing</h2>
        <p className="mt-4 text-[16px] text-text-secondary">Start free. Upgrade when email becomes your superpower.</p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className={`relative flex flex-col rounded-2xl border p-7 ${
              plan.highlight
                ? "border-brand/50 bg-surface-elevated"
                : "border-border bg-surface"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[11px] font-semibold text-[#1C1C1C]">
                Most popular
              </span>
            )}
            <h3 className="font-serif text-[20px] font-semibold text-text-primary">{plan.name}</h3>
            <p className="mt-1 text-[13px] text-text-secondary">{plan.desc}</p>
            <div className="mt-5 flex items-baseline gap-1.5">
              <span className="font-serif text-[40px] font-bold text-text-primary">{plan.price}</span>
              <span className="text-[13px] text-text-muted">{plan.cadence}</span>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] text-text-secondary">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className={`mt-7 rounded-full px-5 py-2.5 text-center text-[14px] font-semibold transition-colors ${
                plan.highlight
                  ? "bg-brand text-[#1C1C1C] hover:bg-brand/90"
                  : "border border-border bg-background text-text-primary hover:bg-surface-elevated"
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
