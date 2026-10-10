import type { ReactNode } from "react";
import type { LeadStatus, OrderStatus } from "@/lib/types";

export function AdminHeading({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[2.25rem] leading-tight text-ink">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-slate">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[4px] border border-sage bg-white ${className}`}>{children}</div>;
}

export function Notice({ tone, children }: { tone: "success" | "error" | "info"; children: ReactNode }) {
  const styles = {
    success: "border-success bg-success-tint",
    error: "border-danger bg-danger-tint",
    info: "border-evergreen bg-white",
  }[tone];
  return (
    <p role={tone === "error" ? "alert" : "status"} className={`mb-6 border-l-4 px-4 py-3 text-ink ${styles}`}>
      {children}
    </p>
  );
}

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Closed, no engagement",
};

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  active: "Active subscription",
  canceled: "Canceled",
  refunded: "Refunded",
  failed: "Payment failed",
};

const tones: Record<string, string> = {
  new: "bg-brass/15 text-[#6b4f22]",
  contacted: "bg-teal/15 text-evergreen",
  qualified: "bg-teal/15 text-evergreen",
  won: "bg-success-tint text-success",
  lost: "bg-sage/60 text-slate",
  pending: "bg-brass/15 text-[#6b4f22]",
  paid: "bg-success-tint text-success",
  active: "bg-success-tint text-success",
  canceled: "bg-sage/60 text-slate",
  refunded: "bg-sage/60 text-slate",
  failed: "bg-danger-tint text-danger",
};

export function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[0.8125rem] font-semibold whitespace-nowrap ${tones[status] ?? "bg-sage text-ink"}`}>
      {label}
    </span>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-slate">
        {children}
      </td>
    </tr>
  );
}

export const th = "px-4 py-3 text-left text-[0.8125rem] font-semibold text-slate";
export const td = "px-4 py-3.5 align-top";
