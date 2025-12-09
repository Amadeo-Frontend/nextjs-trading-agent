import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AppSessionProvider } from "@/components/session-provider"
import { MainHeader } from "@/components/main-header"

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
              <MainHeader />
              <main className="flex-1 px-4 py-6">{children}</main>
            </div>
          </AppSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
