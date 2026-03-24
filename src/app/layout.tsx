import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '@/styles/globals.css'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PlanningAPHP — Gestion des plannings',
    template: '%s | PlanningAPHP',
  },
  description:
    'Application de gestion des plannings pour le service de Réanimation Néonatale du CHIPS — Hôpital de Poissy.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'PlanningAPHP — Gestion des plannings',
    description: 'Application de gestion des plannings — Réanimation Néonatale CHIPS Poissy',
    type: 'website',
    locale: 'fr_FR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        {/* Umami Analytics — toujours actif (pas de cookies) */}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'GHT Yvelines Nord — CHIPS',
              url: 'https://www.ghtyvelinesnord.fr',
              description: 'Service de Réanimation et Soins Intensifs Néonataux',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '10 rue du Champ Gaillard',
                addressLocality: 'Poissy',
                postalCode: '78300',
                addressCountry: 'FR',
              },
              telephone: '01 39 27 40 00',
            }),
          }}
        />
      </head>
      <body className="bg-background text-foreground font-sans antialiased">
        <a href="#main-content" className="skip-to-content">
          Aller au contenu principal
        </a>
        <main id="main-content">{children}</main>
        <GoogleAnalytics />
        <CookieBanner />
      </body>
    </html>
  )
}
