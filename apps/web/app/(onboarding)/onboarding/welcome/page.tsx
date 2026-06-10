import Image from "next/image";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center justify-center gap-8 max-w-md text-center">
        <div className="pointer-events-none select-none">
          <Image 
            src="/illustrations/welcome.svg" 
            width={280} 
            height={220} 
            alt="" 
            className="opacity-70"
            priority
          />
        </div>
        
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-text-primary">
            Welcome to Superhuman
          </h1>
          <p className="font-sans text-base text-text-secondary">
            Connect your accounts to get started
          </p>
        </div>

        <Button asChild size="lg" className="w-full font-serif font-semibold text-base h-12">
          <Link href="/onboarding/connect">
            Continue
          </Link>
        </Button>
      </div>
    </div>
  );
}
