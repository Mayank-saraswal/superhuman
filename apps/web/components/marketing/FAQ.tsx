"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    q: "How does the AI write in my voice?",
    a: "Chai Combinator analyzes your recently sent emails to learn your tone, then drafts replies that sound like you. You stay in control — review and edit before anything sends.",
  },
  {
    q: "Is my email data secure?",
    a: "Yes. We connect via OAuth through Corsair, so your credentials are never stored in plain text. Tokens are encrypted, scoped per user, and refreshed automatically.",
  },
  {
    q: "Which email providers are supported?",
    a: "Gmail and Google Workspace are supported today, with Outlook on the roadmap. You can also connect Google Calendar, Slack, Notion, and Linear.",
  },
  {
    q: "Do I have to learn new keyboard shortcuts?",
    a: "Only if you want to. Everything works with a mouse, but power users can run their entire workflow from Cmd+K and a handful of single-key shortcuts.",
  },
  {
    q: "Can I use it with my team?",
    a: "Absolutely. The Team plan adds shared snippets, analytics, and priority support so everyone moves at the same speed.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24">
      <div className="text-center">
        <h2 className="font-serif text-[36px] font-bold text-text-primary">Questions, answered</h2>
        <p className="mt-4 text-[16px] text-text-secondary">Everything you need to know before you dive in.</p>
      </div>

      <Accordion type="single" collapsible className="mt-12 w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border">
            <AccordionTrigger className="text-left font-sans text-[16px] font-medium text-text-primary hover:no-underline">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-[15px] leading-relaxed text-text-secondary">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
