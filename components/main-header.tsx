"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MainHeader() {
  const { data: session, status } = useSession();
  const role = session?.user?.role ?? "free";
  const isPremium = role === "premium" || role === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full backdrop-blur-xl transition-all",
        "bg-black/30 border-b border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.45)]",
        isPremium
          ? "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-purple-500/60 before:via-fuchsia-400/40 before:to-purple-600/60"
          : "before:absolute before:bottom-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-emerald-400/50 before:via-emerald-500/30 before:to-emerald-600/50"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* LOGO */}
        <Link
          href="/"
          className="relative font-semibold tracking-tight text-zinc-200 hover:text-white transition-colors"
        >
          Trading Agent
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 text-sm">
          {status === "authenticated" ? (
            <>
              <span className="font-medium text-zinc-300">
                {session.user.name}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-zinc-200 hover:bg-white/10 hover:text-white transition"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sair
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-zinc-200 hover:bg-white/10 hover:text-white transition"
              >
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
