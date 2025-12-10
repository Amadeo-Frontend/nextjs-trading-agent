import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_ROUTES = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/agente", "/backtest", "/admin"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // 1) NÃO logado → tentando acessar rota protegida
  if (!token && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2) Logado → tentando acessar login/register
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3) Rota admin → validar role
  if (pathname.startsWith("/admin")) {
    const role = (token as { role?: string } | null)?.role;
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
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
