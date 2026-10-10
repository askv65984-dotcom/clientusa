"use server";

import { redirect } from "next/navigation";
import { createCheckoutSession } from "@/lib/checkout";
import { getPackageForCheckout } from "@/lib/data";

export async function startCheckout(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) redirect("/checkout/unavailable");

  let checkoutUrl: string | null = null;
  try {
    const pkg = await getPackageForCheckout(slug);
    if (pkg && pkg.billing !== "custom") {
      const session = await createCheckoutSession(pkg);
      checkoutUrl = session.url;
    }
  } catch (error) {
    console.error("[checkout] Could not start checkout", { slug, error });
  }

  // redirect() throws, so it stays outside the try block.
  redirect(checkoutUrl ?? "/checkout/unavailable");
}
