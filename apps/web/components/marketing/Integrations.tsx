"use client";

import { motion } from "motion/react";

const integrations = [
  { name: "Gmail", icon: "📧" },
  { name: "Google Calendar", icon: "📅" },
  { name: "Slack", icon: "💬" },
  { name: "Notion", icon: "📝" },
  { name: "Linear", icon: "📐" },
  { name: "GitHub", icon: "🐙" },
];

export function Integrations() {
  return (
    <section id="integrations" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-brand">Connected</span>
        <h2 className="mt-3 font-serif text-[36px] font-bold text-text-primary">
          Plugs into the tools you already live in
        </h2>
        <p className="mt-4 text-[16px] text-text-secondary">
          Powered by Corsair, Chai Combinator securely connects your accounts with OAuth — tokens
          encrypted, refreshed automatically, scoped per user.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {integrations.map((it, i) => (
          <motion.div
            key={it.name}
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-elevated"
          >
            <span className="text-3xl">{it.icon}</span>
            <span className="text-center text-[13px] font-medium text-text-secondary">{it.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
