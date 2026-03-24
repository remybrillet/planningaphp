'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const COOKIE_CONSENT_KEY = 'cookie-consent'

type ConsentState = 'pending' | 'accepted' | 'refused'

export function CookieBanner() {
  const [consent, setConsent] = useState<ConsentState>('pending')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored === 'accepted' || stored === 'refused') {
      setConsent(stored as ConsentState)
      if (stored === 'accepted') {
        enableGA4()
      }
    } else {
      setIsVisible(true)
    }
  }, [])

  const enableGA4 = () => {
    const ga4Id = process.env.NEXT_PUBLIC_GA4_ID
    if (!ga4Id) return

    // Enable consent
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }
  }

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setConsent('accepted')
    setIsVisible(false)
    enableGA4()
  }

  const handleRefuse = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'refused')
    setConsent('refused')
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
          role="dialog"
          aria-label="Bandeau cookies"
        >
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-secondary-200 p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-secondary-800 mb-1">
                  Respect de votre vie privée
                </h3>
                <p className="text-sm text-secondary-500 mb-4">
                  Nous utilisons des cookies pour améliorer votre expérience.
                  Les cookies d&apos;analyse (Google Analytics) ne sont activés
                  qu&apos;avec votre accord. L&apos;outil Umami fonctionne sans
                  cookies.{' '}
                  <Link
                    href="/politique-confidentialite"
                    className="text-primary-600 hover:text-primary-700 underline"
                  >
                    En savoir plus
                  </Link>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleAccept}>
                    Accepter
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleRefuse}>
                    Refuser
                  </Button>
                </div>
              </div>
              <button
                onClick={handleRefuse}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
                aria-label="Fermer le bandeau cookies"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}
