import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeading, EmptyRow, Notice, Panel, StatusBadge, leadStatusLabels, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatCallDate, isTimeRequest, timeRequestLabels, timeWindows } from "@/lib/booking";
import { formatDateTime } from "@/lib/format";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Leads" };

export default async function AdminLeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  const { supabase } = await requireAdmin();
  const { status, deleted } = await searchParams;
  const filter = LEAD_STATUSES.includes(status as LeadStatus) ? (status as LeadStatus) : null;

  let query = supabase
    .from("leads")
    .select("id, created_at, full_name, email, organization, interest, status, source, call_format, preferred_date, preferred_window")
    .order("created_at", { ascending: false })
    .limit(500);
  if (filter) query = query.eq("status", filter);

  const { data, error } = await query;
  if (error) throw new Error(`Could not load leads: ${error.message}`);
  const leads = (data ?? []) as Pick<
    Lead,
    "id" | "created_at" | "full_name" | "email" | "organization" | "interest" | "status" | "source" | "call_format" | "preferred_date" | "preferred_window"
  >[];

  const tabs: { label: string; value: LeadStatus | null }[] = [
    { label: "All", value: null },
    ...LEAD_STATUSES.map((value) => ({ label: leadStatusLabels[value], value })),
  ];

  return (
    <>
      <AdminHeading title="Leads" description="Contact form messages, initial consultation requests and time requests from paying customers. Open one to update its status or add notes." />
      {deleted ? <Notice tone="success">Lead deleted.</Notice> : null}

      <nav aria-label="Filter leads by status" className="mb-5 overflow-x-auto">
        <ul className="flex gap-2">
          {tabs.map((tab) => {
            const active = tab.value === filter;
            return (
              <li key={tab.label}>
                <Link
                  href={tab.value ? `/admin/leads?status=${tab.value}` : "/admin/leads"}
                  aria-current={active ? "page" : undefined}
                  className="inline-flex min-h-9 items-center rounded-full border border-sage bg-white px-3.5 text-[0.9375rem] whitespace-nowrap text-ink no-underline hover:border-evergreen aria-[current=page]:border-evergreen aria-[current=page]:bg-evergreen aria-[current=page]:text-white"
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[52rem] border-collapse">
          <thead className="border-b border-sage bg-mist/60">
            <tr>
              <th scope="col" className={th}>
                Received
              </th>
              <th scope="col" className={th}>
                Name
              </th>
              <th scope="col" className={th}>
                Request
              </th>
              <th scope="col" className={th}>
                Organization
              </th>
              <th scope="col" className={th}>
                Interest
              </th>
              <th scope="col" className={th}>
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-mist/50">
                <td className={`${td} text-[0.9375rem] whitespace-nowrap text-slate`}>{formatDateTime(lead.created_at)}</td>
                <td className={td}>
                  <Link href={`/admin/leads/${lead.id}`} className="font-semibold text-ink underline decoration-sage hover:decoration-evergreen">
                    {lead.full_name}
                  </Link>
                  <span className="block text-[0.875rem] break-all text-slate">{lead.email}</span>
                </td>
                <td className={td}>
                  {isTimeRequest(lead.source) && lead.preferred_date ? (
                    <>
                      <span className="font-semibold text-ink">{timeRequestLabels[lead.source]}</span>
                      <span className="block text-[0.875rem] whitespace-nowrap text-slate">
                        {formatCallDate(lead.preferred_date, true)}
                        {lead.preferred_window ? `, ${timeWindows[lead.preferred_window].name.toLowerCase()}` : ""}
                      </span>
                    </>
                  ) : (
                    "Message"
                  )}
                </td>
                <td className={td}>{lead.organization || <span className="text-slate">Not given</span>}</td>
                <td className={td}>{lead.interest || <span className="text-slate">Not given</span>}</td>
                <td className={td}>
                  <StatusBadge status={lead.status} label={leadStatusLabels[lead.status]} />
                </td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <EmptyRow colSpan={6}>{filter ? "No leads with this status." : "No leads yet. Contact form messages and meeting requests will appear here."}</EmptyRow>
            ) : null}
          </tbody>
        </table>
      </Panel>
    </>
  );
}
