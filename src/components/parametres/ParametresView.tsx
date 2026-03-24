'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Lock, Save } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'

type UserProfile = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  competence: string
  workPercentage: number
  phone: string | null
}

type Props = {
  user: UserProfile
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrateur',
  GESTIONNAIRE: 'Gestionnaire',
  EMPLOYE: 'Employé',
}

const competenceLabels: Record<string, string> = {
  INF: 'Infirmière',
  PUERICULTRCE: 'Puéricultrice',
}

export function ParametresView({ user }: Props) {
  const [phone, setPhone] = useState(user.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setProfileSuccess(false)

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      if (res.ok) {
        setProfileSuccess(true)
      } else {
        const data = await res.json()
        setError(data.message || 'Erreur lors de la mise à jour')
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setSaving(true)
    setError('')
    setPasswordSuccess(false)

    try {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        setPasswordSuccess(true)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        const data = await res.json()
        setError(data.message || 'Erreur lors du changement de mot de passe')
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="max-w-2xl space-y-6"
    >
      {/* Profile info */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-secondary-200 shadow-sm">
        <div className="px-6 py-4 border-b border-secondary-100 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-secondary-800">Mon profil</h2>
        </div>
        <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Prénom" value={user.firstName} disabled />
            <Input label="Nom" value={user.lastName} disabled />
          </div>
          <Input label="Email" type="email" value={user.email} disabled />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-secondary-700 mb-1.5">Rôle</p>
              <Badge variant="info">{roleLabels[user.role]}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-700 mb-1.5">Compétence</p>
              <Badge variant={user.competence === 'INF' ? 'info' : 'default'}>
                {competenceLabels[user.competence]}
              </Badge>
            </div>
          </div>
          <Input
            label="Téléphone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="06 XX XX XX XX"
          />

          {profileSuccess && (
            <Alert variant="success">Profil mis à jour avec succès.</Alert>
          )}

          <Button type="submit" icon={<Save className="w-4 h-4" />} isLoading={saving}>
            Enregistrer
          </Button>
        </form>
      </motion.div>

      {/* Password change */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl border border-secondary-200 shadow-sm">
        <div className="px-6 py-4 border-b border-secondary-100 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-secondary-800">
            Changer le mot de passe
          </h2>
        </div>
        <form onSubmit={handleUpdatePassword} className="p-6 space-y-4">
          <Input
            label="Mot de passe actuel"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            helperText="Minimum 8 caractères, avec majuscule, minuscule et chiffre"
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {passwordSuccess && (
            <Alert variant="success">
              Mot de passe modifié avec succès.
            </Alert>
          )}
          {error && <Alert variant="error">{error}</Alert>}

          <Button type="submit" icon={<Lock className="w-4 h-4" />} isLoading={saving}>
            Modifier le mot de passe
          </Button>
        </form>
      </motion.div>
    </motion.div>
  )
}
