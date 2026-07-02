create or replace function public.get_organization_client_coaching_session(
  p_session_id uuid
)
returns jsonb
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

  return jsonb_build_object(
    'id', v_session.id,
    'organization_id', v_session.organization_id,
    'organization_client_id', v_session.organization_client_id,
    'created_by_member_id', v_session.created_by_member_id,
    'title', v_session.title,
    'status', v_session.status,
    'scheduled_for', v_session.scheduled_for,
    'started_at', v_session.started_at,
    'completed_at', v_session.completed_at,
    'meeting_type', v_session.meeting_type,
    'location', v_session.location,
    'session_notes', v_session.session_notes,
    'created_at', v_session.created_at,
    'updated_at', v_session.updated_at
  );
end;
$$;