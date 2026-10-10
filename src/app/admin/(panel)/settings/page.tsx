import type { Metadata } from "next";
import { PinForm, SettingsForm } from "@/components/admin/settings-forms";
import { AdminHeading, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { ADMIN_SETTINGS_COLUMNS, type AdminSettings, type Package } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const [{ data, error }, packagesResult] = await Promise.all([
    supabase.from("site_settings").select(ADMIN_SETTINGS_COLUMNS).eq("id", 1).maybeSingle(),
    supabase.from("packages").select("id, name, billing, price_cents, is_active").order("sort_order").order("created_at"),
  ]);
  if (error) throw new Error(`Could not load settings: ${error.message}`);
  if (packagesResult.error) throw new Error(`Could not load packages: ${packagesResult.error.message}`);
  const settings = (data as AdminSettings | null) ?? {
    scheduling_url: "",
    contact_email: "",
    contact_phone: "",
    office_hours: "",
    linkedin_url: "",
    consultation_package_id: null,
  };
  // Only packages with a fixed price can be paid for online.
  const packages = ((packagesResult.data ?? []) as Pick<Package, "id" | "name" | "billing" | "price_cents" | "is_active">[]).filter(
    (pkg) => pkg.billing !== "custom",
  );

  return (
    <>
      <AdminHeading title="Settings" description="The consultation package, booking link and contact details used on the website." />
      <Panel className="max-w-3xl p-6">
        <h2 className="mb-5 text-[1.5rem] text-ink">Website details</h2>
        <SettingsForm settings={settings} packages={packages} />
      </Panel>
      <Panel className="mt-8 max-w-3xl scroll-mt-8 p-6">
        <h2 id="admin-pin" className="text-[1.5rem] text-ink">
          Admin PIN
        </h2>
        <p className="mt-1 mb-5 text-[0.9375rem] text-slate">
          The PIN opens this admin area. A longer PIN that is not an easy pattern is harder to guess.
        </p>
        <PinForm />
      </Panel>
    </>
  );
}
