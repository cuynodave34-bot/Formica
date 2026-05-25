# Formica Initial Audit

## Audit Date

May 25, 2026

## Current Repository State

- Workspace: `C:\Users\Admin\OneDrive\Documents\Formica`
- Git state: initialized and pushed to `origin/main`.
- Latest closeout commit at the time of this audit update: `ef3275b Complete Phase 0 and Phase 1 setup`.
- App scaffold: Expo SDK 54 TypeScript app with Expo Router tabs.
- Root docs present: `plan.md`, `audit.md`, `AGENTS.md`, `README.md`, and `docs/phase-0-1-closeout.md`.
- Git remote: `git@github.com:cuynodave34-bot/Formica.git`.

This audit is now a Phase 0 and Phase 1 readiness audit. Product money flows are still sample-only and must not be treated as implemented finance behavior.

## High-Risk Findings

### 1. Sensitive Supabase Keys Were Shared In Planning Context

The planning prompt included Supabase secret material. These values must not be committed to the repository.

Required actions:

- Do not place raw service-role keys or access tokens in docs, source code, `.env.example`, tests, issue templates, screenshots, or logs.
- Rotate the shared service-role key and access token before production use.
- Use `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the app.
- Store `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ACCESS_TOKEN` only in secure local shell sessions, CI secrets, Supabase secrets, or backend-only environments.

Severity: Critical before production.

### 2. Guardrails Are In Place But Must Stay Enforced

TypeScript, linting, formatting, unit tests, Expo dependency checks, npm audit, CI, and Phase 0/1 file checks are configured.

Required actions:

- Run `npm run verify` before claiming Phase 0/1 remains healthy.
- Keep `AGENTS.md` as durable implementation policy.
- Keep database changes migration-based.
- Keep docs updated when roadmap or risk state changes.

Severity: Medium if checks stay enforced, High if bypassed.

### 3. SDK 54 Is Requested But Not Current

Expo SDK 54 is the requested baseline. As of May 25, 2026, Expo SDK 56 is newer. SDK 54 maps to React Native 0.81, React 19.1, and Node.js 20.19.x.

Required actions:

- Pin the project to SDK 54 intentionally.
- Use `npx expo install` for Expo-managed dependencies.
- Run `npx expo install --check` after dependency changes.
- Avoid random latest-version installs that drift from SDK 54 compatibility.
- Re-evaluate SDK upgrade only as a dedicated upgrade project.

Severity: Medium if controlled, High if dependencies drift.

### 4. Local Supabase Realtime Is Excluded In Phase 1

Docker Desktop was installed and local Supabase runs with Realtime excluded. The full local stack failed during self-hosted Realtime initialization, while the database migration path and non-Realtime local stack are usable.

Required actions:

- Use `npm run supabase:start` for Phase 1 work.
- Use `npm run supabase:start:full` only when intentionally diagnosing Realtime.
- Do not introduce Realtime-dependent app behavior until Realtime has a concrete use case and a passing local verification path.

Severity: Low for Phase 1, Medium before any Realtime feature.

### 5. Low Disk Space Limits Heavy Local Tooling

The Windows drive had low free space during closeout. A local install of heavy CLI packages was avoided after disk pressure, and future-facing tools were added as pinned `npx` scripts instead.

Required actions:

- Prefer the existing pinned scripts before adding heavy dev dependencies.
- Check free disk space before installing large CLIs or native build tooling.
- Keep `node_modules` lean unless a tool must be available offline or in CI without `npx`.

Severity: Low if monitored, Medium if future tooling installs are attempted with low disk space.

## Product and UX Risks

### Overwhelming Finance UI

Finance apps can create anxiety when they show too many cards, warnings, charts, and buttons at once.

Controls:

- Nest Overview should show only the highest-signal metrics.
- Keep one primary action per screen where possible.
- Use large readable numbers.
- Use minimal charts.
- Put advanced tools behind secondary navigation.
- Keep Scout Warnings conservative and actionable.

### Inconsistent Ant Vocabulary

The Formica language can become confusing if applied inconsistently.

Controls:

- Use the vocabulary table in `plan.md` as the source of truth.
- Use plain financial labels where safety or clarity requires it.
- Avoid inventing new metaphors for core money operations without updating docs.

### Dangerous Transfer UX

Transfers are easy to duplicate or misdirect.

Controls:

- Prevent same-chamber transfers.
- Require destination chamber.
- Confirm source, destination, amount, and date.
- Disable double taps while saving.
- Use idempotency keys for retryable transfer creation.
- Show clear success and failure states.

## Backend and Data Risks

### Missing RLS

Every user-owned Supabase table must have RLS before app release.

Controls:

- Enable RLS on all exposed user-owned tables.
- Add policies for select, insert, update, and soft delete.
- Test User A cannot read or mutate User B data.
- Test unauthenticated users cannot access private data.

### Weak Money Constraints

Frontend-only validation is insufficient.

Controls:

- Reject zero or negative Trail amounts.
- Restrict transaction type to income, expense, and transfer.
- Restrict chamber type to allowed values.
- Require transfer destination.
- Prevent transfer source and destination from matching.
- Verify referenced chamber and category ownership.
- Prefer integer minor units for money.

### Unsafe Views or RPCs

Views and functions can bypass expected RLS behavior if created carelessly.

Controls:

- Use `security_invoker = true` for Postgres 15+ views exposed to clients.
- Keep privileged functions in private schemas where possible.
- Set explicit `search_path` on security-definer functions.
- Do not trust `user_id` from request bodies.
- Derive user identity from `auth.uid()` or verified JWT context.

### Soft-Delete Edge Cases

Deleting accounts or categories can break historical records.

Controls:

- Use `deleted_at` instead of permanent deletes.
- Hide deleted Chambers from normal pickers.
- Preserve historical Trails.
- Block hard deletion while dependent records exist unless a migration/archive path exists.
- Decide category fallback behavior before release.

## Offline and Sync Risks

### Duplicate Writes

Retries, double taps, and offline replay can duplicate Trails or transfers.

Controls:

- Use client-generated UUIDs.
- Use idempotency keys for critical operations.
- Add unique constraints for retry-sensitive actions.
- Disable submit controls while a local write is being committed.
- Make sync replay safe to run multiple times.

### Conflicting Multi-Device Edits

The same record may be edited on two devices before sync.

Controls:

- Add `version` to important records.
- Compare version or updated timestamp during sync.
- Record conflicts locally.
- Auto-resolve only when deterministic.
- Show a clear conflict screen when user choice is required.

### Timezone Mistakes

Reports and monthly summaries can be wrong around midnight or month boundaries.

Controls:

- Store timestamps in UTC.
- Store user-facing local dates separately where needed.
- Define month boundaries from the user's selected timezone.
- Test transactions near midnight and month-end.

### Generated or Server-Owned Columns

Sync can break if it writes generated or server-owned columns back to Supabase.

Controls:

- Maintain allowlists for sync payload fields.
- Omit generated, derived, and server-owned columns from client writes.
- Add tests for sync normalization.

## Local Storage and Privacy Risks

### Wrong Storage Medium

AsyncStorage is not appropriate for full financial records.

Controls:

- Store full offline finance records in SQLite.
- Use SecureStore only for small secrets, app-lock material, and token/session support where appropriate.
- Do not store raw bank credentials.

### Unsafe Logs

Logs can leak financial data.

Controls:

- Never log auth tokens, refresh tokens, PINs, or secrets.
- Never log exact balances, full transaction notes, or full account names.
- Redact provider errors and sync errors before display.
- Do not send sensitive finance fields to analytics or crash reporting.

### Background Exposure

Balances can be visible in app switchers or screenshots.

Controls:

- Add a hide-balance setting.
- Blur or hide balances when the app backgrounds.
- Lock the app after a configurable background timeout.
- Add biometric/PIN unlock before production release.

## File Storage Risks

Receipts and attachments can leak private financial information.

Controls:

- Use private Supabase Storage buckets.
- Store files under user-owned paths.
- Use signed URLs.
- Restrict upload file type and size.
- Verify ownership before issuing signed URLs.
- Do not include sensitive filenames in logs.

## Environment and Release Risks

### Production Used Too Early

Sync and migration bugs can damage user data.

Controls:

- Maintain local, staging, and production environments.
- Never test risky sync or migration changes directly in production.
- Use migrations for all database changes.
- Avoid destructive migrations without backup.
- Keep backend changes backward-compatible with older app versions.

### CI/CD Missing

Manual-only verification will miss regressions.

Controls:

- Add GitHub Actions for typecheck, lint, tests, and database validation.
- Use EAS internal builds before production builds.
- Keep EAS Update channels separate.
- Run Supabase local tests for migrations and RLS.

## Verification Matrix

| Area       | Required verification                                                                   |
| ---------- | --------------------------------------------------------------------------------------- |
| TypeScript | `npm run typecheck`                                                                     |
| Lint       | `npm run lint`                                                                          |
| Format     | `npm run format`                                                                        |
| Unit tests | `npm test`                                                                              |
| UI tests   | React Native Testing Library                                                            |
| E2E        | Maestro or Detox critical flows                                                         |
| Database   | `npm run supabase:db:lint` plus future SQL tests                                        |
| RLS        | User A versus User B isolation tests                                                    |
| Sync       | Duplicate replay, conflict, delete/edit, and retry tests                                |
| Builds     | `npx expo config --type public`, `npm run eas:version`, and future EAS internal build   |
| Security   | `npm run audit:moderate`, secret search, log redaction tests, invalid amount/type tests |

## Initial Acceptance Checklist

Phase 0 and Phase 1 closeout:

- No raw secret keys are committed.
- App uses Expo SDK 54 intentionally.
- Node.js 20.19.x is documented for local development and CI.
- TypeScript is strict enough to catch domain mistakes.
- Expo Router shell routes exist.
- Expo Doctor passes with the explicit Expo Metro config and Router peers installed.
- Theme tokens and shared UI primitives exist.
- Supabase local migration exists and applies to local Postgres.
- Docker Desktop is installed for Supabase local development.
- Pinned `npx` scripts exist for Expo Doctor, EAS CLI version checks, and Supabase CLI commands.
- Realtime is explicitly excluded from the default local Supabase start command until needed.

Before the first production release:

- All money writes validate on backend.
- All user-owned Supabase tables have RLS.
- User A cannot access User B data.
- SQLite stores offline finance records.
- SecureStore is limited to small secrets and app-lock material.
- Sync is idempotent and conflict-aware.
- Logs are privacy-safe.
- EAS internal builds work.
- A rollback and backup story exists for migrations.

## Current Audit Conclusion

Formica has completed the documentation and Expo foundation baseline. The next safe step is Phase 2: implement real SQLite-backed local finance data, replace sample dashboard values, and add focused validation tests before money flows are connected to Supabase.
