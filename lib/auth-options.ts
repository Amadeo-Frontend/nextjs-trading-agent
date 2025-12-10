import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { JWT } from "next-auth/jwt";
import type { User as NextAuthUser } from "next-auth";

const BACKEND_URL = process.env.BACKEND_URL;

interface BackendUser {
  id: number;
  email: string;
  name?: string | null;
  role: "free" | "premium" | "admin";
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

      async authorize(credentials): Promise<NextAuthUser | null> {
        if (!credentials?.email || !credentials.password) return null;

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

        const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
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
        token.name = user.name ?? null;
        (token as JWT).role = user.role;
        (token as JWT).accessToken = user.accessToken;
      }
      return token;
    },

    async session({ session, token }) {
      const jwt = token as JWT;

      session.user = {
        id: jwt.id,
        email: jwt.email,
        name: jwt.name ?? "",
        role: jwt.role,
        accessToken: jwt.accessToken,
      };

      session.accessToken = jwt.accessToken;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
