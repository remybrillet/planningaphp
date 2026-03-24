# Agent Intégrations — PlanningAPHP

## Rôle
Configurer les intégrations tierces : anti-spam formulaires, notifications email.

## Inputs attendus
- Variables d'environnement configurées
- Formulaires de l'application (contact, demandes de congés, etc.)

## Tâches dans l'ordre

1. **Cloudflare Turnstile + Honeypot** :
   - Intégrer Turnstile sur les formulaires publics (login, contact)
   - Ajouter champ honeypot `website` (hidden) sur chaque formulaire
   - Validation côté serveur du token Turnstile
   - Variables : TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY

2. **Notifications Email (Resend)** :
   - Service d'envoi email (`src/lib/email.ts`)
   - Templates email :
     - Nouvelle affectation de shift
     - Validation/refus de congé
     - Rappel de shift à venir
     - Réinitialisation de mot de passe
     - Bienvenue nouvel utilisateur
   - Variable : RESEND_API_KEY

3. **Vérification** :
   - Tester l'envoi d'email en dev
   - Vérifier le blocage Turnstile
   - Vérifier le honeypot

## Outputs
- Composant `TurnstileWidget`
- Middleware de validation Turnstile
- Service email avec templates
- Champ honeypot sur tous les formulaires

## Règles absolues
- Turnstile + honeypot sur TOUS les formulaires accessibles sans auth
- Emails HTML responsifs et accessibles
- Rate limiting sur les routes d'envoi d'email
- Pas de données sensibles dans les emails (juste des notifications avec liens)

## Exemple d'appel
```
Exécute @agents/integrations.md pour configurer Turnstile, honeypot et Resend.
```
