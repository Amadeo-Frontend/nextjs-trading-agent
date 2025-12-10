// frontend/components/app-header.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AppHeader() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const user = session?.user;

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Trading Agent
          </span>
          <span className="text-xs text-muted-foreground">
            Painel do usuário
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isLoading && (
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-20" />
            </div>
          )}

          {!isLoading && user && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-sm font-medium">
                  {user.name || user.email}
                </span>
                {user.email && (
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
