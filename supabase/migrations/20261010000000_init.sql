-- Anoka Advisors: packages, leads, orders and site settings.
-- Run once in the Supabase SQL editor (or with `supabase db push`).

-- ---------------------------------------------------------------------------
-- Admin access
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
-- No policies: admin_users is managed from the SQL editor only.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Packages (what clients can buy)
-- ---------------------------------------------------------------------------

create type public.package_billing as enum ('one_time', 'monthly', 'custom');

create table public.packages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 80),
  summary text not null default '' check (char_length(summary) <= 400),
  duration_label text not null default '' check (char_length(duration_label) <= 80),
  billing public.package_billing not null default 'one_time',
  price_cents integer check (price_cents is null or price_cents between 50 and 99999999),
  features text[] not null default '{}',
  badge text not null default '' check (char_length(badge) <= 40),
  cta_label text not null default '' check (char_length(cta_label) <= 40),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packages_price_required check (billing = 'custom' or price_cents is not null)
);

create trigger packages_set_updated_at
  before update on public.packages
  for each row execute function public.set_updated_at();

alter table public.packages enable row level security;

create policy "Active packages are public" on public.packages
  for select to anon, authenticated
  using (is_active or (select public.is_admin()));

create policy "Admins can add packages" on public.packages
  for insert to authenticated
  with check ((select public.is_admin()));

create policy "Admins can edit packages" on public.packages
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete packages" on public.packages
  for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Leads (contact form submissions)
-- ---------------------------------------------------------------------------

create type public.lead_status as enum ('new', 'contacted', 'qualified', 'won', 'lost');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text not null default '' check (char_length(phone) <= 40),
  organization text not null default '' check (char_length(organization) <= 160),
  interest text not null default '' check (char_length(interest) <= 80),
  message text not null check (char_length(message) between 1 and 5000),
  status public.lead_status not null default 'new',
  notes text not null default '' check (char_length(notes) <= 10000),
  source text not null default 'contact_form' check (char_length(source) <= 40)
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_status_idx on public.leads (status);

create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

alter table public.leads enable row level security;

create policy "Visitors can send the contact form" on public.leads
  for insert to anon, authenticated
  with check (status = 'new' and notes = '' and source = 'contact_form');

create policy "Admins can read leads" on public.leads
  for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can update leads" on public.leads
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete leads" on public.leads
  for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Orders (written by the Stripe webhook with the secret key)
-- ---------------------------------------------------------------------------

create type public.order_status as enum ('pending', 'paid', 'active', 'canceled', 'refunded', 'failed');

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  stripe_checkout_session_id text not null unique,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  stripe_subscription_id text,
  package_id uuid references public.packages (id) on delete set null,
  package_name text not null,
  billing public.package_billing not null,
  amount_cents integer not null,
  currency text not null default 'usd',
  customer_name text not null default '',
  customer_email text not null default '',
  customer_phone text not null default '',
  organization text not null default '',
  status public.order_status not null default 'pending',
  notes text not null default '' check (char_length(notes) <= 10000)
);

create index orders_created_at_idx on public.orders (created_at desc);
create index orders_subscription_idx on public.orders (stripe_subscription_id);
create index orders_payment_intent_idx on public.orders (stripe_payment_intent_id);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;

create policy "Admins can read orders" on public.orders
  for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can update orders" on public.orders
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Site settings (single row)
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  scheduling_url text not null default '' check (scheduling_url = '' or scheduling_url ~ '^https://'),
  contact_email text not null default 'info@anokaadvisors.com' check (char_length(contact_email) <= 254),
  contact_phone text not null default '' check (char_length(contact_phone) <= 40),
  office_hours text not null default '' check (char_length(office_hours) <= 120),
  linkedin_url text not null default '' check (linkedin_url = '' or linkedin_url ~ '^https://'),
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;

create policy "Settings are public" on public.site_settings
  for select to anon, authenticated
  using (true);

create policy "Admins can edit settings" on public.site_settings
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Newsletter subscribers (footer sign-up)
-- ---------------------------------------------------------------------------

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique check (char_length(email) between 3 and 254 and email = lower(email)),
  source text not null default 'footer' check (char_length(source) <= 40)
);

create index subscribers_created_at_idx on public.subscribers (created_at desc);

alter table public.subscribers enable row level security;

create policy "Visitors can subscribe" on public.subscribers
  for insert to anon, authenticated
  with check (source = 'footer');

create policy "Admins can read subscribers" on public.subscribers
  for select to authenticated
  using ((select public.is_admin()));

create policy "Admins can remove subscribers" on public.subscribers
  for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Table privileges for the Data API (RLS above still applies)
-- ---------------------------------------------------------------------------

grant select on public.packages to anon, authenticated;
grant insert, update, delete on public.packages to authenticated;
grant insert on public.leads to anon, authenticated;
grant select, update, delete on public.leads to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.site_settings to anon, authenticated;
grant update on public.site_settings to authenticated;
grant insert on public.subscribers to anon, authenticated;
grant select, delete on public.subscribers to authenticated;
grant all on public.packages, public.leads, public.orders, public.site_settings, public.admin_users, public.subscribers to service_role;

-- ---------------------------------------------------------------------------
-- Starting content (edit everything from /admin afterwards)
-- ---------------------------------------------------------------------------

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

insert into public.packages (slug, name, summary, duration_label, billing, price_cents, features, badge, cta_label, sort_order)
values
  (
    'operations-diagnostic',
    'Operations Diagnostic',
    'A focused working session on one operational problem, followed by written findings and a prioritized list of next steps.',
    '90-minute session and written summary',
    'one_time',
    49500,
    array[
      'Short intake questionnaire before the call',
      '90-minute working session by phone or video',
      'Review of the reports and documents you share in advance',
      'Written summary with prioritized recommendations within five business days',
      'One follow-up email exchange on the findings'
    ],
    'Best place to start',
    'Buy the diagnostic',
    10
  ),
  (
    'advisory-retainer',
    'Monthly Advisory Retainer',
    'Ongoing senior operations support for leaders who want a steady outside perspective while they run the work.',
    'Ongoing, billed monthly',
    'monthly',
    350000,
    array[
      'Two scheduled strategy calls each month',
      'Email and phone access on business days',
      'Review of policies, workflows, vendor proposals and KPI reports',
      'A short monthly priorities memo',
      'Priority scheduling for time-sensitive questions'
    ],
    '',
    'Start the retainer',
    20
  ),
  (
    'operations-project',
    'Focused Operations Project',
    'A defined project with a clear deliverable, such as a telehealth launch plan, a pharmacy workflow redesign or a patient access improvement plan.',
    'Typically 4 to 6 weeks',
    'one_time',
    750000,
    array[
      'Scoping call to confirm goals, deliverables and timeline',
      'Current-state assessment with staff interviews and data review',
      'Recommendations and a phased implementation roadmap',
      'Working tools such as workflow maps, checklists and SOP drafts',
      'Two progress reviews and a final briefing for your leadership team'
    ],
    '',
    'Buy the project',
    30
  )
on conflict (slug) do nothing;
