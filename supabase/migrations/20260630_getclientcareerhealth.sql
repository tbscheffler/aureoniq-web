create or replace function public.calculate_client_health(
    p_organization_client_id uuid
)
returns table (
    score integer,
    status text
)
language plpgsql
security definer
set search_path = public
as $$
declare
    v_score integer := 0;
begin

    -- Resume uploaded
    if exists (
        select 1
        from organization_clients oc
        join resume_profiles rp
          on rp.user_id = oc.client_user_id
        where oc.id = p_organization_client_id
    ) then
        v_score := v_score + 20;
    end if;

    -- Career Assessment
    if exists (
        select 1
        from organization_clients oc
        join career_reports cr
          on cr.user_id = oc.client_user_id
        where oc.id = p_organization_client_id
    ) then
        v_score := v_score + 20;
    end if;

    -- AIQ
    if exists (
        select 1
        from organization_clients oc
        join aiq_reports ar
          on ar.user_id = oc.client_user_id
        where oc.id = p_organization_client_id
    ) then
        v_score := v_score + 20;
    end if;

    -- Coach Notes
    if exists (
        select 1
        from organization_client_notes
        where organization_client_id = p_organization_client_id
    ) then
        v_score := v_score + 10;
    end if;

    -- Meeting Scheduled
    if exists (
        select 1
        from organization_client_meetings
        where organization_client_id = p_organization_client_id
          and meeting_date >= now()
    ) then
        v_score := v_score + 10;
    end if;

    -- Open Action Items
    if exists (
        select 1
        from organization_client_action_items
        where organization_client_id = p_organization_client_id
          and status = 'open'
    ) then
        v_score := v_score + 10;
    end if;

    -- Recent activity (placeholder)
    v_score := v_score + 10;

    return query
    select
        v_score,
        case
            when v_score >= 90 then 'Excellent'
            when v_score >= 75 then 'Strong'
            when v_score >= 60 then 'Needs Attention'
            else 'At Risk'
        end;
end;
$$;