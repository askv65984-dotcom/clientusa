import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16rem_1fr]">
      <AdminNav />
      <main id="main" className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
