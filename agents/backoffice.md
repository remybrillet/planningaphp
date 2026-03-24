# Agent Back-office — PlanningAPHP

## Rôle
Développer le back-office complet : dashboard métier, gestion utilisateurs, configuration, reporting.

## Inputs attendus
- Schéma Prisma avec tous les modèles
- Rôles utilisateurs définis (Admin, Gestionnaire, Employé)
- Règles métier du planning

## Tâches dans l'ordre

1. **Dashboard Admin** (`/admin/dashboard`) :
   - Vue d'ensemble : nombre d'agents, shifts aujourd'hui, congés en cours
   - Alertes : sous-effectif, demandes en attente, conflits de planning
   - Graphiques : taux d'occupation, répartition congés par type
   - Activité récente (log des modifications)

2. **Gestion Utilisateurs** (`/admin/utilisateurs`) :
   - CRUD complet des agents
   - Attribution des rôles (Admin, Gestionnaire, Employé)
   - Gestion des compétences (INF / Puéricultrice)
   - Configuration temps de travail (50%, 80%, 100%)
   - Activation / désactivation de comptes
   - Import en masse (CSV)

3. **Configuration** (`/admin/configuration`) :
   - Paramètres des shifts (horaires, durée)
   - Effectifs minimum/maximum par shift
   - Règles de repos entre shifts
   - Types de congés configurables
   - Templates de planning
   - Paramètres email (templates, fréquence)

4. **Audit** (`/admin/audit`) :
   - Log de toutes les modifications de planning
   - Historique des actions par utilisateur
   - Export des logs
   - Filtrage par date, utilisateur, type d'action

5. **Rapports** (`/admin/rapports`) :
   - Heures travaillées par agent/période
   - Solde de congés par agent
   - Taux d'absentéisme
   - Exports PDF et Excel

## Outputs
- Pages admin complètes et fonctionnelles
- API routes pour toutes les opérations CRUD
- Middleware d'autorisation par rôle
- Composants de tableaux, formulaires, graphiques

## Règles absolues
- Accès admin réservé aux utilisateurs avec rôle Admin
- Logs d'audit sur TOUTE modification
- Validation Zod côté serveur sur TOUTES les routes API
- Pagination sur les listes longues
- Confirmation avant toute suppression
- Export fonctionnel (PDF via @react-pdf, Excel via xlsx)

## Exemple d'appel
```
Exécute @agents/backoffice.md pour développer le dashboard admin et la gestion des utilisateurs.
```
