# Agent Design UI — PlanningAPHP

## Rôle
Définir et implémenter le design system complet : palette, typographie, composants de base, animations.

## Inputs attendus
- Direction artistique du brief
- Palette de couleurs définie

## Tâches dans l'ordre

1. **Configuration Tailwind** :
   - Palette de couleurs custom (bleu médical #2563EB, gris #6B7280, vert #10B981)
   - Breakpoints responsive
   - Spacing et sizing cohérents
   - Ombres subtiles (shadow-sm à shadow-lg)

2. **Typographie** :
   - Télécharger Inter de Google Fonts
   - Configurer next/font/local dans /public/fonts/
   - Hiérarchie : titres grands et bold, corps lisible
   - Maximum 2 variantes (Inter pour titres et corps)

3. **Composants UI de base** (`src/components/ui/`) :
   - `Button` : variantes primary, secondary, outline, ghost, danger
   - `Input` : text, email, password, number, select, textarea
   - `Card` : avec hover animation (scale 1.02 + shadow)
   - `Badge` : statuts colorés (succès, erreur, warning, info)
   - `Modal` : avec AnimatePresence
   - `Table` : responsive avec tri et pagination
   - `Avatar` : initiales de l'agent
   - `Tooltip` : informations contextuelles
   - `Alert` : messages d'alerte (succès, erreur, warning, info)
   - `Skeleton` : loading states animés (pulse)
   - `Dropdown` : menu contextuel

4. **Composants Layout** (`src/components/layout/`) :
   - `Header` : navbar avec hide-on-scroll
   - `Sidebar` : navigation latérale dashboard
   - `Footer` : crédit Silver Lining
   - `PageTransition` : fade entre pages (AnimatePresence)

5. **Animations Framer Motion** :
   - Variants réutilisables dans `src/lib/animations.ts`
   - fadeUp, stagger, hover cards, hover buttons
   - Container variants pour les listes
   - Page transition variants

## Outputs
- Tailwind configuré avec palette custom
- Fonts Inter chargées localement
- Bibliothèque de composants UI complète
- Fichier d'animations réutilisables
- Styles globaux configurés

## Règles absolues
- Contrastes WCAG AA (ratio ≥ 4.5:1) sur TOUS les textes
- Focus visible sur TOUS les éléments interactifs
- Aucun border-radius > rounded-xl
- Ombres subtiles uniquement (jamais shadow-2xl)
- prefers-reduced-motion respecté sur TOUTES les animations
- Padding minimum py-20 sur les sections
- Sections alternées fond clair / fond foncé

## Exemple d'appel
```
Exécute @agents/design-ui.md pour créer le design system complet.
```
