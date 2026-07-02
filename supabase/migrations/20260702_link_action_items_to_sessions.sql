alter table organization_client_action_items
add column if not exists coaching_session_id uuid
references organization_client_coaching_sessions(id)
on delete set null;

create index if not exists idx_action_items_coaching_session
on organization_client_action_items(coaching_session_id);