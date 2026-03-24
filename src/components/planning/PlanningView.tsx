'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  AlertTriangle,
  Download,
  Wand2,
  Loader2,
  Trash2,
  CheckCircle2,
  BedDouble,
  Users,
  X,
  Eye,
} from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isWeekend as isWeekendFn, addMonths, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { DayDetailPanel } from './DayDetailPanel'
import { AgentPanel } from './AgentPanel'

type Assignment = {
  id: string
  date: string
  status: string
  user: {
    id: string
    firstName: string
    lastName: string
    competence: string
  }
  shiftTemplate: {
    type: 'JOUR' | 'NUIT'
    name: string
  }
}

type PanelState =
  | { type: 'none' }
  | { type: 'day'; date: Date }
  | { type: 'agent'; userId: string; fromDay?: Date }

type AppConfig = {
  staff_jour: number
  staff_nuit: number
  total_beds: number
  default_open_beds: number
  app_name: string
  service_name: string
  hospital_name: string
  shiftJourStart: string
  shiftJourEnd: string
  shiftNuitStart: string
  shiftNuitEnd: string
}

const DEFAULT_CFG: AppConfig = {
  staff_jour: 8, staff_nuit: 8,
  total_beds: 18, default_open_beds: 18,
  app_name: 'PlanningAPHP', service_name: 'Réanimation Néonatale', hospital_name: 'CHIPS Poissy',
  shiftJourStart: '07:00', shiftJourEnd: '19:00', shiftNuitStart: '19:00', shiftNuitEnd: '07:00',
}

export function PlanningView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cfg, setCfg] = useState<AppConfig>(DEFAULT_CFG)

  // Panels
  const [panel, setPanel] = useState<PanelState>({ type: 'none' })

  // Generate panel
  const [showGeneratePanel, setShowGeneratePanel] = useState(false)
  const [openBeds, setOpenBeds] = useState(12)
  const [generating, setGenerating] = useState(false)
  const [genResult, setGenResult] = useState<{ success: boolean; message: string } | null>(null)
  const [bulkLoading, setBulkLoading] = useState<string | null>(null)

  // Agent selector for "view as"
  const [agents, setAgents] = useState<{ id: string; firstName: string; lastName: string; competence: string }[]>([])
  const [showAgentSelector, setShowAgentSelector] = useState(false)
  const [agentSearch, setAgentSearch] = useState('')

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const fetchAssignments = useCallback(async () => {
    setIsLoading(true)
    try {
      const start = format(monthStart, 'yyyy-MM-dd')
      const end = format(monthEnd, 'yyyy-MM-dd')
      const res = await fetch(`/api/planning?start=${start}&end=${end}`)
      if (res.ok) {
        const data = await res.json()
        setAssignments(data.assignments || [])
      }
    } catch (error) {
      console.error('Erreur chargement:', error)
    } finally {
      setIsLoading(false)
    }
  }, [monthStart.toISOString(), monthEnd.toISOString()])

  useEffect(() => { fetchAssignments() }, [fetchAssignments])

  // Load config + agents on mount
  useEffect(() => {
    fetch('/api/agents/list')
      .then((r) => r.ok ? r.json() : { agents: [] })
      .then((d) => setAgents(d.agents || []))
      .catch(() => {})

    fetch('/api/configuration/public')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (!d) return
        const c = d.config
        const shifts = d.shiftTemplates || []
        const jour = shifts.find((s: { type: string }) => s.type === 'JOUR')
        const nuit = shifts.find((s: { type: string }) => s.type === 'NUIT')
        const newCfg: AppConfig = {
          staff_jour: parseInt(c.staff_jour || '8'),
          staff_nuit: parseInt(c.staff_nuit || '8'),
          total_beds: parseInt(c.total_beds || '18'),
          default_open_beds: parseInt(c.default_open_beds || '18'),
          app_name: c.app_name || 'PlanningAPHP',
          service_name: c.service_name || 'Réanimation Néonatale',
          hospital_name: c.hospital_name || 'CHIPS Poissy',
          shiftJourStart: jour?.startTime || '07:00',
          shiftJourEnd: jour?.endTime || '19:00',
          shiftNuitStart: nuit?.startTime || '19:00',
          shiftNuitEnd: nuit?.endTime || '07:00',
        }
        setCfg(newCfg)
        setOpenBeds(newCfg.default_open_beds)
      })
      .catch(() => {})
  }, [])

  const stats = {
    total: assignments.length,
    planifie: assignments.filter((a) => a.status === 'PLANIFIE').length,
    confirme: assignments.filter((a) => a.status === 'CONFIRME').length,
  }
  const hasPlanifie = stats.planifie > 0

  // Effectifs fixes depuis la config
  const staffJour = cfg.staff_jour
  const staffNuit = cfg.staff_nuit

  const handleGenerate = async () => {
    setGenerating(true)
    setGenResult(null)
    try {
      const month = format(currentDate, 'yyyy-MM')
      const res = await fetch('/api/planning/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month, openBeds }),
      })
      const data = await res.json()
      if (res.ok) {
        setGenResult({
          success: true,
          message: `Planning généré pour ${data.openBeds} lits : ${data.staffJour} agents/jour, ${data.staffNuit} agents/nuit — ${data.totalAssignments} affectations`,
        })
        setShowGeneratePanel(false)
        fetchAssignments()
      } else {
        setGenResult({ success: false, message: data.message })
      }
    } catch {
      setGenResult({ success: false, message: 'Erreur lors de la génération' })
    } finally {
      setGenerating(false)
    }
  }

  const handleDeletePlanifie = async () => {
    if (!confirm('Supprimer toutes les affectations prévisionnelles de ce mois ?\n\nLes confirmées ne seront pas touchées.')) return
    setBulkLoading('delete')
    try {
      const month = format(currentDate, 'yyyy-MM')
      const res = await fetch(`/api/planning/bulk?month=${month}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setGenResult({ success: true, message: `${data.deletedCount} affectations prévisionnelles supprimées` })
        fetchAssignments()
      }
    } catch {
      setGenResult({ success: false, message: 'Erreur' })
    } finally {
      setBulkLoading(null)
    }
  }

  const handleConfirmAll = async () => {
    if (!confirm('Confirmer toutes les affectations prévisionnelles de ce mois ?')) return
    setBulkLoading('confirm')
    try {
      const month = format(currentDate, 'yyyy-MM')
      const res = await fetch('/api/planning/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ month }),
      })
      const data = await res.json()
      if (res.ok) {
        setGenResult({ success: true, message: `${data.confirmedCount} affectations confirmées` })
        fetchAssignments()
      }
    } catch {
      setGenResult({ success: false, message: 'Erreur' })
    } finally {
      setBulkLoading(null)
    }
  }

  const getAssignmentsForDay = (date: Date, type: 'JOUR' | 'NUIT') => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return assignments.filter((a) => a.date === dateStr && a.shiftTemplate.type === type && a.status !== 'ANNULE')
  }

  const filteredAgents = agents.filter((a) =>
    `${a.firstName} ${a.lastName}`.toLowerCase().includes(agentSearch.toLowerCase())
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors" aria-label="Mois précédent">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-secondary-800 min-w-[200px] text-center capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-secondary-100 text-secondary-600 transition-colors" aria-label="Mois suivant">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="ml-2 px-3 py-1.5 text-sm rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors">
            Aujourd&apos;hui
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View as agent */}
          <div className="relative">
            <Button size="sm" variant="outline" icon={<Eye className="w-4 h-4" />} onClick={() => setShowAgentSelector(!showAgentSelector)}>
              Voir en tant que
            </Button>
            <AnimatePresence>
              {showAgentSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-lg border border-secondary-200 z-40 overflow-hidden"
                >
                  <div className="p-2 border-b border-secondary-100">
                    <input
                      type="search"
                      placeholder="Rechercher un agent..."
                      value={agentSearch}
                      onChange={(e) => setAgentSearch(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredAgents.length === 0 ? (
                      <p className="p-3 text-sm text-secondary-400 text-center">Aucun agent trouvé</p>
                    ) : (
                      filteredAgents.slice(0, 20).map((a) => (
                        <button
                          key={a.id}
                          onClick={() => {
                            setPanel({ type: 'agent', userId: a.id })
                            setShowAgentSelector(false)
                            setAgentSearch('')
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary-50 text-left text-sm transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-semibold">
                            {a.firstName.charAt(0)}{a.lastName.charAt(0)}
                          </div>
                          <span className="text-secondary-800">{a.firstName} {a.lastName}</span>
                          <Badge variant={a.competence === 'INF' ? 'info' : 'default'} className="ml-auto">
                            {a.competence === 'INF' ? 'INF' : 'PUE'}
                          </Badge>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button size="sm" variant="primary" icon={<Wand2 className="w-4 h-4" />} onClick={() => setShowGeneratePanel(!showGeneratePanel)}>
            Générer
          </Button>
          <Button size="sm" variant="outline" icon={<Download className="w-4 h-4" />}>
            Exporter
          </Button>
        </div>
      </motion.div>

      {/* Stats bar */}
      {stats.total > 0 && (
        <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-secondary-500"><strong className="text-secondary-800">{stats.total}</strong> affectations</span>
            {stats.planifie > 0 && <Badge variant="warning">{stats.planifie} prévisionnelles</Badge>}
            {stats.confirme > 0 && <Badge variant="success">{stats.confirme} confirmées</Badge>}
          </div>
          {hasPlanifie && (
            <div className="flex items-center gap-2 ml-auto">
              <Button size="sm" variant="danger" icon={bulkLoading === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} onClick={handleDeletePlanifie} disabled={bulkLoading !== null}>
                Supprimer prévisionnel
              </Button>
              <Button size="sm" variant="primary" icon={bulkLoading === 'confirm' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} onClick={handleConfirmAll} disabled={bulkLoading !== null}>
                Confirmer tout
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Generate panel */}
      <AnimatePresence>
        {showGeneratePanel && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-primary-800">
                    Générer — {format(currentDate, 'MMMM yyyy', { locale: fr })}
                  </h3>
                </div>
                <button onClick={() => setShowGeneratePanel(false)} className="text-primary-400 hover:text-primary-600" aria-label="Fermer">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="open-beds" className="block text-sm font-medium text-primary-700 mb-1.5">
                    Lits ouverts (bébés hospitalisés)
                  </label>
                  <input id="open-beds" type="number" min={1} max={cfg.total_beds} value={openBeds} onChange={(e) => setOpenBeds(parseInt(e.target.value) || 1)} className="w-full px-4 py-2.5 rounded-lg border border-primary-300 text-center text-lg font-bold text-primary-800 bg-white focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-primary-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    Jour : <strong>{staffJour}</strong> infirmières
                  </p>
                  <p className="text-sm text-primary-600 mt-1">
                    <Moon className="w-4 h-4 inline mr-1" />
                    Nuit : <strong>{staffNuit}</strong> infirmières
                  </p>
                  <p className="text-xs text-primary-400 mt-1">
                    Modifiable dans Admin &gt; Configuration
                  </p>
                </div>
                <div className="flex items-end">
                  <Button className="w-full" icon={generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />} onClick={handleGenerate} disabled={generating}>
                    {generating ? 'Génération...' : 'Lancer la génération'}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-primary-500">
                Le planning sera en statut &quot;Prévisionnel&quot;. Vérifiez, modifiez, puis confirmez ou supprimez.
                Ratios modifiables dans Administration &gt; Configuration.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result message */}
      <AnimatePresence>
        {genResult && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={cn('mb-4 p-3 rounded-lg text-sm flex items-center justify-between', genResult.success ? 'bg-accent-50 text-accent-700 border border-accent-200' : 'bg-error-50 text-error-700 border border-error-200')}>
            <span>{genResult.message}</span>
            <button onClick={() => setGenResult(null)} className="ml-2 opacity-60 hover:opacity-100"><X className="w-4 h-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar grid */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-secondary-200">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
            <div key={d} className="px-2 py-3 text-center text-xs font-semibold text-secondary-500 uppercase">{d}</div>
          ))}
        </div>

        {isLoading ? (
          <div className="p-8"><div className="grid grid-cols-7 gap-px">{Array.from({ length: 35 }).map((_, i) => (<div key={i} className="h-24 bg-secondary-50 animate-pulse rounded" />))}</div></div>
        ) : (
          <div className="grid grid-cols-7 gap-px bg-secondary-100">
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`e-${i}`} className="h-28 bg-white" />
            ))}
            {days.map((day) => {
              const jour = getAssignmentsForDay(day, 'JOUR')
              const nuit = getAssignmentsForDay(day, 'NUIT')
              const today = isToday(day)
              const weekend = isWeekendFn(day)
              const hasPlanifieDay = [...jour, ...nuit].some((a) => a.status === 'PLANIFIE')
              const isSelected = panel.type === 'day' && format(panel.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
              const jourPuer = jour.filter((a) => a.user.competence === 'PUERICULTRCE').length
              const nuitPuer = nuit.filter((a) => a.user.competence === 'PUERICULTRCE').length

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setPanel({ type: 'day', date: day })}
                  className={cn(
                    'h-28 bg-white p-1.5 overflow-hidden hover:bg-primary-50/40 transition-colors cursor-pointer relative text-left',
                    weekend && 'bg-secondary-50/30',
                    today && 'ring-2 ring-inset ring-primary-500',
                    hasPlanifieDay && 'bg-warning-50/20',
                    isSelected && 'ring-2 ring-inset ring-primary-600 bg-primary-50/30'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn('text-xs font-medium', today ? 'text-primary-600 font-bold' : weekend ? 'text-secondary-400' : 'text-secondary-600')}>
                      {format(day, 'd')}
                    </span>
                    {hasPlanifieDay && <span className="w-1.5 h-1.5 rounded-full bg-warning-400" />}
                  </div>

                  {jour.length > 0 && (
                    <div className="flex items-center gap-0.5 mb-0.5">
                      <Sun className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span className="text-[10px] text-secondary-600 truncate">
                        {jour.length} <span className="text-secondary-400">({jourPuer}p)</span>
                      </span>
                    </div>
                  )}
                  {nuit.length > 0 && (
                    <div className="flex items-center gap-0.5">
                      <Moon className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      <span className="text-[10px] text-secondary-600 truncate">
                        {nuit.length} <span className="text-secondary-400">({nuitPuer}p)</span>
                      </span>
                    </div>
                  )}
                  {jour.length === 0 && nuit.length === 0 && !weekend && (
                    <div className="flex items-center gap-0.5 mt-1">
                      <AlertTriangle className="w-3 h-3 text-warning-500" />
                      <span className="text-[10px] text-warning-600">Vide</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* Legend */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 mt-4 text-xs text-secondary-500">
        <div className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-500" /><span>Jour ({cfg.shiftJourStart.replace(':', 'h')}-{cfg.shiftJourEnd.replace(':', 'h')})</span></div>
        <div className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-indigo-500" /><span>Nuit ({cfg.shiftNuitStart.replace(':', 'h')}-{cfg.shiftNuitEnd.replace(':', 'h')})</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning-400" /><span>Prévisionnel</span></div>
        <div className="flex items-center gap-1.5"><span className="text-secondary-400">(2p)</span><span>= 2 puéricultrices</span></div>
      </motion.div>

      {/* Side panels */}
      <AnimatePresence>
        {panel.type === 'day' && (
          <DayDetailPanel
            key="day"
            date={panel.date}
            assignments={assignments}
            onClose={() => setPanel({ type: 'none' })}
            onClickAgent={(userId) => setPanel({ type: 'agent', userId, fromDay: panel.date })}
            shiftJourLabel={`${cfg.shiftJourStart.replace(':', 'h')} à ${cfg.shiftJourEnd.replace(':', 'h')}`}
            shiftNuitLabel={`${cfg.shiftNuitStart.replace(':', 'h')} à ${cfg.shiftNuitEnd.replace(':', 'h')}`}
          />
        )}
        {panel.type === 'agent' && (
          <AgentPanel
            key={`agent-${panel.userId}`}
            userId={panel.userId}
            month={format(currentDate, 'yyyy-MM')}
            onClose={() => setPanel({ type: 'none' })}
            onBack={panel.fromDay ? () => setPanel({ type: 'day', date: panel.fromDay! }) : undefined}
          />
        )}
      </AnimatePresence>

      {/* Overlay for panels */}
      <AnimatePresence>
        {panel.type !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setPanel({ type: 'none' })}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
