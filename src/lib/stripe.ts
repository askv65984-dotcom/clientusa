import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY.");
  client ??= new Stripe(key, { appInfo: { name: "Anoka Advisors website" } });
  return client;
}
