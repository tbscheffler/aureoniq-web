# Opportunity Intelligence v1 setup

## Files to replace/add

1. Replace:

```txt
app/coach/clients/[clientId]/page.tsx
```

2. Add new Supabase Edge Function:

```txt
supabase/functions/opportunity-intelligence/index.ts
```

## Supabase setup

From your project folder, set your OpenAI key as a Supabase secret:

```cmd
supabase secrets set OPENAI_API_KEY=your_openai_key_here
```

Optional:

```cmd
supabase secrets set OPENAI_MODEL=gpt-4o-mini
```

Then deploy the function:

```cmd
supabase functions deploy opportunity-intelligence
```

## Website setup

Make sure your `.env.local` has:

```txt
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then run:

```cmd
npm run build
```

## Test

1. Open a coach client page.
2. Click Evaluate.
3. Paste a job description.
4. Click Analyze Opportunity.
5. The right panel should update with real Opportunity Intelligence.

