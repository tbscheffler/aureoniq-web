create or replace function public.get_coach_dashboard(
  p_organization_id uuid
)
returns jsonb
language sql
security definer
set search_path = public
as $$
select jsonb_build_object(
  'seatUsage', (
    select to_jsonb(s)
    from public.get_organization_seat_usage(p_organization_id) s
  ),
  'stats', jsonb_build_object(
    'activeClients', (
      select count(*)
      from public.organization_clients
      where organization_id = p_organization_id
        and status = 'active'
        and coalesce(is_sample, false) = false
    ),
    'demoClients', (
      select count(*)
      from public.organization_clients
      where organization_id = p_organization_id
        and status = 'active'
        and coalesce(is_sample, false) = true
    ),
    'teamMembers', (
      select count(*)
      from public.organization_members
      where organization_id = p_organization_id
        and status = 'active'
    ),
    'pendingClientInvites', (
      select count(*)
      from public.organization_invitations
      where organization_id = p_organization_id
        and status = 'pending'
    ),
    'pendingTeamInvites', (
      select count(*)
      from public.organization_member_invitations
      where organization_id = p_organization_id
        and status = 'pending'
    ),
    'notesThisWeek', (
      select count(*)
      from public.organization_client_notes
      where organization_id = p_organization_id
        and created_at >= now() - interval '7 days'
    ),
    'meetingsThisWeek', (
      select count(*)
      from public.organization_client_meetings
      where organization_id = p_organization_id
        and meeting_date >= now() - interval '7 days'
    )
  ),
  'agenda', jsonb_build_object(
    'meetingsToday', (
      select count(*)
      from public.organization_client_meetings
      where organization_id = p_organization_id
        and meeting_date >= date_trunc('day', now())
        and meeting_date < date_trunc('day', now()) + interval '1 day'
    ),
    'overdueActions', (
      select count(*)
      from public.organization_client_action_items
      where organization_id = p_organization_id
        and due_date < current_date
        and status <> 'completed'
    )
  )
);
$$;