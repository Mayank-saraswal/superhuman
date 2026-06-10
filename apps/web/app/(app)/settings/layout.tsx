import Link from "next/link";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      {/* Left Nav */}
      <div className="w-[180px] shrink-0 border-r border-border flex flex-col h-full bg-background p-4">
        <h2 className="font-serif font-bold text-[18px] text-text-primary mb-4">Settings</h2>
        <nav className="space-y-1">
          {["Profile", "Integrations", "Inbox", "Snippets", "Notifications", "Shortcuts", "Billing"].map((item) => {
            const path = item.toLowerCase();
            return (
              <Link 
                key={item} 
                href={`/settings/${path}`}
                className="block px-3 py-2 rounded-md font-sans text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
              >
                {item}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
