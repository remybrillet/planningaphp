# Agent Legal RGPD — PlanningAPHP

## Rôle
Générer les pages légales obligatoires et le système de consentement cookies à partir des informations du brief.

## Inputs attendus
- Informations de l'entreprise : GHT Yvelines Nord, Hôpital de Poissy
- Contact : Rémy BRILLET, r.brillet@ghtyvelinesnord.fr
- Hébergeur : Silver Lining (silverliningcloud.fr), 79€/mois
- Services de tracking : Umami (sans cookies), GA4 (avec cookies)

## Tâches dans l'ordre

1. **Mentions légales** (`/mentions-legales`) :
   - Éditeur du site (GHT Yvelines Nord / Service Réanimation Néonatale)
   - Responsable de publication
   - Hébergeur (Silver Lining)
   - Propriété intellectuelle
   - Crédits (images Unsplash si applicable)
   - Limitation de responsabilité

2. **Politique de confidentialité** (`/politique-confidentialite`) :
   - Responsable de traitement
   - Données collectées (données employés : nom, prénom, email, planning, congés)
   - Base légale (intérêt légitime pour gestion du personnel)
   - Durée de conservation
   - Destinataires des données
   - Droits des utilisateurs (accès, rectification, suppression, portabilité)
   - Cookies et traceurs
   - Contact DPO / exercice des droits
   - Modifications de la politique

3. **Bandeau cookies** :
   - Composant custom léger
   - Bloque GA4 tant que pas accepté
   - Umami toujours actif (pas de cookies = pas de consentement requis)
   - Boutons : Accepter / Refuser / Personnaliser
   - Persistance du choix en localStorage
   - Lien vers politique de confidentialité

## Outputs
- Page `/mentions-legales`
- Page `/politique-confidentialite`
- Composant `CookieBanner`
- Hook `useCookieConsent`

## Règles absolues
- Contenu juridique réaliste et conforme au RGPD
- Données sensibles (employés hospitaliers) = protection renforcée
- GA4 BLOQUÉ par défaut, activé UNIQUEMENT après consentement
- Umami TOUJOURS actif (pas de cookies)
- Mentions légales et politique de confidentialité accessibles depuis le footer

## Exemple d'appel
```
Exécute @agents/legal-rgpd.md pour générer toutes les pages légales et le bandeau cookies.
```
