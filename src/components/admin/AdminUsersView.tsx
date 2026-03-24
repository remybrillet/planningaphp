'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Search,
  Edit2,
  UserX,
  UserCheck,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { NewUserForm } from './NewUserForm'

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  competence: string
  workPercentage: number
  phone: string | null
  isActive: boolean
  createdAt: string
}

type Props = {
  users: User[]
}

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  GESTIONNAIRE: 'Gestionnaire',
  EMPLOYE: 'Employé',
}

const roleBadge: Record<string, 'error' | 'warning' | 'default'> = {
  ADMIN: 'error',
  GESTIONNAIRE: 'warning',
  EMPLOYE: 'default',
}

export function AdminUsersView({ users: initialUsers }: Props) {
  const [users, setUsers] = useState(initialUsers)
  const [search, setSearch] = useState('')
  const [showNewForm, setShowNewForm] = useState(false)

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const res = await fetch(`/api/agents/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !isActive }),
    })

    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isActive: !isActive } : u
        )
      )
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-200 text-sm focus:ring-2 focus:ring-primary-500"
            aria-label="Rechercher un utilisateur"
          />
        </div>
        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewForm(true)}
        >
          Nouvel utilisateur
        </Button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-secondary-200 bg-secondary-50">
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Utilisateur</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Rôle</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Compétence</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Temps</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Statut</th>
                <th className="text-left px-4 py-3 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-secondary-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar firstName={user.firstName} lastName={user.lastName} size="sm" />
                      <div>
                        <p className="font-medium text-secondary-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-secondary-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={roleBadge[user.role]}>{roleLabels[user.role]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-secondary-600">
                    {user.competence === 'INF' ? 'Infirmière' : 'Puéricultrice'}
                  </td>
                  <td className="px-4 py-3 text-secondary-600">{user.workPercentage}%</td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <Badge variant="success">Actif</Badge>
                    ) : (
                      <Badge variant="error">Inactif</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        className="p-1.5 rounded-lg text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                        aria-label={`Modifier ${user.firstName} ${user.lastName}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          user.isActive
                            ? 'text-secondary-400 hover:text-error-600 hover:bg-error-50'
                            : 'text-secondary-400 hover:text-accent-600 hover:bg-accent-50'
                        )}
                        aria-label={
                          user.isActive
                            ? `Désactiver ${user.firstName}`
                            : `Activer ${user.firstName}`
                        }
                      >
                        {user.isActive ? (
                          <UserX className="w-4 h-4" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <Modal
        isOpen={showNewForm}
        onClose={() => setShowNewForm(false)}
        title="Nouvel utilisateur"
        size="lg"
      >
        <NewUserForm
          onSuccess={() => {
            setShowNewForm(false)
            window.location.reload()
          }}
          onCancel={() => setShowNewForm(false)}
        />
      </Modal>
    </motion.div>
  )
}
