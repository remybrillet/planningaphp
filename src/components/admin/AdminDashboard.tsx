'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, Clock, AlertTriangle, Activity } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type Stats = {
  totalAgents: number
  activeAgents: number
  todayAssignments: number
  pendingLeaves: number
}

type AuditEntry = {
  id: string
  action: string
  entity: string
  entityId: string
  createdAt: string
  user: { firstName: string; lastName: string } | null
}

type Props = {
  stats: Stats
  recentLogs: AuditEntry[]
}

const actionLabels: Record<string, string> = {
  LOGIN: 'Connexion',
  CREATE: 'Création',
  UPDATE: 'Modification',
  DELETE: 'Suppression',
}

const entityLabels: Record<string, string> = {
  User: 'Utilisateur',
  Assignment: 'Affectation',
  LeaveRequest: 'Demande de congé',
}

export function AdminDashboard({ stats, recentLogs }: Props) {
  const statCards = [
    {
      label: 'Agents actifs',
      value: stats.activeAgents,
      total: stats.totalAgents,
      icon: Users,
      color: 'bg-primary-50 text-primary-600',
    },
    {
      label: "Shifts aujourd'hui",
      value: stats.todayAssignments,
      icon: Calendar,
      color: 'bg-accent-50 text-accent-600',
    },
    {
      label: 'Congés en attente',
      value: stats.pendingLeaves,
      icon: Clock,
      color: 'bg-warning-50 text-warning-600',
    },
    {
      label: 'Alertes effectif',
      value: 0,
      icon: AlertTriangle,
      color: 'bg-error-50 text-error-600',
    },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp}>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-secondary-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-secondary-800 mt-1">
                      {stat.value}
                      {stat.total && (
                        <span className="text-lg text-secondary-400 font-normal">
                          /{stat.total}
                        </span>
                      )}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <motion.div variants={fadeUp}>
        <Card>
          <div className="px-6 py-4 border-b border-secondary-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-secondary-800">
              Activité récente
            </h2>
          </div>
          <div className="divide-y divide-secondary-100">
            {recentLogs.length === 0 ? (
              <div className="p-6 text-center text-secondary-500 text-sm">
                Aucune activité récente.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-400" />
                    <div>
                      <p className="text-sm text-secondary-800">
                        <span className="font-medium">
                          {log.user
                            ? `${log.user.firstName} ${log.user.lastName}`
                            : 'Système'}
                        </span>
                        {' — '}
                        {actionLabels[log.action] || log.action}{' '}
                        {entityLabels[log.entity] || log.entity}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-secondary-400">
                    {new Date(log.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
