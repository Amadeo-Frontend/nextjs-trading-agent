// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

type AuthRole = "free" | "premium" | "admin";

type AuthToken = {
  email?: string;
  name?: string;
  role?: AuthRole;
};

export async function middleware(req: NextRequest) {
  const token = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as AuthToken | null;

  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/agente") ||
    pathname.startsWith("/backtest") ||
    pathname.startsWith("/admin");

  // 1) Não logado em rota protegida → login
  if (!token && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2) Logado indo para /login → envia para dashboard/free
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard/free", req.url));
  }

  // 3) Admin → apenas role admin
  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard/free", req.url));
    }
  }

  // 4) Dashboard premium → apenas premium ou admin
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
