-- Future Skills — mentoring registrations & issued certificates

create table public.mentoring_registrations (
  user_id uuid not null references auth.users (id) on delete cascade,
  session_id text not null,
  registered_at timestamptz not null default now(),
  primary key (user_id, session_id)
);

create index mentoring_registrations_session_id_idx on public.mentoring_registrations (session_id);

create table public.issued_certificates (
  user_id uuid primary key references auth.users (id) on delete cascade,
  learner_name text not null,
  cohort_code text not null,
  issued_at timestamptz not null default now()
);

-- Count registrations across cohort for spot availability
create or replace function public.mentoring_spots_left(p_session_id text, p_capacity int)
returns int
language sql
stable
security definer
set search_path = public
as $$
  select greatest(0, p_capacity - (select count(*)::int from public.mentoring_registrations where session_id = p_session_id));
$$;

grant execute on function public.mentoring_spots_left(text, int) to authenticated;

alter table public.mentoring_registrations enable row level security;
alter table public.issued_certificates enable row level security;

create policy "mentoring_registrations_own"
  on public.mentoring_registrations for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "mentoring_registrations_read_for_spots"
  on public.mentoring_registrations for select
  to authenticated
  using (true);

create policy "issued_certificates_own"
  on public.issued_certificates for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
