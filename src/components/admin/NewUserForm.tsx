'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserSchema, type CreateUserInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Alert } from '@/components/ui/Alert'

type Props = {
  onSuccess: () => void
  onCancel: () => void
}

export function NewUserForm({ onSuccess, onCancel }: Props) {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'EMPLOYE',
      competence: 'INF',
      workPercentage: 100,
    },
  })

  const onSubmit = async (data: CreateUserInput) => {
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.message || 'Erreur lors de la création')
        return
      }

      onSuccess()
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Prénom"
          error={errors.firstName?.message}
          {...register('firstName')}
        />
        <Input
          label="Nom"
          error={errors.lastName?.message}
          {...register('lastName')}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="prenom.nom@ghtyvelinesnord.fr"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Mot de passe"
        type="password"
        helperText="Minimum 8 caractères, avec majuscule, minuscule et chiffre"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="grid grid-cols-3 gap-4">
        <Select
          label="Rôle"
          options={[
            { value: 'EMPLOYE', label: 'Employé' },
            { value: 'GESTIONNAIRE', label: 'Gestionnaire' },
            { value: 'ADMIN', label: 'Administrateur' },
          ]}
          error={errors.role?.message}
          {...register('role')}
        />
        <Select
          label="Compétence"
          options={[
            { value: 'INF', label: 'Infirmière' },
            { value: 'PUERICULTRCE', label: 'Puéricultrice' },
          ]}
          error={errors.competence?.message}
          {...register('competence')}
        />
        <Select
          label="Temps de travail"
          options={[
            { value: '100', label: '100%' },
            { value: '90', label: '90%' },
            { value: '80', label: '80%' },
            { value: '70', label: '70%' },
            { value: '60', label: '60%' },
            { value: '50', label: '50%' },
          ]}
          error={errors.workPercentage?.message}
          {...register('workPercentage', { valueAsNumber: true })}
        />
      </div>

      <Input
        label="Téléphone (optionnel)"
        type="tel"
        placeholder="06 XX XX XX XX"
        {...register('phone')}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Créer l&apos;utilisateur
        </Button>
      </div>
    </form>
  )
}
