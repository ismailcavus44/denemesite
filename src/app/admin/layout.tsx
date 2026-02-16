import { AdminGuard } from "@/components/admin-guard";
import { AdminShell } from "@/components/admin-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      </AdminShell>
    </AdminGuard>
  );
}
