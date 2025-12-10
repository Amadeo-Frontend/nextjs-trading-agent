import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-black min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8 text-white">{children}</main>
    </div>
  );
}
