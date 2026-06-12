"use client";

import { motion } from "motion/react";
import { Sparkles, Inbox, Clock, Keyboard, Search, Users } from "lucide-react";

const features = [
  { icon: Sparkles, title: "AI Composer", desc: "Drafts replies in your voice. Just glance, tweak, and send." },
  { icon: Inbox, title: "Smart Inbox", desc: "Auto-sorts mail into Important, Team, and VIP so nothing slips." },
  { icon: Clock, title: "Follow-up reminders", desc: "Never drop a thread. We bump it back when you need it." },
  { icon: Keyboard, title: "Keyboard-first", desc: "Cmd+K everything. Your hands never leave the keys." },
  { icon: Search, title: "Instant search", desc: "Find any email, attachment, or doc the moment you think of it." },
  { icon: Users, title: "Built for teams", desc: "Shared snippets and read receipts keep everyone in sync." },
];

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-[36px] font-bold text-text-primary">Everything you need to fly through email</h2>
        <p className="mt-4 text-[16px] text-text-secondary">
          A focused set of tools that turn your inbox from a chore into a competitive advantage.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: (i % 3) * 0.08, duration: 0.4 }}
            className="rounded-xl border border-border bg-surface p-6 transition-colors hover:bg-surface-elevated"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-accent-subtle">
              <f.icon className="size-5 text-text-primary" />
            </div>
            <h3 className="font-serif text-[18px] font-semibold text-text-primary">{f.title}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
