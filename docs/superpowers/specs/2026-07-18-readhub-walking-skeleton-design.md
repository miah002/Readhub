# READHub — Walking Skeleton Design

## Context
READHub is a school-based reading intervention platform (San Joaquin Elementary ARAL program). Full product design already exists and is approved: `../../../../design_handoff_readhub/READHub_design_reference.dc.html` (interactive prototype, high-fidelity, final) and `../../../../design_handoff_readhub/README.md` (structured handoff spec — screens, design tokens, data shape, EN/FIL copy). This document does not re-derive the product design; it scopes the first technical implementation pass.

## Goal
Prove the target stack (Next.js + Supabase) end-to-end with a thin vertical slice before building all 12 screens. Real auth, real data, real writes — not stubs — for a reduced screen set.

## Stack
- Next.js 14+, App Router, TypeScript
- Tailwind CSS — theme configured from the README's design tokens (colors, radii, shadows, type scale)
- Fonts: Fredoka + Nunito via `next/font/google`
- Supabase: Auth (email/password) + Postgres, via `@supabase/ssr` for cookie-based sessions in App Router
- Deploy target: Vercel (not deployed in this pass)

## Folder Structure
```
readhub-app/
  app/
    (public)/page.tsx           Home
    login/page.tsx              Teacher Login
    dashboard/page.tsx          Dashboard (protected)
    repository/page.tsx         Reading Repository (protected)
    repository/[id]/page.tsx    Passage Reader (protected)
  components/                   shared UI (Card, Button, Badge, NavHeader, LevelBadge, LanguageToggle...)
  lib/supabase/                 client.ts (browser), server.ts (server component/action), middleware.ts
  lib/i18n/                     EN/FIL string dictionaries + toggle context
  supabase/migrations/          SQL schema (skeleton subset)
```

## Auth
Supabase email/password. Middleware protects `/dashboard` and `/repository/*`, redirecting unauthenticated requests to `/login`. Replaces the prototype's always-succeeds stub login per README's explicit instruction.

## Database Schema (skeleton subset)
Full schema is in the README's "State Management" section; this pass implements only what the skeleton screens need.

- **teachers** — mirrors `auth.users` (id, display_name); RLS: row visible only to its own `auth.uid()`
- **learners** — id, teacher_id (FK → teachers), name, grade, level (`beginning|developing|transitioning`), progress_pct, avatar_initials; RLS: only rows where `teacher_id = auth.uid()`
- **passages** — id, title, theme, grade, level, language (`EN|FIL`), competency, quarter, minutes, emoji, cover_bg, body (`text[]`, one entry per paragraph), status (`published|pending|revision`), source (`teacher|ai`), created_by, created_at; RLS: `status = 'published'` readable by any authenticated teacher, full row visible to `created_by`. **Correction from initial draft:** the prototype (checked against `READHub_design_reference.dc.html` state) models each passage as a single-locale row — one `title`, one `body`, a `language` field, and the Repository's language filter chip — not bilingual `title_en`/`title_fil` columns as first drafted here. The README had flagged "EN/FIL variants or separate rows per locale" as an open modeling question; the prototype's actual behavior resolves it as separate rows per locale, so the schema follows that.
- **assignments** — passage_id (FK → passages), learner_id (FK → learners), assigned_by, assigned_at; RLS: visible/writable only by the assigning teacher

## Screens in Scope
1. **Home** — public, static content per README section 1 (no DB reads)
2. **Teacher Login** — real Supabase Auth email/password sign-in, routes to Dashboard on success
3. **Dashboard** — real learner stats and "My Learners" list queried from `learners`/`assignments`
4. **Reading Repository** — real passage list from `passages` (`status = 'published'`), client-side filter chips per README section 4
5. **Passage Reader** — real passage detail; Assign flow writes rows into `assignments` and increments the learner's assigned-passage count (via the join, not a client-side counter — see README's "real implementation" note)

Nav links to the other 7 screens (Profiles, Content Studio, Assessments, Reports, Notifications, Resources, Admin) exist but route to a placeholder page — not built this pass.

## Out of Scope (this pass)
Content Studio (upload + AI draft), Assessments, Reports, Notifications, Resource Library, Admin Panel, Learner Profiles detail, file upload / Supabase Storage, real AI draft generation, EN/FIL translation content beyond what the 5 in-scope screens need.

## Testing
Not decided yet — left to the implementation plan (writing-plans) to propose given whatever test runner Next.js scaffolding pulls in.

## Open Question Carried Forward
Supabase project credentials (URL/anon key) don't exist yet — user will create the Supabase project separately and provide them before the auth/data wiring steps can run against a live backend. Scaffolding and migration-writing can proceed without them.
