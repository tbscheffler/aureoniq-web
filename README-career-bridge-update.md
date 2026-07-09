# AureonIQ Opportunity Intelligence Career Bridge Update

This update adds Career Bridge support to Opportunity Intelligence.

## Replace these files

- `app/coach/clients/[clientId]/page.tsx`
- `lib/opportunity-intelligence/opportunityIntelligence.ts`
- `lib/opportunity-intelligence/buildOpportunityIntelligence.ts`
- `supabase/functions/opportunity-intelligence/index.ts`

## Then run

```cmd
npm run build
```

## Then redeploy the Supabase function

```cmd
supabase functions deploy opportunity-intelligence
```

## What changed

Evaluate now includes a Career Bridge section that explains the path from the person's current role/identity toward the target role. This is designed to show pathway logic, not just job fit.
