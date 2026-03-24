'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Clock,
  Save,
  Users,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  BedDouble,
  Palette,
  Mail,
} from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'

type Config = {
  id: string
  key: string
  value: string
  label: string
  type: string
  category: string
}

type ShiftTemplate = {
  id: string
  name: string
  type: string
  startTime: string
  endTime: string
  duration: number
  breakTime: number
  isActive: boolean
}

type Props = {
  configs: Config[]
  shiftTemplates: ShiftTemplate[]
}

export function ConfigurationView({ configs: initialConfigs, shiftTemplates: initialShifts }: Props) {
  const [configs, setConfigs] = useState(initialConfigs)
  const [shifts, setShifts] = useState(initialShifts)
  const [saving, setSaving] = useState(false)
  const [savingShifts, setSavingShifts] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (key: string, value: string) => {
    setConfigs((prev) => prev.map((c) => (c.key === key ? { ...c, value } : c)))
    setSuccess(null)
  }

  const toggleBoolean = (key: string) => {
    setConfigs((prev) => prev.map((c) => c.key === key ? { ...c, value: c.value === 'true' ? 'false' : 'true' } : c))
    setSuccess(null)
  }

  const handleShiftChange = (id: string, field: string, value: string | number) => {
    setShifts((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s))
    setSuccess(null)
  }

  const handleSaveConfigs = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/configuration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs }),
      })
      if (res.ok) setSuccess('Configuration enregistrée avec succès.')
    } catch { /* ignore */ } finally {
      setSaving(false)
    }
  }

  const handleSaveShifts = async () => {
    setSavingShifts(true)
    try {
      const res = await fetch('/api/configuration/shifts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shifts }),
      })
      if (res.ok) setSuccess('Modèles de shifts enregistrés.')
    } catch { /* ignore */ } finally {
      setSavingShifts(false)
    }
  }

  const byCategory = (cat: string) => configs.filter((c) => c.category === cat)

  // Render a config field (number, string, or boolean)
  const renderField = (config: Config) => {
    if (config.type === 'boolean') {
      return (
        <div key={config.key} className="flex items-center justify-between py-2 px-1">
          <p className="text-sm font-medium text-secondary-700">{config.label}</p>
          <button
            onClick={() => toggleBoolean(config.key)}
            className="flex items-center gap-2 text-sm"
            aria-label={`${config.label} : ${config.value === 'true' ? 'activé' : 'désactivé'}`}
          >
            {config.value === 'true' ? (
              <><ToggleRight className="w-8 h-8 text-accent-500" /><span className="text-accent-600 font-medium">Activé</span></>
            ) : (
              <><ToggleLeft className="w-8 h-8 text-secondary-300" /><span className="text-secondary-400">Désactivé</span></>
            )}
          </button>
        </div>
      )
    }

    if (config.type === 'number') {
      return (
        <div key={config.key} className="grid grid-cols-3 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">{config.label}</label>
          </div>
          <Input type="number" value={config.value} onChange={(e) => handleChange(config.key, e.target.value)} className="text-center" />
        </div>
      )
    }

    return (
      <Input key={config.key} label={config.label} value={config.value} onChange={(e) => handleChange(config.key, e.target.value)} />
    )
  }

  type Section = {
    icon: React.ReactNode
    title: string
    category: string
    badge?: { label: string; variant: 'info' | 'warning' | 'success' | 'default' }
    grid?: boolean
  }

  const sections: Section[] = [
    { icon: <Settings className="w-5 h-5 text-primary-600" />, title: 'Informations du service', category: 'general' },
    { icon: <Palette className="w-5 h-5 text-primary-600" />, title: 'Application', category: 'application' },
    { icon: <BedDouble className="w-5 h-5 text-primary-600" />, title: 'Capacité du service', category: 'capacite', badge: { label: 'Nombre de lits', variant: 'info' } },
    { icon: <Users className="w-5 h-5 text-primary-600" />, title: 'Effectifs requis (ratios agents / lits)', category: 'effectifs', badge: { label: 'Génération automatique', variant: 'info' }, grid: true },
    { icon: <ShieldCheck className="w-5 h-5 text-primary-600" />, title: 'Règles de planification', category: 'regles', badge: { label: 'Contraintes légales et métier', variant: 'warning' } },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl space-y-6">
      {sections.map((section) => {
        const items = byCategory(section.category)
        if (items.length === 0) return null
        return (
          <motion.div key={section.category} variants={fadeUp}>
            <Card>
              <div className="px-6 py-4 border-b border-secondary-100 flex items-center gap-2">
                {section.icon}
                <h2 className="font-semibold text-secondary-800">{section.title}</h2>
                {section.badge && <Badge variant={section.badge.variant} className="ml-auto">{section.badge.label}</Badge>}
              </div>
              <CardContent className="space-y-4">
                {section.grid ? (
                  <div className="grid grid-cols-2 gap-4">
                    {items.map((c) => (
                      <Input
                        key={c.key}
                        label={c.label}
                        type={c.type === 'number' ? 'number' : 'text'}
                        value={c.value}
                        onChange={(e) => handleChange(c.key, e.target.value)}
                      />
                    ))}
                  </div>
                ) : (
                  items.map(renderField)
                )}
              </CardContent>
            </Card>
          </motion.div>
        )
      })}

      {/* Shift templates — EDITABLE */}
      <motion.div variants={fadeUp}>
        <Card>
          <div className="px-6 py-4 border-b border-secondary-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-secondary-800">Modèles de shifts</h2>
            <Badge variant="info" className="ml-auto">Horaires modifiables</Badge>
          </div>
          <CardContent className="space-y-4">
            {shifts.map((shift) => (
              <div key={shift.id} className="p-4 rounded-lg bg-secondary-50 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={shift.type === 'JOUR' ? 'jour' : 'nuit'}>{shift.name}</Badge>
                  <span className="text-sm text-secondary-600 font-medium">{shift.type === 'JOUR' ? 'Shift de jour' : 'Shift de nuit'}</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-secondary-600 mb-1">Début</label>
                    <input
                      type="time"
                      value={shift.startTime}
                      onChange={(e) => handleShiftChange(shift.id, 'startTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary-600 mb-1">Fin</label>
                    <input
                      type="time"
                      value={shift.endTime}
                      onChange={(e) => handleShiftChange(shift.id, 'endTime', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary-600 mb-1">Durée (h)</label>
                    <input
                      type="number"
                      value={shift.duration}
                      onChange={(e) => handleShiftChange(shift.id, 'duration', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-secondary-200 text-sm text-center focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-secondary-600 mb-1">Pause (min)</label>
                    <input
                      type="number"
                      value={shift.breakTime}
                      onChange={(e) => handleShiftChange(shift.id, 'breakTime', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-secondary-200 text-sm text-center focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              size="sm"
              variant="outline"
              icon={<Save className="w-4 h-4" />}
              onClick={handleSaveShifts}
              isLoading={savingShifts}
            >
              Enregistrer les shifts
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {success && <Alert variant="success">{success}</Alert>}

      <Button icon={<Save className="w-4 h-4" />} onClick={handleSaveConfigs} isLoading={saving} size="lg">
        Enregistrer toute la configuration
      </Button>
    </motion.div>
  )
}
