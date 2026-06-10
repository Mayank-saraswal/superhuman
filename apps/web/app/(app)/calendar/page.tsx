"use client";

import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function CalendarPage() {
  return (
    <div className="flex flex-col h-full bg-background relative">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <h1 className="font-serif text-[18px] font-bold text-text-primary">Calendar</h1>
        <Button onClick={() => alert('Not implemented yet')} className="bg-accent text-[#1C1C1C] hover:bg-accent-hover font-sans text-[13px] h-8 px-4 font-medium">
          + New Event
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60 pointer-events-none select-none">
        <Image src="/illustrations/calendar-empty.svg" width={240} height={180} alt="" />
        <h2 className="font-serif text-[22px] font-bold text-text-primary mt-6 mb-2">No events scheduled</h2>
        <p className="font-sans text-[15px] text-text-secondary">Your calendar is clear.</p>
      </div>
    </div>
  );
}
