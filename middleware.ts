// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/", "/login"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected =
    pathname.startsWith("/app") ||
    pathname.startsWith("/agente") ||
    pathname.startsWith("/backtest") ||
    pathname.startsWith("/admin");

  // 1) Não logado tentando acessar rota protegida → manda pro login
  if (!token && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2) Logado tentando ir pra /login → manda para /app
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // 3) Rota admin → só entra se role === "admin"
  if (pathname.startsWith("/admin")) {
    interface TokenWithRole {
      role?: string;
    }
    const role = (token as TokenWithRole | null)?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/app", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/app/:path*",
    "/agente/:path*",
    "/backtest/:path*",
    "/admin/:path*",
  ],
};
