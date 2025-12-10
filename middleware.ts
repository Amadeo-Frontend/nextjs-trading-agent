// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_ROUTES = ["/", "/login", "/register"];
const PROTECTED_PREFIXES = ["/app", "/agente", "/backtest", "/admin"];

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // 1) Usuário NÃO logado tentando acessar rota protegida
  if (!token && isProtected) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2) Usuário logado tentando ir para login/register/landing
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  // 3) Rota admin: validar role
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
    "/register",
    "/app/:path*",
    "/agente/:path*",
    "/backtest/:path*",
    "/admin/:path*",
  ],
};
