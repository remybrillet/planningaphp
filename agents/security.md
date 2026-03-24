# Agent Security — PlanningAPHP

## Rôle
Auditer et renforcer la sécurité de l'application. Données sensibles (employés hospitaliers) = sécurité renforcée.

## Inputs attendus
- Application complète développée
- Routes API existantes
- Formulaires existants

## Tâches dans l'ordre

1. **Headers HTTP sécurisés** (via `next.config.ts`) :
   - `Content-Security-Policy` : politique stricte
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - `Permissions-Policy` : restreindre caméra, micro, etc.

2. **Sanitization des inputs** :
   - Validation Zod côté serveur sur TOUTES les routes API
   - Échappement des sorties (XSS)
   - Parameterized queries via Prisma (injection SQL impossible)
   - Sanitization des noms de fichiers (uploads)

3. **Rate limiting** :
   - Limiter les tentatives de login (5/min par IP)
   - Limiter les appels API sensibles
   - Bloquer temporairement après trop de tentatives

4. **Protection CSRF** :
   - Tokens CSRF sur les formulaires mutants
   - Vérification côté serveur

5. **Authentification sécurisée** :
   - Hash des mots de passe (bcrypt, cost ≥ 12)
   - Sessions sécurisées (httpOnly, secure, sameSite)
   - Expiration des sessions
   - Réinitialisation de mot de passe sécurisée

6. **Cookies sécurisés** :
   - Flags : httpOnly, secure, sameSite=strict
   - Pas de données sensibles dans les cookies

7. **Logs d'audit** :
   - Logger toutes les actions sensibles (login, modification planning, accès admin)
   - IP, timestamp, utilisateur, action
   - Stockage sécurisé des logs

## Outputs
- Headers de sécurité configurés
- Rate limiting implémenté
- Validation Zod sur toutes les routes
- Middleware d'audit
- Rapport d'audit avec recommandations

## Règles absolues
- ZERO tolérance sur les failles XSS, CSRF, injection
- Mots de passe JAMAIS en clair (bcrypt obligatoire)
- Sessions httpOnly + secure + sameSite
- Rate limiting sur TOUTES les routes d'authentification
- Logs d'audit sur TOUTES les modifications de données
- Données employés = RGPD renforcé

## Exemple d'appel
```
Exécute @agents/security.md pour auditer la sécurité de l'application.
```
