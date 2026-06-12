import type { Metadata } from "next";
import { Navbar } from "~/components/marketing/Navbar";
import { Footer } from "~/components/marketing/Footer";

export const metadata: Metadata = {
  title: "Chai Combinator — Email at the speed of thought",
  description:
    "Chai Combinator is the AI-native email client for founders and high-velocity teams. Triage, write, and organize email in a fraction of the time.",
  openGraph: {
    title: "Chai Combinator — Email at the speed of thought",
    description:
      "The AI-native email client for founders and high-velocity teams. Save 4 hours every week.",
    type: "website",
  },
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-text-primary">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
