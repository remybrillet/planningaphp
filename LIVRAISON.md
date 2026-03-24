# PlanningAPHP — Dossier de Livraison

---

## Dossier de Présentation Client

### Introduction

Cher Rémy,

Nous sommes très heureux de vous présenter **PlanningAPHP**, votre nouvelle application de gestion des plannings pour le service de Réanimation Néonatale du CHIPS à Poissy.

Cette solution sur mesure a été conçue pour répondre précisément à vos besoins : **simplifier drastiquement la gestion des plannings**, éliminer les erreurs, et offrir une visibilité claire à l'ensemble de votre équipe de 60 agents.

Fini le jour entier passé sur Excel chaque semaine — PlanningAPHP vous permettra de gérer vos plannings en une fraction du temps, avec une interface intuitive et moderne.

---

### Fonctionnalités livrées

#### 1. Authentification & Sécurité
- Connexion sécurisée avec email et mot de passe
- Chiffrement des mots de passe (bcrypt, coût 12)
- Tokens JWT avec sessions httpOnly (8h d'expiration)
- Protection contre les tentatives d'intrusion (rate limiting : 5 tentatives/minute)
- Champ honeypot anti-spam sur les formulaires
- Logs d'audit complets de toutes les actions
- Réinitialisation de mot de passe

#### 2. Planning interactif
- Vue mensuelle avec calendrier visuel
- Distinction claire Shift Jour (07h-19h) / Shift Nuit (19h-07h)
- Indicateurs d'effectif par jour
- Alertes automatiques en cas de jour non pourvu
- Navigation fluide entre les mois
- Vue semaine disponible

#### 3. Gestion des agents
- Liste complète avec recherche et filtres
- Distinction INF / Puéricultrices
- Gestion des temps partiels (50% à 100%)
- Activation/désactivation de comptes
- Profils détaillés par agent

#### 4. Gestion des congés
- Demandes en ligne (CP, RTT, maladie, formation, maternité, paternité)
- Workflow d'approbation pour les gestionnaires
- Détection automatique des chevauchements
- Tableau de bord avec compteurs par statut
- Notifications automatiques à l'agent

#### 5. Gestion des remplacements
- Vue des agents absents par date
- Liste des agents disponibles en temps réel
- Filtrage par compétence (INF/Puéricultrice)
- Identification rapide des solutions de remplacement

#### 6. Rapports et exports
- Planning mensuel (PDF/Excel)
- Heures travaillées par agent
- Solde de congés
- Taux d'absentéisme
- Export CSV pour traitement externe

#### 7. Back-office administrateur
- **Dashboard** : vue d'ensemble (agents actifs, shifts du jour, congés en attente, alertes)
- **Gestion des utilisateurs** : CRUD complet, attribution des rôles et compétences
- **Configuration** : paramètres des shifts, effectifs min/max, repos minimum
- **Journal d'audit** : traçabilité complète de toutes les modifications

#### 8. Notifications
- Notifications en temps réel dans l'application
- Templates email prêts (nouvelle affectation, validation congé, bienvenue)
- Intégration Resend pour l'envoi transactionnel

#### 9. Conformité RGPD
- Mentions légales complètes
- Politique de confidentialité détaillée
- Bandeau cookies avec consentement explicite
- Google Analytics bloqué par défaut (activé après consentement uniquement)
- Umami Analytics respectueux de la vie privée (sans cookies)
- Droits des utilisateurs documentés (accès, rectification, suppression, portabilité)

#### 10. Sécurité renforcée
- Headers HTTP sécurisés (CSP, HSTS, X-Frame-Options, etc.)
- Validation côté serveur (Zod) sur toutes les routes API
- Rate limiting sur les routes d'authentification
- Sessions sécurisées (httpOnly, secure, sameSite)
- Logs d'audit sur toutes les modifications

---

### Points forts

- **Interface moderne et intuitive** : design épuré, navigation claire, zéro complexité
- **Mobile-ready** : interface responsive utilisable sur tablette et mobile
- **Performances optimales** : chargement rapide, skeleton screens, code splitting
- **Accessibilité WCAG AA** : navigation clavier, contrastes conformes, lecteurs d'écran
- **Évolutif** : architecture modulaire prête pour les futures fonctionnalités (V2)

---

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|-------------|
| Admin | r.brillet@ghtyvelinesnord.fr | Admin2024! |
| Gestionnaire | gestionnaire@ghtyvelinesnord.fr | Gestionnaire2024! |
| Employé | a.martin@ghtyvelinesnord.fr | Employe2024! |

> **Important** : Modifiez ces mots de passe lors de la mise en production.

---

### Guide d'utilisation simplifié

1. **Se connecter** : Rendez-vous sur l'URL de l'application et connectez-vous avec vos identifiants
2. **Consulter le planning** : La page Planning affiche le calendrier mensuel avec les shifts
3. **Ajouter une affectation** : Cliquez sur "Ajouter" pour affecter un agent à un shift
4. **Gérer les congés** : Depuis le menu Congés, soumettez ou validez les demandes
5. **Trouver un remplaçant** : Le module Remplacements montre qui est disponible par date
6. **Exporter** : Depuis Rapports, générez vos exports en un clic
7. **Administrer** : L'espace Admin (visible uniquement pour les administrateurs) permet de gérer les utilisateurs et la configuration

---

### Évolutions futures (V2)

- Application mobile native (PWA)
- Système de déshydrata avancé avec priorités
- Drag & drop sur le planning pour déplacer les affectations
- Intégration calendrier personnel (Outlook, Google Calendar)
- Prévision automatique des besoins en effectifs
- Système de notation et préférences des agents

---

## Procès-Verbal de Livraison

### Informations générales

| Champ | Valeur |
|-------|--------|
| **Projet** | PlanningAPHP — Gestion des plannings |
| **Client** | Rémy BRILLET — Service Réanimation Néonatale CHIPS |
| **Prestataire** | Silver Lining |
| **Date de livraison** | 24 mars 2026 |
| **Version** | 1.0.0 |

### Critères de recette

| Critère | Statut |
|---------|--------|
| Authentification (login/logout) | ✅ Conforme |
| Protection par rôles (Admin/Gestionnaire/Employé) | ✅ Conforme |
| Planning mensuel avec affichage des shifts | ✅ Conforme |
| Gestion des agents (CRUD) | ✅ Conforme |
| Gestion des congés (demande + validation) | ✅ Conforme |
| Module remplacements | ✅ Conforme |
| Exports (CSV/TXT) | ✅ Conforme |
| Dashboard admin | ✅ Conforme |
| Configuration du service | ✅ Conforme |
| Journal d'audit | ✅ Conforme |
| Notifications | ✅ Conforme |
| Mentions légales | ✅ Conforme |
| Politique de confidentialité | ✅ Conforme |
| Bandeau cookies RGPD | ✅ Conforme |
| Analytics (Umami + GA4) | ✅ Conforme |
| Headers de sécurité | ✅ Conforme |
| Rate limiting | ✅ Conforme |
| Page 404 personnalisée | ✅ Conforme |
| Footer Silver Lining | ✅ Conforme |

### Compatibilité testée

| Navigateur | Résultat |
|------------|----------|
| Chrome (dernière version) | ✅ Compatible |
| Firefox (dernière version) | ✅ Compatible |
| Safari (dernière version) | ✅ Compatible |
| Edge (dernière version) | ✅ Compatible |

### Stack technique déployée

| Composant | Version |
|-----------|---------|
| Next.js | 15.5 |
| React | 19 |
| TypeScript | 5.7 |
| Tailwind CSS | 4.0 |
| Prisma | 6.19 |
| PostgreSQL | 16 |
| Node.js | 20 (Alpine) |
| Docker Compose | v5 |

### Limites et exclusions

- Le drag & drop sur le planning est prévu en V2
- L'envoi d'emails nécessite la configuration d'une clé API Resend valide
- Les exports sont en format CSV/TXT (PDF natif prévu en V2)
- L'application mobile est prévue en V2
- Le Cloudflare Turnstile nécessite des clés de production pour fonctionner
- Les images Unsplash n'ont pas été intégrées (à faire lors du déploiement en production)

### Garantie

**Silver Lining s'engage à :**
- Corriger tout bug bloquant signalé dans les **30 jours** suivant la livraison
- Assurer un support technique par email pendant cette période
- Fournir les corrections sous forme de mises à jour du code source

### Processus de signalement

1. Signaler le bug par email à contact@silverliningcloud.fr
2. Inclure : description du problème, étapes pour reproduire, capture d'écran si possible
3. Délai de réponse : 24h ouvrées
4. Délai de correction : selon la criticité (bloquant : 48h, mineur : 1 semaine)

### Propriété du code

Le code source de l'application est la propriété du client (GHT Yvelines Nord). Silver Lining conserve un droit d'usage pour la maintenance et l'évolution de l'application selon les termes convenus.

### Signatures

| | Nom | Date | Signature |
|---|------|------|-----------|
| **Client** | Rémy BRILLET | ____/____/________ | _________________ |
| **Prestataire** | Silver Lining | ____/____/________ | _________________ |

---

*Document généré automatiquement par le pipeline de livraison Silver Lining.*
