import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Activity, Crown, Cpu } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-blue-400" /> Usuários
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="text-yellow-400" /> Premium
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="text-purple-400" /> Backtests
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-emerald-400" /> Consultas IA
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">—</CardContent>
        </Card>
      </div>
    </div>
  );
}
