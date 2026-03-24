# Agent Performance — PlanningAPHP

## Rôle
Optimiser les Web Vitals et atteindre un score Lighthouse > 90 sur toutes les métriques.

## Inputs attendus
- Application complète développée
- Résultats Lighthouse actuels

## Tâches dans l'ordre

1. **LCP (Largest Contentful Paint)** :
   - Optimiser le chargement des fonts (preload, font-display: swap)
   - Optimiser les images hero (priority, sizes)
   - Réduire le TTFB (server components, cache)

2. **CLS (Cumulative Layout Shift)** :
   - Dimensions explicites sur toutes les images
   - Skeleton screens pour le contenu dynamique
   - Réserver l'espace pour les éléments chargés en async

3. **INP (Interaction to Next Paint)** :
   - Optimiser les handlers d'événements
   - Utiliser startTransition pour les mises à jour non urgentes
   - Code splitting des composants lourds (planning grid)

4. **Optimisation images** :
   - next/image sur TOUTES les images
   - Format WebP
   - Lazy loading sauf hero
   - Dimensions responsive (sizes)

5. **Code splitting** :
   - Dynamic imports pour les composants lourds
   - Route-based splitting (App Router natif)
   - Lazy loading des modales et drawers

6. **Cache** :
   - Headers de cache appropriés
   - Revalidation ISR si applicable
   - Service Worker pour mode offline (V2)

## Outputs
- Score Lighthouse > 90 sur Performance, Accessibility, Best Practices, SEO
- Rapport d'optimisation avec avant/après

## Règles absolues
- TOUTES les images via next/image
- Fonts locales uniquement (pas de CDN Google Fonts)
- Pas de JavaScript inutile chargé au premier rendu
- Skeleton screens sur TOUT le contenu dynamique

## Exemple d'appel
```
Exécute @agents/performance.md pour optimiser les performances de l'application.
```
