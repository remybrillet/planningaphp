# Agent Analytics Setup — PlanningAPHP

## Rôle
Configurer le tracking analytics : Umami (toujours actif) + GA4 (après consentement) + events personnalisés.

## Inputs attendus
- Variables d'environnement analytics
- Liste des pages et interactions à tracker

## Tâches dans l'ordre

1. **Umami** :
   - Script chargé dans le layout racine
   - Variables : NEXT_PUBLIC_UMAMI_WEBSITE_ID, NEXT_PUBLIC_UMAMI_URL
   - Toujours actif (pas de cookies = pas de consentement requis)
   - URL par défaut : https://analytics.silverliningcloud.fr/script.js
   - Attribut `data-website-id` sur le script

2. **Google Analytics GA4** :
   - Script gtag.js avec consent mode v2
   - BLOQUÉ par défaut (analytics_storage: denied)
   - Activé UNIQUEMENT après consentement cookies
   - Variable : NEXT_PUBLIC_GA4_ID
   - Composant `GoogleAnalytics` conditionnel

3. **Events personnalisés** (Umami + GA4) :
   - `formulaire_envoye` : soumission formulaire réussie
   - `clic_telephone` : clic sur numéro de téléphone
   - `clic_email` : clic sur adresse email
   - `scroll_50` : scroll à 50% de la page
   - `scroll_100` : scroll à 100% de la page
   - `clic_cta_hero` : clic sur le CTA principal
   - `planning_consulte` : consultation du planning
   - `conge_demande` : demande de congé soumise
   - `shift_modifie` : modification d'un shift

4. **Hook de tracking** :
   - `useTracking()` hook custom
   - Fonction `trackEvent(name, data)` unifiée Umami + GA4
   - Naming convention : snake_case

## Outputs
- Script Umami dans le layout
- Composant GA4 conditionnel
- Hook `useTracking` et fonction `trackEvent`
- Events intégrés dans les composants concernés
- Documentation des events dans ce fichier

## Règles absolues
- Events nommés en snake_case
- GA4 BLOQUÉ avant consentement
- Umami TOUJOURS actif
- Pas de données personnelles dans les events (pas de nom, email, etc.)
- Chaque event documenté (nom, déclencheur, données envoyées)

## Exemple d'appel
```
Exécute @agents/analytics-setup.md pour configurer Umami, GA4 et les events de tracking.
```
