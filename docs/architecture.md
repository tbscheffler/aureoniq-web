# AureonIQ Architecture Notes

## Product Identity

AureonIQ is a Career Intelligence Platform.

It is not a resume builder and not a job board.

Core promise:

"Discover opportunities you didn't know you qualified for."

## Security Principles

1. Users own their data.
2. Coaches, universities, and employers never own user accounts.
3. Organization access requires explicit user consent.
4. Removing access must be immediate.
5. Billing, passwords, authentication, and private account settings are never visible to coaches.
6. User reports belong to the user.
7. Organization notes and coaching records belong to the organization.
8. Sensitive access should be auditable.
9. UI visibility is not security. Real security lives in Supabase RLS, database functions, and server-side checks.

## Platform Model

AureonIQ supports multiple workspaces:

- Personal Workspace
- Coach Workspace
- Founder Workspace
- University Workspace
- Employer Workspace, future

A user can belong to more than one workspace at the same time.

Example:

A founder can also be a coach and a personal AureonIQ user.

## Organization Model

Organizations are used for:

- Career coaches
- Universities
- Employers, future

Core tables:

- organizations
- organization_members
- organization_plans
- organization_invitations
- organization_clients
- user_sponsored_entitlements
- access_audit_log
- user_permissions

## Entitlement Model

A user's effective access tier should be calculated from:

1. Personal entitlement
2. Sponsored entitlement

Example:

Personal tier: free  
Sponsored tier: aiq_pro  
Effective tier: aiq_pro

If sponsorship ends, the user returns to their personal tier.

## Data Ownership

User-owned data:

- resume_profiles
- career_reports
- aiq_reports
- saved_jobs
- user_preferences
- user_usage

Organization-owned data:

- organization_clients
- organization_invitations
- organization_plans
- future coach notes
- future meeting history
- future organization action items

## Development Rule

Before adding major features, confirm:

1. Is it secure?
2. Does the user stay in control of their data?
3. Can this scale to coaches, universities, and employers?
4. Is it simple enough for the founder to understand and maintain?