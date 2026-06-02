# Déploiement Future Skills

## État actuel

Le workflow **Deploy to GitHub Pages** sur `main` exécute déjà :

- `npm ci` → `npm test` → `npm run build` ✅  
- Publication Pages ❌ tant que Pages n’est pas activé (erreur `404` sur `deploy-pages`).

Dernier run en échec : voir [Actions](https://github.com/kpb-global/future-skills-hub/actions/workflows/deploy.yml).

---

## 1. Activer GitHub Pages (obligatoire, ~2 min)

1. Ouvrir **https://github.com/kpb-global/future-skills-hub/settings/pages**
2. **Build and deployment → Source** : choisir **GitHub Actions** (pas « Deploy from a branch »).
3. Enregistrer si un bouton **Save** apparaît.
4. Lancer le déploiement :
   - **Actions** → **Deploy to GitHub Pages** → **Run workflow`

URL attendue : **https://kpb-global.github.io/future-skills-hub/**

> Dépôt **privé** : GitHub Pages peut nécessiter un plan **Team** ou une politique org autorisant Pages. Sinon utiliser **Lovable** (ci-dessous).

### Artefact de secours

Chaque run produit aussi un zip **`dist-<commit>`** dans l’onglet **Artifacts** du workflow (téléchargement manuel ou hébergement ailleurs).

---

## 2. Secrets Supabase (production, optionnel)

**Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valeur |
|--------|--------|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | clé **anon** (publique) du projet |

Sans ces secrets, l’app déployée reste en **mode démo** (OTP `123456`, données en `localStorage`).

Relancer le workflow après ajout des secrets.

---

## 3. Migrations Supabase (base de données)

Dans le [dashboard Supabase](https://supabase.com/dashboard) → **SQL Editor**, exécuter **dans l’ordre** :

1. `supabase/migrations/20250602000000_initial_schema.sql`
2. `supabase/migrations/20250602100000_progress_deliverables.sql`
3. `supabase/migrations/20250602120000_mentoring_certificates.sql`

Ou avec la CLI (projet lié) :

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push
```

Vérifier **Authentication → Providers** : Email et/ou Phone (OTP) activés.

---

## 4. Développement local

```bash
cp .env.example .env
# Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

Sans `.env` : mode démo, code OTP **`123456`**.

---

## 5. Alternative Lovable

README racine : [Lovable](https://lovable.dev) → **Share → Publish** (hébergement géré par Lovable).
