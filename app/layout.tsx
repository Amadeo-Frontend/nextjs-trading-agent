import type { Metadata } from "next";
import "./globals.css";
import { AppSessionProvider } from "@/components/session-provider";
import { MainHeader } from "@/components/main-header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Trading Agent",
  description: "Agente de IA para mercado financeiro com backtests",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <AppSessionProvider>
          <div className="flex min-h-screen flex-col">
            <MainHeader />
            <main className="flex-1">
              {children}
              <Toaster richColors position="bottom-right" />
            </main>
          </div>
        </AppSessionProvider>
      </body>
    </html>
  );
}
