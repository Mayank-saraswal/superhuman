import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { createConnectUrl, isOAuthPlugin } from "@superhuman/corsair";

export const runtime = "nodejs";

/**
 * Starts the Corsair OAuth flow for a plugin.
 *
 * GET /api/connect?plugin=gmail
 *
 * Authenticates the user via Clerk, generates a provider authorization URL
 * scoped to the user's tenant, stashes the signed state in an httpOnly cookie
 * (CSRF protection), then redirects the browser to the provider.
 */
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const plugin = request.nextUrl.searchParams.get("plugin");
  if (!plugin || !isOAuthPlugin(plugin)) {
    return new NextResponse(`Unsupported or missing plugin: ${plugin ?? "(none)"}`, { status: 400 });
  }

  const appUrl = process.env.APP_URL || request.nextUrl.origin;
  const redirectUri = `${appUrl}/api/auth`;

  try {
    // We use the Clerk user id as the stable Corsair tenant id.
    const { url, state } = await createConnectUrl(plugin, userId, redirectUri);

    const response = NextResponse.redirect(url);
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start OAuth flow";
    console.error("[connect] failed to generate OAuth url:", message);
    return new NextResponse(message, { status: 500 });
  }
}
