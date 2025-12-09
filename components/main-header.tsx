"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"

export function MainHeader() {
  const { data: session, status } = useSession()

  const userName = session?.user?.name
  const userEmail = session?.user?.email
  const label = userName ?? userEmail ?? "Convidado"

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <Link href="/" className="font-semibold">
        Trading Agent
      </Link>

      <div className="flex items-center gap-3 text-sm">
        {status === "authenticated" ? (
          <>
            <div className="flex flex-col items-end">
              <span className="font-medium leading-tight">{label}</span>
              {userName && userEmail && (
                <span className="text-xs text-muted-foreground">
                  {userEmail}
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
        ) : (
          <Link href="/login">
            <Button variant="outline" size="sm">
              Entrar
            </Button>
          </Link>
        )}

        <ModeToggle />
      </div>
    </header>
  )
}
