"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
import { Skeleton } from "@/components/ui/skeleton";

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

import {
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "";

type UserRole = "admin" | "user";

type AdminUser = {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  is_active: boolean;
  is_approved: boolean;
  created_at: string;
  last_login_at: string | null;
};

type AdminStats = {
  total_users: number;
  active_users: number;
  admin_users: number;
  visits_24h: number;
  visits_7d: number;
};

type AdminActionType = "delete" | "promote" | "approve";

type PendingAction = {
  type: AdminActionType;
  user: AdminUser;
} | null;

const PAGE_SIZE = 8;

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [isLoadingUsers, setIsLoadingUsers] = useState<boolean>(true);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const [page, setPage] = useState<number>(1);

  // ------------------------- PROTEÇÃO DE ROTA -------------------------

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const isAdmin = session?.user?.role === "admin";

  // ------------------------- FETCH USERS -------------------------

  async function fetchUsers(token: string) {
    try {
      setIsLoadingUsers(true);

      const res = await fetch(`${BACKEND_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          detail?: string;
        };
        throw new Error(data.detail ?? "Erro ao carregar usuários");
      }

      const data = (await res.json()) as AdminUser[];
      setUsers(data);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao carregar usuários");
    } finally {
      setIsLoadingUsers(false);
    }
  }

  // ------------------------- FETCH STATS -------------------------

  async function fetchStats(token: string) {
    try {
      setIsLoadingStats(true);

      const res = await fetch(`${BACKEND_URL}/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        // Se não existir ainda, não quebra o painel
        return;
      }

      const data = (await res.json()) as AdminStats;
      setStats(data);
    } catch (err: unknown) {
      // só loga, sem quebrar a experiência
      console.error(err);
    } finally {
      setIsLoadingStats(false);
    }
  }

  // ------------------------- CARREGAR DADOS INICIAIS -------------------------

  useEffect(() => {
    if (!session?.accessToken || !BACKEND_URL || !isAdmin) {
      return;
    }

    void fetchUsers(session.accessToken as string);
    void fetchStats(session.accessToken as string);
  }, [session, isAdmin]);

  // ------------------------- PAGINAÇÃO -------------------------

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  }, [users.length]);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return users.slice(start, start + PAGE_SIZE);
  }, [users, page]);

  function handleChangePage(newPage: number) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  // ------------------------- AÇÕES ADMIN -------------------------

  async function performAction(type: AdminActionType, user: AdminUser) {
    if (!session?.accessToken) return;
    const token = session.accessToken as string;

    try {
      setActionLoadingId(user.id);

      if (type === "delete") {
        const res = await fetch(`${BACKEND_URL}/admin/users/${user.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            detail?: string;
          };
          throw new Error(data.detail ?? "Erro ao remover usuário");
        }

        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        toast.success("Usuário removido com sucesso");
      }

      if (type === "promote") {
        const newRole: UserRole = user.role === "admin" ? "user" : "admin";

        const res = await fetch(
          `${BACKEND_URL}/admin/users/${user.id}/role`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
          }
        );

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            detail?: string;
          };
          throw new Error(data.detail ?? "Erro ao atualizar papel do usuário");
        }

        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, role: newRole } : u
          )
        );
        toast.success(
          newRole === "admin"
            ? "Usuário promovido a admin"
            : "Usuário rebaixado para user"
        );
      }

      if (type === "approve") {
        const res = await fetch(
          `${BACKEND_URL}/admin/users/${user.id}/approve`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ approved: true }),
          }
        );

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as {
            detail?: string;
          };
          throw new Error(data.detail ?? "Erro ao aprovar usuário");
        }

        setUsers((prev) =>
          prev.map((u) =>
            u.id === user.id ? { ...u, is_approved: true } : u
          )
        );
        toast.success("Usuário aprovado com sucesso");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erro ao executar ação");
    } finally {
      setActionLoadingId(null);
      setPendingAction(null);
    }
  }

  function openActionDialog(type: AdminActionType, user: AdminUser) {
    setPendingAction({ type, user });
  }

  // ------------------------- TEXTO DO MODAL -------------------------

  function getDialogTexts(action: AdminActionType | null) {
    if (!action) {
      return {
        title: "",
        description: "",
        confirmLabel: "",
      };
    }

    if (action === "delete") {
      return {
        title: "Remover usuário",
        description:
          "Tem certeza que deseja remover este usuário? Essa ação não pode ser desfeita.",
        confirmLabel: "Remover",
      };
    }

    if (action === "promote") {
      return {
        title: "Alterar papel do usuário",
        description:
          "Você está prestes a alterar o papel deste usuário (admin/user). Deseja continuar?",
        confirmLabel: "Confirmar",
      };
    }

    return {
      title: "Aprovar usuário",
      description:
        "Confirme para aprovar este usuário e liberar o acesso ao sistema.",
      confirmLabel: "Aprovar",
    };
  }

  const dialogTexts = getDialogTexts(pendingAction?.type ?? null);

  // ------------------------- MÉTRICAS CALCULADAS NO CLIENTE -------------------------

  const pendingApprovals = users.filter((u) => !u.is_approved).length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const activeUsers = users.filter((u) => u.is_active).length;

  // ------------------------- RENDER -------------------------

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <ShieldCheck className="h-10 w-10 text-yellow-500" />
        <p className="text-lg font-semibold">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Painel Admin</h1>
          <p className="text-muted-foreground">
            Gerencie usuários, permissões e acompanhe métricas do seu Trading
            Agent.
          </p>
        </div>
      </div>

      {/* CARDS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total de usuários */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Usuários totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{users.length}</p>
            )}
          </CardContent>
        </Card>

        {/* Admins */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{totalAdmins}</p>
            )}
          </CardContent>
        </Card>

        {/* Ativos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-2xl font-bold">{activeUsers}</p>
            )}
          </CardContent>
        </Card>

        {/* Visitas (se backend tiver stats) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Visitas (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <p className="text-2xl font-bold">
                {stats ? stats.visits_24h : "-"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* TABELA DE USUÁRIOS */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aprovação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingUsers ? (
                  Array.from({ length: PAGE_SIZE }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-24" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Nenhum usuário encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.name ?? "-"}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "admin" ? "default" : "outline"
                          }
                          className="capitalize"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.is_active ? "default" : "secondary"}
                          className="capitalize"
                        >
                          {user.is_active ? "ativo" : "inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.is_approved ? "outline" : "destructive"
                          }
                        >
                          {user.is_approved ? "Aprovado" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {!user.is_approved && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={actionLoadingId === user.id}
                            onClick={() => openActionDialog("approve", user)}
                          >
                            {actionLoadingId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Aprovar"
                            )}
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={actionLoadingId === user.id}
                          onClick={() => openActionDialog("promote", user)}
                        >
                          {actionLoadingId === user.id &&
                          pendingAction?.type === "promote" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.role === "admin" ? (
                            "Rebaixar"
                          ) : (
                            "Promover"
                          )}
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={actionLoadingId === user.id}
                          onClick={() => openActionDialog("delete", user)}
                        >
                          {actionLoadingId === user.id &&
                          pendingAction?.type === "delete" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação simples */}
          {!isLoadingUsers && users.length > PAGE_SIZE && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                Página {page} de {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL DE CONFIRMAÇÃO (APROVAR / PROMOVER / EXCLUIR) */}
      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => {
          if (!open) setPendingAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogTexts.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {dialogTexts.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoadingId !== null}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={actionLoadingId !== null || !pendingAction}
              onClick={() => {
                if (!pendingAction) return;
                void performAction(pendingAction.type, pendingAction.user);
              }}
            >
              {actionLoadingId !== null ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                dialogTexts.confirmLabel
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
