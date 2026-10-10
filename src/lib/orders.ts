import "server-only";
import type Stripe from "stripe";
import { createServiceClient } from "./supabase/service";
import type { OrderStatus } from "./types";

type SessionEvent =
  | "checkout.session.completed"
  | "checkout.session.async_payment_succeeded"
  | "checkout.session.async_payment_failed";

// Once an order reaches one of these, an out-of-order "completed" event must not move it back to pending.
const SETTLED: OrderStatus[] = ["paid", "active", "failed", "refunded", "canceled"];

function idOf(value: string | { id: string } | null | undefined) {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

function statusFor(session: Stripe.Checkout.Session, eventType: SessionEvent): OrderStatus {
  if (eventType === "checkout.session.async_payment_failed") return "failed";
  const settled = session.payment_status === "paid" || session.payment_status === "no_payment_required";
  if (!settled) return "pending";
  return session.mode === "subscription" ? "active" : "paid";
}

export async function recordCheckoutSession(session: Stripe.Checkout.Session, eventType: SessionEvent) {
  const supabase = createServiceClient();
  const metadata = session.metadata ?? {};

  let packageId: string | null = null;
  if (metadata.package_id) {
    const { data } = await supabase.from("packages").select("id").eq("id", metadata.package_id).maybeSingle();
    packageId = data?.id ?? null;
  }

  const { data: existing, error: readError } = await supabase
    .from("orders")
    .select("status")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();
  if (readError) throw new Error(`Could not read order: ${readError.message}`);

  let status = statusFor(session, eventType);
  if (existing && status === "pending" && SETTLED.includes(existing.status as OrderStatus)) {
    status = existing.status as OrderStatus;
  }

  const details = session.customer_details;
  const row = {
    stripe_checkout_session_id: session.id,
    stripe_customer_id: idOf(session.customer),
    stripe_payment_intent_id: idOf(session.payment_intent),
    stripe_subscription_id: idOf(session.subscription),
    package_id: packageId,
    package_name: metadata.package_name || metadata.package_slug || "Consulting package",
    billing: session.mode === "subscription" ? "monthly" : "one_time",
    amount_cents: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    customer_name: details?.name ?? "",
    customer_email: details?.email ?? "",
    customer_phone: details?.phone ?? "",
    organization: session.collected_information?.business_name ?? "",
    status,
  };

  const { error } = await supabase.from("orders").upsert(row, { onConflict: "stripe_checkout_session_id" });
  if (error) throw new Error(`Could not save order: ${error.message}`);
}

function subscriptionStatus(status: Stripe.Subscription.Status): OrderStatus | null {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "past_due":
    case "unpaid":
      return "failed";
    default:
      return null;
  }
}

export async function recordSubscriptionChange(subscription: Stripe.Subscription) {
  const status = subscriptionStatus(subscription.status);
  if (!status) return;
  const supabase = createServiceClient();
  const { error } = await supabase.from("orders").update({ status }).eq("stripe_subscription_id", subscription.id);
  if (error) throw new Error(`Could not update subscription order: ${error.message}`);
}

export async function recordRefund(charge: Stripe.Charge) {
  const paymentIntentId = idOf(charge.payment_intent);
  if (!charge.refunded || !paymentIntentId) return;
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "refunded" })
    .eq("stripe_payment_intent_id", paymentIntentId);
  if (error) throw new Error(`Could not mark order refunded: ${error.message}`);
}
