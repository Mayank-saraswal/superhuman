"use client";

import { useState } from "react";
import Image from "next/image";
import DOMPurify from "isomorphic-dompurify";
import { formatDistanceToNow } from "date-fns";
import { Star, Paperclip, MoreHorizontal, Reply, Forward, Archive, Edit } from "lucide-react";
import { trpc } from "~/trpc/client";
import { Button } from "~/components/ui/button";

const TABS = ["Important", "Team", "VIP", "Marketing", "Social"] as const;
type Tab = typeof TABS[number] | "All";

export default function MailInbox() {
  const [activeTab, setActiveTab] = useState<Tab>("Important");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  // Queries
  const { data: inbox, isLoading } = trpc.mail.getInbox.useQuery({ 
    page: 0, 
    tab: activeTab === "All" ? "all" : activeTab.toLowerCase() as any 
  });

  const { data: threadData, isLoading: isLoadingThread } = trpc.mail.getThread.useQuery(
    { threadId: selectedThreadId! },
    { enabled: !!selectedThreadId }
  );

  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Left Panel - Email List */}
      <div className="w-[380px] shrink-0 border-r border-border flex flex-col h-full bg-background">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="font-sans font-semibold text-[15px]">{activeTab}</h2>
          <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-text-secondary hover:text-text-primary">
            ↻
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex px-2 pt-2 border-b border-border shrink-0 overflow-x-auto scrollbar-thin">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[12px] font-sans font-medium tracking-[0.05em] uppercase border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-accent text-text-primary"
                  : "border-transparent text-text-muted hover:text-text-secondary"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Email Rows */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {isLoading ? (
            <div className="p-4 text-center text-text-muted text-[13px] font-sans">Loading...</div>
          ) : inbox?.messages?.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center text-center opacity-60 pointer-events-none select-none">
              <Image src="/illustrations/inbox-empty.svg" width={240} height={180} alt="" />
              <h3 className="font-serif text-[20px] mt-4 text-text-primary">Your inbox is empty</h3>
              <p className="font-sans text-[14px] text-text-secondary mt-1">Enjoy the calm</p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {inbox?.messages?.map((msg) => {
                const isSelected = selectedThreadId === msg.threadId;
                const isUnread = true; // In real app, check labelIds includes UNREAD
                const subject = msg.payload?.headers?.find(h => h.name === "Subject")?.value || "No Subject";
                const fromHeader = msg.payload?.headers?.find(h => h.name === "From")?.value || "Unknown";
                const fromName = (fromHeader.split("<")[0] || "Unknown").replace(/"/g, "").trim();
                
                return (
                  <div
                    key={msg.id}
                    onClick={() => setSelectedThreadId(msg.threadId!)}
                    className={`relative p-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-surface-elevated"
                        : "hover:bg-surface"
                    }`}
                  >
                    {isUnread && (
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-white" />
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-sans text-[13px] truncate pr-2 ${isUnread ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                        {fromName}
                      </span>
                      <span className="font-mono text-[11px] text-text-muted shrink-0">
                        {msg.internalDate ? formatDistanceToNow(parseInt(msg.internalDate), { addSuffix: true }) : ""}
                      </span>
                    </div>
                    <div className="font-sans text-[13px] text-text-primary truncate mb-1">
                      {subject}
                    </div>
                    {msg.aiSummary && (
                      <div className="font-sans text-[12px] text-text-muted truncate">
                        ✨ {msg.aiSummary}
                      </div>
                    )}
                    <div className="font-sans text-[12px] text-text-muted truncate mt-0.5">
                      {msg.snippet}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Email Detail */}
      <div className="flex-1 h-full bg-background flex flex-col overflow-hidden">
        {!selectedThreadId ? (
          <div className="flex-1 flex items-center justify-center pointer-events-none select-none opacity-60">
            <div className="text-center">
              <h3 className="font-serif text-[24px] text-text-primary">Select an email to read</h3>
            </div>
          </div>
        ) : isLoadingThread ? (
          <div className="flex-1 flex items-center justify-center text-text-muted font-sans text-[13px]">
            Loading thread...
          </div>
        ) : threadData?.thread && (
          <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col relative">
            
            {/* Headers Area */}
            <div className="p-6 pb-4 border-b border-border shrink-0">
              <div className="flex items-start justify-between gap-4 mb-6">
                <h1 className="font-serif text-[22px] font-bold text-text-primary leading-tight">
                  {threadData.thread.messages?.[0]?.payload?.headers?.find(h => h.name === "Subject")?.value || "No Subject"}
                </h1>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" size="icon-sm" className="text-text-secondary hover:text-text-primary"><Reply className="size-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-text-secondary hover:text-text-primary"><Forward className="size-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-text-secondary hover:text-text-primary"><Archive className="size-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-text-secondary hover:text-text-primary"><Star className="size-4" /></Button>
                  <Button variant="ghost" size="icon-sm" className="text-text-secondary hover:text-text-primary"><MoreHorizontal className="size-4" /></Button>
                </div>
              </div>

              {/* AI Summary Banner */}
              {threadData.draftReply && (
                <div className="bg-surface border-l-2 border-white/30 rounded-r-md p-3 mb-6 flex items-start justify-between">
                  <div>
                    <span className="font-serif text-[12px] font-semibold text-text-primary block mb-1">✨ AI Summary</span>
                    <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                      This is a placeholder summary.
                    </p>
                  </div>
                  <button className="text-text-muted hover:text-text-primary">✕</button>
                </div>
              )}
            </div>

            {/* Messages in Thread */}
            <div className="flex-1 p-6 space-y-12">
              {threadData.thread.messages?.map((msg, idx) => {
                const fromHeader = msg.payload?.headers?.find(h => h.name === "From")?.value || "";
                const dateHeader = msg.payload?.headers?.find(h => h.name === "Date")?.value || "";
                
                // Very basic fallback HTML extraction
                let htmlBody = msg.snippet; 
                // Note: proper Gmail API body extraction requires decoding base64 from msg.payload.body.data or parts
                
                return (
                  <div key={msg.id || idx}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="font-sans text-[14px] text-text-primary font-medium">{fromHeader}</div>
                      <div className="font-mono text-[11px] text-text-muted">{dateHeader}</div>
                    </div>
                    <div 
                      className="font-sans text-[14px] text-text-primary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlBody || "") }} 
                    />
                  </div>
                );
              })}
            </div>

            {/* AI Draft Reply Section */}
            {threadData.draftReply && (
              <div className="p-6 border-t border-border shrink-0 bg-surface">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-serif text-[14px] font-semibold text-text-primary">✨ AI suggests:</span>
                  <Edit className="size-3.5 text-text-muted" />
                </div>
                <textarea 
                  className="w-full bg-background border border-border rounded-md p-3 font-sans text-[14px] text-text-primary mb-3 focus:outline-none focus:border-white/40"
                  rows={3}
                  defaultValue={threadData.draftReply}
                />
                <div className="flex items-center gap-3">
                  <Button className="bg-[#4ADE80] text-[#1C1C1C] hover:bg-[#4ADE80]/90">Send This</Button>
                  <Button variant="ghost">Edit</Button>
                  <button className="text-text-muted hover:text-text-primary text-[13px] ml-auto">Discard</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
