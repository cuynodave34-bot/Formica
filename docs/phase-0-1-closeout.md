# Phase 0 and Phase 1 Closeout

Date: May 25, 2026

## Status

Phase 0 and Phase 1 are complete for the initial scaffold baseline.

## Phase 0: Documentation and Guardrails

- Created `plan.md`, `audit.md`, and `AGENTS.md`.
- Added `README.md` with local setup, verification, and Supabase notes.
- Added `.env.example` with placeholder values only.
- Added `.gitignore` coverage for env files, build outputs, native generated folders, Expo logs, and dependencies.
- Added CI with Node.js `20.19.0`, npm install, typecheck, lint, tests, Expo dependency check, and public Expo config output.
- Added Codex Run action via `.codex/environments/environment.toml`.
- Added `scripts/verify-phase-0-1.mjs` so future agents can verify the baseline without rereading every doc manually.

## Phase 1: Expo Foundation

- Scaffolded Expo SDK 54 with TypeScript.
- Configured Expo Router with route shells for Nest Overview, Chambers, Trails, Mounds, Colony Report, and Settings.
- Installed Expo Router peer dependencies and added an explicit Expo Metro config.
- Added Formica theme tokens and shared `Card` / `Screen` primitives.
- Added Supabase client setup with environment variables and SecureStore session storage.
- Added Supabase local project configuration and an initial migration with UUIDs, RLS, soft deletes, version fields, idempotency keys, constraints, and a summary view.
- Added Jest, React Native Testing Library dependency, ESLint, Prettier, Expo Doctor, EAS on-demand script, Docker readiness script, and Supabase local scripts.

## Tooling Notes

- Docker Desktop 4.73.0 was installed through `winget` because Supabase local development needs Docker.
- The full Supabase stack failed when local Realtime initialized. The Phase 1 default is therefore `npm run supabase:start`, which runs `supabase start --exclude realtime`.
- Realtime is intentionally excluded until the app has a concrete Realtime use case. Use `npm run supabase:start:full` later when diagnosing or enabling Realtime.
- Local Supabase database migrations were applied successfully through `npm run supabase:db:start`.
- Heavy CLIs such as EAS are kept as pinned `npx` scripts instead of repo dependencies to avoid expanding `node_modules` on a low-space Windows drive.

## Follow-Ups For Phase 2

- Build the real SQLite schema and local repository layer.
- Replace sample Nest Overview data with SQLite-backed aggregates.
- Add real Trail entry forms with validation.
- Add local Chamber CRUD.
- Add app-lock and hidden-balance state.
- Add tests for money formatting, Trail validation, and SQLite migrations.
