import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/admin/lead-form";
import { AdminHeading, Panel, StatusBadge, leadStatusLabels } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { callFormatLabels, formatCallDate, isTimeRequest, isUsTimeZone, timeRequestLabels, timeWindows, timeZoneLabels } from "@/lib/booking";
import { formatDateTime, telHref } from "@/lib/format";
import type { Lead } from "@/lib/types";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Lead" };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** A prefilled Google Calendar event at the start of the requested window, with the visitor as a guest. */
function calendarLink(lead: Lead) {
  if (!lead.preferred_date || !lead.preferred_window) return null;
  const day = lead.preferred_date.replaceAll("-", "");
  const start = timeWindows[lead.preferred_window].start;
  const end = `${start.slice(0, 2)}3000`;
  const details = [
    lead.call_format ? callFormatLabels[lead.call_format] : "",
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.organization ? `Organization: ${lead.organization}` : "",
    lead.other_times ? `Other times: ${lead.other_times}` : "",
    lead.message.slice(0, 500),
  ].filter(Boolean);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${lead.source === "paid_booking" ? "Video session" : "Initial consultation"} with ${lead.full_name}`,
    dates: `${day}T${start}/${day}T${end}`,
    details: details.join("\n"),
    add: lead.email,
  });
  if (isUsTimeZone(lead.time_zone)) params.set("ctz", lead.time_zone);
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  const { supabase } = await requireAdmin();
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const { data, error } = await supabase
    .from("leads")
    .select("id, created_at, full_name, email, phone, organization, interest, message, status, notes, source, call_format, preferred_date, preferred_window, time_zone, other_times")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Could not load lead: ${error.message}`);
  if (!data) notFound();
  const lead = data as Lead;

  const isCall = isTimeRequest(lead.source);
  const replySubject = encodeURIComponent(isCall ? "Your meeting with Anoka Advisors" : "Your message to Anoka Advisors");
  const addToCalendar = isCall ? calendarLink(lead) : null;

  return (
    <>
      <Link href="/admin/leads" className="text-link text-[0.9375rem]">
        Back to leads
      </Link>
      <div className="mt-4">
        <AdminHeading
          title={lead.full_name}
          description={`Received ${formatDateTime(lead.created_at)}`}
          actions={
            <>
              {addToCalendar ? (
                <a href={addToCalendar} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  Add to Google Calendar
                </a>
              ) : null}
              <a href={`mailto:${lead.email}?subject=${replySubject}`} className="btn btn-primary">
                Reply by email
              </a>
            </>
          }
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <Panel className="p-6">
          {isCall ? (
            <section aria-labelledby="requested-call" className="mb-8 rounded-lg border border-sage bg-mist/60 p-5">
              <h2 id="requested-call" className="text-[1.375rem] text-ink">
                Requested meeting: {timeRequestLabels[lead.source].toLowerCase()}
              </h2>
              {lead.source === "paid_booking" ? (
                <p className="mt-1 text-[0.9375rem] text-slate">Sent after payment. The matching purchase is under Orders.</p>
              ) : null}
              <dl className="mt-4 grid gap-5 sm:grid-cols-2">
                <div>
                  <dt className="text-[0.875rem] text-slate">Format</dt>
                  <dd className="font-semibold">{lead.call_format ? callFormatLabels[lead.call_format] : "Not given"}</dd>
                </div>
                <div>
                  <dt className="text-[0.875rem] text-slate">Day</dt>
                  <dd className="font-semibold">{lead.preferred_date ? formatCallDate(lead.preferred_date) : "Not given"}</dd>
                </div>
                <div>
                  <dt className="text-[0.875rem] text-slate">Time</dt>
                  <dd className="font-semibold">
                    {lead.preferred_window
                      ? `${timeWindows[lead.preferred_window].name}, ${timeWindows[lead.preferred_window].hours}`
                      : "Not given"}
                    {isUsTimeZone(lead.time_zone) ? <span className="block font-normal text-slate">{timeZoneLabels[lead.time_zone]}</span> : null}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.875rem] text-slate">Other times that work</dt>
                  <dd>{lead.other_times || <span className="text-slate">None given</span>}</dd>
                </div>
              </dl>
            </section>
          ) : null}
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-[0.875rem] text-slate">Email</dt>
              <dd>
                <a href={`mailto:${lead.email}`} className="text-link break-all">
                  {lead.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-slate">Phone</dt>
              <dd>
                {lead.phone ? (
                  <a href={telHref(lead.phone)} className="text-link">
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-slate">Not given</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-slate">Organization</dt>
              <dd>{lead.organization || <span className="text-slate">Not given</span>}</dd>
            </div>
            <div>
              <dt className="text-[0.875rem] text-slate">Interested in</dt>
              <dd>{lead.interest || <span className="text-slate">Not given</span>}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-[0.875rem] text-slate">Current status</dt>
              <dd className="mt-1">
                <StatusBadge status={lead.status} label={leadStatusLabels[lead.status]} />
              </dd>
            </div>
          </dl>
          <h2 className="mt-8 border-t border-sage pt-6 text-[1.375rem] text-ink">{isCall ? "What they want to talk about" : "Message"}</h2>
          {lead.message ? <p className="mt-3 whitespace-pre-wrap">{lead.message}</p> : <p className="mt-3 text-slate">No details given.</p>}
        </Panel>

        <Panel className="p-6">
          <h2 className="mb-5 text-[1.375rem] text-ink">Follow-up</h2>
          <LeadForm lead={lead} />
        </Panel>
      </div>
    </>
  );
}
