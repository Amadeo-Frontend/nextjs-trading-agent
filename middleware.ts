import { withAuth } from "next-auth/middleware";

// Rotas que precisam estar logadas
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

// Regras do middleware
export const config = {
  matcher: [
    "/",
    "/agente/:path*",
    "/backtest/:path*",
    "/perfil/:path*",
    "/admin/:path*",
  ],
};
