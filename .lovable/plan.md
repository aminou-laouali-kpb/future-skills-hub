## Plan — Optimisations LMS pour l'Afrique de l'Ouest + Vidéos YouTube

Une seule itération qui regroupe performance/connectivité, vidéos YouTube, engagement, accessibilité et confiance.

### 1. Mode Lite (global)
- `src/contexts/LiteModeContext.tsx` : provider avec `isLite`, `toggleLite`, persistance localStorage, auto-détection via `navigator.connection` (effectiveType `2g`/`slow-2g` ou `saveData`).
- `src/components/LiteModeToggle.tsx` : switch + libellé "Mode Lite (économie data)".
- Injection d'une classe `lite` sur `<html>` pour : masquer images décoratives, désactiver animations (`* { animation: none !important; transition: none !important; }`), réduire ombres/gradients.
- Ajouté dans Navbar (desktop + mobile) et au début de l'Onboarding.

### 2. Indicateur de connexion
- `src/components/ConnectionStatus.tsx` : badge discret en bas (offline/online + qualité 2G/3G/4G). Toast quand on bascule offline.

### 3. Lecteur YouTube optimisé (placeholders)
- `src/components/VideoPlayer.tsx` : facade lite (thumbnail YouTube + bouton play, iframe chargé seulement au clic), respect Mode Lite (affiche un lien "Ouvrir sur YouTube" + transcription au lieu d'embed), affiche durée et taille estimée.
- Étendre `Lesson` dans `mockData.ts` : `videoId?`, `videoDurationSec?`, `videoSizeMB?`, `transcript?`.
- Ajouter `videoId` placeholder (`dQw4w9WgXcQ` style — chaîne vide ou `PLACEHOLDER_VIDEO_ID`) sur 3 leçons de M1.
- Intégrer `<VideoPlayer>` dans `ModuleDetail.tsx` au-dessus du contenu texte si `videoId` présent.

### 4. Hall of Progress (cohorte)
- `src/components/CohortProgress.tsx` : widget anonyme — "68% de ta cohorte a terminé le Module 1", barre + avatars génériques. Ajouté en haut du Dashboard.

### 5. Plan du jour (Jour 1→10)
- `src/pages/DayPlan.tsx` route `/plan-jour` : mappe modules/leçons à une routine quotidienne (10 jours), met en avant le jour courant (`currentUser.day`).
- Lien depuis Dashboard + Navbar.

### 6. WhatsApp
- `src/components/WhatsAppFab.tsx` : bouton flottant en bas à droite (lien `wa.me/...` placeholder) avec libellé "Aide formateur".
- Onboarding étape 3 : checkbox "Recevoir les rappels du programme via WhatsApp" + champ téléphone optionnel.

### 7. Accessibilité — taille de texte
- `src/components/FontSizeControl.tsx` : 3 boutons A / A+ / A++ → applique classe `text-base|text-lg|text-xl` sur `<html>`, persisté.
- Placé dans Navbar (menu utilisateur).

### 8. Streak quotidien
- Logique simple dans `LiteModeContext` (ou nouveau `EngagementContext`) : `streakDays` calculé depuis dernier login (localStorage). Badge "🔥 3 jours" dans Dashboard.

### 9. Multi-langue — préparation Haoussa / Zarma
- `translations.ts` : ajouter clés `ha` et `zar` vides (fallback FR) + `LanguageSwitcher` montre les 4 options avec mention "(bientôt)" pour ha/zar.

### 10. Confiance / sponsors
- Badge "Certifié Future Skills 2025" sur Landing et Dashboard.
- Section sponsors (logos placeholders) en bas de Landing.

### 11. Performance HTML
- `index.html` : `<title>` + meta description FR, `lang="fr"`, preconnect YouTube (`https://i.ytimg.com`, `https://www.youtube-nocookie.com`), viewport déjà OK.
- Lazy load images via `loading="lazy"` partout.

### Fichiers créés
- `src/contexts/LiteModeContext.tsx`
- `src/components/LiteModeToggle.tsx`
- `src/components/ConnectionStatus.tsx`
- `src/components/VideoPlayer.tsx`
- `src/components/CohortProgress.tsx`
- `src/components/WhatsAppFab.tsx`
- `src/components/FontSizeControl.tsx`
- `src/pages/DayPlan.tsx`

### Fichiers modifiés
- `src/App.tsx` (provider + route + FAB)
- `src/data/mockData.ts` (champs vidéo + transcript)
- `src/pages/ModuleDetail.tsx` (intégration VideoPlayer)
- `src/pages/Dashboard.tsx` (CohortProgress + streak + lien Plan du jour)
- `src/pages/Onboarding.tsx` (WhatsApp opt-in)
- `src/pages/Landing.tsx` (badge + sponsors)
- `src/components/Navbar.tsx` (LiteModeToggle + FontSizeControl)
- `src/components/LanguageSwitcher.tsx` (ha/zar)
- `src/i18n/translations.ts` (nouvelles clés)
- `src/index.css` (classes `.lite`)
- `index.html` (meta + preconnect)

### Hors scope (à confirmer plus tard)
- PWA / service worker (déconseillé en preview Lovable, à activer seulement après publication).
- Backend Cloud (auth réelle, upload livrables, certificats PDF) — séparé.
- A/B test landing CTA — peut être ajouté après tracking analytics.
