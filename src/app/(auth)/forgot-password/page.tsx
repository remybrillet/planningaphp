'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, ShieldCheck } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate sending — in production, this would send via Resend
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full max-w-md"
      >
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary-600 text-white mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-secondary-800">
            PlanningAPHP
          </h1>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {sent ? (
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-secondary-800 mb-2">
                Email envoyé
              </h2>
              <p className="text-secondary-500 text-sm mb-6">
                Si un compte est associé à cette adresse, vous recevrez un lien
                de réinitialisation dans quelques instants. Vérifiez votre boîte
                de réception et vos spams.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-secondary-700 mb-2">
                Mot de passe oublié
              </h2>
              <p className="text-sm text-secondary-500 mb-6">
                Saisissez votre adresse email pour recevoir un lien de
                réinitialisation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  type="email"
                  label="Adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="prenom.nom@ghtyvelinesnord.fr"
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  className="w-full"
                  icon={<Mail className="w-5 h-5" />}
                  isLoading={isLoading}
                >
                  Envoyer le lien
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
