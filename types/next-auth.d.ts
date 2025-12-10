import NextAuth, { DefaultSession } from "next-auth";

import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role: "free" | "premium" | "admin";
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
  }
}
