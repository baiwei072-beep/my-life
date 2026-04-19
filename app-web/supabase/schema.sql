create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  nickname text not null default '新住户',
  bio text not null default '还没有写下新的空间描述。',
  avatar_preset text not null default 'bug-purple',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.spaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  title text not null default '我的房间',
  theme text not null default 'purple-room',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  space_id uuid references public.spaces(id) on delete set null,
  title text not null,
  summary text not null default '',
  content text not null,
  category text not null default 'daily' check (category in ('growth', 'daily', 'business', 'funny')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.avatar_presets (
  id text primary key,
  label text not null,
  palette jsonb not null default '[]'::jsonb
);

create table if not exists public.requirement_workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  raw_request text not null,
  design_context text not null default '',
  api_spec text not null default '',
  generated_markdown text not null,
  analysis jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.avatar_presets (id, label, palette)
values
  ('bug-purple', '紫色小虫', '["#6f42f6", "#cda8ff"]'),
  ('penguin-yellow', '黄肚企鹅', '["#ffd44d", "#3f2b63"]'),
  ('bird-orange', '橙色小鸟', '["#ff8a34", "#fff2ae"]'),
  ('penguin-purple', '紫围巾企鹅', '["#b48cff", "#4e4d7a"]')
on conflict (id) do nothing;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nickname)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nickname', split_part(new.email, '@', 1), '新住户')
  )
  on conflict (id) do nothing;

  insert into public.spaces (owner_id, title)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nickname', '我的房间') || ' 的空间'
  )
  on conflict (owner_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.spaces enable row level security;
alter table public.posts enable row level security;
alter table public.avatar_presets enable row level security;
alter table public.requirement_workspaces enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "spaces_select_own" on public.spaces;
create policy "spaces_select_own"
on public.spaces for select
using (auth.uid() = owner_id);

drop policy if exists "spaces_update_own" on public.spaces;
create policy "spaces_update_own"
on public.spaces for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "spaces_insert_own" on public.spaces;
create policy "spaces_insert_own"
on public.spaces for insert
with check (auth.uid() = owner_id);

drop policy if exists "posts_select_own" on public.posts;
create policy "posts_select_own"
on public.posts for select
using (auth.uid() = owner_id);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts for insert
with check (auth.uid() = owner_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts for delete
using (auth.uid() = owner_id);

drop policy if exists "avatar_presets_public_read" on public.avatar_presets;
create policy "avatar_presets_public_read"
on public.avatar_presets for select
using (true);

drop policy if exists "requirement_workspaces_select_own" on public.requirement_workspaces;
create policy "requirement_workspaces_select_own"
on public.requirement_workspaces for select
using (auth.uid() = owner_id);

drop policy if exists "requirement_workspaces_insert_own" on public.requirement_workspaces;
create policy "requirement_workspaces_insert_own"
on public.requirement_workspaces for insert
with check (auth.uid() = owner_id);

drop policy if exists "requirement_workspaces_update_own" on public.requirement_workspaces;
create policy "requirement_workspaces_update_own"
on public.requirement_workspaces for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "requirement_workspaces_delete_own" on public.requirement_workspaces;
create policy "requirement_workspaces_delete_own"
on public.requirement_workspaces for delete
using (auth.uid() = owner_id);
