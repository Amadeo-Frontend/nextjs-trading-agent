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
  role: string;
}

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    accessToken: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      role: string;
    };
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
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
        if (!credentials?.email || !credentials.password || !BACKEND_URL) {
          return null;
        }

        // 1) Login no backend: /auth/login
        const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: credentials.email,
            password: credentials.password,
          }),
        });

        if (!loginRes.ok) {
          return null;
        }

        const loginData = (await loginRes.json()) as {
          access_token: string;
          token_type: string;
        };

        const accessToken = loginData.access_token;
        if (!accessToken) return null;

        // 2) Buscar dados do usuário: /auth/me
        const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!meRes.ok) {
          return null;
        }

        const user = (await meRes.json()) as BackendUser;

        const nextUser: NextAuthUser = {
          id: String(user.id),
          name: user.name ?? "",
          email: user.email,
          role: user.role,
          accessToken,
        } as NextAuthUser;

        return nextUser;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Primeira vez (após login)
      if (user) {
        const u = user as NextAuthUser & {
          role: string;
          accessToken: string;
        };

        token.id = u.id;
        (token as JWT).role = u.role;
        (token as JWT).accessToken = u.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        id: (token.id as string) ?? "",
        role: (token as JWT).role,
        email: session.user?.email ?? undefined,
        name: session.user?.name ?? undefined,
      };

      session.accessToken = (token as JWT).accessToken;

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
