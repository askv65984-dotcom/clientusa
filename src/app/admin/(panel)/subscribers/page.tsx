import type { Metadata } from "next";
import { deleteSubscriber } from "@/app/admin/actions";
import { AdminHeading, EmptyRow, Panel, td, th } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

// Admin pages read the signed-in session on every request.
export const instant = false;

export const metadata: Metadata = { title: "Subscribers" };

export default async function AdminSubscribersPage() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("subscribers")
    .select("id, created_at, email")
    .order("created_at", { ascending: false })
    .limit(2000);
  if (error) throw new Error(`Could not load subscribers: ${error.message}`);
  const subscribers = (data ?? []) as { id: string; created_at: string; email: string }[];

  return (
    <>
      <AdminHeading
        title="Subscribers"
        description="People who signed up for the newsletter in the website footer. Export the list to import it into your email tool."
        actions={
          <a href="/admin/subscribers/export" className="btn btn-primary">
            Export CSV
          </a>
        }
      />
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse">
          <thead className="border-b border-sage bg-mist/60">
            <tr>
              <th scope="col" className={th}>
                Email
              </th>
              <th scope="col" className={th}>
                Subscribed
              </th>
              <th scope="col" className={th}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id}>
                <td className={`${td} break-all`}>
                  <a href={`mailto:${subscriber.email}`} className="text-ink underline decoration-sage hover:decoration-evergreen">
                    {subscriber.email}
                  </a>
                </td>
                <td className={`${td} text-[0.9375rem] whitespace-nowrap text-slate`}>{formatDateTime(subscriber.created_at)}</td>
                <td className={`${td} text-right`}>
                  <form action={deleteSubscriber}>
                    <input type="hidden" name="id" value={subscriber.id} />
                    <button type="submit" className="text-[0.9375rem] font-semibold text-danger underline decoration-danger/40 hover:decoration-danger">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 ? <EmptyRow colSpan={3}>No subscribers yet. Sign-ups from the website footer will appear here.</EmptyRow> : null}
          </tbody>
        </table>
      </Panel>
      <p className="mt-4 text-[0.9375rem] text-slate">{subscribers.length} subscribers.</p>
    </>
  );
}
