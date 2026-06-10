"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search as SearchIcon } from "lucide-react";
import { trpc } from "~/trpc/client";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  
  // Basic debounce wrapper could go here, but omitted for brevity in stub
  const isLoading = false;
  const data = { messages: [] as any[] };

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden">
      <div className="p-6 border-b border-border shrink-0 max-w-4xl mx-auto w-full mt-4">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted size-5" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl px-12 py-5 font-serif text-[20px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/40 transition-colors shadow-sm"
            placeholder="Search emails, docs, anything..."
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
        {query.length <= 2 ? (
          <div className="flex flex-col items-center justify-center pt-20 text-center opacity-60 pointer-events-none select-none">
            <Image src="/illustrations/search-empty.svg" width={240} height={180} alt="" />
            <h2 className="font-serif text-[22px] font-bold text-text-primary mt-6 mb-2">Search everything</h2>
            <p className="font-sans text-[15px] text-text-secondary">Try: &apos;invoices from last month&apos; or &apos;emails from Rohan&apos;</p>
          </div>
        ) : isLoading ? (
          <div className="text-center text-text-muted font-sans text-[15px] mt-10">Searching...</div>
        ) : data?.messages?.length === 0 ? (
          <div className="text-center text-text-secondary font-sans text-[15px] mt-10">No results found for &quot;{query}&quot;</div>
        ) : (
          <div className="space-y-2">
            {data?.messages?.map(msg => (
              <div key={msg.id} className="p-3 bg-surface border border-border rounded-lg hover:border-white/30 cursor-pointer transition-colors">
                <div className="font-sans font-medium text-[14px] text-text-primary">
                  {msg.payload?.headers?.find((h: any) => h.name === "Subject")?.value || "No Subject"}
                </div>
                <div className="font-sans text-[13px] text-text-secondary mt-1 truncate">
                  {msg.snippet}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
