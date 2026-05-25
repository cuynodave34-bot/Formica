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
npm run verify
```

Or run the individual gates:

```powershell
npm run typecheck
npm run lint
npm test
npm run format
npm run expo:check
npm run audit:moderate
npx expo config --type public
```

## Supabase

Local Supabase files live under `supabase/`. The initial migration defines the
core Formica tables, ownership policies, soft-delete fields, sync versions, and
money constraints. Apply migrations locally before linking or pushing to a
hosted Supabase project.

Docker Desktop is required for local Supabase. Check Docker first:

```powershell
npm run docker:check
```

Start the Phase 1 local stack:

```powershell
npm run supabase:start
```

This excludes local Realtime because Realtime is not part of Phase 1 and the
Windows self-hosted Realtime boot path failed during closeout. Use
`npm run supabase:start:full` later only when Realtime is intentionally being
worked on.
