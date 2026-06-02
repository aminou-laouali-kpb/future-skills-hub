# Déploiement Future Skills

## Application (GitHub Pages)

Chaque push sur `main` déclenche le workflow `.github/workflows/deploy.yml` :

1. `npm ci` → `npm test` → `npm run build`
2. Publication sur GitHub Pages

URL attendue : `https://<org>.github.io/future-skills-hub/`

Dans le dépôt GitHub : **Settings → Pages → Source** = *GitHub Actions* (si ce n’est pas déjà fait).

Variables d’environnement de build (secrets **Settings → Secrets → Actions**) :

| Secret | Description |
|--------|-------------|
| `VITE_SUPABASE_URL` | URL projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Clé anon publique |

Sans ces secrets, l’app tourne en **mode démo** (OTP `123456`, données en `localStorage`).

## Supabase (base de données)

Appliquer les migrations dans l’ordre :

1. `supabase/migrations/20250602000000_initial_schema.sql`
2. `supabase/migrations/20250602100000_progress_deliverables.sql`
3. `supabase/migrations/20250602120000_mentoring_certificates.sql`

Via CLI : `supabase db push` depuis un projet lié.

## Alternative Lovable

Le README racine décrit aussi la publication via [Lovable](https://lovable.dev) (Share → Publish).
