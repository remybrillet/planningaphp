'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, UserCheck, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/animations'
import type { SafeUser } from '@/types'

type Props = {
  agents: SafeUser[]
}

const competenceLabels = {
  INF: 'Infirmière',
  PUERICULTRCE: 'Puéricultrice',
}

const roleLabels = {
  ADMIN: 'Administrateur',
  GESTIONNAIRE: 'Gestionnaire',
  EMPLOYE: 'Employé',
}

export function AgentsList({ agents }: Props) {
  const [search, setSearch] = useState('')
  const [filterCompetence, setFilterCompetence] = useState<string>('all')

  const filtered = agents.filter((agent) => {
    const matchesSearch =
      `${agent.firstName} ${agent.lastName} ${agent.email}`
        .toLowerCase()
        .includes(search.toLowerCase())
    const matchesCompetence =
      filterCompetence === 'all' || agent.competence === filterCompetence
    return matchesSearch && matchesCompetence
  })

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Controls */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-3 mb-6"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un agent..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            aria-label="Rechercher un agent"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-secondary-400" />
          <select
            value={filterCompetence}
            onChange={(e) => setFilterCompetence(e.target.value)}
            className="px-3 py-2 rounded-lg border border-secondary-200 text-sm text-secondary-600 focus:ring-2 focus:ring-primary-500"
            aria-label="Filtrer par compétence"
          >
            <option value="all">Toutes compétences</option>
            <option value="INF">Infirmières</option>
            <option value="PUERICULTRCE">Puéricultrices</option>
          </select>
        </div>

        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" />
          Ajouter un agent
        </button>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                <th className="text-left px-4 py-3 font-medium text-secondary-600">
                  Agent
                </th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">
                  Email
                </th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">
                  Compétence
                </th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">
                  Temps de travail
                </th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">
                  Rôle
                </th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filtered.map((agent) => (
                <tr
                  key={agent.id}
                  className="hover:bg-secondary-50/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-semibold">
                        {agent.firstName.charAt(0)}
                        {agent.lastName.charAt(0)}
                      </div>
                      <span className="font-medium text-secondary-800">
                        {agent.firstName} {agent.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">
                    {agent.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        agent.competence === 'INF'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-purple-50 text-purple-700'
                      )}
                    >
                      {competenceLabels[agent.competence]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">
                    {agent.workPercentage}%
                  </td>
                  <td className="px-4 py-3 text-secondary-600">
                    {roleLabels[agent.role]}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-600">
                      <UserCheck className="w-3.5 h-3.5" />
                      Actif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-secondary-500">
            Aucun agent ne correspond à votre recherche.
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
