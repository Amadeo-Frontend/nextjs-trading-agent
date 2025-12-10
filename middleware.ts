import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC = ["/", "/login", "/register"];

type Role = "free" | "premium" | "admin";

interface AuthToken {
  email?: string;
  name?: string;
  role?: Role;
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as AuthToken | null;

  const pathname = req.nextUrl.pathname;

  const isPublic = PUBLIC.includes(pathname);
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/agente") ||
    pathname.startsWith("/backtest") ||
    pathname.startsWith("/admin");

  if (!token && isProtected) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard/free", req.url));
  }

  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/free", req.url));
    }
  }

  if (pathname.startsWith("/dashboard/premium")) {
    if (!token || (token.role !== "premium" && token.role !== "admin")) {
      return NextResponse.redirect(new URL("/dashboard/free", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/agente/:path*",
    "/backtest/:path*",
    "/admin/:path*",
  ],
};
