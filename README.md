# Future Skills LMS (Niger)

Plateforme d’apprentissage **Future Skills 2025** — React, Vite, TypeScript, shadcn/ui, Tailwind, Supabase.

**Production** : hébergée sur **[Lovable](https://lovable.dev)**. Ce dépôt GitHub alimente Lovable ; publiez depuis Lovable après chaque mise à jour de `main`.

## Démarrage rapide (Lovable)

1. S’assurer que **`main`** est à jour sur GitHub.
2. Ouvrir le projet Lovable lié à ce repo.
3. Configurer **Supabase** (variables + migrations) — voir **[docs/LOVABLE.md](docs/LOVABLE.md)**.
4. **Share → Publish** dans Lovable.

Guide complet : **[docs/LOVABLE.md](docs/LOVABLE.md)**.

## Développement local

```sh
git clone https://github.com/kpb-global/future-skills-hub.git
cd future-skills-hub
npm install
cp .env.example .env
npm run dev
```

Sans `.env` : **mode démo** (OTP `123456`, `localStorage`).

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de dev (port 8080) |
| `npm test` | Tests Vitest |
| `npm run build` | Build production |
| `npm run db:push` | Migrations Supabase (CLI liée) |

## Stack

- Vite · React 18 · TypeScript
- shadcn/ui · Tailwind CSS
- Supabase (auth OTP, progression, livrables, mentorat, certificats)
- PWA (`vite-plugin-pwa`)

## Documentation

| Fichier | Sujet |
|---------|--------|
| [docs/LOVABLE.md](docs/LOVABLE.md) | **Publier et actualiser sur Lovable** |
| [docs/DEPLOY.md](docs/DEPLOY.md) | CI, artefact `dist`, GitHub Pages (optionnel) |
| [supabase/README.md](supabase/README.md) | Migrations SQL |
| [docs/SPRINTS_AGENTS.md](docs/SPRINTS_AGENTS.md) | Sprints d’intégration |
| [docs/Matrice_exigences_FuturSkills.md](docs/Matrice_exigences_FuturSkills.md) | Exigences produit |

## Lovable (édition visuelle / prompts)

Le projet peut aussi être modifié sur Lovable ; les commits sont poussés vers ce dépôt.

- Remplacer `REPLACE_WITH_PROJECT_ID` dans les liens Lovable par l’ID de votre projet si vous copiez ce README ailleurs.
- Domaine personnalisé : Lovable → **Settings → Domains** — [documentation](https://docs.lovable.dev/features/custom-domain).

## CI

Sur chaque push vers `main` : `npm test` + `npm run build` (workflow **CI**). Pas de déploiement automatique vers GitHub Pages — la prod est sur Lovable.
