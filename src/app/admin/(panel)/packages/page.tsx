import type { Metadata } from "next";
import Link from "next/link";
import { setPackageVisibility } from "@/app/admin/actions";
import { DeletePackageButton } from "@/components/admin/delete-package-button";
import { AdminHeading, EmptyRow, Notice, Panel, StatusBadge, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { priceDisplay } from "@/lib/format";
import { PACKAGE_COLUMNS, type Package } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Packages and prices" };

export default async function AdminPackagesPage({ searchParams }: PageProps<"/admin/packages">) {
  const { supabase } = await requireAdmin();
  const { saved, deleted } = await searchParams;

  const [{ data, error }, settings] = await Promise.all([
    supabase.from("packages").select(PACKAGE_COLUMNS).order("sort_order", { ascending: true }).order("created_at", { ascending: true }),
    supabase.from("site_settings").select("consultation_package_id").eq("id", 1).maybeSingle(),
  ]);
  if (error) throw new Error(`Could not load packages: ${error.message}`);
  const packages = (data ?? []) as Package[];
  const bookingOptionId = (settings.data?.consultation_package_id as string | null | undefined) ?? null;

  return (
    <>
      <AdminHeading
        title="Packages and prices"
        description="What visitors see on the Pricing page and can buy at checkout. Changes go live on the website as soon as you save."
        actions={
          <Link href="/admin/packages/new" className="btn btn-primary">
            Add package
          </Link>
        }
      />

      {typeof saved === "string" ? <Notice tone="success">Saved &ldquo;{saved}&rdquo;. The website is updated.</Notice> : null}
      {deleted ? <Notice tone="success">Package deleted.</Notice> : null}

      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse">
          <thead className="border-b border-sage bg-mist/60">
            <tr>
              <th scope="col" className={th}>
                Package
              </th>
              <th scope="col" className={th}>
                Price
              </th>
              <th scope="col" className={th}>
                On website
              </th>
              <th scope="col" className={`${th} text-right`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage">
            {packages.map((pkg) => {
              const price = priceDisplay(pkg.billing, pkg.price_cents);
              return (
                <tr key={pkg.id}>
                  <td className={td}>
                    <Link href={`/admin/packages/${pkg.id}`} className="font-semibold text-ink underline decoration-sage hover:decoration-evergreen">
                      {pkg.name}
                    </Link>
                    <span className="block text-[0.875rem] text-slate">
                      Order {pkg.sort_order} · /pricing#{pkg.slug}
                    </span>
                    {pkg.id === bookingOptionId ? (
                      <span className="mt-1 block text-[0.875rem] font-semibold text-evergreen">Paid option on Book a consultation</span>
                    ) : null}
                  </td>
                  <td className={td}>
                    <span className="font-semibold">{price.amount}</span>
                    <span className="block text-[0.875rem] text-slate">{price.unit}</span>
                  </td>
                  <td className={td}>
                    {pkg.is_active ? <StatusBadge status="active" label="Showing" /> : <StatusBadge status="canceled" label="Hidden" />}
                  </td>
                  <td className={`${td} text-right whitespace-nowrap`}>
                    <form action={setPackageVisibility} className="inline">
                      <input type="hidden" name="id" value={pkg.id} />
                      <input type="hidden" name="visible" value={pkg.is_active ? "false" : "true"} />
                      <button type="submit" className="text-[0.9375rem] font-semibold text-evergreen underline decoration-sage hover:decoration-evergreen">
                        {pkg.is_active ? "Hide" : "Show"}
                      </button>
                    </form>
                    <Link href={`/admin/packages/${pkg.id}`} className="ml-4 text-[0.9375rem] font-semibold text-evergreen underline decoration-sage hover:decoration-evergreen">
                      Edit
                    </Link>
                    <DeletePackageButton id={pkg.id} name={pkg.name} isBookingOption={pkg.id === bookingOptionId} />
                  </td>
                </tr>
              );
            })}
            {packages.length === 0 ? (
              <EmptyRow colSpan={4}>
                No packages yet.{" "}
                <Link href="/admin/packages/new" className="text-link">
                  Add your first package
                </Link>
                .
              </EmptyRow>
            ) : null}
          </tbody>
        </table>
      </Panel>
      <p className="mt-4 text-[0.9375rem] text-slate">
        Changing a price only affects new purchases. Existing monthly retainers keep the price they started on. Deleting a
        package removes it for good; past orders keep their records. To take a package off the website for now, hide it
        instead.
      </p>
    </>
  );
}
