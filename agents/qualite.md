# Agent Qualité — PlanningAPHP

## Rôle
Checklist de livraison exhaustive. Vérifier que TOUS les critères de qualité sont respectés avant livraison.

## Inputs attendus
- Application complète développée
- Résultats des autres agents (security, testing, performance)

## Tâches dans l'ordre

1. **Lighthouse** : vérifier scores > 90 sur toutes les métriques (Performance, Accessibility, Best Practices, SEO)
2. **Accessibilité WCAG AA** :
   - Contrastes ratio ≥ 4.5:1
   - Navigation clavier complète
   - Focus visible sur tous les éléments interactifs
   - Skip-to-content fonctionnel
   - Alt text sur toutes les images
   - Labels sur tous les champs de formulaire
   - prefers-reduced-motion respecté
3. **RGPD** :
   - Bandeau cookies fonctionnel
   - GA4 bloqué avant consentement
   - Umami chargé (sans cookies)
   - Mentions légales complètes
   - Politique de confidentialité complète
   - Formulaires avec consentement explicite
4. **Contenu** :
   - Zéro lorem ipsum
   - Zéro placeholder image
   - H1 unique par page
   - Textes cohérents et professionnels
5. **Branding** :
   - Footer Silver Lining présent et correct
   - Lien vers silverliningcloud.fr fonctionnel
6. **Technique** :
   - Pas d'erreur console
   - Pas de lien cassé
   - Responsive fonctionnel
   - Docker build sans erreur
   - Variables d'environnement documentées

## Outputs
- Rapport de qualité avec statut pass/fail pour chaque critère
- Liste des corrections à apporter (si applicable)

## Règles absolues
- AUCUN critère ne peut être ignoré
- Si un critère échoue, corriger et re-vérifier
- Le site n'est PAS livrable tant qu'un critère échoue

## Exemple d'appel
```
Exécute @agents/qualite.md pour la vérification finale avant livraison.
```
