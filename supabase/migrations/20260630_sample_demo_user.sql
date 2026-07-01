create or replace function public.ensure_sample_client_for_organization(
  p_organization_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sample_user_id uuid := '056782ef-5b2e-45de-8cc2-3a4756aa0390';
  v_owner_member_id uuid;
  v_client_id uuid;
begin
  select id
  into v_owner_member_id
  from public.organization_members
  where organization_id = p_organization_id
    and status = 'active'
  order by
    case when role = 'owner' then 0 else 1 end,
    created_at asc
  limit 1;

  if v_owner_member_id is null then
    raise exception 'No active organization member found for organization %', p_organization_id;
  end if;

  insert into public.organization_clients (
    organization_id,
    coach_user_id,
    client_user_id,
    status,
    access_level,
    sponsored_tier,
    assigned_member_id,
    client_display_name,
    is_sample
  )
  values (
    p_organization_id,
    auth.uid(),
    v_sample_user_id,
    'active',
    'reports_and_notes',
    'aiq_pro',
    v_owner_member_id,
    'Sample Client',
    true
  )
  on conflict (organization_id, client_user_id)
  do update set
    status = 'active',
    is_sample = true,
    client_display_name = 'Sample Client',
    updated_at = now()
  returning id into v_client_id;

  insert into public.organization_client_notes (
    organization_id,
    organization_client_id,
    author_member_id,
    note
  )
  values (
    p_organization_id,
    v_client_id,
    v_owner_member_id,
    'Sample note: This client is here to help you explore the AureonIQ coach workspace. Use notes to capture coaching observations, session themes, and next-step context.'
  )
  on conflict do nothing;

  insert into public.organization_client_meetings (
    organization_id,
    organization_client_id,
    created_by_member_id,
    meeting_date,
    title,
    summary,
    follow_up
  )
  values (
    p_organization_id,
    v_client_id,
    v_owner_member_id,
    now() + interval '2 days',
    'Sample Discovery Session',
    'Review the client career profile, identify hidden opportunities, and discuss next steps.',
    'Prepare three recommended career paths and one action item before the next session.'
  )
  on conflict do nothing;

  insert into public.organization_client_action_items (
    organization_id,
    organization_client_id,
    created_by_member_id,
    title,
    description,
    due_date
  )
  values (
    p_organization_id,
    v_client_id,
    v_owner_member_id,
    'Review sample career assessment',
    'Open the sample client workspace and review how assessment, AIQ, notes, meetings, and action items work together.',
    current_date + 3
  )
  on conflict do nothing;

  return v_client_id;
end;
$$;