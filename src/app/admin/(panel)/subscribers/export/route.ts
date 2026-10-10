import { requireAdmin } from "@/lib/auth";

/** Downloads the newsletter list as a CSV file. Admins only. */
export async function GET() {
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("subscribers")
    .select("email, created_at")
    .order("created_at", { ascending: true });
  if (error) return new Response(`Could not export subscribers: ${error.message}`, { status: 500 });

  // Quote every cell, and neutralize leading characters spreadsheets treat as formulas.
  const escape = (value: string) => `"${value.replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`;
  const rows = (data ?? []).map((row) => [escape(row.email), escape(row.created_at)].join(","));
  const csv = ["email,subscribed_at", ...rows].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="anoka-advisors-subscribers.csv"',
      "Cache-Control": "no-store",
    },
  });
}
