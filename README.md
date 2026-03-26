# Free For Friendlies App

Separate Next.js + Supabase MVP app for Free For Friendlies.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Verify locally

```bash
npm run build
```

If your Supabase project has email confirmation enabled, add `SUPABASE_SERVICE_ROLE_KEY`
to `.env.local` to create profile rows immediately on signup. Without it, the app
will still backfill the profile row on the first authenticated session.
