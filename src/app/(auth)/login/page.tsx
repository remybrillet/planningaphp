'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogIn, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.message || 'Identifiants incorrects')
        return
      }

      router.push('/planning')
      router.refresh()
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full max-w-md"
      >
        {/* Logo & Titre */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-600 text-white mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800">
            PlanningAPHP
          </h1>
          <p className="mt-2 text-secondary-500">
            Réanimation Néonatale — CHIPS Poissy
          </p>
        </motion.div>

        {/* Formulaire */}
        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-xl font-semibold text-secondary-700 mb-6">
            Connexion à votre espace
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-secondary-700 mb-1.5"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="prenom.nom@ghtyvelinesnord.fr"
                className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-secondary-800 placeholder:text-secondary-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-secondary-700 mb-1.5"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Votre mot de passe"
                  className="w-full px-4 py-2.5 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-secondary-800 placeholder:text-secondary-400 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  aria-label={
                    showPassword
                      ? 'Masquer le mot de passe'
                      : 'Afficher le mot de passe'
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-error-50 text-error-700 text-sm"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              Mot de passe oublié ?
            </a>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          variants={fadeUp}
          className="text-center text-xs text-secondary-400 mt-6"
        >
          &copy; {new Date().getFullYear()} GHT Yvelines Nord. Tous droits
          réservés.
          <br />
          Développé par{' '}
          <a
            href="https://silverliningcloud.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-secondary-500 transition-colors"
          >
            Silver Lining
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}
