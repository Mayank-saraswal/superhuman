"use client";

import { useState } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { Button } from "~/components/ui/button";

const SUGGESTIONS = [
  "Summarize my inbox from today",
  "What meetings do I have this week?",
  "Follow up with everyone who didn't reply",
  "Create a doc from my last meeting notes"
];

export default function GoChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: "user" | "ai", text: string}[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", text: input }]);
    setInput("");
    
    // Fake AI response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "I'm looking into that for you..." }]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Top Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-surface/50 backdrop-blur-sm">
        <div>
          <h1 className="font-serif text-[18px] font-bold text-text-primary flex items-center gap-2">
            ⚡ Go
          </h1>
          <p className="font-sans text-[13px] text-text-secondary mt-0.5">
            Your AI assistant with access to all your tools
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="text-text-muted hover:text-text-primary font-sans text-[13px]">
            Clear chat
          </Button>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
            <div className="pointer-events-none select-none mb-6">
              <Image src="/illustrations/ai-agent.svg" width={220} height={180} alt="" className="opacity-50" />
            </div>
            <h2 className="font-serif text-[28px] font-bold text-text-primary mb-2">⚡ Go</h2>
            <p className="font-sans text-[16px] text-text-secondary mb-8">Ask anything. Do anything.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
              {SUGGESTIONS.map((sug, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setInput(sug);
                  }}
                  className="p-3 text-left bg-surface border border-border rounded-lg text-text-secondary font-sans text-[13px] hover:border-white/30 hover:text-text-primary transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full space-y-6 pb-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] px-4 py-3 font-sans text-[14px] leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-surface-elevated text-text-primary border border-border rounded-[12px_12px_4px_12px]" 
                      : "bg-transparent text-text-primary border-l-2 border-border rounded-none pl-4 py-1"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border shrink-0 bg-background">
        <div className="max-w-3xl mx-auto w-full relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey || !e.shiftKey)) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask Go to do something... (Enter or ⌘/Ctrl+Enter to send)"
            className="w-full bg-surface border border-border rounded-[10px] px-4 py-4 pr-12 font-sans text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/40 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent text-[#1C1C1C] rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
