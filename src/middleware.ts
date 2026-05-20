import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";


const isLandingPage = createRouteMatcher(['/']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 2. If the user is logged in and trying to visit the landing page
  if (userId && isLandingPage(req)) {
    const hasRoadmap = req.cookies.get('has_roadmap')?.value === 'true';
    const targetUrl = new URL(hasRoadmap ? '/dashboard' : '/onboarding', req.url);
    return NextResponse.redirect(targetUrl);
  }
});
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};