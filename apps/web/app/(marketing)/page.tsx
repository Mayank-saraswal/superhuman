import { Hero } from "~/components/marketing/Hero";
import { LogoBar } from "~/components/marketing/LogoBar";
import { FeatureGrid } from "~/components/marketing/FeatureGrid";
import { FeatureSection } from "~/components/marketing/FeatureSection";
import { Integrations } from "~/components/marketing/Integrations";
import { Pricing } from "~/components/marketing/Pricing";
import { Testimonials } from "~/components/marketing/Testimonials";
import { FAQ } from "~/components/marketing/FAQ";
import { FinalCTA } from "~/components/marketing/FinalCTA";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <LogoBar />
      <FeatureGrid />

      <FeatureSection
        eyebrow="AI Composer"
        title="Write replies that sound like you"
        description="Chai Combinator studies your tone and drafts a ready-to-send reply for every thread. Glance, tweak a word, and you're done — no blank-page paralysis."
        bullets={[
          "Context-aware drafts from the full thread",
          "Matches your personal writing voice",
          "Type / to drop in saved snippets instantly",
        ]}
        visual={
          <div className="space-y-3 p-4">
            <div className="rounded-md border border-border bg-background p-3">
              <span className="text-[12px] font-semibold text-text-primary">✨ AI suggests:</span>
              <p className="mt-1 text-[13px] text-text-secondary">
                Thanks for sending this over. Friday works on my end — I&apos;ll send a calendar invite shortly.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="rounded-md bg-success px-3 py-1.5 text-[12px] font-semibold text-[#1C1C1C]">Send</span>
              <span className="rounded-md border border-border px-3 py-1.5 text-[12px] text-text-secondary">Edit</span>
            </div>
          </div>
        }
      />

      <FeatureSection
        reverse
        eyebrow="Smart Inbox"
        title="The important stuff, surfaced first"
        description="Every incoming email is classified the moment it arrives, so Important, Team, and VIP threads rise to the top while noise stays out of sight."
        bullets={[
          "Automatic Important / Team / VIP tabs",
          "Newsletters and social tucked away",
          "Unread threads marked at a glance",
        ]}
        visual={
          <div className="space-y-2 p-4">
            {["Important", "Team", "VIP"].map((t, i) => (
              <div key={t} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5">
                <span className="text-[13px] text-text-primary">{t}</span>
                <span className="rounded-full bg-accent-subtle px-2 py-0.5 text-[11px] text-text-secondary">{[3, 8, 1][i]}</span>
              </div>
            ))}
          </div>
        }
      />

      <Integrations />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
