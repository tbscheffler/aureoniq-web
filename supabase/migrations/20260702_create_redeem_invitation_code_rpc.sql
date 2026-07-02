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
  v_member organization_members;
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

  select o.*
  into v_org
  from organizations o
  join organization_members om on om.organization_id = o.id
  where om.user_id = v_user_id
    and om.status = 'active'
  limit 1;

  if v_org.id is null then
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
  end if;

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
  )
  on conflict (organization_id)
  do update set
    plan_type = excluded.plan_type,
    managed_client_limit = excluded.managed_client_limit,
    sponsored_tier = excluded.sponsored_tier,
    status = 'active',
    trial_ends_at = excluded.trial_ends_at,
    current_period_ends_at = excluded.current_period_ends_at,
    updated_at = now();

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
  )
  on conflict (invitation_code_id, organization_id) do nothing;

  update invitation_codes
  set
    redemptions = redemptions + 1,
    updated_at = now()
  where id = v_code.id;

  insert into access_audit_log (
    actor_user_id,
    organization_id,
    action,
    metadata
  )
  values (
    v_user_id,
    v_org.id,
    'invitation_code_redeemed',
    jsonb_build_object(
      'code', v_code.code,
      'purpose', v_code.purpose,
      'beta_access_expires_at', v_beta_expires_at
    )
  );

  return jsonb_build_object(
    'success', true,
    'organization_id', v_org.id,
    'plan_type', v_code.plan_type,
    'managed_client_limit', v_code.managed_client_limit,
    'beta_access_expires_at', v_beta_expires_at
  );
end;
$$;