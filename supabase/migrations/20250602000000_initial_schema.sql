-- Future Skills — Sprint S1 foundation

create extension if not exists "pgcrypto";

-- Cohorts
create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  total_days int not null default 10 check (total_days > 0),
  created_at timestamptz not null default now()
);

-- Learner profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  cohort_id uuid references public.cohorts (id) on delete set null,
  first_name text,
  last_name text,
  city text,
  level text check (level in ('beginner', 'intermediate')),
  goal text check (goal in ('employment', 'entrepreneurship', 'ai', 'productivity')),
  whatsapp_opt_in boolean not null default false,
  phone text,
  contact text,
  program_day int not null default 1 check (program_day >= 1),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_cohort_id_idx on public.profiles (cohort_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, contact)
  values (new.id, coalesce(new.email, new.phone));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.cohorts enable row level security;
alter table public.profiles enable row level security;

create policy "cohorts_read_authenticated"
  on public.cohorts for select
  to authenticated
  using (true);

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Seed default cohort
insert into public.cohorts (code, name, total_days)
values ('FS-2025-01', 'Future Skills Cohorte 1', 10)
on conflict (code) do nothing;
