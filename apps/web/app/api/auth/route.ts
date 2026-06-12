import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { completeConnect } from "@superhuman/corsair";
import { setCorsairTenantId } from "@superhuman/services";

export const runtime = "nodejs";

/**
 * Corsair OAuth callback.
 *
 * GET /api/auth?code=...&state=...
 *
 * Validates the signed state against the httpOnly cookie set in /api/connect,
 * exchanges the authorization code for tokens (stored encrypted per-tenant by
 * Corsair), records the tenant id on the user, then redirects back to the
 * connect screen with a success flag.
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const storedState = request.cookies.get("oauth_state")?.value;

  const clearStateAnd = (response: NextResponse) => {
    response.cookies.delete("oauth_state");
    return response;
  };

  if (!code || !state) {
    return clearStateAnd(new NextResponse("Missing code or state.", { status: 400 }));
  }

  if (!storedState || storedState !== state) {
    return clearStateAnd(new NextResponse("Invalid OAuth state.", { status: 400 }));
  }

  const appUrl = process.env.APP_URL || request.nextUrl.origin;
  const redirectUri = `${appUrl}/api/auth`;

  try {
    const result = await completeConnect({ code, state, redirectUri });

    // Persist the tenant id so server-side tRPC calls can resolve the tenant.
    await setCorsairTenantId(userId, result.tenantId);

    const target = new URL("/onboarding/connect", request.url);
    target.searchParams.set("connected", result.plugin);
    return clearStateAnd(NextResponse.redirect(target));
  } catch (error) {
    const message = error instanceof Error ? error.message : "OAuth failed";
    console.error("[auth] OAuth callback failed:", message);
    const target = new URL("/onboarding/connect", request.url);
    target.searchParams.set("error", "oauth_failed");
    return clearStateAnd(NextResponse.redirect(target));
  }
}
