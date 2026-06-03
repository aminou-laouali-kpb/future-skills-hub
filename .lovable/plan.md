# Notifications Web Push — Mentorat & Plan du jour

## Avertissement
Web Push nécessite un Service Worker. Les SW peuvent interférer avec la preview Lovable (iframe). On garde un SW **minimal dédié uniquement aux notifications** (pas de cache, pas de navigateFallback), et on bloque son enregistrement dans les iframes et sur les domaines `lovableproject.com` / `id-preview--…`. Les notifications fonctionneront donc sur la version **publiée** et sur mobile (Android Chrome/Firefox — iOS Safari 16.4+ requiert installation PWA).

## 1. Secrets (VAPID)
Générer une paire VAPID une seule fois (script local) et stocker :
- `VAPID_PUBLIC_KEY` (runtime + exposée côté client via `VITE_VAPID_PUBLIC_KEY`)
- `VAPID_PRIVATE_KEY` (secret edge function)
- `VAPID_SUBJECT` (ex. `mailto:contact@futureskills.ne`)

## 2. Schéma DB (migration)
```text
push_subscriptions
  id uuid PK, user_id uuid FK auth.users, endpoint text UNIQUE,
  p256dh text, auth text, user_agent text, lang text, created_at timestamptz

notification_preferences
  user_id uuid PK FK auth.users,
  day_plan_enabled bool default true,
  day_plan_time time default '08:00',
  day_plan_tz text default 'Africa/Niamey',
  mentoring_enabled bool default true,
  mentoring_lead_minutes int default 60,
  updated_at timestamptz

scheduled_notifications
  id uuid PK, user_id uuid, kind text ('day_plan'|'mentoring'),
  title text, body text, url text,
  scheduled_for timestamptz, sent_at timestamptz,
  related_id text, created_at timestamptz
```
RLS : chaque user lit/écrit uniquement ses propres lignes. GRANT pour `authenticated` + `service_role`.

## 3. Service Worker — `public/sw-push.js`
Uniquement `push` + `notificationclick` (focus tab existant ou ouvre `data.url`). Pas de `fetch` handler → zéro impact cache.

## 4. Frontend
- `src/lib/pushNotifications.ts` : `enablePush()`, `disablePush()`, `getSubscriptionStatus()`, `urlBase64ToUint8Array()`. Guard iframe/preview → renvoie `{ supported:false, reason }`.
- `src/components/NotificationSettings.tsx` : carte avec toggle principal, heure rappel plan du jour, délai mentorat (15/30/60/120 min), bouton "Tester". Stocke prefs via edge function.
- Intégration : nouvelle section dans `Dashboard.tsx` (collapsible "Rappels & notifications") + bouton rapide dans `Mentoring.tsx` (CTA quand non activé).
- Traductions FR/EN/HA dans `src/i18n/translations.ts` (section `notifications`).

## 5. Edge functions (`supabase/functions/…`)
- `push-subscribe/index.ts` : upsert subscription + prefs init pour le user.
- `push-prefs/index.ts` : GET/PUT préférences.
- `push-test/index.ts` : envoie une notif test au user.
- `push-dispatch/index.ts` : **cron toutes les 5 min**. Étapes :
  1. Pour chaque user avec `day_plan_enabled` : si `now` ≈ `day_plan_time` (fenêtre 5 min, TZ user) → enqueue + envoie.
  2. Pour chaque inscription `mentoring_registrations` future avec `mentoring_enabled` : si `session_start - lead_minutes` ≈ now (±5 min) et pas déjà `sent_at` → enqueue + envoie.
  3. Envoie via `npm:web-push@3` (VAPID). Si endpoint répond 404/410 → supprime la subscription.
Toutes utilisent CORS partagé, validation Zod, `getClaims()` pour les routes user.

## 6. Schedule
Migration ajoute `pg_cron` :
```sql
select cron.schedule(
  'push-dispatch-5min', '*/5 * * * *',
  $$ select net.http_post(
    url := '{SUPABASE_URL}/functions/v1/push-dispatch',
    headers := jsonb_build_object('Authorization','Bearer {SERVICE_ROLE_KEY}'))
  $$);
```
URL & key injectées via `vault` ou variables — on documente dans `supabase/README.md` la commande manuelle de bootstrap.

## 7. Hors périmètre
- iOS Safari < 16.4 (pas de Web Push possible).
- Rappels SMS/WhatsApp (déjà couvert par webhooks n8n existants — à brancher séparément si besoin).
- Notifications "module à compléter" / streak (extension future, structure `kind` déjà extensible).

## 8. Validation
- Script local pour générer VAPID.
- En préview : UI affiche "Disponible uniquement sur la version publiée".
- En prod : permission → subscribe → bouton test → notification reçue. Inscription mentorat puis avance horloge serveur d'un cron manuel `select push-dispatch` → notification reçue.

## Fichiers
**Nouveaux** : `supabase/migrations/20260603000000_push_notifications.sql`, `public/sw-push.js`, `src/lib/pushNotifications.ts`, `src/components/NotificationSettings.tsx`, `supabase/functions/push-subscribe/index.ts`, `…/push-prefs/index.ts`, `…/push-test/index.ts`, `…/push-dispatch/index.ts`, `scripts/generate-vapid.mjs`.
**Modifiés** : `src/i18n/translations.ts`, `src/pages/Dashboard.tsx`, `src/pages/Mentoring.tsx`, `src/main.tsx` (enregistrement SW guardé), `.env.example`, `supabase/README.md`.
