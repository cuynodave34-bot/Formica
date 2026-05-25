# Formica Production Roadmap

## Product Vision

Formica is a privacy-first personal finance app that centralizes a user's wallet across banks, cash wallets, e-wallets, savings products, and other assets. The app uses an ant-colony model to make finance feel organized without making the interface feel childish, cluttered, or stressful.

Formica should help a user answer four questions quickly:

- What is my current financial position?
- Where are my resources stored?
- What moved in or out recently?
- What needs attention before it becomes a problem?

This document is a roadmap. It does not mean every feature should be implemented in the first release.

## Scientific Product Language

Use the ant-colony vocabulary consistently across product copy, navigation, database-facing domain names, comments, and future docs where it improves clarity.

| Finance concept        | Formica term                 | Reason                                     |
| ---------------------- | ---------------------------- | ------------------------------------------ |
| User                   | Formica Ant                  | The individual worker organizing resources |
| App ecosystem          | Colony                       | The full finance environment               |
| Central finance system | Ant Mound                    | The colony's central resource system       |
| Dashboard              | Nest Overview                | Colonies organize activity around a nest   |
| Total balance          | Nest Value                   | The nest represents stored resources       |
| Accounts               | Chambers                     | Nests have chambers and tunnels            |
| Transactions           | Trails                       | Ants use trails between resources and nest |
| Income                 | Foraged In                   | Resources brought back to the colony       |
| Expenses               | Foraged Out / Used Resources | Resources consumed by the colony           |
| Transfers              | Trail Transfer               | Movement between chambers                  |
| Savings goals          | Mounds / Resource Piles      | Stored resources built up over time        |
| Alerts                 | Scout Warning                | Scouts respond to environmental changes    |
| Reports                | Colony Report                | Summary of colony activity                 |

Keep the language practical. Important financial actions should still be understandable on first read. Prefer "Trail Transfer" over a vague metaphor when the user is moving money, and include plain labels where needed during onboarding.

## Visual System

### Theme Tokens

| Token        | Hex       | Use                                              |
| ------------ | --------- | ------------------------------------------------ |
| Forest Green | `#2F5D50` | Primary actions, selected tabs, trusted surfaces |
| Bark Brown   | `#6B4F3F` | Secondary actions, dividers, grounding accents   |
| Ant Red      | `#B55239` | Warm accent, small mascot details, highlights    |
| Amber        | `#D9A441` | Attention states, scout warning accents          |
| Cream        | `#F7F3E8` | Main background                                  |
| Dark Text    | `#26332D` | Primary text                                     |
| Leaf Green   | `#4F8A5B` | Positive values, successful sync, income         |
| Warning Red  | `#C94C4C` | Expense, danger, destructive actions             |

### UI Principles

- Build a calm finance interface: large readable numbers, clear spacing, few buttons per screen, and predictable navigation.
- Use rounded cards for financial summaries, but avoid card nesting and dense decorative layouts.
- Use minimal charts. The first release should prefer readable summaries, small trends, and simple comparisons over complex dashboards.
- Use small ant mascot moments sparingly for empty states, onboarding, and success states. Do not let mascot art compete with money data.
- Keep copy short. Avoid long instructional text on transaction, transfer, and dashboard screens.
- Use soft nature colors with high contrast. Important values must remain readable in bright outdoor conditions.
- Make destructive actions visually clear and slow enough to prevent mistakes.
- Support balance privacy controls: hide balances, blur on background, and optional app lock.

## Technical Baseline

Formica should be built with:

- Expo SDK 54.
- React Native 0.81 and React 19.1, matching Expo SDK 54.
- Node.js 20.19.x for SDK 54 compatibility.
- TypeScript for all app code.
- Expo Router for navigation.
- SQLite for local offline-first financial records.
- Supabase Auth, Supabase Postgres, Row Level Security, Storage, and Edge Functions.
- EAS Build and EAS Update for internal and production release channels.

As of May 25, 2026, Expo SDK 56 is newer than SDK 54. The Formica baseline remains SDK 54 because that is the requested target. Future dependency work must use `npx expo install`, `npx expo install --check`, and official Expo compatibility guidance instead of blindly installing latest npm versions.

## Recommended Project Shape

The first implementation pass should scaffold an Expo TypeScript app and keep route files thin.

Suggested structure:

```text
app/
  _layout.tsx
  (auth)/
  (tabs)/
src/
  components/
  db/
    sqlite/
    supabase/
    sync/
  domain/
    accounts/
    transactions/
    goals/
    reports/
  features/
  navigation/
  security/
  theme/
  utils/
supabase/
  migrations/
  functions/
docs/
```

Route files should compose feature components. Business rules, sync logic, validation, and database access should live under `src/`.

## Core Screens

### Nest Overview

The main dashboard should show:

- Nest Value.
- A short chamber summary.
- Recent Trails.
- Today's Foraged In and Foraged Out.
- Scout Warnings that require attention.
- One primary action for adding a Trail and one secondary action for Trail Transfer.

The screen must not become a command center full of buttons. Use progressive disclosure for reports, filters, and advanced account management.

### Chambers

Chambers represent accounts and asset containers:

- Cash.
- Bank accounts.
- E-wallets.
- Savings products.
- Debt or liability chambers.
- Manual assets.

Each chamber needs a clear type, currency, balance, archived state, soft-delete state, sync version, and ownership.

### Trails

Trails represent money movement:

- Foraged In.
- Foraged Out / Used Resources.
- Trail Transfer.

Transfers must be represented as a linked pair or a single canonical transfer record with source and destination chamber IDs. The data model must prevent transfers to the same chamber.

### Mounds / Resource Piles

Mounds track savings goals, emergency funds, and planned resource piles. They should support progress display without pushing the user into anxiety-inducing dashboards.

### Scout Warnings

Scout Warnings should be conservative and useful:

- Duplicate transaction warning.
- Low balance warning.
- Sync conflict warning.
- Missing category warning.
- Unusual spending warning.
- Offline changes waiting to sync.

Do not produce scary warnings from weak heuristics.

### Colony Report

Reports should summarize activity without fetching every row into the client:

- Current month summary.
- Chamber-level balances.
- Category trends.
- Foraged In versus Foraged Out.
- Mound progress.
- Export and backup status.

Reports should use database views, paginated queries, or local aggregate tables where appropriate.

## Backend Architecture

### Supabase

Supabase owns cloud identity, cloud persistence, server-only operations, and private file storage.

Use:

- Supabase Auth for sign-up, sign-in, password reset, and session management.
- Email verification before production release.
- Supabase Postgres for user-owned finance records.
- RLS on every exposed user-owned table.
- Postgres constraints for money-critical validity.
- Postgres functions for critical operations that must be atomic.
- Edge Functions for server-only tasks, sensitive operations, scheduled jobs, and operations requiring secret keys.
- Private Storage buckets for receipts and attachments.

Environment variables:

```text
EXPO_PUBLIC_SUPABASE_URL
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_ACCESS_TOKEN
```

The mobile app may only use public client-safe keys. Secret keys and service-role credentials must only exist in secure backend environments, local shell sessions, CI secrets, or Edge Function secrets.

The initial Supabase project URL is:

```text
https://jhirkrhwvgybhuoqvhra.supabase.co
```

Do not commit service-role keys, access tokens, or raw production secrets. Because sensitive keys were shared in planning context, rotate them before production use.

### SQLite

SQLite owns offline availability and fast local interaction.

Use SQLite for:

- Chambers.
- Trails.
- Categories.
- Mounds.
- Sync queue.
- Conflict records.
- Local-only app preferences.
- Redacted activity metadata.

Do not store full financial records in AsyncStorage. Use SecureStore only for small secrets, auth/session support where appropriate, app-lock material, and biometric settings.

### Sync Strategy

The first production-capable sync layer should be custom and conservative. PowerSync can be evaluated later when the local schema and remote sync contract are stable.

Sync requirements:

- Use UUIDs for all records.
- Allow client-generated UUIDs for offline-created records.
- Use `created_at`, `updated_at`, `deleted_at`, and `version` on important tables.
- Use soft deletes instead of permanent deletes.
- Make sync operations idempotent.
- Add unique constraints where retries or double taps can create duplicates.
- Record sync attempts and failures in privacy-safe logs.
- Resolve conflicts deterministically where possible and present user-facing conflict choices only when necessary.

Conflict cases to design for:

- Editing a deleted Trail.
- Deleting a Chamber with existing Trails.
- Deleting a category still used by Trails.
- Creating the same transfer twice.
- Multiple devices editing the same record.
- Offline retry after a partial network failure.
- Timezone mistakes around month boundaries.
- User status changes while offline.

## Data Model Roadmap

The first schema should include these concepts:

- `profiles`.
- `chambers`.
- `categories`.
- `trails`.
- `trail_transfers`.
- `mounds`.
- `sync_queue`.
- `sync_conflicts`.
- `receipt_files`.
- `activity_events`.

Every user-owned table must include `user_id`, use UUID primary keys, and enforce ownership through RLS.

Money columns should use integer minor units where possible, such as cents, to avoid floating-point errors. If decimal storage is required, use strict numeric precision and validation.

## Security Roadmap

Security principles:

- Never trust the frontend.
- Validate money-related data on frontend and backend.
- Use Supabase Auth for authentication.
- Enable email verification.
- Enable RLS on all user-owned tables.
- Users can only read, insert, update, delete, or soft-delete their own rows.
- Never expose secret keys in the mobile app.
- Reject zero or negative transaction amounts.
- Restrict transaction types to income, expense, and transfer.
- Restrict chamber/account types to allowed values.
- For transfers, require a destination chamber and prevent same-chamber transfers.
- Verify all referenced records belong to the authenticated user.
- Verify JWTs inside Edge Functions.
- Never trust `user_id` from request bodies.
- Rate-limit sensitive backend actions.
- Keep logs privacy-safe.
- Do not send sensitive financial data to analytics tools.
- Do not include balances, notes, account names, tokens, or PINs in crash reports.
- Add PIN or biometric app lock.
- Hide or blur balances when the app backgrounds.
- Never store raw bank credentials.
- Follow OWASP mobile security practices as the app matures.

## DevOps Roadmap

Required checks before production-facing work:

- TypeScript type checking.
- ESLint.
- Prettier.
- Jest unit tests.
- React Native Testing Library tests.
- Maestro or Detox end-to-end tests.
- Supabase local CLI database tests.
- RLS tests proving User A cannot access User B data.
- Migration review for destructive changes.
- EAS internal builds.
- EAS Update release channels.
- GitHub Actions CI.

Use separate local, staging, and production environments. Never test risky sync or migration changes directly in production.

## Delivery Phases

### Phase 0: Documentation and Guardrails

- Create `plan.md`, `audit.md`, and `AGENTS.md`.
- Record the product language, security model, and implementation standards.
- Keep secrets out of repo files.
- Status: complete as of May 25, 2026. See `docs/phase-0-1-closeout.md`.

### Phase 1: Expo Foundation

- Scaffold Expo SDK 54 with TypeScript.
- Add Expo Router.
- Add theme tokens and shared UI primitives.
- Add empty route shells for Nest Overview, Chambers, Trails, Mounds, Colony Report, and Settings.
- Add typecheck, lint, format, and Jest setup.
- Add Docker/Supabase local diagnostics and a non-Realtime local Supabase start path.
- Status: complete as of May 25, 2026. See `docs/phase-0-1-closeout.md`.

### Phase 2: Local-First MVP

- Implement SQLite schema.
- Implement local Chambers and Trails.
- Add Foraged In, Foraged Out, and Trail Transfer flows.
- Add local summaries for Nest Overview.
- Add balance hiding and basic app lock.

### Phase 3: Supabase Cloud Sync

- Add Supabase Auth.
- Add Postgres migrations with RLS and constraints.
- Add sync queue and idempotent push/pull.
- Add Edge Functions for sensitive operations.
- Add cross-user RLS tests.

### Phase 4: Trust and Reliability

- Add Scout Warnings.
- Add sync conflict handling.
- Add backup/export.
- Add privacy-safe activity history.
- Add receipt storage with private buckets and signed URLs.

### Phase 5: Production Maturity

- Add full E2E coverage for critical money flows.
- Add staging and production release channels.
- Add monitoring with redaction.
- Add audit logs for important actions.
- Add data export and account deletion workflows.
- Evaluate PowerSync if custom sync becomes costly.

## Acceptance Criteria

Formica is production-ready only when:

- User-owned data is protected by RLS and tested.
- Critical money operations are validated server-side.
- Offline writes are idempotent and conflict-aware.
- UI surfaces remain calm, readable, and consistent with the Formica vocabulary.
- Secrets are never committed or exposed in the app bundle.
- CI runs typecheck, lint, unit tests, UI tests, database tests, and at least one release build check.
