'use client'

type EventName =
  | 'formulaire_envoye'
  | 'clic_telephone'
  | 'clic_email'
  | 'scroll_50'
  | 'scroll_100'
  | 'clic_cta_hero'
  | 'planning_consulte'
  | 'conge_demande'
  | 'shift_modifie'

type EventData = Record<string, string | number | boolean>

export function useTracking() {
  const trackEvent = (name: EventName, data?: EventData) => {
    // Umami tracking
    if (typeof window !== 'undefined' && (window as UmamiWindow).umami) {
      ;(window as UmamiWindow).umami.track(name, data)
    }

    // GA4 tracking (only if consent given)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, data)
    }
  }

  return { trackEvent }
}

interface UmamiWindow extends Window {
  umami?: {
    track: (name: string, data?: EventData) => void
  }
}
