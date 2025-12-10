const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!BACKEND_URL) {
  // Apenas aviso em dev
  console.warn("⚠️ NEXT_PUBLIC_BACKEND_URL não definido.");
}

export type UserRole = "user" | "admin";

export interface AdminUser {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  pending_users: number;
  active_users: number;
  total_admins: number;
  today_signups: number;
}

function buildHeaders(accessToken: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function fetchAdminUsers(
  accessToken: string
): Promise<AdminUser[]> {
  const res = await fetch(`${BACKEND_URL}/admin/users`, {
    headers: buildHeaders(accessToken),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar usuários.");
  }

  return (await res.json()) as AdminUser[];
}

export async function fetchAdminStats(
  accessToken: string
): Promise<AdminStats> {
  const res = await fetch(`${BACKEND_URL}/admin/stats`, {
    headers: buildHeaders(accessToken),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Falha ao carregar estatísticas.");
  }

  return (await res.json()) as AdminStats;
}

export async function approveUser(
  userId: number,
  accessToken: string
): Promise<AdminUser> {
  const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/approve`, {
    method: "PATCH",
    headers: buildHeaders(accessToken),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(data.detail ?? "Erro ao aprovar usuário.");
  }

  return (await res.json()) as AdminUser;
}

export async function updateUserRole(
  userId: number,
  role: UserRole,
  accessToken: string
): Promise<AdminUser> {
  const res = await fetch(`${BACKEND_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: buildHeaders(accessToken),
    body: JSON.stringify({ role }),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(data.detail ?? "Erro ao atualizar role.");
  }

  return (await res.json()) as AdminUser;
}

export async function deleteUser(
  userId: number,
  accessToken: string
): Promise<void> {
  const res = await fetch(`${BACKEND_URL}/admin/users/${userId}`, {
    method: "DELETE",
    headers: buildHeaders(accessToken),
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => ({}))) as { detail?: string };
    throw new Error(data.detail ?? "Erro ao remover usuário.");
  }
}
