import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { pool } from "@/lib/db";

/**
 * Tipo do usuário retornado pelo banco
 */
type DBUser = {
  id: string;
  email: string;
  name: string;
  role: "free" | "premium" | "admin";
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
      },

      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email) return null;

        const result = await pool.query<DBUser>(
          "SELECT * FROM users WHERE email = $1 LIMIT 1",
          [credentials.email]
        );

        if (result.rowCount === 0) return null;

        const user = result.rows[0];

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = (user as DBUser).role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        role: token.role as "free" | "premium" | "admin",
      };
      return session;
    },
  },
};
