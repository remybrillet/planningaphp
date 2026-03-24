# Agent Livraison — PlanningAPHP

## Rôle
Générer le dossier de présentation client et le procès-verbal de livraison.

## Inputs attendus
- Application complète et validée par tous les autres agents
- Scores Lighthouse réels
- Résultats des tests E2E
- Résultats de l'audit sécurité

## Tâches dans l'ordre

1. **Dossier de présentation client** :
   - Introduction enthousiaste
   - Récapitulatif de TOUTES les fonctionnalités livrées
   - Scores de performance (Lighthouse réels)
   - Points forts du site / application
   - Guide d'utilisation simplifié (captures d'écran si possible)
   - Fonctionnalités futures envisagées (V2)
   - Ton : professionnel, enthousiaste, orienté valeur business

2. **PV de livraison** :
   - Critères de recette (checklist exhaustive)
   - Compatibilité testée (navigateurs, devices)
   - Scores Lighthouse réels
   - Limites et exclusions
   - Garantie 30 jours Silver Lining
   - Processus de signalement des bugs
   - Propriété du code
   - Espace pour signatures (client + Silver Lining)

3. **Sauvegarde** :
   - Tout le contenu dans `/LIVRAISON.md` à la racine du projet

## Outputs
- Fichier `/LIVRAISON.md` complet
- Document prêt à présenter au client

## Règles absolues
- Le dossier doit être COMPLET et autosuffisant
- Scores Lighthouse = valeurs RÉELLES (pas inventées)
- Ton professionnel et enthousiaste (pas de jargon technique excessif)
- Inclure les limites et exclusions (transparence)
- Garantie 30 jours mentionnée
- Agent exécuté EN DERNIER (après tous les autres)

## Exemple d'appel
```
Exécute @agents/livraison.md pour générer le dossier de livraison final.
Scores Lighthouse : Performance 95, Accessibility 98, Best Practices 100, SEO 100
Tests E2E : 42/42 passed
```
