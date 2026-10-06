import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/projects(.*)",
  "/products(.*)",
  "/lab(.*)",
  "/about",
  "/contact",
  "/login(.*)",
  "/api/webhooks/clerk(.*)",
  "/_next(.*)",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  // Admin routes require admin role
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth.protect();
    const metadata = sessionClaims?.publicMetadata as { role?: string } | undefined;
    const role = metadata?.role ?? "user";
    if (role !== "admin") {
      const url = new URL("/", req.url);
      return new Response(null, {
        status: 307,
        headers: { Location: url.toString() },
      });
    }
  }

  // Protected routes require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }

  // Public routes pass through
  if (isPublicRoute(req)) {
    return;
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};