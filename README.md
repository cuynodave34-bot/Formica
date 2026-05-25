# Formica

Formica is an Expo SDK 54 and TypeScript finance app scaffold for centralizing a
user's wallet across Chambers, Trails, Mounds, and Colony Reports.

## Local Setup

```powershell
npm install
Copy-Item .env.example .env.local
npm run start
```

Fill `.env.local` with rotated Supabase values before connecting to the hosted
project. Do not commit `.env.local` or any service-role credentials.

## Verification

```powershell
npm run typecheck
npm run lint
npm test
npm run expo:check
npx expo config --type public
```

## Supabase

Local Supabase files live under `supabase/`. The initial migration defines the
core Formica tables, ownership policies, soft-delete fields, sync versions, and
money constraints. Apply migrations locally before linking or pushing to a
hosted Supabase project.
