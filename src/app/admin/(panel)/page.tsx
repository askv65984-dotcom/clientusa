import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading, Panel, StatusBadge, leadStatusLabels, orderStatusLabels } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatCallDate, isTimeRequest, timeRequestLabels } from "@/lib/booking";
import { formatDateTime, formatUsd } from "@/lib/format";
import { parseSchedulingUrl } from "@/lib/scheduling";
import { ADMIN_SETTINGS_COLUMNS, type AdminSettings, type Lead, type Order } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Overview" };

export default async function AdminOverviewPage() {
  const { supabase } = await requireAdmin();

  const [newLeads, recentLeads, orders, activePackages, settingsResult] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("id, created_at, full_name, organization, interest, status, source, call_format, preferred_date").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("id, created_at, package_name, amount_cents, customer_name, customer_email, status").order("created_at", { ascending: false }).limit(200),
    supabase.from("packages").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("site_settings").select(ADMIN_SETTINGS_COLUMNS).eq("id", 1).maybeSingle(),
  ]);

  const orderRows = (orders.data ?? []) as Pick<Order, "id" | "created_at" | "package_name" | "amount_cents" | "customer_name" | "customer_email" | "status">[];
  const paidOrders = orderRows.filter((order) => order.status === "paid" || order.status === "active");
  const revenue = paidOrders.reduce((total, order) => total + order.amount_cents, 0);
  const settings = settingsResult.data as AdminSettings | null;

  const setup = [
    { done: (activePackages.count ?? 0) > 0, label: "At least one package is showing on the website", href: "/admin/packages" },
    { done: Boolean(settings?.consultation_package_id), label: "Paid option chosen for the Book a consultation page", href: "/admin/settings" },
    { done: Boolean(settings && parseSchedulingUrl(settings.scheduling_url)), label: "Calendly link added, so customers can choose a time after paying", href: "/admin/settings" },
    { done: Boolean(settings?.contact_email), label: "Contact email added", href: "/admin/settings" },
    { done: Boolean(process.env.STRIPE_SECRET_KEY), label: "Stripe connected for checkout", href: null },
    { done: Boolean(process.env.STRIPE_WEBHOOK_SECRET), label: "Stripe webhook connected so orders appear here", href: null },
  ];
  const remaining = setup.filter((item) => !item.done);

  const stats = [
    { label: "New leads", value: String(newLeads.count ?? 0), href: "/admin/leads?status=new" },
    { label: "Paid orders", value: String(paidOrders.length), href: "/admin/orders" },
    { label: "Revenue recorded", value: formatUsd(revenue), href: "/admin/orders" },
    { label: "Packages on the website", value: String(activePackages.count ?? 0), href: "/admin/packages" },
  ];

  return (
    <>
      <AdminHeading title="Overview" description="New inquiries, recent orders and anything that still needs setting up." />

      {remaining.length > 0 ? (
        <Panel className="mb-8 p-6">
          <h2 className="text-[1.5rem] text-ink">Finish setting up</h2>
          <ul className="mt-4 space-y-2.5">
            {setup.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border text-xs ${item.done ? "border-success bg-success text-white" : "border-slate/50"}`}
                >
                  {item.done ? "✓" : ""}
                </span>
                <span className={item.done ? "text-slate line-through" : "text-ink"}>
                  {item.label}
                  {!item.done && item.href ? (
                    <>
                      {" "}
                      <Link href={item.href} className="text-link">
                        Set this up
                      </Link>
                    </>
                  ) : null}
                  {!item.done && !item.href ? <span className="text-slate"> (set in hosting environment variables)</span> : null}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="block rounded-[4px] border border-sage bg-white p-5 text-ink no-underline hover:border-evergreen">
            <dt className="text-[0.9375rem] text-slate">{stat.label}</dt>
            <dd className="mt-2 font-serif text-[2rem] leading-none">{stat.value}</dd>
          </Link>
        ))}
      </dl>

      <div className="mt-8 grid gap-8 xl:grid-cols-2">
        <Panel>
          <div className="flex items-center justify-between border-b border-sage px-5 py-4">
            <h2 className="text-[1.375rem] text-ink">Latest leads</h2>
            <Link href="/admin/leads" className="text-link text-[0.9375rem]">
              All leads
            </Link>
          </div>
          <ul className="divide-y divide-sage">
            {((recentLeads.data ?? []) as Pick<Lead, "id" | "created_at" | "full_name" | "organization" | "interest" | "status" | "source" | "call_format" | "preferred_date">[]).map((lead) => (
              <li key={lead.id}>
                <Link href={`/admin/leads/${lead.id}`} className="flex items-start justify-between gap-4 px-5 py-4 text-ink no-underline hover:bg-mist">
                  <span>
                    <span className="block font-semibold">{lead.full_name}</span>
                    {isTimeRequest(lead.source) && lead.preferred_date ? (
                      <span className="block text-[0.9375rem] text-ink">
                        {timeRequestLabels[lead.source]}: {formatCallDate(lead.preferred_date, true)}
                      </span>
                    ) : null}
                    <span className="block text-[0.9375rem] text-slate">
                      {[lead.organization, lead.interest].filter(Boolean).join(", ") || "No details given"}
                    </span>
                    <span className="block text-[0.8125rem] text-slate">{formatDateTime(lead.created_at)}</span>
                  </span>
                  <StatusBadge status={lead.status} label={leadStatusLabels[lead.status]} />
                </Link>
              </li>
            ))}
            {(recentLeads.data ?? []).length === 0 ? (
              <li className="px-5 py-8 text-slate">No leads yet. Contact form messages and meeting requests will appear here.</li>
            ) : null}
          </ul>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between border-b border-sage px-5 py-4">
            <h2 className="text-[1.375rem] text-ink">Latest orders</h2>
            <Link href="/admin/orders" className="text-link text-[0.9375rem]">
              All orders
            </Link>
          </div>
          <ul className="divide-y divide-sage">
            {orderRows.slice(0, 5).map((order) => (
              <li key={order.id} className="flex items-start justify-between gap-4 px-5 py-4">
                <span>
                  <span className="block font-semibold">{order.package_name}</span>
                  <span className="block text-[0.9375rem] text-slate">{order.customer_name || order.customer_email}</span>
                  <span className="block text-[0.8125rem] text-slate">{formatDateTime(order.created_at)}</span>
                </span>
                <span className="text-right">
                  <span className="block font-semibold">{formatUsd(order.amount_cents)}</span>
                  <StatusBadge status={order.status} label={orderStatusLabels[order.status]} />
                </span>
              </li>
            ))}
            {orderRows.length === 0 ? (
              <li className="px-5 py-8 text-slate">No orders yet. Purchases made through checkout will appear here.</li>
            ) : null}
          </ul>
        </Panel>
      </div>
    </>
  );
}
