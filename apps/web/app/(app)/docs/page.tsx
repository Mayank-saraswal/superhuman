import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function DocsPage() {
  return (
    <div className="flex h-full w-full bg-background overflow-hidden">
      <div className="w-[200px] shrink-0 border-r border-border flex flex-col h-full bg-background">
        <div className="p-4 border-b border-border flex items-center justify-between shrink-0">
          <h2 className="font-serif font-bold text-[16px] text-text-primary">My Docs</h2>
          <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-text-secondary hover:text-text-primary">
            +
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center opacity-50 select-none">
          <span className="font-sans text-[13px] text-text-muted">No docs yet</span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60 pointer-events-none select-none">
        <Image src="/illustrations/docs-empty.svg" width={240} height={180} alt="" />
        <h2 className="font-serif text-[22px] font-bold text-text-primary mt-6 mb-2">Create your first doc</h2>
        <p className="font-sans text-[15px] text-text-secondary">Capture your ideas in an instant.</p>
      </div>
    </div>
  );
}
