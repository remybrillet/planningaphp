# PlanningAPHP — Fichier de contexte projet

## Description du projet
Application web de gestion des plannings pour le service de Réanimation Néonatale du CHIPS (Centre Hospitalier Intercommunal de Poissy-Saint-Germain-en-Laye).

**Client :** Rémy BRILLET, Cadre — Service Réanimation néonatale
**Contact :** r.brillet@ghtyvelinesnord.fr | 06 19 92 60 93
**Effectif :** 60 agents (infirmières + puéricultrices)
**Développé par :** Silver Lining (https://silverliningcloud.fr)

## Stack technique

| Outil | Version | Usage |
|-------|---------|-------|
| Next.js | 15 (App Router) | Framework React SSR/SSG |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | v4 | Styles utilitaires |
| Prisma | 6.x | ORM PostgreSQL |
| PostgreSQL | 16 | Base de données |
| Framer Motion | 11.x | Animations UI |
| Zod | 3.x | Validation schémas |
| React Hook Form | 7.x | Gestion formulaires |
| Lucide React | latest | Icônes |
| Resend | SDK | Email transactionnel |
| Docker | Compose | Environnement complet |

## Architecture du projet

```
planningaphp/
├── CLAUDE.md                    # Ce fichier
├── docker-compose.yml           # App + PostgreSQL
├── Dockerfile                   # Multi-stage build
├── .env                         # Variables d'environnement
├── .env.example                 # Template variables
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── prisma/
│   ├── schema.prisma            # Modèles de données
│   └── seed.ts                  # Données initiales
├── agents/                      # Agents spécialisés
│   ├── README.md
│   ├── copywriting.md
│   ├── seo.md
│   ├── qualite.md
│   ├── legal-rgpd.md
│   ├── integrations.md
│   ├── performance.md
│   ├── backoffice.md
│   ├── design-ui.md
│   ├── images.md
│   ├── testing.md
│   ├── security.md
│   ├── analytics-setup.md
│   └── livraison.md
├── public/
│   ├── fonts/                   # Google Fonts locales
│   └── images/                  # Images stock (WebP)
│       └── README.md            # Attributions Unsplash
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Layout racine
│   │   ├── page.tsx             # Page d'accueil / login
│   │   ├── (auth)/              # Pages authentification
│   │   │   ├── login/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/         # Pages protégées
│   │   │   ├── layout.tsx       # Layout dashboard
│   │   │   ├── planning/        # Vue planning principal
│   │   │   ├── agents/          # Gestion des agents
│   │   │   ├── conges/          # Gestion des congés
│   │   │   ├── remplacements/   # Gestion remplacements
│   │   │   ├── rapports/        # Exports et rapports
│   │   │   └── parametres/      # Configuration
│   │   ├── (admin)/             # Back-office admin
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/
│   │   │   ├── utilisateurs/
│   │   │   ├── configuration/
│   │   │   └── audit/
│   │   ├── api/                 # Routes API
│   │   │   ├── auth/
│   │   │   ├── planning/
│   │   │   ├── agents/
│   │   │   ├── conges/
│   │   │   └── exports/
│   │   ├── mentions-legales/
│   │   └── politique-confidentialite/
│   ├── components/
│   │   ├── ui/                  # Composants UI de base
│   │   ├── planning/            # Composants planning
│   │   ├── layout/              # Header, Footer, Nav
│   │   └── forms/               # Composants formulaire
│   ├── lib/
│   │   ├── prisma.ts            # Client Prisma singleton
│   │   ├── auth.ts              # Utilitaires auth
│   │   ├── utils.ts             # Fonctions utilitaires
│   │   ├── validations.ts       # Schémas Zod
│   │   └── email.ts             # Service Resend
│   ├── hooks/                   # Hooks React custom
│   ├── types/                   # Types TypeScript
│   └── styles/
│       └── globals.css          # Styles globaux Tailwind
```

## Conventions de code

### Naming
- **Fichiers composants** : PascalCase (`PlanningGrid.tsx`)
- **Fichiers utilitaires** : camelCase (`formatDate.ts`)
- **Routes API** : kebab-case (`/api/planning/[id]/route.ts`)
- **Variables CSS** : kebab-case (`--color-primary`)
- **Types/Interfaces** : PascalCase avec préfixe descriptif (`AgentShift`, `CongeRequest`)

### Imports
```typescript
// 1. React / Next.js
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// 2. Librairies externes
import { motion } from 'framer-motion'
import { z } from 'zod'

// 3. Composants internes
import { Button } from '@/components/ui/Button'

// 4. Utilitaires / types
import { cn } from '@/lib/utils'
import type { Agent } from '@/types'
```

### Structure composant
```typescript
'use client' // si nécessaire

// Imports
// Types
// Composant
// Export default
```

## Commandes Docker

```bash
# Build et démarrage
docker compose up -d --build

# Logs
docker compose logs -f app
docker compose logs -f postgres

# Shell dans le conteneur
docker compose exec app sh

# Installer une dépendance
docker compose exec app npm install <package>

# Prisma
docker compose exec app npx prisma generate
docker compose exec app npx prisma migrate dev --name <nom>
docker compose exec app npx prisma db seed
docker compose exec app npx prisma studio

# Rebuild complet
docker compose down -v && docker compose up -d --build
```

## Design System

### Palette de couleurs
| Rôle | Couleur | Hex |
|------|---------|-----|
| Principal | Bleu médical | #2563EB |
| Secondaire | Gris professionnel | #6B7280 |
| Accent / Succès | Vert validation | #10B981 |
| Fond principal | Blanc médical | #FAFAFA |
| Texte principal | Gris anthracite | #374151 |
| Erreur | Rouge | #EF4444 |
| Warning | Orange | #F59E0B |
| Shift jour | Jaune clair | #FEF3C7 |
| Shift nuit | Bleu foncé | #1E3A5F |

### Typographie
- **Titres** : Inter (bold, semi-bold)
- **Corps** : Inter (regular, medium)
- Chargement local via `next/font/local`

### Animations Framer Motion
- **Fade-up sections** : opacity 0→1, translateY 30→0, durée 0.6s, ease [0.25, 0.1, 0.25, 1]
- **Stagger listes** : délai 0.1s entre éléments
- **Hover cards** : scale(1.02) + shadow elevation
- **Hover boutons** : scale(1.05) + luminosité
- **Navbar** : show on scroll up, hide on scroll down

## Règles métier planning

### Shifts
- **Jour** : 12h (ex: 07h00-19h00)
- **Nuit** : 12h (ex: 19h00-07h00)
- Pauses légales calculées automatiquement

### Compétences
- **INF** : Infirmières
- **PUE** : Puéricultrices
- Distinction obligatoire dans les affectations

### Temps de travail
- Temps plein (100%)
- Temps partiels : 50%, 60%, 70%, 80%, 90%
- Calcul automatique du nombre de shifts/semaine

### Congés
- CP (Congés Payés)
- RTT
- Maladie
- Formation
- Déshydrata (jours souhaités de non-travail)

### Vérifications automatiques
- Temps de repos minimum entre 2 shifts (11h)
- Détection sous-effectif / sur-effectif
- Pas de doublon d'affectation
- Respect du quota horaire selon le pourcentage de temps de travail

## Variables d'environnement

```env
# Base de données
DATABASE_URL=postgresql://planning:planning@postgres:5432/planningaphp

# Auth
NEXTAUTH_SECRET=<généré>
NEXTAUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=<clé Resend>

# Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<ID Umami>
NEXT_PUBLIC_UMAMI_URL=https://analytics.silverliningcloud.fr/script.js
NEXT_PUBLIC_GA4_ID=<G-XXXXXXX>

# Anti-spam
TURNSTILE_SITE_KEY=<clé site>
TURNSTILE_SECRET_KEY=<clé secrète>

# Images
UNSPLASH_ACCESS_KEY=ope2rlcRXj01S6DWG6yVIm_ZIeAr2xXqBDLBSqYMQRY
```

## Contraintes

- **RGPD renforcé** : données employés sensibles, chiffrement, logs d'audit
- **Docker uniquement** : pas de Node.js/npm local
- **Fonts locales** : jamais de lien vers fonts.googleapis.com
- **Git** : chaque commit avec `Co-Authored-By: Claude Code <remybrillet@gmail.com>`
- **Accessibilité** : WCAG AA minimum (contrastes 4.5:1, navigation clavier, focus visible)
- **Performance** : Lighthouse > 90 toutes métriques
- **Pas d'intégration externe** : système autonome, pas de SIRH ni logiciel hospitalier
