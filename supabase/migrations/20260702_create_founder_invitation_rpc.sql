create or replace function public.create_founder_invitation_code(
  p_coach_name text default null,
  p_coach_email text default null,
  p_plan_type text default 'coach_professional',
  p_managed_client_limit integer default 25,
  p_max_redemptions integer default 1,
  p_beta_expires_after_days integer default 90,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code text;
  v_invite invitation_codes;
begin
  if not exists (
    select 1
    from user_roles
    where user_id = auth.uid()
      and role = 'founder'
  ) then
    raise exception 'Not allowed.';
  end if;

  v_code := 'AIQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into invitation_codes (
    code,
    purpose,
    plan_type,
    managed_client_limit,
    max_redemptions,
    beta_expires_after_days,
    active,
    coach_name,
    coach_email,
    notes
  )
  values (
    v_code,
    'founding_coach',
    p_plan_type,
    p_managed_client_limit,
    p_max_redemptions,
    p_beta_expires_after_days,
    true,
    nullif(trim(p_coach_name), ''),
    nullif(trim(p_coach_email), ''),
    nullif(trim(p_notes), '')
  )
  returning * into v_invite;

  return to_jsonb(v_invite);
end;
$$;