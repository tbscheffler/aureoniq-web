create or replace function public.get_organization_seat_usage(
    p_organization_id uuid
)
returns table (
    seat_limit integer,
    billable_clients integer,
    demo_clients integer,
    removed_clients integer,
    remaining_seats integer
)
language sql
security definer
set search_path = public
as $$
with usage_stats as (
    select
        count(*) filter (
            where status = 'active'
              and is_sample = false
        ) as billable_clients,

        count(*) filter (
            where status = 'active'
              and is_sample = true
        ) as demo_clients,

        count(*) filter (
            where status = 'removed'
        ) as removed_clients
    from organization_clients
    where organization_id = p_organization_id
),
plan as (
    select managed_client_limit
    from organization_plans
    where organization_id = p_organization_id
      and status = 'active'
    limit 1
)
select
    coalesce(plan.managed_client_limit, 0) as seat_limit,

    coalesce(usage_stats.billable_clients, 0) as billable_clients,

    coalesce(usage_stats.demo_clients, 0) as demo_clients,

    coalesce(usage_stats.removed_clients, 0) as removed_clients,

    greatest(
        coalesce(plan.managed_client_limit, 0)
        - coalesce(usage_stats.billable_clients, 0),
        0
    ) as remaining_seats
from usage_stats
cross join plan;
$$;