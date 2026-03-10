-- ============================================================
-- BubbleExport SaaS Starter — Supabase Schema
-- Run this in the Supabase SQL editor to set up your database.
-- ============================================================

-- ── profiles ────────────────────────────────────────────────
-- Extends the built-in auth.users table with app-specific data.
create table if not exists public.profiles (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  full_name           text,
  avatar_url          text,
  role                text        not null default 'member'
                                  check (role in ('admin', 'member')),
  stripe_customer_id  text        unique,
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read and update only their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── projects ────────────────────────────────────────────────
create table if not exists public.projects (
  id          uuid        primary key default gen_random_uuid(),
  owner_id    uuid        not null references public.profiles(id) on delete cascade,
  title       text        not null,
  description text,
  status      text        not null default 'active'
                          check (status in ('active', 'paused', 'completed')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

-- Members manage their own projects
create policy "Users can view own projects"
  on public.projects for select
  using (auth.uid() = owner_id);

create policy "Users can insert own projects"
  on public.projects for insert
  with check (auth.uid() = owner_id);

create policy "Users can update own projects"
  on public.projects for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Users can delete own projects"
  on public.projects for delete
  using (auth.uid() = owner_id);

-- Admins can see ALL projects
create policy "Admins can view all projects"
  on public.projects for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── subscriptions ───────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        not null references public.profiles(id) on delete cascade,
  stripe_subscription_id  text        unique not null,
  plan                    text        not null default 'pro',
  status                  text        not null,
  current_period_end      timestamptz,
  updated_at              timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

-- Users read only their own subscription
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- ── auto-create profile on signup ───────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

-- Drop and recreate to avoid conflicts on re-runs
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── updated_at helpers ──────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Premium Dashboard Extension Tables
-- ============================================================

-- Chat channels
create table public.channels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz default now()
);

-- Chat messages (Realtime enabled)
create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
create policy "Users can read all messages" on public.messages for select using (auth.uid() is not null);
create policy "Users can insert own messages" on public.messages for insert with check (auth.uid() = sender_id);

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;

-- Notifications
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('liked','commented','mentioned','followed')),
  content    text not null,
  read       boolean not null default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);

-- Marketplace items (public read-only)
create table public.marketplace_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  price       numeric(10,2) not null default 0,
  image_url   text,
  description text,
  created_at  timestamptz default now()
);

alter table public.marketplace_items enable row level security;
create policy "Anyone can read marketplace" on public.marketplace_items for select using (true);

-- Transactions (Wallet)
create table public.transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  amount     numeric(10,2) not null,
  method     text not null default 'stripe',
  status     text not null default 'paid' check (status in ('paid','pending','failed')),
  fees       numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;
create policy "Users read own transactions" on public.transactions for select using (auth.uid() = user_id);

-- Projects extension
alter table public.projects add column if not exists due_date timestamptz;
alter table public.projects add column if not exists member_count integer not null default 1;

-- Tasks
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  status      text not null default 'todo' check (status in ('todo','in-progress','done')),
  assignee_id uuid references public.profiles(id),
  created_at  timestamptz default now()
);

alter table public.tasks enable row level security;
create policy "Users manage tasks in own projects"
  on public.tasks for all
  using (exists (select 1 from public.projects where id = project_id and owner_id = auth.uid()));
