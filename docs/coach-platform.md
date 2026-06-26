# AureonIQ Coach Platform

## Purpose

The Coach Platform lets approved coach organizations invite clients, sponsor access, view shared career intelligence, and manage coaching workflows.

Users own their accounts and reports. Organizations own coaching records such as notes, meetings, and action plans.

## Current Features

- Coach Workspace
- Client invitations
- Secure invitation acceptance
- Client display names
- Active client list
- Client Workspace
- Read-only Career Discovery Reports
- Read-only AIQ Reports
- Coach Notes
- Meeting History
- Action Plan

## Security Model

Coach access is not controlled by UI visibility.

Access is controlled by:

- Supabase RLS
- Security definer database functions
- Organization membership checks
- Active client relationship checks
- Audit logging

A coach can access a client workspace only if:

- The client relationship is active
- The coach is an active organization member
- The coach is assigned to the client, or is owner/admin

## Data Ownership

User-owned:

- resume_profiles
- career_reports
- aiq_reports
- user_preferences
- user_entitlements

Organization-owned:

- organization_clients
- organization_invitations
- organization_client_notes
- organization_client_meetings
- organization_client_action_items
- user_sponsored_entitlements

## Component Structure

Coach UI components live in:

```txt
components/coach