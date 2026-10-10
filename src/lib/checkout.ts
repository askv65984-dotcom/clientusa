import "server-only";
import type Stripe from "stripe";
import { absoluteUrl } from "./site";
import { getStripe } from "./stripe";
import type { Package } from "./types";

/** Builds a Stripe Checkout session from the package as it is stored right now. */
export async function createCheckoutSession(pkg: Package) {
  if (pkg.billing === "custom" || pkg.price_cents == null) {
    throw new Error(`Package "${pkg.slug}" is quoted per project and cannot be bought online.`);
  }

  const monthly = pkg.billing === "monthly";
  const metadata = { package_id: pkg.id, package_slug: pkg.slug, package_name: pkg.name.slice(0, 200) };

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
    quantity: 1,
    price_data: {
      currency: "usd",
      unit_amount: pkg.price_cents,
      product_data: {
        name: pkg.name,
        ...(pkg.summary ? { description: pkg.summary } : {}),
        metadata,
      },
      ...(monthly ? { recurring: { interval: "month" as const } } : {}),
    },
  };

  const shared: Stripe.Checkout.SessionCreateParams = {
    line_items: [lineItem],
    success_url: `${absoluteUrl("/checkout/success")}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: absoluteUrl("/checkout/canceled"),
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    name_collection: { business: { enabled: true, optional: true } },
    allow_promotion_codes: true,
    metadata,
  };

  const params: Stripe.Checkout.SessionCreateParams = monthly
    ? {
        ...shared,
        mode: "subscription",
        subscription_data: { metadata, description: pkg.name },
      }
    : {
        ...shared,
        mode: "payment",
        submit_type: "pay",
        customer_creation: "always",
        invoice_creation: { enabled: true, invoice_data: { description: pkg.name, metadata } },
        payment_intent_data: { description: pkg.name, metadata },
      };

  return getStripe().checkout.sessions.create(params);
}
