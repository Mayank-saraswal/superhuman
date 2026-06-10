"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CompletePage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/mail");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center gap-6 max-w-md text-center">
        <div className="pointer-events-none select-none">
          <Image 
            src="/illustrations/done.svg" 
            width={200} 
            height={160} 
            alt="" 
            className="opacity-70"
            priority
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="font-serif text-[32px] font-bold tracking-tight text-text-primary">
            You&apos;re all set!
          </h1>
          <p className="font-sans text-[16px] text-text-secondary">
            Taking you to your inbox...
          </p>
        </div>
      </div>
    </div>
  );
}
