import type Stripe from "stripe";
import { recordCheckoutSession, recordRefund, recordSubscriptionChange } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe sends payment events here. Point a webhook endpoint at /api/stripe/webhook with these events:
 * checkout.session.completed, checkout.session.async_payment_succeeded, checkout.session.async_payment_failed,
 * customer.subscription.updated, customer.subscription.deleted, charge.refunded
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set.");
    return new Response("Webhook is not configured.", { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing Stripe signature.", { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("[stripe-webhook] Signature check failed", error);
    return new Response("Invalid signature.", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
      case "checkout.session.async_payment_failed":
        await recordCheckoutSession(event.data.object, event.type);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await recordSubscriptionChange(event.data.object);
        break;
      case "charge.refunded":
        await recordRefund(event.data.object);
        break;
      default:
        break;
    }
  } catch (error) {
    // A 500 tells Stripe to retry the event later.
    console.error(`[stripe-webhook] Failed to handle ${event.type}`, error);
    return new Response("Webhook handler failed.", { status: 500 });
  }

  return Response.json({ received: true });
}
