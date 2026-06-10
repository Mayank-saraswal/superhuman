"use client";

import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@superhuman/trpc/server";

export const trpc = createTRPCReact<AppRouter>();
