create or replace function public.get_organization_client_meetings(
  p_organization_client_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client organization_clients;
  v_member organization_members;
  v_meetings jsonb;
begin
  select *
  into v_client
  from organization_clients
  where id = p_organization_client_id
    and status = 'active';

  if v_client.id is null then
    raise exception 'Client relationship not found.';
  end if;

  select *
  into v_member
  from organization_members
  where organization_id = v_client.organization_id
    and user_id = auth.uid()
    and status = 'active'
    and (
      id = v_client.assigned_member_id
      or role in ('owner', 'admin')
    );

  if v_member.id is null then
    raise exception 'Not allowed.';
  end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', m.id,
        'meeting_date', m.meeting_date,
        'title', m.title,
        'summary', m.summary,
        'follow_up', m.follow_up,
        'created_at', m.created_at,
        'updated_at', m.updated_at
      )
      order by m.meeting_date desc
    ),
    '[]'::jsonb
  )
  into v_meetings
  from organization_client_meetings m
  where m.organization_client_id = v_client.id;

  return v_meetings;
end;
$$;