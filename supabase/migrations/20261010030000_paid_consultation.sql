-- Consultations are paid. The Book a consultation page sells one package, chosen in admin settings,
-- and the booking link is shown only after payment, so it is no longer readable with the public key.

insert into public.packages (slug, name, summary, duration_label, billing, price_cents, features, badge, cta_label, sort_order)
values (
  'video-consultation',
  'Video Consultation',
  'A one-to-one video meeting with a senior consultant to talk through your operational question and agree clear next steps.',
  '60-minute video meeting',
  'one_time',
  25000,
  array[
    'One-to-one video meeting with a senior consultant',
    'Choose your time on our calendar right after payment',
    'A few short questions beforehand so we can prepare',
    'A clear recommendation on next steps'
  ],
  '',
  'Pay and book',
  0
)
on conflict (slug) do nothing;

alter table public.site_settings
  add column consultation_package_id uuid references public.packages (id) on delete set null;

update public.site_settings
set consultation_package_id = (select id from public.packages where slug = 'video-consultation')
where id = 1;

-- Visitors can read everything except the booking link.
revoke select on public.site_settings from anon;
grant select (id, contact_email, contact_phone, office_hours, linkedin_url, consultation_package_id, updated_at)
  on public.site_settings to anon;
