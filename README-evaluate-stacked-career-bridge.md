# AureonIQ Evaluate UX + Engine Synthesis Update

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

- Evaluate no longer uses two side-by-side columns after analysis.
- The job input stays at the top.
- Opportunity Intelligence now renders as a stacked report:
  - Summary
  - Alignment
  - Decision Perspective
  - Career Bridge
  - Why it may fit
  - Growth Stretch
  - Conversation Starters
- The Edge Function prompt now asks the engine to use the full Career Intelligence Profile, including Discovery, AIQ, Evidence, Regional context, hidden opportunities, and adjacent paths when creating the Career Bridge.
