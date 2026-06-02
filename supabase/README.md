# Supabase — Future Skills

## Migrations

| Fichier | Contenu |
|---------|---------|
| `20250602000000_initial_schema.sql` | Cohortes, profils, RLS, seed `FS-2025-01` |
| `20250602100000_progress_deliverables.sql` | Progression leçons/quiz, livrables |
| `20250602120000_mentoring_certificates.sql` | Mentorat, certificats, RPC `mentoring_spots_left` |

## Application des migrations

**SQL Editor** (dashboard) : coller chaque fichier dans l’ordre, puis **Run**.

**CLI** :

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
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
