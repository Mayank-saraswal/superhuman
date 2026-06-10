"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Check } from "lucide-react";
// Import trpc client here, assuming it's available as trpc
import { trpc } from "~/trpc/client";
import { useEffect, useState } from "react";

export default function ConnectPage() {
  const router = useRouter();
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  
  const { data: integrations } = trpc.settings.getIntegrations.useQuery(undefined, {
    refetchInterval: 3000,
  });

  const utils = trpc.useUtils();

  const completeOnboarding = trpc.settings.completeOnboarding.useMutation({
    onSuccess: () => {
      router.push("/onboarding/complete");
    }
  });

  useEffect(() => {
    if (integrations?.hasGmail) {
      setIsGmailConnected(true);
    }
  }, [integrations]);

  const handleConnect = async (provider: string) => {
    try {
      const data = await utils.settings.getConnectLink.fetch({ provider });
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err) {
      console.error("Failed to connect", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-background">
      <div className="flex flex-col items-center w-full max-w-xl gap-8">
        
        <div className="pointer-events-none select-none">
          <Image 
            src="/illustrations/connect.svg" 
            width={240} 
            height={180} 
            alt="" 
            className="opacity-70"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="font-serif text-[32px] font-bold text-text-primary">
            Connect your accounts
          </h1>
          <p className="font-sans text-[16px] text-text-secondary">
            Superhuman works best with your existing tools
          </p>
        </div>

        <div className="w-full space-y-4">
          {/* Integration Card: Gmail */}
          <div className="flex items-center justify-between p-4 bg-surface border rounded-[10px] transition-colors data-[connected=true]:border-success/40 border-border" data-connected={isGmailConnected}>
            <div className="flex items-center gap-4">
              <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">📧</div>
              <div>
                <h3 className="font-sans font-medium text-text-primary text-[15px]">Gmail</h3>
                <p className="font-sans text-[13px] text-text-secondary">Read, send, and organize your emails</p>
              </div>
            </div>
            {isGmailConnected ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/15 border border-success/30 text-success text-[13px] font-medium font-sans">
                <Check className="size-3.5" />
                Connected
              </div>
            ) : (
              <Button variant="default" onClick={() => handleConnect("gmail")} className="h-8 px-4 text-[13px]">
                Connect →
              </Button>
            )}
          </div>

          {/* Integration Card: Google Calendar */}
          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-[10px]">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">📅</div>
              <div>
                <h3 className="font-sans font-medium text-text-primary text-[15px]">Google Calendar</h3>
                <p className="font-sans text-[13px] text-text-secondary">Manage your schedule and meetings</p>
              </div>
            </div>
            <Button variant="default" onClick={() => handleConnect("googlecalendar")} className="h-8 px-4 text-[13px]">
              Connect →
            </Button>
          </div>
          
          {/* Integration Card: Slack */}
          <div className="flex items-center justify-between p-4 bg-surface border border-border rounded-[10px]">
            <div className="flex items-center gap-4">
              <div className="size-10 bg-white/10 rounded-lg flex items-center justify-center text-xl">💬</div>
              <div>
                <h3 className="font-sans font-medium text-text-primary text-[15px]">Slack</h3>
                <p className="font-sans text-[13px] text-text-secondary">Send messages and notifications</p>
              </div>
            </div>
            <Button variant="default" onClick={() => handleConnect("slack")} className="h-8 px-4 text-[13px]">
              Connect →
            </Button>
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-4 mt-4">
          <Button 
            size="lg" 
            className="w-full font-serif font-semibold text-base h-12"
            disabled={!isGmailConnected}
            onClick={() => completeOnboarding.mutate()}
          >
            Continue
          </Button>
          <button 
            className="text-[13px] text-text-muted hover:text-text-primary transition-colors"
            onClick={() => completeOnboarding.mutate()}
          >
            Skip for now →
          </button>
        </div>

      </div>
    </div>
  );
}
