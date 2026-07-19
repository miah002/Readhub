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
