# AureonIQ Evaluate Polish Update

Replace these files in your project:

1. `app/coach/clients/[clientId]/page.tsx`
2. `supabase/functions/opportunity-intelligence/index.ts`

Then run:

```cmd
npm run build
```

Then redeploy the Edge Function:

```cmd
supabase functions deploy opportunity-intelligence
```

What changed:
- Replaces the visible heading `Career decision support, not CRM tracking` with `Opportunity Intelligence`.
- Changes the analysis badge from `AI analysis` to `Career Intelligence`.
- Renames `Decision Perspective` to `Career Perspective`.
- Adds a safe fallback so `Why it may fit` is never blank for true stretch roles.
- Updates the Edge Function prompt so the model avoids CRM language, avoids `your current role` wording, and always returns useful `whyItFits` content even when alignment is a stretch.
