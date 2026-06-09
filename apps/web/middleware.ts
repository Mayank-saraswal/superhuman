import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/mail(.*)', 
  '/docs(.*)', 
  '/calendar(.*)', 
  '/go(.*)', 
  '/settings(.*)', 
  '/search(.*)'
])

// Define which routes are auth-related (login/signup)
const isAuthRoute = createRouteMatcher([
  '/login(.*)',
  '/signup(.*)'
])

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If user is authenticated and trying to access login/signup, redirect to /mail
  if (userId && isAuthRoute(req)) {
    const mailUrl = new URL('/mail', req.url);
    return NextResponse.redirect(mailUrl);
  }

  // If route is protected, protect it (will redirect to login if not authenticated)
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
