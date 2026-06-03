-- Future Skills — Web Push notifications (mentoring + day plan reminders)
-- Apply via SQL Editor or `supabase db push` after moving into supabase/migrations/.

-- 1. Subscriptions (one row per device/browser endpoint)
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  lang text default 'fr',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

grant select, insert, update, delete on public.push_subscriptions to authenticated;
grant all on public.push_subscriptions to service_role;

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions_own"
  on public.push_subscriptions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Per-user notification preferences
create table public.notification_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  day_plan_enabled boolean not null default true,
  day_plan_time time not null default '08:00',
  day_plan_tz text not null default 'Africa/Niamey',
  mentoring_enabled boolean not null default true,
  mentoring_lead_minutes int not null default 60,
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.notification_preferences to authenticated;
grant all on public.notification_preferences to service_role;

alter table public.notification_preferences enable row level security;

create policy "notification_preferences_own"
  on public.notification_preferences for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3. Sent / scheduled notifications (idempotency log)
create table public.scheduled_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('day_plan','mentoring','test','custom')),
  title text not null,
  body text not null,
  url text,
  related_id text,
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, kind, related_id, scheduled_for)
);

create index scheduled_notifications_due_idx
  on public.scheduled_notifications (scheduled_for)
  where sent_at is null;

grant select on public.scheduled_notifications to authenticated;
grant all on public.scheduled_notifications to service_role;

alter table public.scheduled_notifications enable row level security;

create policy "scheduled_notifications_own_read"
  on public.scheduled_notifications for select
  to authenticated
  using (auth.uid() = user_id);

-- 4. (Optional) pg_cron schedule for push-dispatch every 5 minutes.
-- Run AFTER you've set 'app.settings.dispatch_url' and 'app.settings.service_role_key'
-- via `alter database postgres set app.settings.dispatch_url = '...'` (or use Vault).
--
-- create extension if not exists pg_cron;
-- create extension if not exists pg_net;
--
-- select cron.schedule(
--   'push-dispatch-5min',
--   '*/5 * * * *',
--   $$
--     select net.http_post(
--       url := current_setting('app.settings.dispatch_url'),
--       headers := jsonb_build_object(
--         'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
--         'Content-Type', 'application/json'
--       ),
--       body := '{}'::jsonb
--     );
--   $$
-- );
