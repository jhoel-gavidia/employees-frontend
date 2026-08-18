import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  console.log("PROXY EJECUTADO:", request.nextUrl.pathname);
  const token = request.cookies.get("token")?.value;
  console.log("TOKEN:", token);
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};