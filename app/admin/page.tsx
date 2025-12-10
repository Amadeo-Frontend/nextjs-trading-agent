"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/use-auth";
import {
  fetchAdminUsers,
  fetchAdminStats,
  approveUser,
  updateUserRole,
  deleteUser,
  type AdminUser,
  type AdminStats,
  type UserRole,
} from "@/lib/api-admin";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Skeleton } from "@/components/ui/skeleton";

import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Shield,
  UserPlus,
  Users,
  BarChart3,
  CheckCircle2,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

const PAGE_SIZE = 8;

type PendingAction =
  | { type: "approve"; user: AdminUser }
  | { type: "delete"; user: AdminUser }
  | { type: "promote"; user: AdminUser; newRole: UserRole }
  | null;

export default function AdminPage() {
  const { accessToken, isLoading: authLoading, user } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [globalLoading, setGlobalLoading] = useState<boolean>(false);

  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [page, setPage] = useState<number>(1);

  // LOAD DATA
  useEffect(() => {
    if (!accessToken) return;

    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const data = await fetchAdminUsers(accessToken);
        setUsers(data);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const loadStats = async () => {
      try {
        setIsLoadingStats(true);
        const data = await fetchAdminStats(accessToken);
        setStats(data);
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadUsers();
    loadStats();
  }, [accessToken]);

  // PAGINATION
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(users.length / PAGE_SIZE)),
    [users.length]
  );

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, page]);

  const isBusy = authLoading || globalLoading;

  // ACTION HANDLERS
  const handleApprove = (user: AdminUser) =>
    setPendingAction({ type: "approve", user });

  const handleDelete = (user: AdminUser) =>
    setPendingAction({ type: "delete", user });

  const handleToggleRole = (user: AdminUser) => {
    const newRole: UserRole = user.role === "admin" ? "user" : "admin";
    setPendingAction({ type: "promote", user, newRole });
  };

  const executePendingAction = async () => {
    if (!pendingAction || !accessToken) return;

    setGlobalLoading(true);

    try {
      if (pendingAction.type === "approve") {
        const updated = await approveUser(pendingAction.user.id, accessToken);
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        toast.success("Usuário aprovado!");
      }

      if (pendingAction.type === "delete") {
        await deleteUser(pendingAction.user.id, accessToken);
        setUsers((prev) =>
          prev.filter((u) => u.id !== pendingAction.user.id)
        );
        toast.success("Usuário removido!");
      }

      if (pendingAction.type === "promote") {
        const updated = await updateUserRole(
          pendingAction.user.id,
          pendingAction.newRole,
          accessToken
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === updated.id ? updated : u))
        );
        toast.success(
          updated.role === "admin"
            ? "Usuário promovido a admin!"
            : "Usuário rebaixado para user."
        );
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setGlobalLoading(false);
      setPendingAction(null);
    }
  };

  // BADGES
  const getRoleBadge = (role: UserRole) =>
    role === "admin" ? (
      <Badge className="bg-purple-600/80 text-white shadow-sm flex gap-1 items-center">
        <Shield className="h-3 w-3 animate-pulse" />
        Admin
      </Badge>
    ) : (
      <Badge className="border-gray-400 text-gray-300">User</Badge>
    );

  const getActiveBadge = (isActive: boolean) =>
    isActive ? (
      <Badge className="bg-emerald-600/80 text-white px-2">Ativo</Badge>
    ) : (
      <Badge className="border-amber-500 text-amber-400 px-2">Pendente</Badge>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#050505] via-[#0b0b0b] to-[#111] text-white animate-fade-in">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Admin</h1>
          <p className="text-sm text-gray-400">
            Gerencie usuários, permissões e acompanhe métricas.
          </p>
        </div>

        {user && (
          <div className="text-right text-xs">
            <p className="font-semibold">{user.name ?? user.email}</p>
            <p className="text-gray-400">Role: {user.role}</p>
          </div>
        )}
      </div>

      {/* METRIC CARDS */}
      <div className="grid gap-4 md:grid-cols-4">
        {isLoadingStats || !stats ? (
          <>
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </>
        ) : (
          <>
            {/* TOTAL USERS */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="premium-title flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400 animate-fade" />
                  Usuários Totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="premium-number">
                  {stats.total_users.toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>

            {/* PENDING */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="premium-title flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-amber-400 animate-bounce" />
                  Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="premium-number">
                  {stats.pending_users.toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>

            {/* ACTIVE USERS */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="premium-title flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 animate-pulse" />
                  Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="premium-number">
                  {stats.active_users.toLocaleString("pt-BR")}
                </p>
              </CardContent>
            </Card>

            {/* ADMINS */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="premium-title flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-400 animate-pulse" />
                  Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="premium-number">{stats.total_admins}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* USERS TABLE */}
      <Card className="premium-table mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Usuários cadastrados</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoadingUsers ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white/5">
                      <TableHead>Usuário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paginatedUsers.map((u) => (
                      <TableRow key={u.id} className="hover:bg-white/5 transition">
                        <TableCell>
                          <p className="font-semibold">{u.name ?? "Sem nome"}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </TableCell>

                        <TableCell>{getActiveBadge(u.is_active)}</TableCell>

                        <TableCell>{getRoleBadge(u.role)}</TableCell>

                        <TableCell className="text-xs text-gray-400">
                          {new Date(u.created_at).toLocaleString("pt-BR")}
                        </TableCell>

                        <TableCell className="flex justify-end gap-2">
                          {!u.is_active && (
                            <Button
                              size="sm"
                              className="premium-btn-green"
                              onClick={() => handleApprove(u)}
                            >
                              Aprovar
                            </Button>
                          )}

                          <Button
                            size="sm"
                            className="premium-btn-blue"
                            onClick={() => handleToggleRole(u)}
                          >
                            {u.role === "admin" ? (
                              <ArrowDownCircle className="h-4 w-4" />
                            ) : (
                              <ArrowUpCircle className="h-4 w-4" />
                            )}
                          </Button>

                          <Button
                            size="sm"
                            className="premium-btn-red"
                            onClick={() => handleDelete(u)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-4 text-sm text-gray-300">
                <p>
                  Página {page} de {totalPages}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    <ChevronLeft />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    <ChevronRight />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* CONFIRM DIALOG */}
      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent className="premium-dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a executar uma ação em{" "}
              <strong>{pendingAction?.user?.email}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={globalLoading}>Cancelar</AlertDialogCancel>

            <AlertDialogAction
              disabled={globalLoading}
              onClick={executePendingAction}
            >
              {globalLoading && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
