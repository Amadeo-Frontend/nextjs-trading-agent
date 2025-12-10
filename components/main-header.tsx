"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainHeader() {
  const { data: session } = useSession();

  const role = session?.user?.role ?? "free";
  const name = session?.user?.name ?? session?.user?.email ?? "";
  const firstLetter = name.charAt(0).toUpperCase();

  const isPremium = role === "premium" || role === "admin";

  const glowColor = isPremium
    ? "before:bg-gradient-to-r before:from-purple-600/20 before:via-fuchsia-500/10 before:to-purple-400/20"
    : "before:bg-gradient-to-r before:from-emerald-500/15 before:via-emerald-600/10 before:to-emerald-900/5";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-black/20 shadow-lg",
        "before:absolute before:inset-0 before:-z-10 before:opacity-40",
        glowColor
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
        <Link href="/" className="font-semibold">
          Trading Agent
        </Link>

        {!session?.user ? (
          <Link href="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-purple-600/40 text-white flex items-center justify-center font-bold">
              {firstLetter}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sair
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
