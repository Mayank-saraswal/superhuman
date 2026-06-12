"use client";

import { Marquee } from "~/components/ui/marquee";

const companies = [
  "Stripe",
  "Linear",
  "Vercel",
  "Notion",
  "Ramp",
  "Retool",
  "Loom",
  "Cron",
  "Superhuman",
  "Arc",
];

export function LogoBar() {
  return (
    <section className="border-y border-border bg-background py-10">
      <p className="mb-6 text-center font-mono text-[12px] uppercase tracking-[0.2em] text-text-muted">
        Trusted by fast-moving teams
      </p>
      <div className="relative">
        <Marquee pauseOnHover className="[--duration:30s]">
          {companies.map((name) => (
            <span
              key={name}
              className="mx-6 font-serif text-[22px] font-semibold text-text-muted transition-colors hover:text-text-secondary"
            >
              {name}
            </span>
          ))}
        </Marquee>
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
