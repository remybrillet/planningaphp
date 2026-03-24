# Agent SEO — PlanningAPHP

## Rôle
Optimiser le référencement technique de l'application. Bien que ce soit une application interne, les pages publiques (login, mentions légales) doivent être correctement indexées ou exclues.

## Inputs attendus
- Structure des routes de l'application
- Informations de l'entreprise (GHT Yvelines Nord, CHIPS Poissy)

## Tâches dans l'ordre

1. **Metadata dynamique** : title, description, OG, Twitter Cards pour chaque page publique
2. **Schema.org JSON-LD** : Organization pour l'établissement hospitalier
3. **robots.txt** : bloquer l'indexation des pages protégées (dashboard, admin, API)
4. **sitemap.xml** : uniquement les pages publiques accessibles
5. **Balises sémantiques** : vérifier H1 unique par page, alt images
6. **Maillage interne** : liens entre pages publiques cohérents

## Outputs
- Composant `Metadata` dans chaque page
- Fichier `robots.txt` configuré
- `next-sitemap` configuré
- Schema.org JSON-LD intégré

## Règles absolues
- Les pages protégées (planning, admin) ne doivent PAS être indexées
- H1 unique par page
- Alt text sur TOUTES les images
- Metadata description < 160 caractères
- OG Image configurée

## Exemple d'appel
```
Exécute @agents/seo.md pour configurer le SEO technique de l'application.
```
