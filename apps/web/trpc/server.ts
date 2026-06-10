import "server-only";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { auth } from "@clerk/nextjs/server";
import type { AppRouter } from "@superhuman/trpc/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/trpc";
if (process.env.NODE_ENV === "production" && apiUrl.includes("localhost")) {
  throw new Error("NEXT_PUBLIC_API_URL must be set in production");
}

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiUrl,
      headers: async () => {
        const { getToken } = await auth();
        const token = await getToken();
        return {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
      },
    }),
  ],
});
