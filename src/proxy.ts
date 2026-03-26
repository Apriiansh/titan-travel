import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY =
  process.env.JWT_SECRET ||
  "fallback_secret_key_yang_sangat_panjang_dan_aman_123456";
const key = new TextEncoder().encode(SECRET_KEY);

async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload;
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isManagerRoute =
    pathname.startsWith("/manager") || pathname.startsWith("/laporan");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  if ((isAdminRoute || isManagerRoute) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const payload = await decrypt(token);

    if (!payload && (isAdminRoute || isManagerRoute)) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    if (payload) {
      const userRole = payload.role as string;

      if (isAuthRoute) {
        if (userRole === "ADMIN") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        if (userRole === "MANAGER") {
          return NextResponse.redirect(new URL("/manager", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (isAdminRoute && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (isManagerRoute && userRole === "USER") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/manager/:path*",
    "/laporan/:path*",
    "/login",
    "/register",
  ],
};
