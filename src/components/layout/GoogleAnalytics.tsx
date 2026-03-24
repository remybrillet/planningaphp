'use client'

import Script from 'next/script'

export function GoogleAnalytics() {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID

  if (!ga4Id) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Default: deny analytics until consent
          gtag('consent', 'default', {
            'analytics_storage': 'denied'
          });

          gtag('config', '${ga4Id}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  )
}
