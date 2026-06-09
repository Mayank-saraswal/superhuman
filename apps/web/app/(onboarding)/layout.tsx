import { clerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, upsertUser } from "@superhuman/services";

export default async function OnboardingLayout({
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

  if (user && user.onboardingComplete === true) {
    redirect("/mail");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0d1117] text-white">
      {children}
    </div>
  );
}
