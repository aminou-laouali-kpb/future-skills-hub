# Supabase — Future Skills

## Migrations

| Fichier | Contenu |
|---------|---------|
| `migrations/20250602000000_initial_schema.sql` | Cohortes, profils, RLS, seed `FS-2025-01` |
| `migrations/20250602100000_progress_deliverables.sql` | Progression leçons/quiz, livrables |
| `migrations/20250602120000_mentoring_certificates.sql` | Mentorat, certificats, RPC `mentoring_spots_left` |
| `migrations-pending/20260603000000_push_notifications.sql` | Tables Web Push (`push_subscriptions`, `notification_preferences`, `scheduled_notifications`) — **à appliquer manuellement** |

## Application des migrations

**SQL Editor** (dashboard) : coller chaque fichier dans l'ordre, puis **Run**.

**CLI** :

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
# Déplacer migrations-pending/* dans migrations/ avant push
npx supabase db push
```

## Variables front

```env
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
```

Copier depuis **Project Settings → API**.

## Auth OTP

**Authentication → Providers** : activer Email et/ou Phone.
Templates SMS/email selon la région (Niger : vérifier le fournisseur Supabase).

## Web Push notifications

### 1. Secrets edge functions

Ajouter dans **Edge Functions → Secrets** :

| Nom | Valeur |
|-----|--------|
| `VAPID_PUBLIC_KEY` | clé publique VAPID (même que `src/lib/vapidConfig.ts`) |
| `VAPID_PRIVATE_KEY` | clé privée VAPID (gardée secrète) |
| `VAPID_SUBJECT` | `mailto:contact@futureskills.ne` (adresse de contact valide) |

Pour régénérer une paire :

```bash
node scripts/generate-vapid.mjs
```

Mettre à jour `VAPID_PUBLIC_KEY` dans `src/lib/vapidConfig.ts` ET dans les secrets.

### 2. Déployer les edge functions

```bash
supabase functions deploy push-subscribe push-prefs push-test push-dispatch
```

### 3. Cron (rappels périodiques)

Activer `pg_cron` + `pg_net`, puis (SQL Editor) :

```sql
alter database postgres set "app.settings.dispatch_url" =
  'https://<ref>.functions.supabase.co/push-dispatch';
alter database postgres set "app.settings.service_role_key" = '<SERVICE_ROLE_KEY>';

select cron.schedule(
  'push-dispatch-5min',
  '*/5 * * * *',
  $$
    select net.http_post(
      url := current_setting('app.settings.dispatch_url'),
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
        'Content-Type', 'application/json'
      ),
      body := '{}'::jsonb
    );
  $$
);
```

### 4. Mentorat (synchro catalogue)

Les sessions sont actuellement définies en dur dans `src/data/mentoringCatalog.ts` ET dans `supabase/functions/push-dispatch/index.ts`. Pour ajouter une session, mettre à jour les deux fichiers (ou migrer le catalogue en table Supabase).
