create or replace function public.update_organization_client_coaching_session_notes(
  p_session_id uuid,
  p_session_notes text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session organization_client_coaching_sessions;
  v_member organization_members;
begin
  select *
  into v_session
  from organization_client_coaching_sessions
  where id = p_session_id;

  if v_session.id is null then
    raise exception 'Session not found.';
  end if;

  select *
  into v_member
  from organization_members
  where organization_id = v_session.organization_id
    and user_id = auth.uid()
    and status = 'active'
    and (
      id = v_session.created_by_member_id
      or role in ('owner', 'admin')
    );

  if v_member.id is null then
    raise exception 'Not allowed.';
  end if;

  update organization_client_coaching_sessions
  set
    session_notes = p_session_notes,
    updated_at = now()
  where id = p_session_id;

  return true;
end;
$$;