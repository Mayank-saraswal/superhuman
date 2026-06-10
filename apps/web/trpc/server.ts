import "server-only";

import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { auth } from "@clerk/nextjs/server";
import type { AppRouter } from "@superhuman/trpc/server";

export const api = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/trpc",
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
