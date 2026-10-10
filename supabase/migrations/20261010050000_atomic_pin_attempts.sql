-- Makes the admin PIN lockout race-free. Before, the app counted recent failures and recorded the
-- attempt afterwards, so many requests sent at once could all pass the check. This function takes a
-- lock, checks both limits and records the attempt in one transaction. The attempt counts as a
-- failure until the app marks it as succeeded.

create or replace function public.reserve_admin_login_attempt(
  p_ip text,
  p_window_minutes integer,
  p_max_per_ip integer,
  p_max_total integer
)
returns table (attempt_id bigint, ip_failures integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_since timestamptz := now() - make_interval(mins => p_window_minutes);
  v_ip text := left(coalesce(p_ip, ''), 100);
  v_total integer;
  v_ip_count integer;
  v_id bigint;
begin
  -- One sign-in check at a time; the lock is released when the transaction ends.
  perform pg_advisory_xact_lock(hashtext('public.admin_login_attempts'));

  select count(*) into v_total
  from public.admin_login_attempts
  where succeeded = false and created_at >= v_since;

  select count(*) into v_ip_count
  from public.admin_login_attempts
  where ip = v_ip and succeeded = false and created_at >= v_since;

  if v_total >= p_max_total or v_ip_count >= p_max_per_ip then
    return; -- locked out: no row
  end if;

  insert into public.admin_login_attempts (ip, succeeded)
  values (v_ip, false)
  returning id into v_id;

  return query select v_id, v_ip_count + 1;
end;
$$;

revoke all on function public.reserve_admin_login_attempt(text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.reserve_admin_login_attempt(text, integer, integer, integer) to service_role;
