create or replace function public.accept_organization_member_invitation(
  invite_token text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation organization_member_invitations;
begin
  select *
  into v_invitation
  from organization_member_invitations
  where token = invite_token
    and status = 'pending'
    and expires_at > now();

  if v_invitation.id is null then
    raise exception 'Team invitation not found or expired.';
  end if;

  insert into organization_members (
    organization_id,
    user_id,
    role,
    status
  )
  values (
    v_invitation.organization_id,
    auth.uid(),
    v_invitation.role,
    'active'
  )
  on conflict (organization_id, user_id)
  do update set
    role = excluded.role,
    status = 'active';

  update organization_member_invitations
  set status = 'accepted',
      accepted_at = now(),
      accepted_user_id = auth.uid()
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
    'organization_member_invitation_accepted',
    jsonb_build_object(
      'invitation_id', v_invitation.id,
      'role', v_invitation.role
    )
  );
end;
$$;