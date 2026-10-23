create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  description text not null,
  type text not null default 'PROJETO',
  link text not null default '',
  created_at timestamptz not null default now(),
  constraint projects_link_http check (link = '' or link ~* '^https?://')
);

alter table public.projects enable row level security;

revoke all on table public.projects from public, anon, authenticated;
grant select on table public.projects to anon, authenticated;
grant insert, update, delete on table public.projects to authenticated;

drop policy if exists "Projects are public to read" on public.projects;
create policy "Projects are public to read"
  on public.projects for select
  using (true);

drop policy if exists "Only the owner can add projects" on public.projects;
create policy "Only the owner can add projects"
  on public.projects for insert
  to authenticated
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

drop policy if exists "Only the owner can update projects" on public.projects;
create policy "Only the owner can update projects"
  on public.projects for update
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid)
  with check (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

drop policy if exists "Only the owner can delete projects" on public.projects;
create policy "Only the owner can delete projects"
  on public.projects for delete
  to authenticated
  using (auth.uid() = '00000000-0000-0000-0000-000000000000'::uuid);

insert into public.projects (id, name, category, description, type, link)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'Aquário virtual',
    'HTML · CSS · JAVASCRIPT',
    'Um ambiente marinho interativo com peixes animados.',
    'INTERATIVO',
    ''
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Laboratório digital',
    'EXPERIMENTOS',
    'Experimentos e ideias para explorar novas possibilidades.',
    'EXPERIMENTO',
    ''
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Aprender brincando',
    'JOGOS DIDÁTICOS',
    'Jogos e experiências para aprender ciência.',
    'EDUCAÇÃO',
    ''
  )
on conflict (id) do nothing;
