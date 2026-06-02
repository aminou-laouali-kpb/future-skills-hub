# Actualiser Future Skills sur Lovable

Ce dépôt est la **source de vérité** pour le code. **Lovable** héberge la production : chaque push sur `main` peut être récupéré par Lovable, puis publié en un clic.

---

## Checklist rapide (5 étapes)

| # | Action | Où |
|---|--------|-----|
| 1 | Vérifier que `main` contient la dernière version (`git pull origin main`) | GitHub / local |
| 2 | Attendre la synchro Lovable (quelques secondes à minutes) | [lovable.dev](https://lovable.dev) → votre projet |
| 3 | Ajouter les variables d’environnement Supabase | Lovable → **Project → Settings → Environment variables** |
| 4 | Exécuter les 3 migrations SQL | [Supabase SQL Editor](https://supabase.com/dashboard) |
| 5 | **Share → Publish** | Lovable |

Sans étape 3–4, l’app fonctionne en **mode démo** : OTP `123456`, données en `localStorage` uniquement.

---

## 1. Synchroniser le code Git → Lovable

Lovable est connecté à ce dépôt GitHub (`kpb-global/future-skills-hub`).

**Flux recommandé**

1. Les améliorations sont mergées sur **`main`** (CI : tests + build).
2. Ouvrir le projet Lovable — le code se met à jour automatiquement depuis Git.
3. Prévisualiser dans Lovable (preview intégrée).
4. **Share → Publish** pour mettre en ligne la version publique.

**Flux inverse (édition dans Lovable)**

Les prompts Lovable peuvent committer sur ce repo. Avant de repartir en local :

```bash
git pull origin main
npm install
npm run dev
```

**Conflits** : privilégier une seule source à la fois (soit Lovable, soit IDE) pour la même zone de fichiers.

---

## 2. Variables d’environnement sur Lovable

Dans **Project → Settings → Environment variables**, ajouter :

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | URL du projet, ex. `https://abcdefgh.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé **anon** (publique) — **Project Settings → API** sur Supabase |

Copier le modèle depuis `.env.example` à la racine du repo.

**Important**

- Ne pas commiter `.env` (déjà dans `.gitignore`).
- Après modification des variables, **republier** (Publish) pour que le build de prod les prenne en compte.
- `VITE_BASE_PATH` : **ne pas définir** sur Lovable (défaut `/`). Ce réglage ne sert que pour GitHub Pages en sous-chemin.

---

## 3. Base Supabase (obligatoire pour la prod multi-appareils)

### Créer / choisir un projet

1. [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Noter **Project URL** et **anon key** (étape 2 ci-dessus).

### Migrations SQL (ordre strict)

Dans **SQL Editor**, exécuter **un fichier après l’autre** :

1. `supabase/migrations/20250602000000_initial_schema.sql` — cohortes, profils, RLS, seed `FS-2025-01`
2. `supabase/migrations/20250602100000_progress_deliverables.sql` — leçons, quiz, livrables
3. `supabase/migrations/20250602120000_mentoring_certificates.sql` — mentorat, certificats

Détails : [supabase/README.md](../supabase/README.md).

**CLI alternative** (local, projet lié) :

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npm run db:push
```

### Auth OTP

**Authentication → Providers** : activer **Email** et/ou **Phone**.

- En prod : configurer SMS/email selon votre région (Niger).
- Sans Supabase configuré : connexion démo, code **`123456`**.

---

## 4. Publier sur Lovable

1. Ouvrir le projet sur [lovable.dev](https://lovable.dev).
2. Vérifier la preview (parcours : Landing → Login → Onboarding → Dashboard → Modules).
3. **Share → Publish**.
4. (Optionnel) **Settings → Domains** pour un domaine personnalisé.

Documentation Lovable : [Publish](https://docs.lovable.dev/features/publish) · [Custom domain](https://docs.lovable.dev/features/custom-domain).

---

## 5. Fonctionnalités livrées sur `main`

| Domaine | Contenu |
|---------|---------|
| Auth | OTP, onboarding, `AuthContext`, sync profil |
| Parcours | Modules M1–M5, progression 80 % leçons / 60 % quiz |
| Recommandations | Moteur + cartes UI |
| UX | PWA, mode lite, nav mobile, accessibilité, cache hors-ligne leçons |
| Certificat / admin | Certificat, mentorat persisté, exports CSV admin |
| Sync cloud | Progression, livrables, mentorat, certificats (si utilisateur UUID Supabase) |
| i18n | FR, EN, HA (Haoussa) — Zarma à venir |

Tests : `npm test` (14 tests). CI : workflow **CI** sur chaque push `main`.

---

## 6. Développement local (miroir Lovable)

```bash
git clone https://github.com/kpb-global/future-skills-hub.git
cd future-skills-hub
npm install
cp .env.example .env
# Renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (ou laisser vide = démo)
npm run dev
```

Preview : `http://localhost:8080` (port défini dans `vite.config.ts`).

---

## 7. Dépannage

| Symptôme | Piste |
|----------|--------|
| Lovable n’a pas le dernier code | Vérifier la branche connectée (`main`), `git pull`, attendre la sync |
| Build Lovable échoue | Ouvrir les logs de build ; lancer `npm run build` en local |
| Connexion impossible | Variables Supabase sur Lovable ; providers Auth activés |
| Données non partagées entre appareils | Migrations appliquées ; utilisateur connecté via Supabase (pas seulement démo) |
| OTP ne arrive pas | Mode démo `123456` sans `.env` ; en prod vérifier SMS/email Supabase |
| PWA / routes 404 en prod | Republier depuis Lovable ; `base` doit rester `/` |

---

## 8. Prochaines évolutions (hors `main` ou via prompts Lovable)

- i18n Zarma (S6)
- Vidéos réelles M1–M5
- File d’attente hors-ligne pour les livrables
- Supabase comme seule source de vérité (fusion complète local/cloud)

Plan Lovable en cours : [.lovable/plan.md](../.lovable/plan.md) (Haoussa — déjà intégré sur `main`).

---

## Liens utiles

- [README.md](../README.md) — vue d’ensemble du projet
- [DEPLOY.md](./DEPLOY.md) — alternatives (GitHub Pages, CI)
- [SPRINTS_AGENTS.md](./SPRINTS_AGENTS.md) — historique des sprints agents
- [Matrice_exigences_FuturSkills.md](./Matrice_exigences_FuturSkills.md) — exigences produit
