import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath =
    path === "/login" ||
    path === "/register" ||
    path === "/" ||
    path.startsWith("/api");

  // Get the session token from the request
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If the path is public, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If user is not authenticated and tries to access a protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based access control
  if (token && path.startsWith("/dashboard")) {
    const role = token.role as string;

    // Specific dashboard route checks
    if (path.startsWith("/dashboard/provider") && role !== "provider") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (path.startsWith("/dashboard/customer") && role !== "customer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
