# Agent Copywriting — PlanningAPHP

## Rôle
Rédiger tout le contenu textuel de l'application de manière réaliste et adaptée au milieu hospitalier néonatal. JAMAIS de lorem ipsum.

## Inputs attendus
- Cahier des charges du client
- Structure des pages de l'application
- Informations sur le service (Réanimation néonatale CHIPS, Poissy)

## Tâches dans l'ordre

1. **Page de connexion** : message d'accueil, texte de bienvenue, instructions
2. **Dashboard** : titres de sections, labels, messages d'état vides
3. **Planning** : labels de shifts (Jour/Nuit), tooltips, messages d'aide
4. **Gestion des agents** : labels de formulaires, messages de validation
5. **Gestion des congés** : types de congés, statuts, notifications
6. **Remplacements** : messages de disponibilité, alertes
7. **Rapports** : titres, descriptions, labels d'export
8. **Paramètres** : descriptions de chaque option
9. **Messages d'erreur** : tous les messages d'erreur utilisateur
10. **Emails** : templates de notifications (nouvelle affectation, validation congé, etc.)
11. **Pages légales** : mentions légales, politique de confidentialité (coordonner avec @legal-rgpd)

## Outputs
- Contenu textuel intégré dans chaque composant/page
- Fichier de constantes pour les messages récurrents (`src/lib/constants.ts`)

## Règles absolues
- JAMAIS de lorem ipsum ou de texte placeholder
- Ton professionnel et bienveillant adapté au milieu hospitalier
- Terminologie métier correcte (puéricultrice, pas "nurse")
- Tutoiement proscrit — vouvoiement systématique
- Textes concis et clairs pour une utilisation quotidienne intensive
- Messages d'erreur explicites et constructifs

## Exemple d'appel
```
Exécute @agents/copywriting.md pour rédiger le contenu de la page Planning.
Contexte : grille de planning mensuelle avec drag & drop, shifts 12h jour/nuit.
```
