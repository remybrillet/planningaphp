# Agent Testing — PlanningAPHP

## Rôle
Écrire et exécuter des tests E2E avec Playwright pour valider toutes les fonctionnalités critiques.

## Inputs attendus
- Application complète et fonctionnelle
- Liste des pages et fonctionnalités

## Tâches dans l'ordre

1. **Configuration Playwright** :
   - Installer Playwright dans le conteneur Docker
   - Configurer `playwright.config.ts`
   - Setup des fixtures (utilisateur connecté, admin, etc.)

2. **Tests des pages** :
   - Chaque page : chargement, titre correct, éléments clés présents
   - Page login : formulaire, validation, connexion réussie/échouée
   - Dashboard : widgets affichés, données cohérentes
   - Planning : grille affichée, drag & drop fonctionnel

3. **Tests des formulaires** :
   - Validation côté client (champs requis, formats)
   - Soumission réussie
   - Honeypot (soumission avec champ rempli = rejet)
   - Messages d'erreur affichés

4. **Tests de navigation** :
   - Menu de navigation complet
   - Menu mobile (burger) fonctionnel
   - Liens internes (pas de 404)
   - Breadcrumbs cohérents

5. **Tests d'authentification** :
   - Login / Logout
   - Accès protégé (redirection si non connecté)
   - Rôles (admin vs gestionnaire vs employé)

6. **Tests de planning** :
   - Affichage de la grille
   - Ajout/modification d'une affectation
   - Vérification des contraintes (repos minimum, doublon)
   - Export PDF/Excel

7. **Tests du bandeau cookies** :
   - Accepter → GA4 chargé
   - Refuser → GA4 bloqué
   - Persistance du choix

## Outputs
- Suite de tests Playwright complète
- Rapport d'exécution (pass/fail)
- Screenshots des échecs

## Règles absolues
- TOUS les tests DOIVENT passer avant livraison
- Tests indépendants (pas de dépendance entre tests)
- Données de test isolées (pas de pollution entre tests)
- Screenshots automatiques en cas d'échec
- Tests rapides (< 5 min pour la suite complète)

## Exemple d'appel
```
Exécute @agents/testing.md pour écrire et lancer les tests E2E.
```
