"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-800 bg-[#0d1117] p-4 flex flex-col justify-between h-full">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Streamyst</h2>
        <nav className="space-y-2">
          <Link href="/mail" className="block text-gray-400 hover:text-white">Mail</Link>
          <Link href="/calendar" className="block text-gray-400 hover:text-white">Calendar</Link>
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">
        <UserButton 
          appearance={{
            elements: {
              userButtonAvatarBox: "w-8 h-8",
            }
          }}
        />
      </div>
    </aside>
  );
}
