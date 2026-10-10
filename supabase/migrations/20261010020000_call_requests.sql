-- Call requests from the built-in booking form on /book, shown when no booking link is set in admin.
-- They are stored as leads with source 'booking_form' so they share the leads inbox.

alter table public.leads
  add column call_format text not null default '' check (call_format in ('', 'phone', 'video')),
  add column preferred_date date,
  add column preferred_window text not null default '' check (preferred_window in ('', 'morning', 'midday', 'afternoon')),
  add column time_zone text not null default '' check (char_length(time_zone) <= 64),
  add column other_times text not null default '' check (char_length(other_times) <= 300);

-- A call request may come without a message; the contact form still requires one (checked below).
alter table public.leads drop constraint leads_message_check;
alter table public.leads add constraint leads_message_check check (char_length(message) <= 5000);

drop policy "Visitors can send the contact form" on public.leads;

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
        source = 'booking_form'
        and call_format <> ''
        and preferred_date is not null
        and preferred_window <> ''
        and time_zone <> ''
      )
    )
  );
