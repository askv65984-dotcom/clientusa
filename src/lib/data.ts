import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "./supabase/public";
import { createServiceClient } from "./supabase/service";
import { site } from "./site";
import { PACKAGE_COLUMNS, SETTINGS_COLUMNS, type Package, type SiteSettings } from "./types";

export const PACKAGES_TAG = "packages";
export const SETTINGS_TAG = "settings";

const EMPTY_SETTINGS: SiteSettings = {
  contact_email: site.email,
  contact_phone: "",
  office_hours: "",
  linkedin_url: "",
  consultation_package_id: null,
};

/** Packages shown on the public site, cached until an admin edit expires the tag. */
export async function getActivePackages(): Promise<Package[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(PACKAGES_TAG);

  const supabase = createPublicClient();
  if (!supabase) {
    console.warn("[packages] Supabase is not configured, so no packages are shown.");
    return [];
  }

  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Could not load packages: ${error.message}`);
  return (data ?? []) as Package[];
}

/** Fresh, uncached read used at checkout so the charged price always matches the database. */
export async function getPackageForCheckout(slug: string): Promise<Package | null> {
  const supabase = createPublicClient();
  if (!supabase) throw new Error("Supabase is not configured.");

  const { data, error } = await supabase
    .from("packages")
    .select(PACKAGE_COLUMNS)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(`Could not load package: ${error.message}`);
  return (data as Package | null) ?? null;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);

  const supabase = createPublicClient();
  if (!supabase) return EMPTY_SETTINGS;

  const { data, error } = await supabase
    .from("site_settings")
    .select(SETTINGS_COLUMNS)
    .eq("id", 1)
    .maybeSingle();

  if (error) throw new Error(`Could not load site settings: ${error.message}`);
  return (data as SiteSettings | null) ?? EMPTY_SETTINGS;
}

/** The paid option on the Book a consultation page, chosen in admin settings, if it is active and can be bought online. */
export async function getConsultationPackage(): Promise<Package | null> {
  const [packages, settings] = await Promise.all([getActivePackages(), getSiteSettings()]);
  return packages.find((pkg) => pkg.id === settings.consultation_package_id && pkg.billing !== "custom") ?? null;
}

/**
 * The booking link (Calendly or similar). Visitors cannot read it with the public key, so it is
 * only ever sent to people who reach the page after paying.
 */
export async function getSchedulingUrl(): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag(SETTINGS_TAG);

  try {
    const { data, error } = await createServiceClient().from("site_settings").select("scheduling_url").eq("id", 1).maybeSingle();
    if (error) throw error;
    return (data?.scheduling_url as string | undefined) ?? "";
  } catch (error) {
    console.error("[settings] Could not load the booking link", error);
    return "";
  }
}
