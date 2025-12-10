import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { JWT } from "next-auth/jwt";
import type { User as NextAuthUser } from "next-auth";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  console.warn("⚠ BACKEND_URL não definido nas envs");
}

interface BackendUser {
  id: number;
  email: string;
  name?: string | null;
  role: "free" | "premium" | "admin";
}

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string | null;
    role: "free" | "premium" | "admin";
    accessToken: string;
  }

  interface Session {
    user: User;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    role: "free" | "premium" | "admin";
    accessToken: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "E-mail", type: "text" },
        password: { label: "Senha", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        // LOGIN no FastAPI
        const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: credentials.email,
            password: credentials.password,
          }),
        });

        if (!loginRes.ok) return null;

        const loginData = await loginRes.json();
        const accessToken = loginData.access_token;
        if (!accessToken) return null;

        // BUSCA USER /auth/me
        const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!meRes.ok) return null;

        const user = (await meRes.json()) as BackendUser;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? "",
          role: user.role,
          accessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email!;
        token.name = user.name!;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        name: token.name,
        role: token.role,
        accessToken: token.accessToken,
      };

      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
