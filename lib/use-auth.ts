"use client";

import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

type ExtendedSession = Session & {
  accessToken?: string;
  user?: Session["user"] & {
    role?: string;
    id?: string;
  };
};

export function useAuth() {
  const { data, status } = useSession();

  const session = (data ?? {}) as ExtendedSession;

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  return {
    session,
    user: session.user ?? null,
    accessToken: session.accessToken ?? "",
    status,
    isLoading,
    isAuthenticated,
    signOut,
  };
}
