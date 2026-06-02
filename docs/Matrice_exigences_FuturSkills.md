# Matrice d'exigences — Future Skills UX / LMS

> **Source** : dérivée de `Matrice_exigences_FuturSkills.docx` (à réconcilier dès import dans `docs/`), du code actuel (`/workspace/src`) et du cahier des charges UX (référence utilisateur).
>
> **Légende statut** : `OK` = UI mock présente · `PARTIEL` = incomplet ou mock · `ABSENT` = non implémenté
>
> **Priorité** : P0 bloquant prod · P1 valeur métier · P2 polish / phase 2

| ID | Domaine | Exigence | Persona | P | Statut | Sprint |
|----|---------|----------|---------|---|--------|--------|
| FS-AUTH-01 | Auth | Connexion sans mot de passe (email ou téléphone + OTP 6 chiffres) | Apprenant | P0 | PARTIEL | S1 |
| FS-AUTH-02 | Auth | Renvoi de code, retour étape contact | Apprenant | P1 | OK | — |
| FS-ONB-01 | Onboarding | Code cohorte obligatoire (3 étapes) | Apprenant | P0 | PARTIEL | S1 |
| FS-ONB-02 | Onboarding | Profil : prénom, nom, ville | Apprenant | P0 | PARTIEL | S1 |
| FS-ONB-03 | Onboarding | Niveau (débutant / intermédiaire) + objectif (emploi, entrepreneuriat, IA, productivité) | Apprenant | P0 | PARTIEL | S1 |
| FS-ONB-04 | Onboarding | Opt-in WhatsApp + numéro | Apprenant | P1 | PARTIEL | S1 |
| FS-I18N-01 | i18n | FR, EN, HA actifs (switcher) | Tous | P0 | OK | — |
| FS-I18N-02 | i18n | Zarma (placeholder → actif) | Tous | P2 | ABSENT | S6 |
| FS-I18N-03 | i18n | 100 % des chaînes via `translations.ts` (zéro ternaire FR/EN en dur) | Tous | P1 | PARTIEL | S1 |
| FS-ACC-01 | Accessibilité | Contrôle taille police (base / lg / xl) | Apprenant | P1 | OK | — |
| FS-ACC-02 | Accessibilité | Mode lite (faible bande passante / save-data) | Apprenant | P0 | OK | S4 |
| FS-ACC-03 | Accessibilité | WCAG AA (focus, contrastes, aria lecteur vidéo/quiz) | Apprenant | P1 | PARTIEL | S4 |
| FS-OFF-01 | Offline | Détection hors ligne + message | Apprenant | P1 | OK | — |
| FS-OFF-02 | Offline | Cache leçons texte + transcriptions ; file livrables | Apprenant | P1 | ABSENT | S4 |
| FS-LAND-01 | Marketing | Landing : hero, programme 10j, 5 modules, CTA cohorte | Visiteur | P0 | OK | — |
| FS-DASH-01 | Parcours | Dashboard : progression globale, jour cohorte, modules | Apprenant | P0 | PARTIEL | S2 |
| FS-DASH-02 | Parcours | Objectif du jour, dernier feedback, prochain mentorat | Apprenant | P1 | PARTIEL | S2 |
| FS-DASH-03 | Parcours | Streak + badge certificat | Apprenant | P2 | PARTIEL | S2 |
| FS-DASH-04 | Parcours | Progression anonymisée cohorte | Apprenant | P2 | PARTIEL | S2 |
| FS-PLAN-01 | Parcours | Plan 10 jours fixe par jour / module | Apprenant | P0 | PARTIEL | S3 |
| FS-PLAN-02 | Parcours | Plan du jour **dynamique** (lié progression réelle) | Apprenant | P0 | ABSENT | S3 |
| FS-MOD-01 | Contenu | Catalogue 5 modules (verrouillage séquentiel) | Apprenant | P0 | PARTIEL | S2 |
| FS-MOD-02 | Contenu | Détail module : sidebar leçons, lecteur, marquer terminé | Apprenant | P0 | PARTIEL | S2 |
| FS-MOD-03 | Contenu | Leçons + quiz pour **tous** les modules (pas seulement M1) | Apprenant | P0 | ABSENT | S2 |
| FS-MOD-04 | Contenu | Vidéos réelles (YouTube ou hébergement) + transcription | Apprenant | P0 | PARTIEL | S4 |
| FS-QUIZ-01 | Évaluation | Quiz QCM / Vrai-Faux, score, explications, retry | Apprenant | P0 | PARTIEL | S2 |
| FS-QUIZ-02 | Évaluation | Seuil validation module : **≥ 60 %** (règle FAQ) | Apprenant | P0 | ABSENT | S2 |
| FS-PROG-01 | Progression | 80 % leçons par module pour valider (règle FAQ) | Apprenant | P0 | ABSENT | S2 |
| FS-LIV-01 | Livrables | Dépôt fichier / lien, types (CV, pitch, BP…), checklist | Apprenant | P0 | PARTIEL | S2 |
| FS-LIV-02 | Livrables | Statuts brouillon / soumis / feedback / retard | Apprenant | P0 | PARTIEL | S2 |
| FS-FB-01 | Feedback | Page feedback : note, forces, améliorations, resoumission | Apprenant | P0 | PARTIEL | S2 |
| FS-MEN-01 | Mentorat | Liste sessions, inscription, détails, lien Meet | Apprenant | P1 | PARTIEL | S5 |
| FS-MEN-02 | Mentorat | **≥ 1 session** pour certificat (règle FAQ) | Apprenant | P0 | ABSENT | S5 |
| FS-RES-01 | Ressources | Bibliothèque filtrable (PDF, vidéo, template, lien) | Apprenant | P1 | PARTIEL | S5 |
| FS-RECO-01 | Recommandations | Moteur règles : prochaine action prioritaire | Apprenant | P0 | ABSENT | S3 |
| FS-RECO-02 | Recommandations | Carte Dashboard « Recommandé pour toi » + « Pourquoi ? » | Apprenant | P0 | ABSENT | S3 |
| FS-RECO-03 | Recommandations | Recos post-quiz (remediation) et post-feedback | Apprenant | P0 | ABSENT | S3 |
| FS-RECO-04 | Recommandations | Personnalisation par objectif onboarding | Apprenant | P0 | ABSENT | S3 |
| FS-RECO-05 | Recommandations | Recos ressources / mentorat selon lacunes | Apprenant | P1 | ABSENT | S3 |
| FS-RECO-06 | Recommandations | Admin : reco manuelle + suivi clic → action | Admin | P2 | ABSENT | S6 |
| FS-CERT-01 | Certificat | Conditions : 5 modules + 80 % leçons + 60 % quiz + livrables + 1 mentorat | Apprenant | P0 | ABSENT | S5 |
| FS-CERT-02 | Certificat | Génération PDF / partage LinkedIn | Apprenant | P1 | ABSENT | S5 |
| FS-ADM-01 | Admin | Reporting cohorte (progression, quiz, livrables) | Admin | P0 | PARTIEL | S5 |
| FS-ADM-02 | Admin | Alertes à risque (48h offline, quiz < 50 %, retards) | Admin | P0 | PARTIEL | S5 |
| FS-ADM-03 | Admin | Exports CSV / Sheets, rappels | Admin | P1 | PARTIEL | S5 |
| FS-ADM-04 | Admin | Gestion cohortes / utilisateurs (CRUD) | Admin | P1 | ABSENT | S5 |
| FS-SUP-01 | Support | FAQ + formulaire contact | Tous | P1 | OK | — |
| FS-SUP-02 | Support | WhatsApp FAB aide | Apprenant | P1 | OK | — |
| FS-DATA-01 | Technique | Persistance Supabase (profil, progression, tentatives, livrables) | Système | P0 | ABSENT | S1 |
| FS-DATA-02 | Technique | RLS par cohorte / rôle | Système | P0 | ABSENT | S1 |
| FS-ANA-01 | Analytics | Entonnoir reco affichée → clic → complétion | Produit | P2 | ABSENT | S6 |

## Règles métier (référence certificat — FAQ intégrée)

- **Modules** : les 5 modules complétés.
- **Leçons** : ≥ 80 % des leçons par module.
- **Quiz** : ≥ 60 % par module.
- **Livrables** : déposés et validés (détail par module à préciser dans le docx officiel).
- **Mentorat** : participation à au moins 1 session.

## Écarts à valider avec le docx officiel

- [ ] Parcours strictement linéaire jour J vs navigation libre entre leçons.
- [ ] Nombre exact de livrables obligatoires par module.
- [ ] Rôles : mentor / formateur distinct de l'admin ?
- [ ] Notifications WhatsApp : API vs deep links uniquement.
