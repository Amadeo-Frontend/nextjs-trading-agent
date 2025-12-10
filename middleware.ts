import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const isProtectedRoute =
    pathname.startsWith("/agente") ||
    pathname.startsWith("/backtest") ||
    pathname.startsWith("/admin");

  // 1) Não logado tentando acessar rota protegida
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2) Logado tentando ir para /login ou /register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/agente", req.url));
  }

  // 3) Rota de admin, mas usuário não é admin
  if (pathname.startsWith("/admin")) {
    const tokenWithRole = token as { role?: string } | null;
    const role = tokenWithRole?.role;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/agente", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/agente/:path*",
    "/backtest/:path*",
    "/admin/:path*",
  ],
};
