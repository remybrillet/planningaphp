# Agents Spécialisés — PlanningAPHP

Index de tous les agents avec leur rôle et leur position dans le workflow.

## Pipeline de développement

### Phase 2 — Développement
| # | Agent | Rôle |
|---|-------|------|
| 5 | [@design-ui](./design-ui.md) | Palette, typographie, composants de base, animations Framer Motion |
| 7 | [@copywriting](./copywriting.md) | Rédaction contenu réaliste adapté au métier hospitalier |
| 8 | [@images](./images.md) | Recherche images Unsplash, téléchargement, conversion WebP |
| 9 | [@legal-rgpd](./legal-rgpd.md) | Mentions légales, politique de confidentialité, bandeau cookies |
| 10 | [@seo](./seo.md) | Schema.org JSON-LD, sitemap, pages géolocalisées |
| 11 | [@integrations](./integrations.md) | Google Places, Maps, Turnstile, honeypot, emails Resend |
| 12 | [@analytics-setup](./analytics-setup.md) | Umami + GA4 + events de tracking |
| 13 | [@backoffice](./backoffice.md) | Dashboard admin, gestion utilisateurs, reporting |

### Phase 3 — Qualité & Sécurité
| # | Agent | Rôle |
|---|-------|------|
| 14 | [@security](./security.md) | Headers HTTP, CSP, sanitization, rate limiting |
| 15 | [@testing](./testing.md) | Tests E2E Playwright |
| 16 | [@performance](./performance.md) | Lighthouse, Web Vitals, optimisation |
| 17 | [@qualite](./qualite.md) | Checklist finale exhaustive |

### Phase 4 — Livraison
| # | Agent | Rôle |
|---|-------|------|
| 18 | [@livraison](./livraison.md) | Dossier de présentation client + PV de livraison |

## Règles communes

- Chaque agent DOIT être exécuté dans l'ordre du pipeline
- Si un agent détecte des problèmes, corriger AVANT de passer au suivant
- Le site n'est pas terminé tant que @livraison n'a pas été exécuté
