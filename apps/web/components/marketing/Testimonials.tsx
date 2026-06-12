"use client";

import { Marquee } from "~/components/ui/marquee";

const testimonials = [
  { quote: "I cleared a 300-email backlog in one sitting. The AI drafts are scary good.", name: "Aarav Mehta", role: "Founder, Ledgerly" },
  { quote: "It's the first email app that feels as fast as I think. Cmd+K runs my whole day.", name: "Sara Khan", role: "VP Sales, Nimbus" },
  { quote: "Smart Inbox alone saved my mornings. VIP threads never get buried anymore.", name: "Diego Romero", role: "CEO, Patio" },
  { quote: "The follow-up reminders closed two deals I would've forgotten. Wild ROI.", name: "Priya Nair", role: "AE, Boltwave" },
  { quote: "Reads like a premium product and runs like a race car. Couldn't go back.", name: "Tom Becker", role: "CTO, Hexa" },
  { quote: "My inbox finally feels calm. That's worth the price by itself.", name: "Mei Lin", role: "Founder, Cascade" },
];

function Card({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <figure className="mx-3 w-[340px] shrink-0 rounded-2xl border border-border bg-surface p-6">
      <blockquote className="text-[15px] leading-relaxed text-text-primary">“{quote}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-accent-subtle font-serif text-[14px] text-text-primary">
          {name.charAt(0)}
        </span>
        <div>
          <div className="text-[13px] font-semibold text-text-primary">{name}</div>
          <div className="text-[12px] text-text-muted">{role}</div>
        </div>
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  const half = Math.ceil(testimonials.length / 2);
  return (
    <section className="overflow-hidden py-24">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="font-serif text-[36px] font-bold text-text-primary">Loved by people who live in their inbox</h2>
        <p className="mt-4 text-[16px] text-text-secondary">Founders, operators, and sales leaders moving at full speed.</p>
      </div>

      <div className="relative mt-14">
        <Marquee pauseOnHover className="[--duration:45s]">
          {testimonials.slice(0, half).map((t) => (
            <Card key={t.name} {...t} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="mt-3 [--duration:45s]">
          {testimonials.slice(half).map((t) => (
            <Card key={t.name} {...t} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  );
}
