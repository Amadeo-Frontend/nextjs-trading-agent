"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Crown,
  Settings,
  LogOut,
} from "lucide-react";

const menu = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Usuários", href: "/admin/users", icon: Users },
  { name: "Métricas", href: "/admin/metrics", icon: BarChart3 },
  { name: "Assinaturas", href: "/admin/subscriptions", icon: Crown },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-zinc-900 border-r border-zinc-800 px-4 py-6 flex flex-col">
      <h1 className="text-xl font-bold text-white mb-8">Admin Panel</h1>

      <nav className="flex-1 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition",
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center gap-2 text-zinc-500 hover:text-red-400 transition">
        <LogOut size={18} />
        Sair
      </button>
    </aside>
  );
}
