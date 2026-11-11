import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt, isTokenExpired } from "./lib/jwt";

export function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = request.nextUrl;

  // Extract client IP for structured edge logging
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Check auth token cookie
  const authToken = request.cookies.get("auth_token")?.value;
  const isAuth = Boolean(authToken && !isTokenExpired(authToken));
  const jwtPayload = isAuth && authToken ? decodeJwt(authToken) : null;
  const role = jwtPayload?.role || "user";

  const fullPath = `${pathname}${search}`;

  // Log incoming request
  const logResponse = (status: number, outcome: string) => {
    const elapsed = Date.now() - startTime;
    console.log(
      `[Edge Middleware] ${request.method} ${pathname} | Status: ${status} | Role: ${
        isAuth ? role : "guest"
      } | IP: ${clientIp} | +${elapsed}ms | Outcome: ${outcome}`
    );
  };

  // 1. Dashboard Route Shield: requires authenticated user
  if (pathname.startsWith("/dashboard")) {
    if (!isAuth) {
      logResponse(307, "Redirect Unauthenticated -> /?login=true");
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("login", "true");
      loginUrl.searchParams.set("callbackUrl", fullPath);
      const redirectRes = NextResponse.redirect(loginUrl);
      if (authToken) {
        redirectRes.cookies.delete("auth_token");
      }
      return redirectRes;
    }
  }

  // 2. Admin Route Shield: requires authenticated user WITH admin role
  if (pathname.startsWith("/admin")) {
    if (!isAuth) {
      logResponse(307, "Redirect Unauthenticated Admin -> /?login=true");
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("login", "true");
      loginUrl.searchParams.set("callbackUrl", fullPath);
      const redirectRes = NextResponse.redirect(loginUrl);
      if (authToken) {
        redirectRes.cookies.delete("auth_token");
      }
      return redirectRes;
    }

    if (role !== "admin") {
      logResponse(403, "Forbidden Non-Admin Access -> Redirect /dashboard");
      const forbiddenUrl = new URL("/dashboard", request.url);
      forbiddenUrl.searchParams.set("error", "admin_required");
      return NextResponse.redirect(forbiddenUrl);
    }
  }

  // 3. Auth Pages Redirect: already authenticated users should not access /login or /register
  if (pathname === "/login" || pathname === "/register") {
    if (isAuth) {
      const cb = request.nextUrl.searchParams.get("callbackUrl");
      const destination =
        cb && !cb.startsWith("/login") && !cb.startsWith("/register")
          ? cb
          : role === "admin"
          ? "/admin"
          : "/dashboard";
      logResponse(307, `Redirect Authenticated Away From Auth Page -> ${destination}`);
      return NextResponse.redirect(new URL(destination, request.url));
    }
  }

  // Allow request to proceed
  const response = NextResponse.next();
  const elapsed = Date.now() - startTime;
  response.headers.set("x-response-time", `${elapsed}ms`);
  logResponse(200, "OK Passed");

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
