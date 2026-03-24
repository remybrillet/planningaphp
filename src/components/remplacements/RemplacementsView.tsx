'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, UserCheck, UserX, Search, AlertTriangle } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { EmptyState } from '@/components/ui/EmptyState'
import { cn } from '@/lib/utils'

type Agent = {
  id: string
  firstName: string
  lastName: string
  competence: string
  workPercentage: number
}

type LeaveRequest = {
  id: string
  type: string
  startDate: string
  endDate: string
  user: {
    id: string
    firstName: string
    lastName: string
    competence: string
  }
}

type Props = {
  agents: Agent[]
  upcomingLeaves: LeaveRequest[]
}

const typeLabels: Record<string, string> = {
  CP: 'CP',
  RTT: 'RTT',
  MALADIE: 'Maladie',
  FORMATION: 'Formation',
  MATERNITE: 'Maternité',
  PATERNITE: 'Paternité',
  AUTRE: 'Autre',
}

export function RemplacementsView({ agents, upcomingLeaves }: Props) {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [filterCompetence, setFilterCompetence] = useState<string>('all')

  // Agents absent on selected date
  const absentAgentIds = upcomingLeaves
    .filter(
      (l) => l.startDate <= selectedDate && l.endDate >= selectedDate
    )
    .map((l) => l.user.id)

  const absentAgents = upcomingLeaves.filter(
    (l) => l.startDate <= selectedDate && l.endDate >= selectedDate
  )

  // Available agents (not on leave)
  const availableAgents = agents.filter(
    (a) =>
      !absentAgentIds.includes(a.id) &&
      (filterCompetence === 'all' || a.competence === filterCompetence)
  )

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Date picker + filters */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label
            htmlFor="date-select"
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            Date à pourvoir
          </label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label
            htmlFor="competence-filter"
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            Compétence
          </label>
          <select
            id="competence-filter"
            value={filterCompetence}
            onChange={(e) => setFilterCompetence(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">Toutes</option>
            <option value="INF">Infirmières</option>
            <option value="PUERICULTRCE">Puéricultrices</option>
          </select>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Absent agents */}
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-semibold text-secondary-800 mb-3 flex items-center gap-2">
            <UserX className="w-5 h-5 text-error-500" />
            Agents absents ({absentAgents.length})
          </h2>
          <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
            {absentAgents.length === 0 ? (
              <div className="p-6 text-center text-secondary-500 text-sm">
                Aucun agent absent à cette date.
              </div>
            ) : (
              <div className="divide-y divide-secondary-100">
                {absentAgents.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={leave.user.firstName}
                        lastName={leave.user.lastName}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">
                          {leave.user.firstName} {leave.user.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {leave.user.competence === 'INF'
                            ? 'Infirmière'
                            : 'Puéricultrice'}
                        </p>
                      </div>
                    </div>
                    <Badge variant="error">
                      {typeLabels[leave.type] || leave.type}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Available agents */}
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-semibold text-secondary-800 mb-3 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-accent-500" />
            Agents disponibles ({availableAgents.length})
          </h2>
          <div className="bg-white rounded-xl border border-secondary-200 shadow-sm overflow-hidden">
            {availableAgents.length === 0 ? (
              <EmptyState
                icon={<AlertTriangle className="w-6 h-6" />}
                title="Aucun agent disponible"
                description="Aucun agent ne correspond aux critères pour cette date."
              />
            ) : (
              <div className="divide-y divide-secondary-100">
                {availableAgents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary-50/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        firstName={agent.firstName}
                        lastName={agent.lastName}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-secondary-800">
                          {agent.firstName} {agent.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {agent.competence === 'INF'
                            ? 'Infirmière'
                            : 'Puéricultrice'}{' '}
                          — {agent.workPercentage}%
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">Disponible</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
