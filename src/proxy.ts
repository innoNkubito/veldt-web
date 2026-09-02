import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Everything behind the operator dashboard. Public surfaces — /onboarding,
// /view/[slug] and /pay/[token] — are deliberately absent: prospective
// operators and paying clients reach those without an account.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/itineraries(.*)",
  "/library(.*)",
  "/settings(.*)",
  "/tasks(.*)",
  "/bookings(.*)",
  "/integrations(.*)",
  "/admin(.*)",
]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// "/" is the public landing page. Signed-in users have no use for it, and
// redirecting here rather than inside the page avoids rendering the marketing
// shell for a moment before bouncing.
const isLandingRoute = createRouteMatcher(["/"]);

export const proxy = clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Signed-in users don't need the landing page or sign-in/sign-up
  if (userId && (isAuthRoute(req) || isLandingRoute(req))) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protected routes require auth
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
