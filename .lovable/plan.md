## Ajout du Haoussa (ha) comme langue active

### Fichiers modifiés

**1. `src/i18n/translations.ts`**
- Étendre le type `Lang` : `"fr" | "en" | "ha"`
- Ajouter un objet `ha` complet, miroir de la structure `fr`/`en`, couvrant toutes les sections : `nav`, `landing` (avec features, steps, footer), `auth`, `onboarding` (avec levelOptions, goalOptions), `dashboard`, `modules`, `moduleDetail`, `quiz`, `deliverables`, `feedback`, `mentoring`, `resources`, `admin`, `support`, `status`, `common`, `notFound`.
- Haoussa standard nigérien. Termes techniques universels conservés (Quiz, Email, WhatsApp, PDF). Passages longs (FAQ, hero) rédigés simplement pour relecture native ultérieure.

**2. `src/i18n/LanguageContext.tsx`**
- Valider `"ha"` dans la lecture localStorage : `stored === "en" || stored === "fr" || stored === "ha"`.

**3. `src/components/LanguageSwitcher.tsx`**
- Déplacer `HA` de `upcoming` vers `langs` actifs.
- Conserver uniquement `ZAR` (Zarma) dans `upcoming`.

**4. `src/pages/Landing.tsx`**
- Le badge "Programme certifié" utilise `lang === "fr"` en ternaire. Le remplacer par une clé de traduction `t.landing.certifiedBadge` (ajoutée dans les 3 langues) pour éviter qu'il s'affiche en français quand `lang === "ha"`.

### Hors périmètre
- Zarma (reste placeholder).
- Audio/voix off haoussa.
- Détection automatique de langue navigateur.

### Validation
- Basculer FR → EN → HA via le switcher sur Landing, Dashboard, Onboarding, Modules : aucune clé manquante, pas de fallback FR visible.