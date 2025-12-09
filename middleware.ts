import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Rotas que NÃO exigem login
const publicRoutes = ["/login", "/register"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    // Se rota for pública → permite
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Se caiu aqui e não tem token → redireciona
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // públicas sempre liberadas
        if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
          return true;
        }

        // Se tiver token → liberado
        return !!token;
      },
    },
  }
);

// Define quais rotas serão protegidas
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|login|register).*)",
    "/agente/:path*",
    "/backtest/:path*",
    "/perfil/:path*",
    "/admin/:path*",
  ],
};
