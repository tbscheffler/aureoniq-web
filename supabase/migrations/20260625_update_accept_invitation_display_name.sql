alter table organization_clients
add column if not exists client_display_name text;





create or replace function public.accept_organization_invitation(
  invite_token uuid,
  client_display_name_input text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation organization_invitations;
  v_member_id uuid;
begin
  select *
  into v_invitation
  from organization_invitations
  where token = invite_token
    and status = 'pending'
    and expires_at > now();

  if v_invitation.id is null then
    raise exception 'Invitation not found or expired.';
  end if;

  select id
  into v_member_id
  from organization_members
  where organization_id = v_invitation.organization_id
    and user_id = v_invitation.invited_by
    and status = 'active'
  limit 1;

  insert into organization_clients (
    organization_id,
    client_user_id,
    invited_by,
    assigned_member_id,
    access_level,
    sponsored_tier,
    status,
    client_display_name
  )
  values (
    v_invitation.organization_id,
    auth.uid(),
    v_invitation.invited_by,
    v_member_id,
    'reports_only',
    'aiq_pro',
    'active',
    nullif(trim(client_display_name_input), '')
  );

  insert into user_sponsored_entitlements (
    user_id,
    organization_id,
    sponsored_tier,
    status
  )
  values (
    auth.uid(),
    v_invitation.organization_id,
    'aiq_pro',
    'active'
  );

  update organization_invitations
  set status = 'accepted',
      accepted_at = now(),
      accepted_by = auth.uid()
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
      'client_display_name', nullif(trim(client_display_name_input), '')
    )
  );
end;
$$;



drop function if exists public.accept_organization_invitation(uuid, text);
drop function if exists public.accept_organization_invitation(text, text);

create or replace function public.accept_organization_invitation(
  invite_token text,
  client_display_name_input text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation organization_invitations;
  v_member_id uuid;
begin
  select *
  into v_invitation
  from organization_invitations
  where token = invite_token
    and status = 'pending'
    and expires_at > now();

  if v_invitation.id is null then
    raise exception 'Invitation not found or expired.';
  end if;

  select id
  into v_member_id
  from organization_members
  where organization_id = v_invitation.organization_id
    and user_id = v_invitation.invited_by
    and status = 'active'
  limit 1;

  insert into organization_clients (
    organization_id,
    client_user_id,
    invited_by,
    assigned_member_id,
    access_level,
    sponsored_tier,
    status,
    client_display_name
  )
  values (
    v_invitation.organization_id,
    auth.uid(),
    v_invitation.invited_by,
    v_member_id,
    'reports_only',
    'aiq_pro',
    'active',
    nullif(trim(client_display_name_input), '')
  );

  insert into user_sponsored_entitlements (
    user_id,
    organization_id,
    sponsored_tier,
    status
  )
  values (
    auth.uid(),
    v_invitation.organization_id,
    'aiq_pro',
    'active'
  );

  update organization_invitations
  set status = 'accepted',
      accepted_at = now(),
      accepted_by = auth.uid()
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
      'client_display_name', nullif(trim(client_display_name_input), '')
    )
  );
end;
$$;