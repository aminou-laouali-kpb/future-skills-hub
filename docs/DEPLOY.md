# Déploiement Future Skills

## Production recommandée : Lovable

L’application en ligne est publiée depuis **[Lovable](https://lovable.dev)** (Share → Publish).

**Guide pas à pas** : [LOVABLE.md](./LOVABLE.md)

Résumé :

1. Code à jour sur **`main`** (ce dépôt).
2. Variables sur Lovable : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
3. Migrations SQL dans Supabase (3 fichiers, voir [supabase/README.md](../supabase/README.md)).
4. Publish dans Lovable.

Ne pas définir `VITE_BASE_PATH` sur Lovable (`base` = `/`).

---

## CI GitHub (qualité, pas hébergement prod)

Le workflow **CI** (`.github/workflows/ci.yml`) sur chaque push / PR vers `main` :

- `npm ci` → `npm test` → `npm run build`
- Artefact **`dist`** (14 jours) — téléchargement manuel si besoin

Secrets optionnels (**Settings → Secrets → Actions**) pour un build proche de la prod :

| Secret | Usage |
|--------|--------|
| `VITE_SUPABASE_URL` | Injecté au build CI |
| `VITE_SUPABASE_ANON_KEY` | Injecté au build CI |

Sans secrets : le build CI reste valide ; l’app packagée est en mode démo côté runtime si les variables ne sont pas dans l’hôte final.

---

## Supabase (toutes les cibles)

Dans le [dashboard Supabase](https://supabase.com/dashboard) → **SQL Editor**, exécuter **dans l’ordre** :

1. `supabase/migrations/20250602000000_initial_schema.sql`
2. `supabase/migrations/20250602100000_progress_deliverables.sql`
3. `supabase/migrations/20250602120000_mentoring_certificates.sql`

**Authentication → Providers** : Email et/ou Phone (OTP).

Développement local : copier `.env.example` vers `.env`. OTP démo **`123456`** si vide.

---

## GitHub Pages (optionnel, non utilisé en prod)

Si vous hébergez vous-même sur Pages (dépôt public ou plan Team pour dépôt privé) :

1. **Settings → Pages → Source** : **GitHub Actions**
2. Build avec sous-chemin du repo :

   ```bash
   VITE_BASE_PATH=/<nom-du-repo>/ npm run build
   ```

3. Déployer le contenu de `dist/` (workflow Pages personnalisé ou manuel)

L’équipe projet utilise **Lovable** ; Pages n’est pas requis pour actualiser l’app utilisateurs.

---

## Développement local

```bash
cp .env.example .env
npm install
npm run dev
```

Voir aussi [LOVABLE.md](./LOVABLE.md) § développement local.
