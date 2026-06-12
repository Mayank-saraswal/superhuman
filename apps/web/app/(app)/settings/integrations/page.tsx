"use client";

import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";
import { trpc } from "~/trpc/client";

type Provider = {
  id: string;
  name: string;
  description: string;
  icon: string;
  connected: boolean;
  oauth: boolean;
};

export default function IntegrationsSettingsPage() {
  const { data, isLoading } = trpc.settings.getIntegrations.useQuery(undefined, {
    refetchInterval: 5000,
  });

  const providers: Provider[] = [
    {
      id: "gmail",
      name: "Gmail",
      description: "Read, send, and organize your emails",
      icon: "📧",
      connected: !!data?.hasGmail,
      oauth: true,
    },
    {
      id: "googlecalendar",
      name: "Google Calendar",
      description: "Manage your schedule and meetings",
      icon: "📅",
      connected: !!data?.hasGoogleCalendar,
      oauth: true,
    },
    {
      id: "notion",
      name: "Notion",
      description: "Sync docs and databases",
      icon: "📝",
      connected: !!data?.hasNotion,
      oauth: true,
    },
  ];

  const connect = (provider: string) => {
    window.location.href = `/api/connect?plugin=${encodeURIComponent(provider)}`;
  };

  return (
    <div>
      <h1 className="font-serif text-[24px] font-bold text-text-primary mb-6">Integrations</h1>

      <div className="space-y-4">
        {providers.map((p) => (
          <div
            key={p.id}
            data-connected={p.connected}
            className="flex items-center justify-between p-4 bg-surface border border-border rounded-[10px] transition-colors data-[connected=true]:border-success/40"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">{p.icon}</div>
              <div>
                <h3 className="font-sans font-medium text-text-primary text-[15px]">{p.name}</h3>
                <p className="font-sans text-[13px] text-text-secondary">{p.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <span className="text-[13px] text-text-muted font-sans">Checking…</span>
              ) : p.connected ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 border border-success/30 text-success text-[13px] font-medium font-sans">
                  <Check className="size-3.5" />
                  Connected
                </div>
              ) : (
                <Button variant="solid" className="text-[13px] h-8 px-4" onClick={() => connect(p.id)}>
                  Connect →
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
