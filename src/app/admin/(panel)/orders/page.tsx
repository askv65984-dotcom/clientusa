import type { Metadata } from "next";
import { AdminHeading, EmptyRow, Panel, StatusBadge, orderStatusLabels, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime, formatUsd } from "@/lib/format";
import type { Order } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Orders" };

function stripeLink(order: Order) {
  const base = order.stripe_checkout_session_id.startsWith("cs_test_")
    ? "https://dashboard.stripe.com/test"
    : "https://dashboard.stripe.com";
  if (order.stripe_subscription_id) return `${base}/subscriptions/${order.stripe_subscription_id}`;
  if (order.stripe_payment_intent_id) return `${base}/payments/${order.stripe_payment_intent_id}`;
  return null;
}

export default async function AdminOrdersPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, created_at, package_name, billing, amount_cents, currency, customer_name, customer_email, customer_phone, organization, status, stripe_checkout_session_id, stripe_subscription_id, stripe_payment_intent_id",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw new Error(`Could not load orders: ${error.message}`);
  const orders = (data ?? []) as Order[];

  return (
    <>
      <AdminHeading
        title="Orders"
        description="Purchases made through checkout. Refunds and cancellations are handled in Stripe and update here automatically."
        actions={
          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Open Stripe
          </a>
        }
      />

      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <thead className="border-b border-sage bg-mist/60">
            <tr>
              <th scope="col" className={th}>
                Date
              </th>
              <th scope="col" className={th}>
                Customer
              </th>
              <th scope="col" className={th}>
                Package
              </th>
              <th scope="col" className={`${th} text-right`}>
                Amount
              </th>
              <th scope="col" className={th}>
                Status
              </th>
              <th scope="col" className={th}>
                <span className="sr-only">Stripe</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage">
            {orders.map((order) => {
              const link = stripeLink(order);
              return (
                <tr key={order.id}>
                  <td className={`${td} text-[0.9375rem] whitespace-nowrap text-slate`}>{formatDateTime(order.created_at)}</td>
                  <td className={td}>
                    <span className="block font-semibold">{order.customer_name || "Name not given"}</span>
                    {order.organization ? <span className="block text-[0.875rem]">{order.organization}</span> : null}
                    {order.customer_email ? (
                      <a href={`mailto:${order.customer_email}`} className="block text-[0.875rem] break-all text-slate underline decoration-sage">
                        {order.customer_email}
                      </a>
                    ) : null}
                    {order.customer_phone ? <span className="block text-[0.875rem] text-slate">{order.customer_phone}</span> : null}
                  </td>
                  <td className={td}>
                    {order.package_name}
                    <span className="block text-[0.875rem] text-slate">{order.billing === "monthly" ? "Monthly" : "One-time"}</span>
                  </td>
                  <td className={`${td} text-right font-semibold whitespace-nowrap`}>
                    {formatUsd(order.amount_cents)}
                    {order.billing === "monthly" ? <span className="block text-[0.875rem] font-normal text-slate">per month</span> : null}
                  </td>
                  <td className={td}>
                    <StatusBadge status={order.status} label={orderStatusLabels[order.status]} />
                  </td>
                  <td className={`${td} whitespace-nowrap`}>
                    {link ? (
                      <a href={link} target="_blank" rel="noopener noreferrer" className="text-[0.9375rem] font-semibold text-evergreen underline decoration-sage hover:decoration-evergreen">
                        View in Stripe
                      </a>
                    ) : null}
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 ? (
              <EmptyRow colSpan={6}>No orders yet. Purchases made through checkout will appear here.</EmptyRow>
            ) : null}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
