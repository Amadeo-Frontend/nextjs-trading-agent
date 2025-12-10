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
import { ChevronLeft, ChevronRight, Loader2, Shield, UserPlus } from "lucide-react";

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

  // --- Load data ---
  useEffect(() => {
    if (!accessToken) return;

    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        const data = await fetchAdminUsers(accessToken);
        setUsers(data);
      } catch (err) {
        const error = err as Error;
        toast.error(error.message);
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
        const error = err as Error;
        toast.error(error.message);
      } finally {
        setIsLoadingStats(false);
      }
    };

    void loadUsers();
    void loadStats();
  }, [accessToken]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  }, [users.length]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, page]);

  const isBusy = authLoading || globalLoading;

  // --- Action handlers ---

  const handleApprove = (userToApprove: AdminUser) => {
    setPendingAction({ type: "approve", user: userToApprove });
  };

  const handleDelete = (userToDelete: AdminUser) => {
    setPendingAction({ type: "delete", user: userToDelete });
  };

  const handleToggleRole = (userToChange: AdminUser) => {
    const newRole: UserRole = userToChange.role === "admin" ? "user" : "admin";
    setPendingAction({
      type: "promote",
      user: userToChange,
      newRole,
    });
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
        toast.success("Usuário aprovado com sucesso.");
      }

      if (pendingAction.type === "delete") {
        await deleteUser(pendingAction.user.id, accessToken);
        setUsers((prev) => prev.filter((u) => u.id !== pendingAction.user.id));
        toast.success("Usuário removido com sucesso.");
      }

      if (pendingAction.type === "promote") {
        if (!pendingAction.newRole) return;
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
            ? "Usuário promovido para admin."
            : "Usuário atualizado para role user."
        );
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    } finally {
      setGlobalLoading(false);
      setPendingAction(null);
    }
  };

  // --- UI helpers ---

  const getRoleBadge = (role: UserRole) => {
    if (role === "admin") {
      return (
        <Badge className="gap-1 bg-purple-600/90 hover:bg-purple-600">
          <Shield className="h-3 w-3" />
          Admin
        </Badge>
      );
    }

    return <Badge variant="outline">User</Badge>;
  };

  const getActiveBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge className="bg-emerald-600/90 hover:bg-emerald-600">
          Ativo
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-amber-500 text-amber-500">
        Pendente
      </Badge>
    );
  };

  return (
    <div className="flex min-h-screen flex-col gap-6 p-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Painel Administrativo
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie usuários, permissões e acompanhe métricas da plataforma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <div className="flex flex-col items-end text-right text-xs">
              <span className="font-medium">{user.name ?? user.email}</span>
              <span className="text-[11px] text-muted-foreground">
                Role: {user.role ?? "user"}
              </span>
            </div>
          )}
          {isBusy && (
            <Badge variant="outline" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Atualizando...
            </Badge>
          )}
        </div>
      </div>

      {/* Cards de métricas */}
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
            <Card className="border border-border/60 bg-gradient-to-br from-zinc-900/80 to-zinc-950">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuários totais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_users.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Inclui ativos e pendentes.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pendentes de aprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">
                    {stats.pending_users.toLocaleString("pt-BR")}
                  </div>
                  <UserPlus className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Cadastros aguardando liberação.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuários ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.active_users.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Com acesso liberado ao agente.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_admins.toLocaleString("pt-BR")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Contas com acesso ao painel.
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Tabela de usuários */}
      <Card className="mt-2">
        <CardHeader>
          <CardTitle className="text-base">Usuários cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingUsers ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum usuário encontrado.
            </p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium">
                              {u.name ?? "Sem nome"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {u.email}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getActiveBadge(u.is_active)}</TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">
                            {new Date(u.created_at).toLocaleString("pt-BR")}
                          </span>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          {!u.is_active && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-600/70 text-emerald-400 hover:bg-emerald-600/10"
                              onClick={() => handleApprove(u)}
                              disabled={isBusy}
                            >
                              Aprovar
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleRole(u)}
                            disabled={isBusy}
                          >
                            {u.role === "admin" ? "Rebaixar" : "Promover"}
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(u)}
                            disabled={isBusy}
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 1 || isBusy}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === totalPages || isBusy}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação */}
      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction?.type === "approve" && "Aprovar usuário"}
              {pendingAction?.type === "delete" && "Remover usuário"}
              {pendingAction?.type === "promote" && "Alterar role do usuário"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.user && (
                <>
                  Ação para o usuário{" "}
                  <span className="font-semibold">
                    {pendingAction.user.email}
                  </span>
                  .
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={globalLoading}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executePendingAction}
              disabled={globalLoading}
            >
              {globalLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
