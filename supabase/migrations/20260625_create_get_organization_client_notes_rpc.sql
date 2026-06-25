create or replace function public.get_organization_client_notes(
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
  v_notes jsonb;
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
        'id', n.id,
        'note', n.note,
        'visibility', n.visibility,
        'created_at', n.created_at,
        'updated_at', n.updated_at
      )
      order by n.created_at desc
    ),
    '[]'::jsonb
  )
  into v_notes
  from organization_client_notes n
  where n.organization_client_id = v_client.id;

  return v_notes;
end;
$$;