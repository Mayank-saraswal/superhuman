import { api } from "~/trpc/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { status } = await api.health.getHealth.query();
  return (
    <main className="min-h-screen bg-background text-text-primary flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Superhuman</h1>
          <p className="text-text-secondary text-lg">
            The fastest email experience ever made.
          </p>
        </div>
        
        <div className="pt-8">
          <a 
            href="/mail" 
            className="inline-flex h-10 items-center justify-center rounded-md bg-accent px-8 text-sm font-medium text-white transition-colors hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background"
          >
            Enter App
          </a>
        </div>

        <div className="pt-12 text-xs text-text-muted">
          API Status: {status === 'healthy' ? (
            <span className="text-green-500 font-medium">Online</span>
          ) : (
            <span className="text-red-500 font-medium">Offline</span>
          )}
        </div>
      </div>
    </main>
  );
}
