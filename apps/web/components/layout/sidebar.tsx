"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Mail, Calendar, FileText, Zap, Search, Settings } from "lucide-react";
import { cn } from "~/lib/utils";

const NAV_ITEMS = [
  { href: "/mail", label: "Mail", icon: Mail, shortcut: "G I" },
  { href: "/calendar", label: "Calendar", icon: Calendar, shortcut: "G C" },
  { href: "/docs", label: "Docs", icon: FileText, shortcut: "G D" },
  { href: "/go", label: "Go", icon: Zap, shortcut: "G A" },
  { href: "/search", label: "Search", icon: Search, shortcut: "G S" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-[220px] shrink-0 border-r border-border bg-background flex flex-col h-full">
      {/* Top Section */}
      <div className="p-4 flex flex-col gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-background font-bold text-lg select-none">
            S
          </div>
          <span className="font-serif font-semibold text-[15px] tracking-wide">Superhuman</span>
        </div>
        
        <div className="h-[1px] w-full bg-border" />

        {/* Action Buttons */}
        <button className="flex items-center justify-between w-full h-9 rounded-md bg-surface border border-border px-3 text-text-secondary hover:bg-surface-elevated transition-colors text-sm">
          <span className="flex items-center gap-2">
            <Search className="size-4" />
            <span>Search...</span>
          </span>
          <span className="font-mono text-[10px] bg-border px-1.5 py-0.5 rounded-sm">⌘K</span>
        </button>

        <button 
          type="button"
          onClick={() => router.push('/mail/compose')}
          className="w-full h-9 rounded-md bg-accent text-background font-serif font-semibold hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
        >
          Compose
          <span className="font-mono text-[10px] bg-black/10 px-1.5 py-0.5 rounded-sm ml-1 text-background">C</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-md text-[13px] font-medium transition-colors border-l-2",
                isActive
                  ? "bg-surface-elevated text-text-primary border-accent"
                  : "text-text-secondary border-transparent hover:bg-surface hover:text-text-primary"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </div>
              <span className={cn(
                "font-mono text-[10px]",
                isActive ? "text-text-muted" : "text-text-muted opacity-0 group-hover:opacity-100 transition-opacity"
              )}>
                {item.shortcut}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8 rounded-md",
            }
          }}
        />
        <Link href="/settings" className="p-2 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors">
          <Settings className="size-4" />
        </Link>
      </div>
    </aside>
  );
}
