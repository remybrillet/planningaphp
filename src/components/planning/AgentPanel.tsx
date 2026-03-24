'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Sun,
  Moon,
  Calendar,
  Clock,
  TrendingUp,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

type AgentStats = {
  user: {
    id: string
    firstName: string
    lastName: string
    competence: string
    workPercentage: number
    email: string
  }
  stats: {
    totalShifts: number
    jourShifts: number
    nuitShifts: number
    totalHours: number
    weekendShifts: number
    targetShifts: number
    leaves: number
  }
  assignments: {
    id: string
    date: string
    status: string
    shift: string
    type: string
  }[]
}

type Props = {
  userId: string
  month: string // YYYY-MM
  onClose: () => void
  onBack?: () => void
}

export function AgentPanel({ userId, month, onClose, onBack }: Props) {
  const [data, setData] = useState<AgentStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/planning/agent-stats?userId=${userId}&month=${month}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId, month])

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-secondary-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-200 bg-secondary-50">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
              aria-label="Retour"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h3 className="font-bold text-secondary-800">Planning agent</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : !data ? (
          <div className="p-5 text-center text-secondary-500">Agent non trouvé</div>
        ) : (
          <>
            {/* Agent info */}
            <div className="p-5 border-b border-secondary-100">
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  firstName={data.user.firstName}
                  lastName={data.user.lastName}
                  size="lg"
                />
                <div>
                  <p className="font-bold text-secondary-800 text-lg">
                    {data.user.firstName} {data.user.lastName}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {data.user.competence === 'INF' ? 'Infirmière' : 'Puéricultrice'}
                    {' — '}{data.user.workPercentage}%
                  </p>
                  <p className="text-xs text-secondary-400">{data.user.email}</p>
                </div>
              </div>

              {/* Month label */}
              <p className="text-sm text-secondary-600 capitalize font-medium">
                <Calendar className="w-4 h-4 inline mr-1" />
                {format(new Date(month + '-01'), 'MMMM yyyy', { locale: fr })}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3 p-5">
              <StatCard
                icon={<TrendingUp className="w-4 h-4 text-primary-500" />}
                label="Total gardes"
                value={data.stats.totalShifts}
                sub={`objectif : ${data.stats.targetShifts}`}
                highlight={data.stats.totalShifts > data.stats.targetShifts + 1}
              />
              <StatCard
                icon={<Clock className="w-4 h-4 text-secondary-500" />}
                label="Heures"
                value={`${data.stats.totalHours}h`}
              />
              <StatCard
                icon={<Sun className="w-4 h-4 text-amber-500" />}
                label="Shifts jour"
                value={data.stats.jourShifts}
              />
              <StatCard
                icon={<Moon className="w-4 h-4 text-indigo-500" />}
                label="Shifts nuit"
                value={data.stats.nuitShifts}
              />
              <StatCard
                icon={<Calendar className="w-4 h-4 text-orange-500" />}
                label="Week-ends"
                value={data.stats.weekendShifts}
              />
              <StatCard
                icon={<Calendar className="w-4 h-4 text-error-500" />}
                label="Congés"
                value={data.stats.leaves}
              />
            </div>

            {/* Assignment list */}
            <div className="px-5 pb-5">
              <h4 className="text-sm font-semibold text-secondary-700 mb-2">
                Détail des gardes
              </h4>
              {data.assignments.length === 0 ? (
                <p className="text-sm text-secondary-400 italic">Aucune garde ce mois-ci</p>
              ) : (
                <div className="space-y-1">
                  {data.assignments.map((a) => {
                    const d = new Date(a.date)
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-lg text-sm',
                          isWeekend ? 'bg-orange-50' : 'bg-secondary-50'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {a.type === 'JOUR' ? (
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                          ) : (
                            <Moon className="w-3.5 h-3.5 text-indigo-500" />
                          )}
                          <span className="text-secondary-700 capitalize">
                            {format(d, 'EEE d MMM', { locale: fr })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-secondary-500">{a.shift}</span>
                          <Badge
                            variant={a.status === 'CONFIRME' ? 'success' : 'warning'}
                          >
                            {a.status === 'CONFIRME' ? 'OK' : 'Prév.'}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'p-3 rounded-lg border',
        highlight ? 'border-warning-300 bg-warning-50' : 'border-secondary-200 bg-secondary-50'
      )}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-secondary-500">{label}</span>
      </div>
      <p className="text-xl font-bold text-secondary-800">{value}</p>
      {sub && <p className="text-[10px] text-secondary-400 mt-0.5">{sub}</p>}
    </div>
  )
}
