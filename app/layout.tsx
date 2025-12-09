import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { AppSessionProvider } from "@/components/session-provider"

export const metadata: Metadata = {
  title: "Trading Agent",
  description: "Agente de IA para mercado financeiro com backtests",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppSessionProvider>
            <div className="flex min-h-screen flex-col">
              <header className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-semibold">Trading Agent</span>
                <div className="flex items-center gap-2">
                  <ModeToggle />
                </div>
              </header>
              <main className="flex-1 px-4 py-6">{children}</main>
            </div>
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
