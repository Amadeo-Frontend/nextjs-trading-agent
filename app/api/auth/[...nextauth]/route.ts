import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User as NextAuthUser } from "next-auth";
import type { JWT } from "next-auth/jwt";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  console.warn("⚠️ BACKEND_URL não definido nas envs");
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

        // 1) /auth/login -> token JWT do backend
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

        const token = loginData.access_token;
        if (!token) return null;

        // 2) /auth/me -> dados do usuário
        const meRes = await fetch(`${BACKEND_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!meRes.ok) {
          return null;
        }

        const user = (await meRes.json()) as {
          id: number;
          email: string;
          name?: string;
          role: string;
        };

        // objeto que o NextAuth trata como "User"
        const nextAuthUser: NextAuthUser = {
          id: String(user.id),
          name: user.name,
          email: user.email,
          // esses campos extras estão tipados no next-auth.d.ts
          role: user.role,
          accessToken: token,
        };

        return nextAuthUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // quando loga pela primeira vez, user vem preenchido
      if (user) {
        const u = user as NextAuthUser;
        token.id = u.id;
        (token as JWT).role = u.role;
        (token as JWT).accessToken = u.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token as JWT).role;
      }

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
