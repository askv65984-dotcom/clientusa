-- The Book a consultation page now offers two options:
--   1. An initial consultation, requested through the form (leads.source = 'booking_form').
--   2. The paid Operations Diagnostic: checkout, then Calendly. Until a Calendly link is set,
--      paying customers request a time through the same form (leads.source = 'paid_booking').

drop policy "Visitors can send the contact or booking form" on public.leads;

create policy "Visitors can send the contact or booking form" on public.leads
  for insert to anon, authenticated
  with check (
    status = 'new'
    and notes = ''
    and (
      (
        source = 'contact_form'
        and char_length(message) >= 1
        and call_format = ''
        and preferred_date is null
        and preferred_window = ''
        and time_zone = ''
        and other_times = ''
      )
      or (
        source in ('booking_form', 'paid_booking')
        and call_format <> ''
        and preferred_date is not null
        and preferred_window <> ''
        and time_zone <> ''
      )
    )
  );

-- The paid option is the Operations Diagnostic. The separate video consultation package is hidden,
-- not deleted, so it can be switched back on in admin.
update public.site_settings
set consultation_package_id = (select id from public.packages where slug = 'operations-diagnostic')
where id = 1
  and exists (select 1 from public.packages where slug = 'operations-diagnostic');

update public.packages set is_active = false where slug = 'video-consultation';
