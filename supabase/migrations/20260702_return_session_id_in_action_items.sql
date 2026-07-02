create or replace function public.get_organization_client_action_items(
  p_organization_client_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_items jsonb;
begin
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'organization_client_id', organization_client_id,
        'coaching_session_id', coaching_session_id,
        'title', title,
        'description', description,
        'status', status,
        'due_date', due_date,
        'created_at', created_at,
        'updated_at', updated_at
      )
      order by created_at desc
    ),
    '[]'::jsonb
  )
  into v_items
  from organization_client_action_items
  where organization_client_id = p_organization_client_id;

  return v_items;
end;
$$;