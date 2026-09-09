CREATE OR REPLACE FUNCTION public.accept_organization_invitation(invite_token text, client_display_name_input text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_invitation organization_invitations;
  v_member_id uuid;
  v_org_client_id uuid;
  v_user_id uuid := auth.uid();
  v_email text;
  v_confirmed_at timestamptz;
  v_organization_id uuid;
  v_seat_limit integer;
  v_used_seats integer;
begin
  if v_user_id is null then
    raise exception 'Please sign in before accepting this invitation.';
  end if;
  select email, email_confirmed_at into v_email, v_confirmed_at
  from auth.users where id = v_user_id;
  if v_email is null or v_confirmed_at is null then
    raise exception 'Please verify your email before accepting this invitation.';
  end if;

  select organization_id into v_organization_id
  from public.organization_invitations where token = invite_token;
  if v_organization_id is null then
    raise exception 'Invitation not found or expired.';
  end if;
  -- One acceptance per organization at a time, including different tokens.
  perform 1 from public.organizations where id = v_organization_id for update;

  select *
  into v_invitation
  from organization_invitations
  where token = invite_token
    and status = 'pending'
    and expires_at > now()
  for update;

  if v_invitation.id is null then
    raise exception 'Invitation not found or expired.';
  end if;

  if lower(trim(v_email)) is distinct from lower(trim(v_invitation.client_email)) then
    raise exception 'Please sign in with the email address your coach invited.';
  end if;

  select id
  into v_member_id
  from organization_members
  where organization_id = v_invitation.organization_id
    and user_id = v_invitation.invited_by
    and status = 'active'
    and role in ('owner', 'admin', 'coach')
  limit 1
  for share;

  if v_member_id is null then
    raise exception 'Inviting coach is no longer an active organization member.';
  end if;

  select managed_client_limit into v_seat_limit
  from public.organization_plans
  where organization_id = v_organization_id and status = 'active'
  order by created_at desc, id
  limit 1 for share;
  if coalesce(v_seat_limit, 0) <= 0 then
    raise exception 'Your coach needs an active client plan before this invitation can be accepted.';
  end if;

  -- Existing real clients already occupy a seat. Samples do not.
  if not exists (
    select 1 from public.organization_clients
    where organization_id = v_organization_id and client_user_id = v_user_id
      and status = 'active' and coalesce(is_sample, false) = false
  ) then
    select count(*) into v_used_seats from public.organization_clients
    where organization_id = v_organization_id and status = 'active'
      and coalesce(is_sample, false) = false;
    if v_used_seats >= v_seat_limit then
      raise exception 'Your coach has no available client seats. Please ask them to free a seat or upgrade their plan.';
    end if;
  end if;

  insert into organization_clients (
    organization_id,
    coach_user_id,
    client_user_id,
    assigned_member_id,
    status,
    access_level,
    sponsored_tier,
    started_at,
    ended_at,
    ended_by,
    client_display_name,
    is_sample
  )
  values (
    v_invitation.organization_id,
    v_invitation.invited_by,
    auth.uid(),
    v_member_id,
    'active',
    'reports_only',
    'aiq_pro',
    now(),
    null,
    null,
    nullif(trim(client_display_name_input), ''),
    false
  )
  on conflict (organization_id, client_user_id)
  do update set
    coach_user_id = excluded.coach_user_id,
    assigned_member_id = excluded.assigned_member_id,
    status = 'active',
    access_level = excluded.access_level,
    sponsored_tier = excluded.sponsored_tier,
    ended_at = null,
    ended_by = null,
    client_display_name = coalesce(excluded.client_display_name, organization_clients.client_display_name),
    is_sample = false
  returning id into v_org_client_id;

  insert into user_sponsored_entitlements (
    user_id,
    organization_id,
    organization_client_id,
    tier,
    status,
    starts_at,
    ends_at
  )
  values (
    auth.uid(),
    v_invitation.organization_id,
    v_org_client_id,
    'aiq_pro',
    'active',
    now(),
    null
  )
  on conflict (user_id, organization_id, organization_client_id)
  do update set
    tier = excluded.tier,
    status = 'active',
    starts_at = coalesce(user_sponsored_entitlements.starts_at, excluded.starts_at),
    ends_at = null;

  update organization_invitations
  set status = 'accepted',
      accepted_at = now(),
      client_user_id = auth.uid()
  where id = v_invitation.id;

  insert into access_audit_log (
    actor_user_id,
    organization_id,
    target_user_id,
    action,
    metadata
  )
  values (
    auth.uid(),
    v_invitation.organization_id,
    auth.uid(),
    'organization_invitation_accepted',
    jsonb_build_object(
      'invitation_id', v_invitation.id,
      'organization_client_id', v_org_client_id,
      'client_display_name', nullif(trim(client_display_name_input), '')
    )
  );
end;
$function$;

-- Keep the established RPC signature; only signed-in clients may call it.
revoke execute on function public.accept_organization_invitation(text, text) from public, anon;
grant execute on function public.accept_organization_invitation(text, text) to authenticated;
