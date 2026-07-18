# READHub Walking Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a working Next.js + Supabase walking skeleton of READHub covering Home, Teacher Login, Dashboard, Reading Repository, and Passage Reader (with real assign-to-learner writes), per `docs/superpowers/specs/2026-07-18-readhub-walking-skeleton-design.md`.

**Architecture:** Next.js 14 App Router with Server Components fetching from Supabase (Postgres + Auth via `@supabase/ssr`), each data-bearing route split into a thin server `page.tsx` (fetch) + a pure presentational `*View` component (props in, JSX out) so business logic and rendering are unit-testable with Vitest/RTL without a live database. Middleware protects `/dashboard` and `/repository/*`.

**Tech Stack:** Next.js 14 (App Router, TypeScript), Tailwind CSS 3, `next/font/google` (Fredoka + Nunito), `@supabase/ssr` + `@supabase/supabase-js`, Vitest + `@testing-library/react` (unit/component), Playwright (e2e).

## Global Constraints

- Next.js version pinned to **14** (`create-next-app@14`) — Next 14's `cookies()` and route `params` are synchronous; do not use the Next 15+ async/Promise forms.
- Design tokens (colors, radii, shadows, fonts) come verbatim from `design_handoff_readhub/README.md` — do not invent new colors.
- All user-facing copy must have EN and FIL entries pulled verbatim from `design_handoff_readhub/READHub_design_reference.dc.html`'s `STR` object, except where this plan explicitly documents a deliberate correction.
- Only these 5 screens get real implementations this pass: Home, Teacher Login, Dashboard, Reading Repository, Passage Reader. The other 7 nav destinations render a placeholder page.
- `status = 'published'` is the only passage visibility gate for the Repository — no client-side status filtering.
- Assignments are persisted rows (`assignments` table), never a client-side counter.
- Package manager: npm.

---

## Task 1: Scaffold Next.js App, Tailwind Tokens, Fonts, Test Infra

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `app/globals.css`, `app/layout.tsx` (temporary minimal version, replaced in Task 7), `app/page.tsx` (temporary, replaced in Task 8)
- Create: `vitest.config.ts`, `vitest.setup.ts`, `playwright.config.ts`, `.env.local.example`, `.gitignore` additions

**Interfaces:**
- Produces: Tailwind color tokens `cream`, `cardBorder`, `cardAlt`, `ink`, `inkSub`, `inkMuted`, `coral`, `teal`, `amber`, `purple` (flat hex, no nested keys). Font families `font-display` (Fredoka) and `font-sans` (Nunito) via CSS vars `--font-fredoka` / `--font-nunito`.

- [ ] **Step 1: Scaffold the app**

Run from `readhub-app/`:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm
```
When prompted about the non-empty directory (it contains `docs/` and `.git`), proceed — there are no conflicting files.

- [ ] **Step 2: Verify the scaffold builds**

Run: `npm run build`
Expected: build succeeds, ends with a route summary table.

- [ ] **Step 3: Install runtime and test dependencies**

```bash
npm install clsx
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test
```

- [ ] **Step 4: Configure Tailwind design tokens**

Replace `tailwind.config.ts` content:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF6EA',
        cardBorder: '#F0E4D0',
        cardAlt: '#FDF7EC',
        ink: '#33303E',
        inkSub: '#6E6A7A',
        inkMuted: '#A79883',
        coral: '#F04E37',
        teal: '#29B6A4',
        amber: '#F5A623',
        purple: '#7A6CF0',
      },
      fontFamily: {
        display: ['var(--font-fredoka)', 'sans-serif'],
        sans: ['var(--font-nunito)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Set up Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

- [ ] **Step 6: Set up Playwright**

Create `playwright.config.ts`:
```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://localhost:3000' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true },
})
```

- [ ] **Step 7: Add test scripts to `package.json`**

Add to the `scripts` block:
```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test"
```

- [ ] **Step 8: Add Supabase env template**

Create `.env.local.example`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Confirm `.gitignore` already excludes `.env*.local` (create-next-app sets this by default).

- [ ] **Step 9: Verify Vitest runs (smoke check)**

Create `lib/smoke.test.ts` temporarily:
```ts
import { describe, it, expect } from 'vitest'
describe('smoke', () => { it('runs', () => expect(1 + 1).toBe(2)) })
```
Run: `npm test`
Expected: 1 passed.
Delete `lib/smoke.test.ts` after confirming.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 14 app with Tailwind tokens and test infra"
```

---

## Task 2: i18n Dictionaries + LanguageProvider

**Files:**
- Create: `lib/i18n/dictionary.ts`, `lib/i18n/en.ts`, `lib/i18n/fil.ts`, `lib/i18n/dictionaries.test.ts`
- Create: `lib/i18n/language-context.tsx`, `lib/i18n/language-context.test.tsx`

**Interfaces:**
- Produces: `Dictionary` type; `en: Dictionary`, `fil: Dictionary`; `LanguageProvider`, `useLanguage(): { lang: 'en' | 'fil'; dict: Dictionary; setLang: (lang: 'en' | 'fil') => void }`.
- Consumes: nothing (foundational).

- [ ] **Step 1: Write the dictionary shape-parity test (fails first — no files exist yet)**

Create `lib/i18n/dictionaries.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { en } from './en'
import { fil } from './fil'

function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) {
    return obj.length ? keyPaths(obj[0], `${prefix}[]`) : [prefix]
  }
  if (obj && typeof obj === 'object') {
    return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) =>
      keyPaths(v, prefix ? `${prefix}.${k}` : k)
    )
  }
  return [prefix]
}

describe('dictionaries', () => {
  it('en and fil expose the same key paths', () => {
    expect(keyPaths(fil).sort()).toEqual(keyPaths(en).sort())
  })
})
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npx vitest run lib/i18n/dictionaries.test.ts`
Expected: FAIL — cannot find module `./en`.

- [ ] **Step 3: Write the `Dictionary` type**

Create `lib/i18n/dictionary.ts`:
```ts
export interface Dictionary {
  nav: {
    home: string; repository: string; profiles: string; content: string
    assessments: string; reports: string; resources: string; dashboard: string
  }
  header: { login: string; logout: string }
  footer: string
  levels: { beginning: string; developing: string; transitioning: string; all: string }
  home: {
    tagline: string; heroTitle: string; heroSub: string; startReading: string; teacherLogin: string
    todaysReading: string; exploreTitle: string; exploreSub: string; howTitle: string; howSub: string
    heroStats: { passages: string; languages: string; gradeLevels: string }
    features: { title: string; desc: string }[]
    steps: { title: string; desc: string }[]
  }
  login: {
    title: string; subtitle: string; emailLabel: string; passwordLabel: string
    loginBtn: string; forgot: string; backHome: string; errorInvalid: string
  }
  dashboard: {
    welcome: string; assignReading: string; readingProgress: string; vsQuarter: string; avgSessions: string
    myLearners: string; viewAll: string; learnersWord: string; passagesWord: string
    stats: {
      materials: { title: string; unit: string }
      learners: { title: string; unit: string }
      week: { title: string; unit: string }
    }
  }
  repository: {
    title: string; subtitle: string; filters: string; gradeLevel: string; readingLevel: string
    competency: string; quarter: string; language: string; assign: string; noResults: string; passagesFound: string
  }
  reader: { assign: string; backToList: string; selectLearners: string; confirmAssign: string; assignedTo: string }
}
```

- [ ] **Step 4: Write the English dictionary**

Create `lib/i18n/en.ts`:
```ts
import type { Dictionary } from './dictionary'

export const en = {
  nav: { home: 'Home', repository: 'Repository', profiles: 'Profiles', content: 'Content', assessments: 'Assess', reports: 'Reports', resources: 'Resource', dashboard: 'Dashboard' },
  header: { login: 'Teacher Login', logout: 'Log Out' },
  footer: 'Reading Enhancement through AI-Assisted Digital Hub',
  levels: { beginning: 'Beginning', developing: 'Developing', transitioning: 'Transitioning', all: 'All' },
  home: {
    tagline: 'AI-Assisted Reading Intervention for ARAL',
    heroTitle: 'Differentiated reading support for every struggling reader.',
    heroSub: 'READHub centralizes validated reading passages, instructional resources, and progress monitoring so teachers can plan differentiated ARAL interventions with confidence.',
    startReading: 'Browse Reading',
    teacherLogin: 'Teacher Login',
    todaysReading: "Today's Reading",
    exploreTitle: 'Explore READHub',
    exploreSub: 'Everything you need to guide a young reader in one friendly place.',
    howTitle: 'The intervention loop',
    howSub: 'A simple cycle that keeps differentiated instruction organized from assessment to report.',
    heroStats: { passages: 'Passages', languages: 'Languages', gradeLevels: 'Grade levels' },
    features: [
      { title: 'Reading Repository', desc: 'Validated passages organized by grade, level, competency, quarter and language.' },
      { title: 'Learner Profiles', desc: 'CRLA/Phil-IRI results, instructional level, intervention history and remarks.' },
      { title: 'Content Studio', desc: 'Draft or adapt materials with AI assistance — always reviewed by teachers first.' },
      { title: 'Assessments', desc: 'Track comprehension, fluency and vocabulary checks across your class.' },
      { title: 'Reports', desc: 'Generate progress, intervention and ARAL accomplishment reports.' },
      { title: 'Resource Library', desc: 'Worksheets, teacher guides and reading logs to support every session.' },
    ],
    steps: [
      { title: 'Assess reading level', desc: 'Record CRLA or Phil-IRI results to find each learner’s instructional level.' },
      { title: 'Assign a differentiated passage', desc: 'Match reading material to grade, level and competency.' },
      { title: 'Monitor & report progress', desc: 'Track growth and generate ARAL accomplishment reports.' },
    ],
  },
  login: {
    title: 'Teacher Login',
    subtitle: 'Sign in to view your learners, assign reading, and track ARAL intervention progress.',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    loginBtn: 'Log In',
    forgot: 'Forgot password?',
    backHome: '← Back to Home',
    errorInvalid: 'Invalid email or password.',
  },
  dashboard: {
    welcome: 'WELCOME BACK',
    assignReading: 'Assign Reading',
    readingProgress: 'Reading Progress',
    vsQuarter: 'vs last quarter',
    avgSessions: 'sessions / week',
    myLearners: 'My Learners',
    viewAll: 'View all',
    learnersWord: 'learners',
    passagesWord: 'passages',
    stats: {
      materials: { title: 'Reading Materials', unit: 'passages' },
      learners: { title: 'My Learners', unit: 'learners' },
      week: { title: 'This Week', unit: 'assignments' },
    },
  },
  repository: {
    title: 'Reading Repository',
    subtitle: 'Find the perfect passage — filter by grade, level, theme and language.',
    filters: 'Filters',
    gradeLevel: 'Grade Level',
    readingLevel: 'Reading Level',
    competency: 'Competency',
    quarter: 'Quarter',
    language: 'Language',
    assign: 'Assign',
    noResults: 'No passages match those filters yet.',
    passagesFound: 'passages found',
  },
  reader: {
    assign: 'Assign',
    backToList: 'Back to Repository',
    selectLearners: 'Select Learners',
    confirmAssign: 'Confirm Assignment',
    assignedTo: 'Assigned to',
  },
} satisfies Dictionary
```

- [ ] **Step 5: Write the Filipino dictionary**

Create `lib/i18n/fil.ts`:
```ts
import type { Dictionary } from './dictionary'

export const fil = {
  nav: { home: 'Home', repository: 'Imbakan', profiles: 'Profile', content: 'Content', assessments: 'Pagtatasa', reports: 'Ulat', resources: 'Resource', dashboard: 'Dashboard' },
  header: { login: 'Login ng Guro', logout: 'Mag-log Out' },
  footer: 'Reading Enhancement through AI-Assisted Digital Hub',
  levels: { beginning: 'Nagsisimula', developing: 'Umuunlad', transitioning: 'Lumilipat', all: 'Lahat' },
  home: {
    tagline: 'Tulong sa Bawat Batang Nagbabasa',
    heroTitle: 'Bawat bata, tiwalang bumabasa.',
    heroSub: 'Tinutulungan ng READHub ang mga guro na mag-organisa ng mga wastong babasahin, instructional resources, at pagsubaybay ng progreso para makapagplano nang may kumpiyansa ng differentiated ARAL interventions.',
    startReading: 'Tingnan ang Babasahin',
    teacherLogin: 'Login ng Guro',
    todaysReading: 'Babasahin Ngayon',
    exploreTitle: 'Tuklasin ang READHub',
    exploreSub: 'Lahat ng kailangan mo para gabayan ang batang bumabasa, nasa isang lugar.',
    howTitle: 'Paano ito gumagana',
    howSub: 'Simpleng proseso na nagpapanatiling maayos ang differentiated instruction mula sa pagtatasa hanggang sa ulat.',
    heroStats: { passages: 'Babasahin', languages: 'Wika', gradeLevels: 'Baitang' },
    features: [
      { title: 'Imbakan ng Babasahin', desc: 'Mga wastong babasahin na inayos ayon sa baitang, antas, competency, quarter at wika.' },
      { title: 'Profile ng Mag-aaral', desc: 'Resulta ng CRLA/Phil-IRI, instructional level, kasaysayan ng interbensyon at puna.' },
      { title: 'Content Studio', desc: 'Gumawa o baguhin ng materyales gamit ang AI — laging sinusuri ng guro bago ilathala.' },
      { title: 'Pagtatasa', desc: 'Subaybayan ang pag-unawa, katatasan at bokabularyo ng iyong klase.' },
      { title: 'Ulat', desc: 'Bumuo ng ulat sa progreso, interbensyon at ARAL accomplishment.' },
      { title: 'Resource Library', desc: 'Worksheet, gabay ng guro at reading log para sa bawat sesyon.' },
    ],
    steps: [
      { title: 'Suriin ang antas ng pagbasa', desc: 'Itala ang resulta ng CRLA o Phil-IRI para malaman ang instructional level ng bawat mag-aaral.' },
      { title: 'Magtakda ng naaangkop na babasahin', desc: 'Itugma ang babasahin sa baitang, antas at competency.' },
      { title: 'Subaybayan at mag-ulat ng progreso', desc: 'Subaybayan ang paglago at bumuo ng ulat ng ARAL accomplishment.' },
    ],
  },
  login: {
    title: 'Login ng Guro',
    subtitle: 'Mag-sign in para makita ang iyong mga mag-aaral, magtakda ng babasahin, at subaybayan ang progreso ng ARAL intervention.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginBtn: 'Mag-log In',
    forgot: 'Nakalimutan ang password?',
    backHome: '← Bumalik sa Home',
    errorInvalid: 'Maling email o password.',
  },
  dashboard: {
    welcome: 'MALIGAYANG PAGBABALIK',
    assignReading: 'Magtakda ng Babasahin',
    readingProgress: 'Progreso sa Pagbasa',
    vsQuarter: 'kumpara sa nakaraan',
    avgSessions: 'sesyon / linggo',
    myLearners: 'Aking mga Mag-aaral',
    viewAll: 'Tingnan lahat',
    learnersWord: 'mag-aaral',
    passagesWord: 'babasahin',
    stats: {
      materials: { title: 'Mga Babasahin', unit: 'babasahin' },
      learners: { title: 'Aking mga Mag-aaral', unit: 'mag-aaral' },
      week: { title: 'Ngayong Linggo', unit: 'itinakda' },
    },
  },
  repository: {
    title: 'Imbakan ng Babasahin',
    subtitle: 'Hanapin ang tamang babasahin — salain ayon sa baitang, antas, tema at wika.',
    filters: 'Mga Salaan',
    gradeLevel: 'Baitang',
    readingLevel: 'Antas ng Pagbasa',
    competency: 'Competency',
    quarter: 'Quarter',
    language: 'Wika',
    assign: 'Itakda',
    noResults: 'Walang babasahing tumutugma sa mga salaan.',
    passagesFound: 'babasahing nahanap',
  },
  reader: {
    assign: 'Itakda',
    backToList: 'Bumalik sa Listahan',
    selectLearners: 'Pumili ng mga Mag-aaral',
    confirmAssign: 'Kumpirmahin ang Pagtakda',
    assignedTo: 'Itinakda kay',
  },
} satisfies Dictionary
```

Note: the prototype's FIL `steps` copy (design_handoff's `STR.fil.steps`) is mistranslated in the source design file — it describes a different parent-facing flow than the EN teacher-facing "Assess / Assign / Monitor" steps. This dictionary uses a correct FIL translation of the EN meaning instead of copying that mismatch, mirroring the correction precedent already noted in the walking-skeleton spec's passages schema section.

- [ ] **Step 6: Run the dictionary test, confirm it passes**

Run: `npx vitest run lib/i18n/dictionaries.test.ts`
Expected: PASS.

- [ ] **Step 7: Write the LanguageProvider test (fails first)**

Create `lib/i18n/language-context.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { LanguageProvider, useLanguage } from './language-context'

function Probe() {
  const { lang, dict, setLang } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="title">{dict.login.title}</span>
      <button onClick={() => setLang('fil')}>switch</button>
    </div>
  )
}

describe('LanguageProvider', () => {
  it('defaults to en and switches to fil on demand', async () => {
    render(<LanguageProvider><Probe /></LanguageProvider>)
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
    expect(screen.getByTestId('title')).toHaveTextContent('Teacher Login')
    await userEvent.click(screen.getByText('switch'))
    expect(screen.getByTestId('lang')).toHaveTextContent('fil')
    expect(screen.getByTestId('title')).toHaveTextContent('Login ng Guro')
  })
})
```

- [ ] **Step 8: Run test, confirm it fails**

Run: `npx vitest run lib/i18n/language-context.test.tsx`
Expected: FAIL — cannot find module `./language-context`.

- [ ] **Step 9: Implement LanguageProvider**

Create `lib/i18n/language-context.tsx`:
```tsx
'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { en } from './en'
import { fil } from './fil'
import type { Dictionary } from './dictionary'

type LangCode = 'en' | 'fil'

interface LanguageContextValue {
  lang: LangCode
  dict: Dictionary
  setLang: (lang: LangCode) => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const DICTS: Record<LangCode, Dictionary> = { en, fil }

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en')
  return (
    <LanguageContext.Provider value={{ lang, dict: DICTS[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
```

- [ ] **Step 10: Run test, confirm it passes**

Run: `npx vitest run lib/i18n/language-context.test.tsx`
Expected: PASS.

- [ ] **Step 11: Commit**

```bash
git add lib/i18n
git commit -m "feat: add EN/FIL dictionaries and LanguageProvider"
```

---

## Task 3: Domain Types, Level Color Constants, Database Migration

**Files:**
- Create: `lib/types.ts`, `lib/level-colors.ts`
- Create: `supabase/migrations/0001_init.sql`

**Interfaces:**
- Produces: `Level = 'beginning' | 'developing' | 'transitioning'`, `Language = 'EN' | 'FIL'`, `Learner`, `Passage`, `Assignment` interfaces; `LEVEL_COLOR: Record<Level, string>`, `LEVEL_TINT: Record<Level, string>`.
- Consumes: nothing.

- [ ] **Step 1: Write domain types**

Create `lib/types.ts`:
```ts
export type Level = 'beginning' | 'developing' | 'transitioning'
export type Language = 'EN' | 'FIL'
export type PassageStatus = 'published' | 'pending' | 'revision'
export type PassageSource = 'teacher' | 'ai'

export interface Learner {
  id: string
  teacher_id: string
  name: string
  grade: string
  level: Level
  progress_pct: number
  avatar_initials: string
}

export interface Passage {
  id: string
  title: string
  theme: string
  grade: string
  level: Level
  language: Language
  competency: string
  quarter: string
  minutes: number
  emoji: string
  cover_bg: string
  body: string[]
  status: PassageStatus
  source: PassageSource
  created_by: string
}

export interface Assignment {
  id: string
  passage_id: string
  learner_id: string
  assigned_by: string
  assigned_at: string
}
```

- [ ] **Step 2: Write level color constants**

Create `lib/level-colors.ts`:
```ts
import type { Level } from './types'

export const LEVEL_COLOR: Record<Level, string> = {
  beginning: '#F04E37',
  developing: '#F5A623',
  transitioning: '#29B6A4',
}

export const LEVEL_TINT: Record<Level, string> = {
  beginning: '#FFE0D8',
  developing: '#FEEFCB',
  transitioning: '#DFF6F1',
}
```

- [ ] **Step 3: Write the database migration**

Create `supabase/migrations/0001_init.sql`:
```sql
create extension if not exists pgcrypto;

create table teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);
alter table teachers enable row level security;
create policy "Teachers can view own row" on teachers for select using (auth.uid() = id);
create policy "Teachers can update own row" on teachers for update using (auth.uid() = id);
create policy "Teachers can insert own row" on teachers for insert with check (auth.uid() = id);

create table learners (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  name text not null,
  grade text not null,
  level text not null check (level in ('beginning','developing','transitioning')),
  progress_pct int not null default 0 check (progress_pct between 0 and 100),
  avatar_initials text not null,
  created_at timestamptz not null default now()
);
alter table learners enable row level security;
create policy "Teachers manage own learners" on learners
  for all using (auth.uid() = teacher_id) with check (auth.uid() = teacher_id);

create table passages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  theme text not null,
  grade text not null,
  level text not null check (level in ('beginning','developing','transitioning')),
  language text not null check (language in ('EN','FIL')),
  competency text not null,
  quarter text not null,
  minutes int not null,
  emoji text not null,
  cover_bg text not null,
  body text[] not null,
  status text not null default 'pending' check (status in ('published','pending','revision')),
  source text not null default 'teacher' check (source in ('teacher','ai')),
  created_by uuid not null references teachers(id),
  created_at timestamptz not null default now()
);
alter table passages enable row level security;
create policy "Published passages readable by any teacher" on passages
  for select using (status = 'published' or created_by = auth.uid());
create policy "Teachers insert own passages" on passages
  for insert with check (created_by = auth.uid());
create policy "Teachers update own passages" on passages
  for update using (created_by = auth.uid());

create table assignments (
  id uuid primary key default gen_random_uuid(),
  passage_id uuid not null references passages(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  assigned_by uuid not null references teachers(id),
  assigned_at timestamptz not null default now()
);
alter table assignments enable row level security;
create policy "Teachers manage own assignments" on assignments
  for all using (assigned_by = auth.uid()) with check (assigned_by = auth.uid());
```

- [ ] **Step 4: Manual verification checklist (no live Supabase project yet — see spec's open question)**

Review the SQL against `design_handoff_readhub/README.md`'s "State Management" section field-by-field:
- [ ] `teachers` mirrors `auth.users` with `display_name`, RLS scoped to `auth.uid()` — matches spec line 37.
- [ ] `learners` has `teacher_id` FK, `level` enum, `progress_pct`, `avatar_initials`, RLS `teacher_id = auth.uid()` — matches spec line 38.
- [ ] `passages` is single-locale per row (`title`, `body`, `language`) not bilingual columns, `status` enum, RLS: published readable by any teacher, full row visible to creator — matches spec line 39's correction.
- [ ] `assignments` has `passage_id`/`learner_id` FKs, RLS scoped to `assigned_by` — matches spec line 40.

If the Supabase CLI is installed and linked to a project, optionally run `npx supabase db push` once credentials exist (`.env.local` filled in) to apply this migration — not required to complete this task.

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/level-colors.ts supabase/migrations
git commit -m "feat: add domain types, level color tokens, and initial DB schema"
```

---

## Task 4: Supabase Client Helpers + Route Protection Middleware

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Create: `lib/supabase/protected-paths.ts`, `lib/supabase/protected-paths.test.ts`
- Create: `middleware.ts` (repo root)

**Interfaces:**
- Produces: `createClient()` (browser, from `lib/supabase/client.ts`), `createClient()` (server, from `lib/supabase/server.ts`, synchronous per Next 14), `isProtectedPath(pathname: string): boolean`.
- Consumes: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars.

- [ ] **Step 1: Install Supabase packages**

```bash
npm install @supabase/ssr @supabase/supabase-js
```

- [ ] **Step 2: Write the protected-paths test (fails first)**

Create `lib/supabase/protected-paths.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { isProtectedPath } from './protected-paths'

describe('isProtectedPath', () => {
  it('matches /dashboard and its subpaths', () => {
    expect(isProtectedPath('/dashboard')).toBe(true)
    expect(isProtectedPath('/dashboard/settings')).toBe(true)
  })
  it('matches /repository and its subpaths', () => {
    expect(isProtectedPath('/repository')).toBe(true)
    expect(isProtectedPath('/repository/abc-123')).toBe(true)
  })
  it('does not match unrelated or prefix-lookalike paths', () => {
    expect(isProtectedPath('/')).toBe(false)
    expect(isProtectedPath('/login')).toBe(false)
    expect(isProtectedPath('/repositoryFoo')).toBe(false)
  })
})
```

- [ ] **Step 3: Run test, confirm it fails**

Run: `npx vitest run lib/supabase/protected-paths.test.ts`
Expected: FAIL — cannot find module `./protected-paths`.

- [ ] **Step 4: Implement `isProtectedPath`**

Create `lib/supabase/protected-paths.ts`:
```ts
const PROTECTED_PREFIXES = ['/dashboard', '/repository']

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}
```

- [ ] **Step 5: Run test, confirm it passes**

Run: `npx vitest run lib/supabase/protected-paths.test.ts`
Expected: PASS.

- [ ] **Step 6: Write the browser Supabase client**

Create `lib/supabase/client.ts`:
```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 7: Write the server Supabase client**

Create `lib/supabase/server.ts`:
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {
            // Called from a Server Component — middleware refreshes the session instead.
          }
        },
      },
    }
  )
}
```

- [ ] **Step 8: Write the middleware**

Create `middleware.ts` at the repo root:
```ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { isProtectedPath } from '@/lib/supabase/protected-paths'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/repository/:path*'],
}
```

Note: the `matcher` already scopes middleware invocation to the two protected trees, so `isProtectedPath` is redundant with it today — it's kept because it's independently unit-tested (Step 2-5) and is the single source of truth if the matcher list and the redirect condition ever need to diverge (e.g. adding a protected path that isn't a static Next.js matcher literal).

- [ ] **Step 9: Commit**

```bash
git add lib/supabase middleware.ts
git commit -m "feat: add Supabase client helpers and route-protection middleware"
```

---

## Task 5: Core UI Primitives (Button, Card, Badge, LevelBadge)

**Files:**
- Create: `components/ui/button.tsx`, `components/ui/button.test.tsx`
- Create: `components/ui/card.tsx`, `components/ui/card.test.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/level-badge.tsx`, `components/ui/level-badge.test.tsx`

**Interfaces:**
- Produces: `Button({ variant?: 'primary'|'secondary'|'ghost'|'teal'|'purple', ...ButtonHTMLAttributes })`, `Card(...HTMLAttributes<HTMLDivElement>)`, `Badge(...HTMLAttributes<HTMLSpanElement>)`, `LevelBadge({ level: Level, label: string })`.
- Consumes: `Level` from `lib/types`, `LEVEL_COLOR`/`LEVEL_TINT` from `lib/level-colors`.

- [ ] **Step 1: Write the Button test (fails first)**

Create `components/ui/button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders children and forwards onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies the teal variant class', () => {
    render(<Button variant="teal">Log In</Button>)
    expect(screen.getByRole('button', { name: 'Log In' })).toHaveClass('bg-teal')
  })
})
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npx vitest run components/ui/button.test.tsx`
Expected: FAIL — cannot find module `./button`.

- [ ] **Step 3: Implement Button**

Create `components/ui/button.tsx`:
```tsx
import { type ButtonHTMLAttributes } from 'react'
import { clsx } from 'clsx'

type Variant = 'primary' | 'secondary' | 'ghost' | 'teal' | 'purple'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-coral text-white shadow-[0_4px_0_#C13A28]',
  secondary: 'bg-white text-ink border-2 border-cardBorder',
  ghost: 'bg-transparent text-inkMuted',
  teal: 'bg-teal text-white shadow-[0_4px_0_#1B8577]',
  purple: 'bg-purple text-white shadow-[0_4px_0_#5A4DC0]',
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx('rounded-2xl px-6 py-3 font-display font-semibold cursor-pointer', VARIANT_CLASSES[variant], className)}
      {...props}
    />
  )
}
```

- [ ] **Step 4: Run test, confirm it passes**

Run: `npx vitest run components/ui/button.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write the Card test (fails first)**

Create `components/ui/card.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card } from './card'

describe('Card', () => {
  it('renders children inside a bordered container', () => {
    render(<Card data-testid="card">Hello</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveTextContent('Hello')
    expect(card).toHaveClass('border-cardBorder')
  })
})
```

- [ ] **Step 6: Run test, confirm it fails, then implement Card**

Run: `npx vitest run components/ui/card.test.tsx` → FAIL (module missing).

Create `components/ui/card.tsx`:
```tsx
import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx('bg-white border-2 border-cardBorder rounded-[22px] p-6', className)} {...props} />
}
```

Run: `npx vitest run components/ui/card.test.tsx`
Expected: PASS.

- [ ] **Step 7: Implement Badge (no dedicated test — trivial pass-through, covered via LevelBadge)**

Create `components/ui/badge.tsx`:
```tsx
import type { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={clsx('inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold', className)} {...props} />
}
```

- [ ] **Step 8: Write the LevelBadge test (fails first)**

Create `components/ui/level-badge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LevelBadge } from './level-badge'

describe('LevelBadge', () => {
  it('renders the label with the level color', () => {
    render(<LevelBadge level="transitioning" label="Transitioning" />)
    const badge = screen.getByText('Transitioning')
    expect(badge).toHaveStyle({ color: '#29B6A4' })
  })
})
```

- [ ] **Step 9: Run test, confirm it fails, then implement LevelBadge**

Run: `npx vitest run components/ui/level-badge.test.tsx` → FAIL (module missing).

Create `components/ui/level-badge.tsx`:
```tsx
import { Badge } from './badge'
import { LEVEL_COLOR, LEVEL_TINT } from '@/lib/level-colors'
import type { Level } from '@/lib/types'

interface LevelBadgeProps {
  level: Level
  label: string
}

export function LevelBadge({ level, label }: LevelBadgeProps) {
  return <Badge style={{ color: LEVEL_COLOR[level], background: LEVEL_TINT[level] }}>{label}</Badge>
}
```

Run: `npx vitest run components/ui/level-badge.test.tsx`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add components/ui
git commit -m "feat: add Button, Card, Badge, and LevelBadge primitives"
```

---

## Task 6: NavHeader, LanguageToggle, Footer, Placeholder Pages

**Files:**
- Create: `components/language-toggle.tsx`, `components/language-toggle.test.tsx`
- Create: `components/nav-header.tsx`, `components/nav-header.test.tsx`
- Create: `components/footer.tsx`
- Create: `components/coming-soon.tsx`
- Create: `app/profiles/page.tsx`, `app/content/page.tsx`, `app/assessments/page.tsx`, `app/reports/page.tsx`, `app/notifications/page.tsx`, `app/resources/page.tsx`, `app/admin/page.tsx`

**Interfaces:**
- Consumes: `useLanguage()` from Task 2.
- Produces: `LanguageToggle({ lang, onChange })`, `NavHeader({ loggedIn, onLogout })`, `Footer()`, `ComingSoon({ title })`.

- [ ] **Step 1: Write the LanguageToggle test (fails first)**

Create `components/language-toggle.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LanguageToggle } from './language-toggle'

describe('LanguageToggle', () => {
  it('calls onChange with the clicked language', async () => {
    const onChange = vi.fn()
    render(<LanguageToggle lang="en" onChange={onChange} />)
    await userEvent.click(screen.getByText('FIL'))
    expect(onChange).toHaveBeenCalledWith('fil')
  })
})
```

- [ ] **Step 2: Run test, confirm it fails, then implement**

Run: `npx vitest run components/language-toggle.test.tsx` → FAIL (module missing).

Create `components/language-toggle.tsx`:
```tsx
'use client'
import { clsx } from 'clsx'

interface LanguageToggleProps {
  lang: 'en' | 'fil'
  onChange: (lang: 'en' | 'fil') => void
}

export function LanguageToggle({ lang, onChange }: LanguageToggleProps) {
  return (
    <div className="flex bg-[#FBEFDD] rounded-full p-1 border-2 border-cardBorder">
      <button
        type="button"
        onClick={() => onChange('en')}
        className={clsx('px-3.5 py-1.5 rounded-full text-sm font-extrabold', lang === 'en' ? 'bg-coral text-white' : 'text-inkMuted')}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange('fil')}
        className={clsx('px-3.5 py-1.5 rounded-full text-sm font-extrabold', lang === 'fil' ? 'bg-coral text-white' : 'text-inkMuted')}
      >
        FIL
      </button>
    </div>
  )
}
```

Run: `npx vitest run components/language-toggle.test.tsx`
Expected: PASS.

- [ ] **Step 3: Write the ComingSoon placeholder**

Create `components/coming-soon.tsx`:
```tsx
export function ComingSoon({ title }: { title: string }) {
  return (
    <main className="max-w-[1240px] mx-auto px-7 py-16 text-center">
      <h1 className="font-display font-bold text-3xl">{title}</h1>
      <p className="text-inkSub mt-3">This screen isn&apos;t built yet.</p>
    </main>
  )
}
```

- [ ] **Step 4: Create the 7 placeholder pages**

Create `app/profiles/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function ProfilesPage() {
  return <ComingSoon title="Profiles" />
}
```

Create `app/content/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function ContentPage() {
  return <ComingSoon title="Content Studio" />
}
```

Create `app/assessments/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function AssessmentsPage() {
  return <ComingSoon title="Assessments" />
}
```

Create `app/reports/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function ReportsPage() {
  return <ComingSoon title="Reports" />
}
```

Create `app/notifications/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function NotificationsPage() {
  return <ComingSoon title="Notifications" />
}
```

Create `app/resources/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function ResourcesPage() {
  return <ComingSoon title="Resource Library" />
}
```

Create `app/admin/page.tsx`:
```tsx
import { ComingSoon } from '@/components/coming-soon'
export default function AdminPage() {
  return <ComingSoon title="Admin Panel" />
}
```

- [ ] **Step 5: Write the Footer**

Create `components/footer.tsx`:
```tsx
'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'

export function Footer() {
  const { dict } = useLanguage()
  return (
    <footer className="border-t-2 border-cardBorder mt-5">
      <div className="max-w-[1240px] mx-auto px-7 py-6 flex items-center gap-3 flex-wrap text-inkMuted font-bold text-sm">
        <span className="font-display text-coral text-base">READHub</span>
        <span>&middot; San Joaquin Elementary School</span>
        <Link href="/admin" className="text-inkMuted font-bold">Admin Panel</Link>
        <span className="ml-auto">{dict.footer}</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: Write the NavHeader test (fails first)**

Create `components/nav-header.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { NavHeader } from './nav-header'
import { LanguageProvider } from '@/lib/i18n/language-context'

vi.mock('next/navigation', () => ({ usePathname: () => '/repository' }))

describe('NavHeader', () => {
  it('shows Teacher Login when logged out', () => {
    render(
      <LanguageProvider>
        <NavHeader loggedIn={false} onLogout={vi.fn()} />
      </LanguageProvider>
    )
    expect(screen.getByRole('link', { name: /Teacher Login/ })).toBeInTheDocument()
  })

  it('shows Log Out when logged in and highlights the active nav item', () => {
    render(
      <LanguageProvider>
        <NavHeader loggedIn={true} onLogout={vi.fn()} />
      </LanguageProvider>
    )
    expect(screen.getByRole('button', { name: 'Log Out' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Repository' })).toHaveClass('bg-[#FFE7B8]')
  })
})
```

- [ ] **Step 7: Run test, confirm it fails, then implement NavHeader**

Run: `npx vitest run components/nav-header.test.tsx` → FAIL (module missing).

Create `components/nav-header.tsx`:
```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/i18n/language-context'
import { LanguageToggle } from './language-toggle'
import { Button } from './ui/button'

const NAV_LINKS = [
  { href: '/repository', key: 'repository' as const },
  { href: '/profiles', key: 'profiles' as const },
  { href: '/content', key: 'content' as const },
  { href: '/assessments', key: 'assessments' as const },
  { href: '/reports', key: 'reports' as const },
  { href: '/resources', key: 'resources' as const },
]

interface NavHeaderProps {
  loggedIn: boolean
  onLogout: () => void
}

function navClass(active: boolean) {
  return clsx('px-3 py-2 rounded-lg font-display text-sm whitespace-nowrap', active ? 'bg-[#FFE7B8] text-[#B87B12]' : 'text-inkSub')
}

export function NavHeader({ loggedIn, onLogout }: NavHeaderProps) {
  const pathname = usePathname()
  const { dict, lang, setLang } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b-2 border-cardBorder">
      <div className="max-w-[1240px] mx-auto px-7 py-3.5 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#FF8A5B] to-coral grid place-items-center text-2xl">📖</span>
          <span className="font-display font-bold text-2xl text-coral">READHub</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
          <Link href="/" className={navClass(pathname === '/')}>{dict.nav.home}</Link>
          {NAV_LINKS.map((n) => (
            <Link key={n.href} href={n.href} className={navClass(pathname.startsWith(n.href))}>
              {dict.nav[n.key]}
            </Link>
          ))}
          {loggedIn && (
            <Link href="/dashboard" className={navClass(pathname.startsWith('/dashboard'))}>
              {dict.nav.dashboard}
            </Link>
          )}
          {loggedIn && (
            <Link href="/notifications" aria-label="Notifications" className="w-10 h-10 rounded-xl bg-[#FBEFDD] border-2 border-cardBorder grid place-items-center text-lg ml-1 flex-shrink-0">
              🔔
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle lang={lang} onChange={setLang} />
          {loggedIn ? (
            <Button variant="purple" onClick={onLogout}>{dict.header.logout}</Button>
          ) : (
            <Link href="/login">
              <Button variant="teal">{dict.header.login}</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 8: Run test, confirm it passes**

Run: `npx vitest run components/nav-header.test.tsx`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add components/language-toggle.tsx components/language-toggle.test.tsx components/nav-header.tsx components/nav-header.test.tsx components/footer.tsx components/coming-soon.tsx app/profiles app/content app/assessments app/reports app/notifications app/resources app/admin
git commit -m "feat: add NavHeader, LanguageToggle, Footer, and placeholder screens"
```

---

## Task 7: Root Layout + AppShell

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/app-shell.tsx`, `components/app-shell.test.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `NavHeader`, `Footer`, `LanguageProvider` (Tasks 2, 6), `createClient` from `lib/supabase/server` and `lib/supabase/client`.
- Produces: `AppShell({ loggedIn: boolean; children: ReactNode })`.

- [ ] **Step 1: Write the AppShell test (fails first)**

Create `components/app-shell.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AppShell } from './app-shell'
import { LanguageProvider } from '@/lib/i18n/language-context'

const push = vi.fn()
const refresh = vi.fn()
const signOut = vi.fn().mockResolvedValue({ error: null })

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push, refresh }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ auth: { signOut } }),
}))

describe('AppShell', () => {
  beforeEach(() => {
    push.mockClear()
    refresh.mockClear()
    signOut.mockClear()
  })

  it('signs out and redirects home when Log Out is clicked', async () => {
    render(
      <LanguageProvider>
        <AppShell loggedIn={true}>content</AppShell>
      </LanguageProvider>
    )
    await userEvent.click(screen.getByRole('button', { name: 'Log Out' }))
    expect(signOut).toHaveBeenCalledOnce()
    expect(push).toHaveBeenCalledWith('/')
    expect(refresh).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run test, confirm it fails, then implement AppShell**

Run: `npx vitest run components/app-shell.test.tsx` → FAIL (module missing).

Create `components/app-shell.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { NavHeader } from './nav-header'
import { Footer } from './footer'
import { createClient } from '@/lib/supabase/client'
import type { ReactNode } from 'react'

export function AppShell({ loggedIn, children }: { loggedIn: boolean; children: ReactNode }) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavHeader loggedIn={loggedIn} onLogout={handleLogout} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 3: Run test, confirm it passes**

Run: `npx vitest run components/app-shell.test.tsx`
Expected: PASS.

- [ ] **Step 4: Wire the root layout**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Fredoka, Nunito } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/i18n/language-context'
import { AppShell } from '@/components/app-shell'
import { createClient } from '@/lib/supabase/server'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-fredoka' })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'], style: ['normal', 'italic'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: 'READHub',
  description: 'Reading Enhancement through AI-Assisted Digital Hub',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${nunito.variable} font-sans bg-cream text-ink`}>
        <LanguageProvider>
          <AppShell loggedIn={!!user}>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Simplify globals.css**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: var(--font-nunito), sans-serif;
}
```

- [ ] **Step 6: Verify the app boots (manual — no Supabase credentials yet, expect an auth error in the console but the page should still render)**

Run: `npm run dev`, open `http://localhost:3000` in a browser.
Expected: header, footer, and placeholder home content render without a crashed page. A Supabase auth warning in the terminal is expected until Task 4's env vars are filled in — not a blocker for this task.

- [ ] **Step 7: Commit**

```bash
git add app/layout.tsx app/globals.css components/app-shell.tsx components/app-shell.test.tsx
git commit -m "feat: wire root layout with fonts, LanguageProvider, and AppShell"
```

---

## Task 8: Home Page

**Files:**
- Modify: `app/(public)/page.tsx` (move existing `app/page.tsx` content here; delete the old `app/page.tsx`)
- Create: `app/(public)/page.test.tsx`

**Interfaces:**
- Consumes: `useLanguage()`, `Button`, `Card`.

- [ ] **Step 1: Delete the scaffold's default home page**

```bash
rm app/page.tsx
mkdir -p "app/(public)"
```

- [ ] **Step 2: Write the Home page test (fails first)**

Create `app/(public)/page.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HomePage from './page'
import { LanguageProvider } from '@/lib/i18n/language-context'

describe('HomePage', () => {
  it('renders the hero and links to Repository and Login', () => {
    render(
      <LanguageProvider>
        <HomePage />
      </LanguageProvider>
    )
    expect(screen.getByText('Differentiated reading support for every struggling reader.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse Reading' })).toHaveAttribute('href', '/repository')
    expect(screen.getByRole('link', { name: 'Teacher Login' })).toHaveAttribute('href', '/login')
  })
})
```

- [ ] **Step 3: Run test, confirm it fails**

Run: `npx vitest run "app/(public)/page.test.tsx"`
Expected: FAIL — cannot find module `./page`.

- [ ] **Step 4: Implement the Home page**

Create `app/(public)/page.tsx`:
```tsx
'use client'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  const { dict } = useLanguage()
  const heroStats = [
    { num: '248', label: dict.home.heroStats.passages },
    { num: '2', label: dict.home.heroStats.languages },
    { num: '6', label: dict.home.heroStats.gradeLevels },
  ]
  const featureIcons = ['📚', '🧒', '🤖', '✏️', '📈', '🗂️']
  const featureHrefs = ['/repository', '/profiles', '/content', '/assessments', '/reports', '/resources']
  const stepColors = ['#FFC64B', '#FF8A5B', '#29B6A4']

  return (
    <main className="max-w-[1240px] mx-auto px-7">
      <section className="grid grid-cols-[1.05fr_.95fr] gap-10 items-center py-14">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FFE7B8] text-[#B87B12] font-extrabold text-sm px-4 py-2 rounded-full mb-5">
            ✨ {dict.home.tagline}
          </div>
          <h1 className="font-display font-bold text-[56px] leading-[1.04] tracking-[-1.5px] text-ink">{dict.home.heroTitle}</h1>
          <p className="text-lg leading-relaxed text-inkSub my-6 max-w-[520px]">{dict.home.heroSub}</p>
          <div className="flex gap-3.5 flex-wrap">
            <Link href="/repository"><Button variant="primary">{dict.home.startReading}</Button></Link>
            <Link href="/login"><Button variant="secondary">{dict.home.teacherLogin}</Button></Link>
          </div>
          <div className="flex gap-8 mt-10">
            {heroStats.map((s) => (
              <div key={s.label}>
                <div className="font-display font-bold text-3xl text-coral leading-none">{s.num}</div>
                <div className="text-sm font-bold text-inkMuted mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative h-[420px]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD98A] to-[#FFB05B] rounded-[34px] rotate-[-3deg]" />
          <div className="absolute inset-0 bg-white rounded-[34px] border-[3px] border-ink flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b-2 border-dashed border-cardBorder flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFE7B8] grid place-items-center text-lg">📚</div>
              <div className="font-display font-semibold">{dict.home.todaysReading}</div>
            </div>
            <div className="flex-1 p-5 flex items-center justify-center text-6xl">🐃</div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <h2 className="font-display font-bold text-4xl tracking-[-.5px] mb-1.5">{dict.home.exploreTitle}</h2>
        <p className="text-lg text-inkSub mb-7">{dict.home.exploreSub}</p>
        <div className="grid grid-cols-3 gap-5">
          {dict.home.features.map((f, i) => (
            <Link key={f.title} href={featureHrefs[i]} className="bg-white border-2 border-cardBorder rounded-[22px] p-6 block">
              <div className="w-14 h-14 rounded-2xl grid place-items-center text-2xl bg-[#FFE0D8]">{featureIcons[i]}</div>
              <div className="font-display font-semibold text-xl mt-4">{f.title}</div>
              <p className="text-sm text-inkSub leading-relaxed mt-2">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="my-11 bg-gradient-to-br from-ink to-[#453F58] rounded-[30px] p-11 text-white grid grid-cols-2 gap-11 items-center">
        <div>
          <h2 className="font-display font-bold text-3xl tracking-[-.5px]">{dict.home.howTitle}</h2>
          <p className="text-base text-[#C9C3D6] mt-3 leading-relaxed">{dict.home.howSub}</p>
        </div>
        <div className="flex flex-col gap-4">
          {dict.home.steps.map((s, i) => (
            <div key={s.title} className="flex gap-4 items-center bg-white/10 rounded-2xl p-4">
              <div className="w-11 h-11 flex-shrink-0 rounded-xl grid place-items-center font-display font-bold text-lg text-ink" style={{ background: stepColors[i] }}>
                {i + 1}
              </div>
              <div>
                <div className="font-display font-semibold text-lg">{s.title}</div>
                <div className="text-sm text-[#C9C3D6] mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 5: Run test, confirm it passes**

Run: `npx vitest run "app/(public)/page.test.tsx"`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add "app/(public)" app/page.tsx
git commit -m "feat: implement Home page"
```

---

## Task 9: Login Page + Supabase Auth

**Files:**
- Create: `lib/supabase/actions.ts`
- Create: `components/login-view.tsx`, `components/login-view.test.tsx`
- Create: `app/login/page.tsx`

**Interfaces:**
- Produces: `signIn(email: string, password: string): Promise<{ error?: string } | void>` (server action), `LoginView({ onSubmit })`.
- Consumes: `createClient` from `lib/supabase/server`, `Button`/`Card` from Task 5.

- [ ] **Step 1: Write the LoginView test (fails first)**

Create `components/login-view.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { LoginView } from './login-view'
import { LanguageProvider } from '@/lib/i18n/language-context'

describe('LoginView', () => {
  it('submits the entered email and password', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<LanguageProvider><LoginView onSubmit={onSubmit} /></LanguageProvider>)

    await userEvent.type(screen.getByLabelText('Email Address'), 'jemimah.ulan@sjes.edu.ph')
    await userEvent.type(screen.getByLabelText('Password'), 'hunter2')
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(onSubmit).toHaveBeenCalledWith('jemimah.ulan@sjes.edu.ph', 'hunter2')
  })

  it('shows the returned error message', async () => {
    const onSubmit = vi.fn().mockResolvedValue({ error: 'Invalid email or password.' })
    render(<LanguageProvider><LoginView onSubmit={onSubmit} /></LanguageProvider>)

    await userEvent.type(screen.getByLabelText('Email Address'), 'wrong@sjes.edu.ph')
    await userEvent.type(screen.getByLabelText('Password'), 'bad')
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password.')
  })
})
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npx vitest run components/login-view.test.tsx`
Expected: FAIL — cannot find module `./login-view`.

- [ ] **Step 3: Implement LoginView**

Create `components/login-view.tsx`:
```tsx
'use client'
import { useState, type FormEvent } from 'react'
import { useLanguage } from '@/lib/i18n/language-context'
import { Button } from './ui/button'
import { Card } from './ui/card'

interface LoginViewProps {
  onSubmit: (email: string, password: string) => Promise<{ error?: string } | void>
}

export function LoginView({ onSubmit }: LoginViewProps) {
  const { dict } = useLanguage()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await onSubmit(email, password)
    if (result?.error) setError(result.error)
    setSubmitting(false)
  }

  return (
    <main className="max-w-[460px] mx-auto mt-16 mb-24 px-7">
      <Card>
        <div className="text-center mb-6">
          <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-[#FF8A5B] to-coral grid place-items-center text-3xl mx-auto mb-4">📖</div>
          <h1 className="font-display font-bold text-2xl">{dict.login.title}</h1>
          <p className="text-sm text-inkSub mt-2">{dict.login.subtitle}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-xs font-extrabold text-inkMuted">{dict.login.emailLabel}</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-cardBorder text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-extrabold text-inkMuted">{dict.login.passwordLabel}</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-cardBorder text-sm"
            />
          </div>
          {error && <p role="alert" className="text-coral text-sm font-bold">{error}</p>}
          <Button type="submit" disabled={submitting}>{dict.login.loginBtn}</Button>
          <a href="#" className="text-center text-sm font-extrabold">{dict.login.forgot}</a>
        </form>
      </Card>
    </main>
  )
}
```

- [ ] **Step 4: Run test, confirm it passes**

Run: `npx vitest run components/login-view.test.tsx`
Expected: PASS.

- [ ] **Step 5: Implement the sign-in server action**

Create `lib/supabase/actions.ts`:
```ts
'use server'
import { redirect } from 'next/navigation'
import { createClient } from './server'

export async function signIn(email: string, password: string) {
  const supabase = createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}
```

- [ ] **Step 6: Wire the Login page**

Create `app/login/page.tsx`:
```tsx
import { LoginView } from '@/components/login-view'
import { signIn } from '@/lib/supabase/actions'

export default function LoginPage() {
  return <LoginView onSubmit={signIn} />
}
```

- [ ] **Step 7: Commit**

```bash
git add lib/supabase/actions.ts components/login-view.tsx components/login-view.test.tsx app/login
git commit -m "feat: implement Teacher Login with Supabase Auth"
```

---

## Task 10: Dashboard Page

**Files:**
- Create: `lib/dashboard/level-bars.ts`, `lib/dashboard/level-bars.test.ts`
- Create: `components/dashboard-view.tsx`, `components/dashboard-view.test.tsx`
- Create: `app/dashboard/page.tsx`

**Interfaces:**
- Produces: `computeLevelBars(learners: Learner[]): { level: Level; count: number; pct: number }[]`, `DashboardView({ dict, teacherName, materialsCount, learnerCount, weekAssignments, levelBars, learners })`.
- Consumes: `Learner`, `Level` from `lib/types`; `LEVEL_COLOR` from `lib/level-colors`; `LevelBadge`, `Card`, `Button` from Task 5; `Dictionary` from Task 2.

Note on data honesty: the design prototype's "This Week / reads" stat has no backing table in the skeleton schema (no reading-session tracking is in scope). This task substitutes "This Week / assignments" — a count of `assignments` rows created in the last 7 days — so every number on this page is real, per the spec's "Real auth, real data, real writes — not stubs" goal. Same for learner avatar color: the prototype assigns arbitrary per-learner colors with no backing column; this task derives it from `LEVEL_COLOR[learner.level]` instead of inventing an unmodeled field.

- [ ] **Step 1: Write the level-bars test (fails first)**

Create `lib/dashboard/level-bars.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { computeLevelBars } from './level-bars'
import type { Learner } from '@/lib/types'

function learner(level: Learner['level']): Learner {
  return { id: level, teacher_id: 't1', name: level, grade: 'G1', level, progress_pct: 0, avatar_initials: 'XX' }
}

describe('computeLevelBars', () => {
  it('counts and percentages learners per level', () => {
    const learners = [learner('beginning'), learner('developing'), learner('developing'), learner('transitioning')]
    const bars = computeLevelBars(learners)
    expect(bars).toEqual([
      { level: 'beginning', count: 1, pct: 25 },
      { level: 'developing', count: 2, pct: 50 },
      { level: 'transitioning', count: 1, pct: 25 },
    ])
  })

  it('returns 0% for every level when there are no learners', () => {
    expect(computeLevelBars([])).toEqual([
      { level: 'beginning', count: 0, pct: 0 },
      { level: 'developing', count: 0, pct: 0 },
      { level: 'transitioning', count: 0, pct: 0 },
    ])
  })
})
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npx vitest run lib/dashboard/level-bars.test.ts`
Expected: FAIL — cannot find module `./level-bars`.

- [ ] **Step 3: Implement computeLevelBars**

Create `lib/dashboard/level-bars.ts`:
```ts
import type { Learner, Level } from '@/lib/types'

export interface LevelBarDatum {
  level: Level
  count: number
  pct: number
}

const LEVELS: Level[] = ['beginning', 'developing', 'transitioning']

export function computeLevelBars(learners: Learner[]): LevelBarDatum[] {
  const total = learners.length
  return LEVELS.map((level) => {
    const count = learners.filter((l) => l.level === level).length
    return { level, count, pct: total === 0 ? 0 : Math.round((count / total) * 100) }
  })
}
```

- [ ] **Step 4: Run test, confirm it passes**

Run: `npx vitest run lib/dashboard/level-bars.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the DashboardView test (fails first)**

Create `components/dashboard-view.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { DashboardView } from './dashboard-view'
import { en } from '@/lib/i18n/en'
import type { Learner } from '@/lib/types'

const learners: (Learner & { passageCount: number })[] = [
  { id: '1', teacher_id: 't1', name: 'Maria Santos', grade: 'Grade 2', level: 'developing', progress_pct: 64, avatar_initials: 'MS', passageCount: 8 },
]

describe('DashboardView', () => {
  it('renders stat counts and the learner list', () => {
    render(
      <DashboardView
        dict={en}
        teacherName="Teacher Jemimah Ulan"
        materialsCount={248}
        learnerCount={32}
        weekAssignments={5}
        levelBars={[{ level: 'beginning', count: 8, pct: 25 }, { level: 'developing', count: 15, pct: 47 }, { level: 'transitioning', count: 9, pct: 28 }]}
        learners={learners}
      />
    )
    expect(screen.getByText('Teacher Jemimah Ulan 👋')).toBeInTheDocument()
    expect(screen.getByText('248')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('Grade 2 · 8 passages')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test, confirm it fails, then implement DashboardView**

Run: `npx vitest run components/dashboard-view.test.tsx` → FAIL (module missing).

Create `components/dashboard-view.tsx`:
```tsx
import Link from 'next/link'
import { Card } from './ui/card'
import { LevelBadge } from './ui/level-badge'
import { Button } from './ui/button'
import { LEVEL_COLOR } from '@/lib/level-colors'
import type { Learner } from '@/lib/types'
import type { LevelBarDatum } from '@/lib/dashboard/level-bars'
import type { Dictionary } from '@/lib/i18n/dictionary'

interface DashboardViewProps {
  dict: Dictionary
  teacherName: string
  materialsCount: number
  learnerCount: number
  weekAssignments: number
  levelBars: LevelBarDatum[]
  learners: (Learner & { passageCount: number })[]
}

export function DashboardView({ dict, teacherName, materialsCount, learnerCount, weekAssignments, levelBars, learners }: DashboardViewProps) {
  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
        <div>
          <div className="text-sm font-extrabold text-inkMuted">{dict.dashboard.welcome}</div>
          <h1 className="font-display font-bold text-4xl">{teacherName} 👋</h1>
        </div>
        <Link href="/repository">
          <Button>＋ {dict.dashboard.assignReading}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-6">
        <Card>
          <div className="font-display font-semibold text-lg">{dict.dashboard.stats.materials.title}</div>
          <div className="font-display font-bold text-4xl text-coral mt-3">{materialsCount}</div>
        </Card>
        <Card>
          <div className="font-display font-semibold text-lg">{dict.dashboard.stats.learners.title}</div>
          <div className="font-display font-bold text-4xl text-purple mt-3">{learnerCount}</div>
        </Card>
        <Card>
          <div className="font-display font-semibold text-lg">{dict.dashboard.stats.week.title}</div>
          <div className="font-display font-bold text-4xl text-amber mt-3">{weekAssignments}</div>
        </Card>
      </div>

      <div className="grid grid-cols-[1.3fr_1fr] gap-5">
        <Card>
          <h2 className="font-display font-semibold text-xl mb-5">{dict.dashboard.readingProgress}</h2>
          <div className="flex flex-col gap-5">
            {levelBars.map((b) => (
              <div key={b.level}>
                <div className="flex justify-between items-center mb-2">
                  <span className="flex items-center gap-2 font-extrabold text-sm">
                    <span className="w-3 h-3 rounded" style={{ background: LEVEL_COLOR[b.level] }} />
                    {dict.levels[b.level]}
                  </span>
                  <span className="font-extrabold text-sm text-inkMuted">{b.count} {dict.dashboard.learnersWord}</span>
                </div>
                <div className="h-4 bg-[#F3E9D8] rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: LEVEL_COLOR[b.level] }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-display font-semibold text-xl mb-4">{dict.dashboard.myLearners}</h2>
          <div className="flex flex-col gap-3">
            {learners.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3 rounded-2xl bg-cardAlt">
                <div className="w-10 h-10 rounded-xl grid place-items-center font-display font-bold text-white" style={{ background: LEVEL_COLOR[l.level] }}>
                  {l.avatar_initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-sm">{l.name}</div>
                  <div className="text-xs text-inkMuted font-bold">{l.grade} · {l.passageCount} {dict.dashboard.passagesWord}</div>
                </div>
                <LevelBadge level={l.level} label={dict.levels[l.level]} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
```

- [ ] **Step 7: Run test, confirm it passes**

Run: `npx vitest run components/dashboard-view.test.tsx`
Expected: PASS.

- [ ] **Step 8: Wire the Dashboard page**

Create `app/dashboard/page.tsx`:
```tsx
import { DashboardView } from '@/components/dashboard-view'
import { computeLevelBars } from '@/lib/dashboard/level-bars'
import { createClient } from '@/lib/supabase/server'
import type { Learner } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: teacher } = await supabase.from('teachers').select('display_name').eq('id', user!.id).single()

  const { data: learnersRaw } = await supabase
    .from('learners')
    .select('id, teacher_id, name, grade, level, progress_pct, avatar_initials, assignments(count)')
    .eq('teacher_id', user!.id)

  const learners = (learnersRaw ?? []).map((l) => {
    const { assignments, ...rest } = l as Learner & { assignments: { count: number }[] }
    return { ...rest, passageCount: assignments?.[0]?.count ?? 0 }
  })

  const { count: materialsCount } = await supabase
    .from('passages')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: weekAssignments } = await supabase
    .from('assignments')
    .select('id', { count: 'exact', head: true })
    .eq('assigned_by', user!.id)
    .gte('assigned_at', weekAgo)

  const en = (await import('@/lib/i18n/en')).en

  return (
    <DashboardView
      dict={en}
      teacherName={teacher?.display_name ?? 'Teacher'}
      materialsCount={materialsCount ?? 0}
      learnerCount={learners.length}
      weekAssignments={weekAssignments ?? 0}
      levelBars={computeLevelBars(learners)}
      learners={learners}
    />
  )
}
```

Note: `DashboardView` takes `dict` as a prop rather than reading `useLanguage()` internally because it is a Server Component's child rendered without a client boundary — this keeps the data-fetching page fully server-rendered. It defaults to the English dictionary; wiring the live language toggle into server-rendered pages (cookie-based locale) is not in scope for this pass — flag this as a follow-up if bilingual server pages are needed beyond Home/Login (which are client components and already fully bilingual via `useLanguage()`).

- [ ] **Step 9: Commit**

```bash
git add lib/dashboard components/dashboard-view.tsx components/dashboard-view.test.tsx app/dashboard
git commit -m "feat: implement Dashboard with real learner and assignment data"
```

---

## Task 11: Reading Repository Page

**Files:**
- Create: `lib/passages/filter-passages.ts`, `lib/passages/filter-passages.test.ts`
- Create: `components/repository-view.tsx`, `components/repository-view.test.tsx`
- Create: `app/repository/page.tsx`

**Interfaces:**
- Produces: `filterPassages(passages: Passage[], filters: PassageFilters): Passage[]`, `DEFAULT_FILTERS: PassageFilters`, `RepositoryView({ passages })`.
- Consumes: `Passage`, `Level`, `Language` from `lib/types`; `LEVEL_COLOR` from `lib/level-colors`; `LevelBadge` from Task 5; `useLanguage()` from Task 2.

- [ ] **Step 1: Write the filterPassages test (fails first)**

Create `lib/passages/filter-passages.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { filterPassages, DEFAULT_FILTERS } from './filter-passages'
import type { Passage } from '@/lib/types'

function passage(overrides: Partial<Passage>): Passage {
  return {
    id: '1', title: 'Test', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
    competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '', body: [],
    status: 'published', source: 'teacher', created_by: 't1', ...overrides,
  }
}

const passages: Passage[] = [
  passage({ id: '1', grade: 'G1', level: 'beginning', language: 'EN', competency: 'Vocabulary', quarter: 'Q1' }),
  passage({ id: '2', grade: 'G2', level: 'developing', language: 'FIL', competency: 'Comprehension', quarter: 'Q2' }),
  passage({ id: '3', grade: 'G1', level: 'transitioning', language: 'EN', competency: 'Fluency', quarter: 'Q3' }),
]

describe('filterPassages', () => {
  it('returns everything when all filters are "all"', () => {
    expect(filterPassages(passages, DEFAULT_FILTERS)).toHaveLength(3)
  })

  it('combines filters with AND logic', () => {
    const result = filterPassages(passages, { ...DEFAULT_FILTERS, grade: 'G1', level: 'beginning' })
    expect(result.map((p) => p.id)).toEqual(['1'])
  })

  it('returns an empty array when no passage matches', () => {
    const result = filterPassages(passages, { ...DEFAULT_FILTERS, grade: 'G6' })
    expect(result).toEqual([])
  })
})
```

- [ ] **Step 2: Run test, confirm it fails**

Run: `npx vitest run lib/passages/filter-passages.test.ts`
Expected: FAIL — cannot find module `./filter-passages`.

- [ ] **Step 3: Implement filterPassages**

Create `lib/passages/filter-passages.ts`:
```ts
import type { Passage, Level, Language } from '@/lib/types'

export interface PassageFilters {
  grade: string
  level: Level | 'all'
  language: Language | 'all'
  competency: string
  quarter: string
}

export const DEFAULT_FILTERS: PassageFilters = { grade: 'all', level: 'all', language: 'all', competency: 'all', quarter: 'all' }

export function filterPassages(passages: Passage[], filters: PassageFilters): Passage[] {
  return passages.filter((p) =>
    (filters.grade === 'all' || p.grade === filters.grade) &&
    (filters.level === 'all' || p.level === filters.level) &&
    (filters.language === 'all' || p.language === filters.language) &&
    (filters.competency === 'all' || p.competency === filters.competency) &&
    (filters.quarter === 'all' || p.quarter === filters.quarter)
  )
}
```

- [ ] **Step 4: Run test, confirm it passes**

Run: `npx vitest run lib/passages/filter-passages.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the RepositoryView test (fails first)**

Create `components/repository-view.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { RepositoryView } from './repository-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Passage } from '@/lib/types'

function passage(overrides: Partial<Passage>): Passage {
  return {
    id: '1', title: 'My Little Garden', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
    competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '#DFF6F1',
    body: ['para'], status: 'published', source: 'teacher', created_by: 't1', ...overrides,
  }
}

const passages: Passage[] = [
  passage({ id: '1', title: 'My Little Garden', grade: 'G1' }),
  passage({ id: '2', title: 'Volcano Mysteries', grade: 'G4', level: 'transitioning' }),
]

describe('RepositoryView', () => {
  it('filters the grid when a grade chip is clicked', async () => {
    render(<LanguageProvider><RepositoryView passages={passages} /></LanguageProvider>)
    expect(screen.getByText('2 passages found')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'G1' }))
    expect(screen.getByText('1 passages found')).toBeInTheDocument()
    expect(screen.getByText('My Little Garden')).toBeInTheDocument()
    expect(screen.queryByText('Volcano Mysteries')).not.toBeInTheDocument()
  })

  it('shows the empty state when no passage matches', async () => {
    render(<LanguageProvider><RepositoryView passages={passages} /></LanguageProvider>)
    await userEvent.click(screen.getByRole('button', { name: 'G6' }))
    expect(screen.getByText('No passages match those filters yet.')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run test, confirm it fails, then implement RepositoryView**

Run: `npx vitest run components/repository-view.test.tsx` → FAIL (module missing).

Create `components/repository-view.tsx`:
```tsx
'use client'
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/i18n/language-context'
import { LevelBadge } from './ui/level-badge'
import { filterPassages, DEFAULT_FILTERS, type PassageFilters } from '@/lib/passages/filter-passages'
import { LEVEL_COLOR } from '@/lib/level-colors'
import type { Passage, Level } from '@/lib/types'

interface RepositoryViewProps {
  passages: Passage[]
}

function Chip({ active, onClick, children, dot }: { active: boolean; onClick: () => void; children: ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-extrabold border-2',
        active ? 'bg-ink text-white border-ink' : 'bg-cardAlt text-inkSub border-cardBorder'
      )}
    >
      {dot && <span className="w-2.5 h-2.5 rounded-sm" style={{ background: dot }} />}
      {children}
    </button>
  )
}

const GRADES = ['all', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6']
const LEVELS: { value: Level | 'all'; color: string }[] = [
  { value: 'all', color: '#B7AE9C' },
  { value: 'beginning', color: LEVEL_COLOR.beginning },
  { value: 'developing', color: LEVEL_COLOR.developing },
  { value: 'transitioning', color: LEVEL_COLOR.transitioning },
]
const COMPETENCIES = ['all', 'Vocabulary', 'Comprehension', 'Fluency']
const QUARTERS = ['all', 'Q1', 'Q2', 'Q3', 'Q4']
const LANGUAGES: { value: 'all' | 'EN' | 'FIL'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'EN', label: 'English' },
  { value: 'FIL', label: 'Filipino' },
]

export function RepositoryView({ passages }: RepositoryViewProps) {
  const { dict } = useLanguage()
  const [filters, setFilters] = useState<PassageFilters>(DEFAULT_FILTERS)
  const visible = filterPassages(passages, filters)

  return (
    <main className="max-w-[1240px] mx-auto px-7 py-9">
      <div className="mb-6">
        <h1 className="font-display font-bold text-4xl">📚 {dict.repository.title}</h1>
        <p className="text-inkSub mt-1.5">{dict.repository.subtitle}</p>
      </div>
      <div className="grid grid-cols-[250px_1fr] gap-6 items-start">
        <aside className="bg-white border-2 border-cardBorder rounded-[22px] p-5 sticky top-24">
          <div className="font-display font-semibold mb-3">🔎 {dict.repository.filters}</div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.gradeLevel}</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {GRADES.map((g) => (
              <Chip key={g} active={filters.grade === g} onClick={() => setFilters((f) => ({ ...f, grade: g }))}>
                {g === 'all' ? dict.levels.all : g}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.readingLevel}</div>
          <div className="flex flex-col gap-2 mb-5">
            {LEVELS.map((l) => (
              <Chip key={l.value} active={filters.level === l.value} onClick={() => setFilters((f) => ({ ...f, level: l.value }))} dot={l.color}>
                {l.value === 'all' ? dict.levels.all : dict.levels[l.value]}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.competency}</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {COMPETENCIES.map((c) => (
              <Chip key={c} active={filters.competency === c} onClick={() => setFilters((f) => ({ ...f, competency: c }))}>
                {c === 'all' ? dict.levels.all : c}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.quarter}</div>
          <div className="flex flex-wrap gap-2 mb-5">
            {QUARTERS.map((q) => (
              <Chip key={q} active={filters.quarter === q} onClick={() => setFilters((f) => ({ ...f, quarter: q }))}>
                {q === 'all' ? dict.levels.all : q}
              </Chip>
            ))}
          </div>

          <div className="text-xs font-extrabold text-inkMuted uppercase mb-2.5">{dict.repository.language}</div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Chip key={l.value} active={filters.language === l.value} onClick={() => setFilters((f) => ({ ...f, language: l.value }))}>
                {l.value === 'all' ? dict.levels.all : l.label}
              </Chip>
            ))}
          </div>
        </aside>

        <div>
          <div className="font-extrabold text-sm text-inkMuted mb-4">{visible.length} {dict.repository.passagesFound}</div>
          <div className="grid grid-cols-3 gap-4.5">
            {visible.map((p) => (
              <Link key={p.id} href={`/repository/${p.id}`} className="bg-white border-2 border-cardBorder rounded-[20px] overflow-hidden flex flex-col">
                <div className="h-[120px] grid place-items-center text-5xl relative" style={{ background: p.cover_bg }}>
                  {p.emoji}
                  <span className="absolute top-2.5 left-2.5 text-xs font-extrabold bg-white/85 px-2.5 py-1 rounded-full">{p.grade}</span>
                  <span className="absolute top-2.5 right-2.5 text-xs font-extrabold text-white bg-ink/55 px-2.5 py-1 rounded-full">{p.language}</span>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-display font-semibold text-lg leading-tight">{p.title}</div>
                  <div className="text-xs text-inkMuted font-bold mt-1">{p.theme} · {p.minutes} min</div>
                  <div className="text-[11.5px] text-inkMuted font-bold mt-0.5">{p.competency} · {p.quarter}</div>
                  <div className="mt-auto pt-3.5 flex items-center justify-between">
                    <LevelBadge level={p.level} label={dict.levels[p.level]} />
                    <span className="font-display font-semibold text-sm text-coral">{dict.repository.assign} →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {visible.length === 0 && (
            <div className="text-center py-16 text-inkMuted">
              <div className="text-5xl">🫙</div>
              <div className="font-display font-semibold text-xl mt-3">{dict.repository.noResults}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 7: Run test, confirm it passes**

Run: `npx vitest run components/repository-view.test.tsx`
Expected: PASS.

- [ ] **Step 8: Wire the Repository page**

Create `app/repository/page.tsx`:
```tsx
import { RepositoryView } from '@/components/repository-view'
import { createClient } from '@/lib/supabase/server'
import type { Passage } from '@/lib/types'

export default async function RepositoryPage() {
  const supabase = createClient()
  const { data } = await supabase
    .from('passages')
    .select('id, title, theme, grade, level, language, competency, quarter, minutes, emoji, cover_bg, body, status, source, created_by')
    .eq('status', 'published')

  return <RepositoryView passages={(data ?? []) as Passage[]} />
}
```

- [ ] **Step 9: Commit**

```bash
git add lib/passages components/repository-view.tsx components/repository-view.test.tsx app/repository/page.tsx
git commit -m "feat: implement Reading Repository with real filters"
```

---

## Task 12: Passage Reader + Assign Flow

**Files:**
- Modify: `lib/supabase/actions.ts` (add `assignPassage`)
- Create: `components/reader-view.tsx`, `components/reader-view.test.tsx`
- Create: `app/repository/[id]/page.tsx`

**Interfaces:**
- Produces: `assignPassage(passageId: string, learnerIds: string[]): Promise<void>` (server action), `ReaderView({ passage, learners, onConfirmAssign })`.
- Consumes: `Passage`, `Learner` from `lib/types`; `LevelBadge`, `Button` from Task 5; `useLanguage()` from Task 2.

- [ ] **Step 1: Write the ReaderView test (fails first)**

Create `components/reader-view.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ReaderView } from './reader-view'
import { LanguageProvider } from '@/lib/i18n/language-context'
import type { Passage, Learner } from '@/lib/types'

const passage: Passage = {
  id: 'p1', title: 'My Little Garden', theme: 'Nature', grade: 'G1', level: 'beginning', language: 'EN',
  competency: 'Vocabulary', quarter: 'Q1', minutes: 3, emoji: '🌱', cover_bg: '#DFF6F1',
  body: ['Lina has a small garden.'], status: 'published', source: 'teacher', created_by: 't1',
}

const learners: Learner[] = [
  { id: 'l1', teacher_id: 't1', name: 'Maria Santos', grade: 'Grade 2', level: 'developing', progress_pct: 64, avatar_initials: 'MS' },
]

describe('ReaderView', () => {
  it('assigns the passage to selected learners and shows a confirmation banner', async () => {
    const onConfirmAssign = vi.fn().mockResolvedValue(undefined)
    render(<LanguageProvider><ReaderView passage={passage} learners={learners} onConfirmAssign={onConfirmAssign} /></LanguageProvider>)

    await userEvent.click(screen.getByRole('button', { name: 'Assign' }))
    await userEvent.click(screen.getByRole('button', { name: 'Maria Santos' }))
    await userEvent.click(screen.getByRole('button', { name: 'Confirm Assignment' }))

    expect(onConfirmAssign).toHaveBeenCalledWith(['l1'])
    expect(await screen.findByText('Assigned to Maria Santos')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, confirm it fails, then implement ReaderView**

Run: `npx vitest run components/reader-view.test.tsx` → FAIL (module missing).

Create `components/reader-view.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { clsx } from 'clsx'
import { useLanguage } from '@/lib/i18n/language-context'
import { LevelBadge } from './ui/level-badge'
import { Button } from './ui/button'
import type { Passage, Learner } from '@/lib/types'

interface ReaderViewProps {
  passage: Passage
  learners: Learner[]
  onConfirmAssign: (learnerIds: string[]) => Promise<void>
}

export function ReaderView({ passage, learners, onConfirmAssign }: ReaderViewProps) {
  const { dict } = useLanguage()
  const [assignOpen, setAssignOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [bannerNames, setBannerNames] = useState<string[] | null>(null)

  function toggleLearner(id: string) {
    setSelectedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]))
  }

  async function handleConfirm() {
    await onConfirmAssign(selectedIds)
    const names = learners.filter((l) => selectedIds.includes(l.id)).map((l) => l.name)
    setBannerNames(names)
    setAssignOpen(false)
    setSelectedIds([])
  }

  return (
    <main className="max-w-[820px] mx-auto px-7 py-9 pb-20">
      <a href="/repository" className="font-extrabold text-sm inline-block mb-5">← {dict.repository.title}</a>
      <div className="bg-white border-2 border-cardBorder rounded-[26px] overflow-hidden">
        <div className="h-40 grid place-items-center text-7xl" style={{ background: passage.cover_bg }}>
          {passage.emoji}
        </div>
        <div className="p-8 pt-7">
          <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
            <LevelBadge level={passage.level} label={dict.levels[passage.level]} />
            <span className="text-sm text-inkMuted font-bold">{passage.theme} · {passage.minutes} min · {passage.competency} · {passage.quarter}</span>
          </div>
          <h1 className="font-display font-bold text-3xl mb-5">{passage.title}</h1>
          <div className="flex flex-col gap-4">
            {passage.body.map((para, i) => (
              <p key={i} className="text-lg leading-loose text-[#3A3548]">{para}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-cardBorder flex gap-3 flex-wrap">
            <Button onClick={() => setAssignOpen((v) => !v)}>{dict.reader.assign}</Button>
            <a href="/repository"><Button variant="secondary">{dict.reader.backToList}</Button></a>
          </div>

          {assignOpen && (
            <div className="mt-4 bg-cardAlt border-2 border-cardBorder rounded-2xl p-5">
              <div className="font-extrabold text-xs text-inkMuted uppercase mb-3">{dict.reader.selectLearners}</div>
              <div className="flex flex-wrap gap-2.5">
                {learners.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLearner(l.id)}
                    className={clsx(
                      'px-3.5 py-2 rounded-xl text-sm font-extrabold border-2',
                      selectedIds.includes(l.id) ? 'bg-ink text-white border-ink' : 'bg-white text-inkSub border-cardBorder'
                    )}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
              <Button variant="teal" className="mt-4" onClick={handleConfirm}>{dict.reader.confirmAssign}</Button>
            </div>
          )}

          {bannerNames && bannerNames.length > 0 && (
            <div className="mt-4 bg-[#DFF6F1] text-[#1B8577] font-extrabold text-sm px-4.5 py-3.5 rounded-2xl">
              ✅ {dict.reader.assignedTo} {bannerNames.join(', ')}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: Run test, confirm it passes**

Run: `npx vitest run components/reader-view.test.tsx`
Expected: PASS.

- [ ] **Step 4: Add the assignPassage server action**

Append to `lib/supabase/actions.ts`:
```ts
export async function assignPassage(passageId: string, learnerIds: string[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const rows = learnerIds.map((learner_id) => ({ passage_id: passageId, learner_id, assigned_by: user.id }))
  const { error } = await supabase.from('assignments').insert(rows)
  if (error) throw new Error(error.message)
}
```

- [ ] **Step 5: Wire the Passage Reader page**

Create `app/repository/[id]/page.tsx`:
```tsx
import { notFound } from 'next/navigation'
import { ReaderView } from '@/components/reader-view'
import { createClient } from '@/lib/supabase/server'
import { assignPassage } from '@/lib/supabase/actions'
import type { Passage, Learner } from '@/lib/types'

export default async function ReaderPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: passage } = await supabase
    .from('passages')
    .select('id, title, theme, grade, level, language, competency, quarter, minutes, emoji, cover_bg, body, status, source, created_by')
    .eq('id', params.id)
    .single()

  if (!passage) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: learners } = await supabase
    .from('learners')
    .select('id, teacher_id, name, grade, level, progress_pct, avatar_initials')
    .eq('teacher_id', user!.id)

  async function confirmAssign(learnerIds: string[]) {
    'use server'
    await assignPassage(params.id, learnerIds)
  }

  return (
    <ReaderView
      passage={passage as Passage}
      learners={(learners ?? []) as Learner[]}
      onConfirmAssign={confirmAssign}
    />
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/supabase/actions.ts components/reader-view.tsx components/reader-view.test.tsx "app/repository/[id]"
git commit -m "feat: implement Passage Reader with real assign-to-learner writes"
```

---

## Task 13: Playwright E2E Smoke Test

**Files:**
- Create: `e2e/assign-flow.spec.ts`

**Interfaces:**
- Consumes: a live Supabase project with a seeded teacher account, at least one `G1`/`published` passage, and at least one learner.

**Blocked note:** per the design spec's "Open Question Carried Forward," Supabase project credentials don't exist yet. This task's code is ready to run the moment `.env.local` is populated (Task 1's template) and a teacher account + seed data exist — that seeding is a manual follow-up, not part of this plan, since it requires a real Supabase project the user has not created yet.

- [ ] **Step 1: Write the e2e spec**

Create `e2e/assign-flow.spec.ts`:
```ts
import { test, expect } from '@playwright/test'

const TEACHER_EMAIL = process.env.E2E_TEACHER_EMAIL!
const TEACHER_PASSWORD = process.env.E2E_TEACHER_PASSWORD!

test('teacher can log in, filter the repository, and assign a passage', async ({ page }) => {
  await page.goto('/login')
  await page.getByLabel('Email Address').fill(TEACHER_EMAIL)
  await page.getByLabel('Password').fill(TEACHER_PASSWORD)
  await page.getByRole('button', { name: 'Log In' }).click()
  await expect(page).toHaveURL('/dashboard')

  await page.goto('/repository')
  await page.getByRole('button', { name: 'G1' }).click()
  await expect(page.getByText(/passages found/)).toBeVisible()

  await page.getByRole('link').filter({ hasText: 'Assign →' }).first().click()
  await page.getByRole('button', { name: 'Assign' }).click()
  await page.getByRole('button', { name: 'Confirm Assignment' }).click()
  await expect(page.getByText(/Assigned to/)).toBeVisible()
})
```

- [ ] **Step 2: Attempt a run and record the outcome**

Run: `npm run test:e2e`
Expected today: fails at `page.goto('/login')` auth step (or earlier) because `NEXT_PUBLIC_SUPABASE_URL`/`E2E_TEACHER_EMAIL`/`E2E_TEACHER_PASSWORD` aren't set — this is expected and not a plan failure. Once the user creates the Supabase project, fills in `.env.local`, creates a teacher account plus one published `G1` passage and one learner, and sets `E2E_TEACHER_EMAIL`/`E2E_TEACHER_PASSWORD`, re-run this command and confirm PASS before considering the walking skeleton fully verified end-to-end.

- [ ] **Step 3: Commit**

```bash
git add e2e
git commit -m "test: add Playwright e2e smoke test for login-assign flow (requires live Supabase credentials to run)"
```

---

## Post-Plan Checklist

- [ ] `npm test` passes for every task's Vitest suite (Tasks 2, 3, 5, 6, 7, 8, 9, 10, 11, 12).
- [ ] `npm run build` succeeds.
- [ ] `npm run dev` manually verified in a browser for Home, Login (will fail auth until Supabase credentials exist — expected), and that placeholder screens render for the 7 out-of-scope nav links.
- [ ] Task 13's e2e spec re-run and passing once the user provides Supabase project credentials and seed data (tracked as the spec's open question, not a gap in this plan).
