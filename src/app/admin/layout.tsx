import { AdminGuard } from "@/components/admin-guard";
import { AdminShell } from "@/components/admin-shell";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminShell>
        <div className="w-full">{children}</div>
      </AdminShell>
    </AdminGuard>
  );
}
