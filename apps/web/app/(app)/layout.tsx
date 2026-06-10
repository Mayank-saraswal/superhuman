import { clerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, upsertUser } from "@superhuman/services";
import { Sidebar } from "~/components/layout/sidebar";
import { CommandPalette } from "~/components/layout/CommandPalette";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/login");
  }

  let user = await getUserByClerkId(userId);

  if (!user) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(userId);
      const email = clerkUser.emailAddresses[0]?.emailAddress;
      
      if (email) {
        user = await upsertUser({
          clerkId: userId,
          email,
          name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
          imageUrl: clerkUser.imageUrl || null,
        });
      }
    } catch (err) {
      console.error("Error creating user during race condition fallback:", err);
    }
  }

  if (!user || user.onboardingComplete === false) {
    redirect("/onboarding/connect");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-text-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <CommandPalette />
    </div>
  );
}
