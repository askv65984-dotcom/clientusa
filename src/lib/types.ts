export const BILLING_TYPES = ["one_time", "monthly", "custom"] as const;
export type Billing = (typeof BILLING_TYPES)[number];

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const ORDER_STATUSES = ["pending", "paid", "active", "canceled", "refunded", "failed"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Package = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  duration_label: string;
  billing: Billing;
  price_cents: number | null;
  features: string[];
  badge: string;
  cta_label: string;
  sort_order: number;
  is_active: boolean;
};

export type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  interest: string;
  message: string;
  status: LeadStatus;
  notes: string;
  /** contact_form or booking_form (call requests from /book). */
  source: string;
  call_format: "" | "phone" | "video";
  preferred_date: string | null;
  preferred_window: "" | "morning" | "midday" | "afternoon";
  time_zone: string;
  other_times: string;
};

export type Order = {
  id: string;
  created_at: string;
  package_name: string;
  billing: Billing;
  amount_cents: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  organization: string;
  status: OrderStatus;
  stripe_checkout_session_id: string;
  stripe_subscription_id: string | null;
  stripe_payment_intent_id: string | null;
};

/** Settings the public site can read. */
export type SiteSettings = {
  contact_email: string;
  contact_phone: string;
  office_hours: string;
  linkedin_url: string;
  /** The package sold on the Book a consultation page. */
  consultation_package_id: string | null;
};

/** Admin also sees the booking link, which visitors only get after paying. */
export type AdminSettings = SiteSettings & { scheduling_url: string };

export const SETTINGS_COLUMNS = "contact_email, contact_phone, office_hours, linkedin_url, consultation_package_id";
export const ADMIN_SETTINGS_COLUMNS = `scheduling_url, ${SETTINGS_COLUMNS}`;

export const PACKAGE_COLUMNS =
  "id, slug, name, summary, duration_label, billing, price_cents, features, badge, cta_label, sort_order, is_active";
