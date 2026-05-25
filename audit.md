# Formica Initial Audit

## Audit Date

May 25, 2026

## Current Repository State

- Workspace: `C:\Users\Admin\OneDrive\Documents\Formica`
- Git state: empty repository with no commits at audit time.
- App scaffold: not created yet.
- Root docs planned: `plan.md`, `audit.md`, `AGENTS.md`.
- Git remote: not configured at audit time.

This audit is a planning and readiness audit. It is not a code audit because there is no app code yet.

## High-Risk Findings

### 1. Sensitive Supabase Keys Were Shared In Planning Context

The planning prompt included Supabase secret material. These values must not be committed to the repository.

Required actions:

- Do not place raw service-role keys or access tokens in docs, source code, `.env.example`, tests, issue templates, screenshots, or logs.
- Rotate the shared service-role key and access token before production use.
- Use `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the app.
- Store `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_ACCESS_TOKEN` only in secure local shell sessions, CI secrets, Supabase secrets, or backend-only environments.

Severity: Critical before production.

### 2. Empty Repo Means Guardrails Must Come First

There is no existing TypeScript, lint, database, CI, or test setup. If implementation starts without guardrails, Formica can quickly accumulate inconsistent vocabulary, unsafe money logic, and difficult sync behavior.

Required actions:

- Scaffold Expo SDK 54 with TypeScript before feature work.
- Add typecheck, lint, format, and Jest early.
- Add database migration discipline before creating Supabase tables.
- Add `AGENTS.md` as durable implementation policy.

Severity: High for maintainability.

### 3. SDK 54 Is Requested But Not Current

Expo SDK 54 is the requested baseline. As of May 25, 2026, Expo SDK 56 is newer. SDK 54 maps to React Native 0.81, React 19.1, and Node.js 20.19.x.

Required actions:

- Pin the project to SDK 54 intentionally.
- Use `npx expo install` for Expo-managed dependencies.
- Run `npx expo install --check` after dependency changes.
- Avoid random latest-version installs that drift from SDK 54 compatibility.
- Re-evaluate SDK upgrade only as a dedicated upgrade project.

Severity: Medium if controlled, High if dependencies drift.

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

| Area       | Required verification                                         |
| ---------- | ------------------------------------------------------------- |
| TypeScript | `npm run typecheck`                                           |
| Lint       | `npm run lint`                                                |
| Format     | `npm run format:check`                                        |
| Unit tests | `npm test -- --runInBand` or a CI-safe Jest command           |
| UI tests   | React Native Testing Library                                  |
| E2E        | Maestro or Detox critical flows                               |
| Database   | Supabase local CLI and SQL tests                              |
| RLS        | User A versus User B isolation tests                          |
| Sync       | Duplicate replay, conflict, delete/edit, and retry tests      |
| Builds     | `npx expo config --type public` and EAS internal build        |
| Security   | Secret search, log redaction tests, invalid amount/type tests |

## Initial Acceptance Checklist

Before the first production release:

- No raw secret keys are committed.
- App uses Expo SDK 54 intentionally.
- Node.js 20.19.x is documented for local development and CI.
- TypeScript is strict enough to catch domain mistakes.
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

Formica is ready for documentation-driven scaffolding, not production implementation. The next safe step is to scaffold the Expo SDK 54 TypeScript app, add the base theme and navigation, and set up verification before building money flows.
