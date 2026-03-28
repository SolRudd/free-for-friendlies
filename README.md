# Free For Friendlies App

Separate Next.js + Supabase MVP app for Free For Friendlies.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Required Supabase setup

Add these env vars in `.env.local` and in Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional, but needed for immediate signup profile backfill and team crest uploads)

Apply the SQL in `supabase-schema.sql` to your Supabase project. The file is written to be re-runnable so it can add missing columns and refresh the current RLS policies on an existing prototype database.

If you want team crest uploads to work, also create a public Supabase Storage bucket called `team-assets`.

## Verify locally

```bash
npm run build
npm run typecheck
```

If your Supabase project has email confirmation enabled, add `SUPABASE_SERVICE_ROLE_KEY`
to `.env.local` to create profile rows immediately on signup. Without it, the app
will still backfill the profile row on the first authenticated session.
