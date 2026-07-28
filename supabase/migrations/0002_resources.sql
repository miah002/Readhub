insert into storage.buckets (id, name, public)
values ('resources', 'resources', true)
on conflict (id) do nothing;

create policy "Public read access to resources bucket"
  on storage.objects for select
  using (bucket_id = 'resources');

create policy "Teachers upload to their own folder in resources bucket"
  on storage.objects for insert
  with check (bucket_id = 'resources' and auth.uid()::text = (storage.foldername(name))[1]);

create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tag text not null check (tag in ('Guide','Worksheet','Video','Reference')),
  file_path text not null,
  file_url text not null,
  uploaded_by uuid not null references teachers(id),
  created_at timestamptz not null default now()
);
alter table resources enable row level security;
create policy "Any authenticated teacher can view resources" on resources
  for select using (auth.role() = 'authenticated');
create policy "Teachers insert own resources" on resources
  for insert with check (uploaded_by = auth.uid());
