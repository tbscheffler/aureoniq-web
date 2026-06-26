# AureonIQ Database Notes

## Core Principle

UI is not security.

Sensitive access is enforced through:

- RLS
- Security definer RPC functions
- Organization membership checks
- Active relationship checks
- Audit logging

## Organization Tables

- organizations
- organization_members
- organization_plans
- organization_invitations
- organization_clients
- user_sponsored_entitlements

## Coach Workspace Tables

- organization_client_notes
- organization_client_meetings
- organization_client_action_items

## User-Owned Career Intelligence

- resume_profiles
- career_reports
- aiq_reports
- user_preferences
- user_entitlements

## Important RPC Functions

### Invitation Flow

- send-organization-invitation Edge Function
- accept_organization_invitation

### Client Workspace

- get_coach_client_summary
- get_coach_client_workspace legacy, avoid expanding

### Notes

- create_organization_client_note
- get_organization_client_notes

### Meetings

- create_organization_client_meeting
- get_organization_client_meetings

### Action Plans

- create_organization_client_action_item
- get_organization_client_action_items

## Important Rule

Every future database change should be saved in:

```txt
supabase/migrations

Run SQL in Supabase first, then copy the exact working SQL into the migration file.

Subscription Direction

Professional subscriptions use RevenueCat.

Coach organization subscriptions should likely use Stripe because:

Coaches pay on web
Organizations need seat limits
Billing needs invoices
Universities/employers need future enterprise billing