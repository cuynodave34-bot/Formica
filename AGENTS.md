# Formica Agent Instructions

These instructions apply to the Formica repository.

## Default Working Style

- Always analyze, diagnose, and surgically fix when the prompt asks to fix bugs.
- Keep summaries coherent and concise.
- Make plans detailed enough that another engineer can implement them without guessing.
- Prefer repo-specific evidence over generic advice.
- Keep changes scoped to the request.
- Do not rewrite unrelated files.
- Do not commit secrets.
- If a bug touches money, sync, auth, or privacy, treat it as high risk until verified.

## Product Identity

Formica is a finance app using an ant-colony model:

- User: Formica Ant.
- Full app ecosystem: Colony.
- Central finance system: Ant Mound.
- Dashboard: Nest Overview.
- Total balance: Nest Value.
- Accounts: Chambers.
- Transactions: Trails.
- Income: Foraged In.
- Expenses: Foraged Out / Used Resources.
- Transfers: Trail Transfer.
- Savings goals: Mounds / Resource Piles.
- Alerts: Scout Warning.
- Reports: Colony Report.

Use these terms consistently. If plain financial wording is needed for safety or clarity, use it beside the Formica term instead of replacing the term silently.

## Technical Baseline

- Build with React Native through Expo SDK 54.
- Use TypeScript for app code.
- SDK 54 maps to React Native 0.81, React 19.1, and Node.js 20.19.x.
- As of May 25, 2026, Expo SDK 56 is newer. Do not upgrade from SDK 54 unless the user explicitly asks for an SDK upgrade pass.
- Use `npx expo install` for Expo-managed dependencies.
- Run `npx expo install --check` after dependency changes.
- Prefer Expo Router for navigation.
- Keep route files thin. Put components, domain logic, validation, database code, and sync code under `src/`.
- Phase 0 and Phase 1 are complete as of commit `ef3275b`.
- See `docs/phase-0-1-closeout.md` before changing the scaffold assumptions.
- The project has an explicit `metro.config.js` that extends Expo's default Metro config; keep that shape unless there is a concrete bundler requirement.
- `expo-constants` and `expo-linking` are direct dependencies because Expo Router requires them.

## Frontend Standards

Frontend quality is a priority for this app.

- Build calm, low-clutter screens.
- Use soft nature colors from the Formica palette.
- Use large readable numbers for balances and financial totals.
- Keep primary actions obvious and limited.
- Avoid overwhelming button clusters.
- Use rounded cards, clear spacing, and compact rows.
- Use minimal charts unless the chart directly helps decision-making.
- Use small ant mascot moments only for empty states, onboarding, and gentle confirmations.
- Do not let decorative art compete with financial data.
- Keep copy short and psychologically calm.
- Avoid raw technical errors in the UI. Convert failures into clear, privacy-safe messages.
- Support hidden balances and background balance blur.
- Design destructive actions with confirmation and clear consequences.

Theme tokens:

```text
Forest Green: #2F5D50
Bark Brown: #6B4F3F
Ant Red: #B55239
Amber: #D9A441
Cream: #F7F3E8
Dark Text: #26332D
Leaf Green: #4F8A5B
Warning Red: #C94C4C
```

## Backend Standards

Never trust the frontend.

- Validate money-related data on frontend and backend.
- Use Supabase Auth for authentication.
- Enable email verification before production release.
- Use Supabase Postgres for cloud persistence.
- Enable Row Level Security on all user-owned tables.
- Every user-owned table must include `user_id`.
- Users can only read their own data.
- Users can only insert rows with their own `user_id`.
- Users can only update their own data.
- Users can only delete or soft-delete their own data.
- Use UUIDs for all important records.
- Use client-generated UUIDs for offline-created records.
- Use `created_at`, `updated_at`, `deleted_at`, and `version` on important tables.
- Always prefer soft deletes over permanent deletes.
- Use database constraints for amount, type, and account validity.
- Reject zero or negative Trail amounts.
- Restrict Trail types to income, expense, and transfer.
- Restrict Chamber/account types to allowed values.
- For Trail Transfers, require a destination Chamber and prevent transfers to the same Chamber.
- Verify that `account_id`, `transfer_account_id`, and `category_id` belong to the authenticated user.
- Use Postgres functions for critical money operations that need atomicity.
- Use Edge Functions for server-only tasks and operations requiring secrets.

## Supabase Key Handling

- The mobile app may only use public client-safe Supabase keys.
- Prefer `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` for the app client.
- Do not expose secret keys or service-role credentials in the app bundle.
- Store secret keys only in secure backend environments, Supabase Edge Function secrets, CI secrets, or shell-local variables.
- Never commit raw Supabase service keys, access tokens, refresh tokens, or JWTs.
- If a key appears in chat, logs, screenshots, or files, treat it as compromised and rotate it before production use.

Expected environment variable names:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ACCESS_TOKEN
```

## SQLite and Offline Sync Standards

- Store financial records locally in SQLite for offline mode.
- Do not store sensitive finance records in AsyncStorage.
- Use SecureStore only for small secrets, token/session support where appropriate, app-lock material, and biometric settings.
- Use a sync queue for local writes.
- Make sync operations idempotent.
- Prevent duplicate transactions during retries or double taps.
- Use unique constraints where retries can duplicate records.
- Use optimistic concurrency with `version`.
- Handle editing deleted records, deleted Chambers with Trails, deleted categories, network retries, timezone boundaries, and multiple-device edits.
- Realtime should be used carefully. Do not use realtime as a substitute for durable sync.
- Consider PowerSync later only after the schema and sync contract stabilize.

## Security Standards

- Verify JWTs inside Edge Functions.
- Never trust `user_id` from a request body.
- Get authenticated user identity from the token/session.
- Validate Edge Function request bodies with schemas.
- Rate-limit sensitive backend actions.
- Use private storage buckets for receipts or files.
- Use signed URLs for private files.
- Restrict uploaded file type and size.
- Store receipt files under user-owned paths.
- Never store raw bank credentials.
- Add PIN or biometric app lock.
- Lock the app after it has been in the background.
- Hide or blur balances when the app is backgrounded.
- Never log auth tokens, refresh tokens, PINs, or secrets.
- Never log full transaction notes, exact balances, or full account names.
- Keep logs useful but privacy-safe.
- Do not send sensitive financial data to analytics tools.
- Do not include balances, notes, or account names in crash reports.
- Provide export and backup options for user data.
- Follow OWASP mobile security practices as the app matures.

## Database and Migration Standards

- Use migrations for all database changes.
- Keep local, staging, and production environments separate.
- Never test risky sync or migration changes directly in production.
- Avoid destructive migrations without backup.
- Keep backend changes backward-compatible with old app versions.
- Test RLS policies before release.
- Test that User A cannot access User B data.
- Test that unauthenticated users cannot access private data.
- Test invalid amounts and invalid transaction types.
- Test duplicate sync and offline conflict cases.
- Use views for summaries where they reduce data transfer.
- Use pagination for large history lists.
- Add indexes for ownership, date filters, sync state, and summary queries.

## DevOps Standards

Use these checks as the expected quality gate once the app is scaffolded:

```text
npm run typecheck
npm run lint
npm run format
npm test
npm run audit:moderate
npm run verify
npx expo install --check
npx expo config --type public
```

Also add and maintain:

- React Native Testing Library tests for UI behavior.
- Maestro or Detox tests for critical end-to-end flows.
- Supabase local CLI and SQL tests.
- GitHub Actions CI.
- EAS internal builds before production builds.
- Separate EAS Update channels for development, staging, and production.
- Docker Desktop for local Supabase.
- `npm run supabase:start` for Phase 1 local Supabase because it excludes Realtime.
- `npm run supabase:start:full` only when intentionally working on Realtime.

Current tool scripts:

```text
npm run verify
npm run doctor
npm run docker:check
npm run supabase:start
npm run supabase:start:full
npm run supabase:status
npm run supabase:db:start
npm run supabase:db:lint
npm run supabase:reset
npm run eas:version
```

Tooling notes:

- Prefer these pinned `npx` scripts before adding heavy CLIs to `devDependencies`.
- Check disk space before adding large native/mobile tooling. The closeout session hit low disk space, so EAS and Supabase CLI are intentionally invoked on demand.
- Do not paste local Supabase status output into docs or issues if it contains generated local keys.
- The default Supabase start path excludes Realtime. Do not add Realtime-dependent app behavior until `npm run supabase:start:full` is intentionally diagnosed and passes.
- Run `npm run doctor` after Expo dependency or Metro changes.

## Documentation Standards

- Update `plan.md` when product direction, architecture, or roadmap phases change.
- Update `audit.md` when new risks, mitigations, or verification results are discovered.
- Update `AGENTS.md` when durable repo policy changes.
- Keep documentation practical and implementation-oriented.
- Do not add secrets to examples.
- Prefer explicit acceptance criteria over vague recommendations.

## Bug-Fix Workflow

When asked to fix a bug:

1. Reproduce or inspect the current behavior.
2. Identify the smallest affected surface.
3. Diagnose the root cause.
4. Make the narrowest safe change.
5. Add or update focused tests when possible.
6. Run the relevant verification commands.
7. Summarize what changed and what was verified.

For money, auth, sync, and privacy bugs, include edge cases in the verification notes.

## Release Readiness

Do not call Formica production-ready until:

- RLS is enabled and tested on all user-owned Supabase tables.
- Critical money operations validate server-side.
- Offline sync is idempotent and conflict-aware.
- Secrets are not committed or exposed in the app bundle.
- Local finance records are stored in SQLite.
- Balance privacy controls exist.
- CI and EAS build checks pass.
- User data export and backup options exist.
