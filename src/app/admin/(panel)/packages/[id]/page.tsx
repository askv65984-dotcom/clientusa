import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PackageForm } from "@/components/admin/package-form";
import { AdminHeading } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { PACKAGE_COLUMNS, type Package } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Edit package" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function EditPackagePage({ params }: PageProps<"/admin/packages/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const { data, error } = await supabase.from("packages").select(PACKAGE_COLUMNS).eq("id", id).maybeSingle();
  if (error) throw new Error(`Could not load package: ${error.message}`);
  if (!data) notFound();
  const pkg = data as Package;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/packages" className="text-link text-[0.9375rem]">
        Back to packages
      </Link>
      <div className="mt-4">
        <AdminHeading title={`Edit ${pkg.name}`} />
      </div>
      <PackageForm key={pkg.id} pkg={pkg} />
    </div>
  );
}
