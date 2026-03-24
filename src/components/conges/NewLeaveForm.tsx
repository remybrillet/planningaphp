'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createLeaveRequestSchema, type CreateLeaveRequestInput } from '@/lib/validations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Alert } from '@/components/ui/Alert'

const leaveTypeOptions = [
  { value: 'CP', label: 'Congés payés' },
  { value: 'RTT', label: 'RTT' },
  { value: 'MALADIE', label: 'Maladie' },
  { value: 'FORMATION', label: 'Formation' },
  { value: 'MATERNITE', label: 'Maternité' },
  { value: 'PATERNITE', label: 'Paternité' },
  { value: 'AUTRE', label: 'Autre' },
]

type Props = {
  onSuccess: () => void
  onCancel: () => void
}

export function NewLeaveForm({ onSuccess, onCancel }: Props) {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeaveRequestInput>({
    resolver: zodResolver(createLeaveRequestSchema),
  })

  const onSubmit = async (data: CreateLeaveRequestInput) => {
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/conges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const result = await res.json()
        setError(result.message || 'Erreur lors de la soumission')
        return
      }

      onSuccess()
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Type de congé"
        options={leaveTypeOptions}
        placeholder="Sélectionnez un type"
        error={errors.type?.message}
        {...register('type')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Date de début"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          type="date"
          label="Date de fin"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <Textarea
        label="Motif (optionnel)"
        placeholder="Indiquez le motif de votre demande..."
        error={errors.reason?.message}
        {...register('reason')}
      />

      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Soumettre la demande
        </Button>
      </div>
    </form>
  )
}
