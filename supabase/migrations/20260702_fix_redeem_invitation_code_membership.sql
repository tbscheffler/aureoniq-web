create or replace function public.redeem_invitation_code(
  p_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_code invitation_codes;
  v_user_id uuid;
  v_org organizations;
  v_beta_expires_at timestamptz;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'User not signed in.';
  end if;

  select *
  into v_code
  from invitation_codes
  where upper(code) = upper(trim(p_code))
    and active = true;

  if v_code.id is null then
    raise exception 'Invalid invitation code.';
  end if;

  if v_code.expires_at is not null and v_code.expires_at < now() then
    raise exception 'Invitation code has expired.';
  end if;

  if v_code.redemptions >= v_code.max_redemptions then
    raise exception 'Invitation code has reached its redemption limit.';
  end if;

  insert into organizations (
    name,
    type,
    created_by
  )
  values (
    'My Coaching Practice',
    'coach',
    v_user_id
  )
  returning * into v_org;

  insert into organization_members (
    organization_id,
    user_id,
    role,
    status
  )
  values (
    v_org.id,
    v_user_id,
    'owner',
    'active'
  );

  v_beta_expires_at :=
    now() + make_interval(days => v_code.beta_expires_after_days);

  insert into organization_plans (
    organization_id,
    plan_type,
    managed_client_limit,
    sponsored_tier,
    status,
    trial_ends_at,
    current_period_ends_at
  )
  values (
    v_org.id,
    v_code.plan_type,
    v_code.managed_client_limit,
    'aiq_pro',
    'active',
    v_beta_expires_at,
    v_beta_expires_at
  );

insert into user_roles (
  user_id,
  role
)
select
  v_user_id,
  'coach'
where not exists (
  select 1
  from user_roles
  where user_id = v_user_id
    and role = 'coach'
);

  insert into invitation_code_redemptions (
    invitation_code_id,
    organization_id,
    redeemed_by,
    beta_access_expires_at
  )
  values (
    v_code.id,
    v_org.id,
    v_user_id,
    v_beta_expires_at
  );

  update invitation_codes
  set
    redemptions = redemptions + 1,
    updated_at = now()
  where id = v_code.id;

  return jsonb_build_object(
    'success', true,
    'organization_id', v_org.id,
    'plan_type', v_code.plan_type,
    'managed_client_limit', v_code.managed_client_limit,
    'beta_access_expires_at', v_beta_expires_at
  );
end;
$$;