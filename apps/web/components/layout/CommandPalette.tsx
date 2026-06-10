"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Mail, Calendar, FileText, Settings, PenLine, Search } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      } else if (e.key === "Escape" || e.key === "Esc") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <Command 
        className="w-full max-w-[560px] bg-surface rounded-xl shadow-2xl border border-border overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
        shouldFilter={true}
      >
        <Command.Input 
          autoFocus 
          placeholder="Search emails, docs, anything..." 
          className="w-full bg-transparent px-4 py-4 text-text-primary placeholder:text-text-muted outline-none border-b border-border font-sans text-[15px]"
        />
        <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-thin">
          <Command.Empty className="py-6 text-center text-sm text-text-muted">No results found.</Command.Empty>
          
          <Command.Group heading="Navigation" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-text-muted">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/mail"))}
              className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-text-primary text-text-secondary text-[13px] font-sans transition-colors"
            >
              <div className="flex items-center gap-2">
                <Mail className="size-4" />
                Go to Inbox
              </div>
              <span className="font-mono text-[10px] bg-border px-1.5 py-0.5 rounded-sm">G I</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/calendar"))}
              className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-text-primary text-text-secondary text-[13px] font-sans transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                Go to Calendar
              </div>
              <span className="font-mono text-[10px] bg-border px-1.5 py-0.5 rounded-sm">G C</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/docs"))}
              className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-text-primary text-text-secondary text-[13px] font-sans transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="size-4" />
                Go to Docs
              </div>
              <span className="font-mono text-[10px] bg-border px-1.5 py-0.5 rounded-sm">G D</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/settings"))}
              className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-text-primary text-text-secondary text-[13px] font-sans transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="size-4" />
                Go to Settings
              </div>
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Mail Actions" className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-text-muted mt-2">
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/mail/compose"))}
              className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-text-primary text-text-secondary text-[13px] font-sans transition-colors"
            >
              <div className="flex items-center gap-2">
                <PenLine className="size-4" />
                Compose Email
              </div>
              <span className="font-mono text-[10px] bg-border px-1.5 py-0.5 rounded-sm">C</span>
            </Command.Item>
            <Command.Item 
              onSelect={() => runCommand(() => router.push("/search"))}
              className="flex items-center justify-between px-2 py-2 rounded-md cursor-pointer aria-selected:bg-surface-elevated aria-selected:text-text-primary text-text-secondary text-[13px] font-sans transition-colors"
            >
              <div className="flex items-center gap-2">
                <Search className="size-4" />
                Search Emails
              </div>
              <span className="font-mono text-[10px] bg-border px-1.5 py-0.5 rounded-sm">/</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
