'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Shield } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/Badge'

type AuditEntry = {
  id: string
  action: string
  entity: string
  entityId: string
  ipAddress: string | null
  createdAt: string
  user: { firstName: string; lastName: string; email: string } | null
}

type Props = {
  logs: AuditEntry[]
}

const actionBadge: Record<string, 'success' | 'info' | 'error' | 'warning'> = {
  CREATE: 'success',
  LOGIN: 'info',
  UPDATE: 'warning',
  DELETE: 'error',
}

export function AuditView({ logs }: Props) {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('all')

  const filtered = logs.filter((log) => {
    const matchesSearch = search === '' ||
      `${log.user?.firstName} ${log.user?.lastName} ${log.entity} ${log.action}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesAction = filterAction === 'all' || log.action === filterAction
    return matchesSearch && matchesAction
  })

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans les logs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
            aria-label="Rechercher dans les logs"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-secondary-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
            aria-label="Filtrer par action"
          >
            <option value="all">Toutes les actions</option>
            <option value="LOGIN">Connexions</option>
            <option value="CREATE">Créations</option>
            <option value="UPDATE">Modifications</option>
            <option value="DELETE">Suppressions</option>
          </select>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Utilisateur</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Action</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Entité</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-secondary-50/50 transition-colors">
                  <td className="px-4 py-3 text-secondary-600 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-secondary-800">
                    {log.user
                      ? `${log.user.firstName} ${log.user.lastName}`
                      : 'Système'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={actionBadge[log.action] || 'default'}>
                      {log.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">{log.entity}</td>
                  <td className="px-4 py-3 text-secondary-400 text-xs font-mono">
                    {log.ipAddress || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-secondary-500">
            Aucun log ne correspond à vos critères.
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
