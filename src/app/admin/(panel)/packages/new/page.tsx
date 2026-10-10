import type { Metadata } from "next";
import Link from "next/link";
import { PackageForm } from "@/components/admin/package-form";
import { AdminHeading } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Add package" };

export default async function NewPackagePage() {
  await requireAdmin();
  return (
    <div className="max-w-3xl">
      <Link href="/admin/packages" className="text-link text-[0.9375rem]">
        Back to packages
      </Link>
      <div className="mt-4">
        <AdminHeading title="Add package" />
      </div>
      <PackageForm />
    </div>
  );
}
