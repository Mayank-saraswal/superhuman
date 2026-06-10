"use client";

import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";

export default function IntegrationsSettingsPage() {
  // In a real app we'd fetch integrations via tRPC
  return (
    <div>
      <h1 className="font-serif text-[24px] font-bold text-text-primary mb-6">Integrations</h1>
      
      <div className="space-y-4">
        {/* Gmail */}
        <div className="flex items-center justify-between p-4 bg-surface border border-success/40 rounded-[10px]">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">📧</div>
            <div>
              <h3 className="font-sans font-medium text-text-primary text-[15px]">Gmail</h3>
              <p className="font-sans text-[13px] text-text-secondary">Read, send, and organize your emails</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 border border-success/30 text-success text-[13px] font-medium font-sans">
              <Check className="size-3.5" />
              Connected
            </div>
            <Button variant="ghost" className="text-danger hover:text-danger hover:bg-danger/10 text-[13px]">Disconnect</Button>
          </div>
        </div>

        {/* Google Calendar */}
        <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-[10px]">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">📅</div>
            <div>
              <h3 className="font-sans font-medium text-text-primary text-[15px]">Google Calendar</h3>
              <p className="font-sans text-[13px] text-text-secondary">Manage your schedule and meetings</p>
            </div>
          </div>
          <Button variant="default" className="text-[13px] h-8 px-4">Connect →</Button>
        </div>
      </div>
    </div>
  );
}
