"use client";

import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

export function AppHeader() {
  const { user, isLoading, signOut } = useAuth();

  const handleLogout = async () => {
    toast.loading("Saindo...");
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="w-full border-b border-border bg-background/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* Logo / título */}
        <h1 className="text-lg font-semibold tracking-tight">Trading Agent</h1>

        {/* Área do usuário */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name ?? user?.email}</p>
                <p className="text-xs text-muted-foreground">Role: {user?.role}</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
