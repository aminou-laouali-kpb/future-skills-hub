-- Future Skills — learner progress & deliverables (S1.5 sync)

-- Completed lessons
create table public.user_lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create index user_lesson_progress_user_id_idx on public.user_lesson_progress (user_id);

-- Best quiz score per module
create table public.user_quiz_scores (
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null check (module_id in ('m1', 'm2', 'm3', 'm4', 'm5')),
  best_percent int not null check (best_percent between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (user_id, module_id)
);

-- Deliverables
create table public.deliverables (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module_id text not null,
  type text not null,
  file_name text,
  link_url text,
  context text not null default '',
  status text not null check (status in ('draft', 'submitted', 'feedback', 'overdue')),
  submitted_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index deliverables_user_id_idx on public.deliverables (user_id);

create trigger deliverables_updated_at
  before update on public.deliverables
  for each row execute function public.set_updated_at();

-- Mentor feedback on deliverables
create table public.deliverable_feedback (
  deliverable_id uuid primary key references public.deliverables (id) on delete cascade,
  score int check (score between 0 and 100),
  strengths text,
  improvements text,
  next_steps text,
  mentor_name text,
  feedback_date date
);

-- RLS
alter table public.user_lesson_progress enable row level security;
alter table public.user_quiz_scores enable row level security;
alter table public.deliverables enable row level security;
alter table public.deliverable_feedback enable row level security;

create policy "lesson_progress_own"
  on public.user_lesson_progress for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "quiz_scores_own"
  on public.user_quiz_scores for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "deliverables_own"
  on public.deliverables for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "deliverable_feedback_select_own"
  on public.deliverable_feedback for select
  to authenticated
  using (
    exists (
      select 1 from public.deliverables d
      where d.id = deliverable_id and d.user_id = auth.uid()
    )
  );

create policy "deliverable_feedback_insert_own"
  on public.deliverable_feedback for insert
  to authenticated
  with check (
    exists (
      select 1 from public.deliverables d
      where d.id = deliverable_id and d.user_id = auth.uid()
    )
  );

create policy "deliverable_feedback_update_own"
  on public.deliverable_feedback for update
  to authenticated
  using (
    exists (
      select 1 from public.deliverables d
      where d.id = deliverable_id and d.user_id = auth.uid()
    )
  );
