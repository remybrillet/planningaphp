'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Calendar,
  Check,
  X,
  Clock,
  Filter,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/EmptyState'
import { NewLeaveForm } from './NewLeaveForm'

type LeaveRequest = {
  id: string
  type: string
  startDate: string
  endDate: string
  reason: string | null
  status: string
  reviewNote: string | null
  createdAt: string
  user: {
    id: string
    firstName: string
    lastName: string
    competence: string
  }
}

const typeLabels: Record<string, string> = {
  CP: 'Congés payés',
  RTT: 'RTT',
  MALADIE: 'Maladie',
  FORMATION: 'Formation',
  MATERNITE: 'Maternité',
  PATERNITE: 'Paternité',
  AUTRE: 'Autre',
}

const statusConfig: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'default' }> = {
  EN_ATTENTE: { label: 'En attente', variant: 'warning' },
  APPROUVE: { label: 'Approuvé', variant: 'success' },
  REFUSE: { label: 'Refusé', variant: 'error' },
  ANNULE: { label: 'Annulé', variant: 'default' },
}

type Props = {
  leaveRequests: LeaveRequest[]
  isManager: boolean
  currentUserId: string
}

export function CongesView({ leaveRequests, isManager, currentUserId }: Props) {
  const [showNewForm, setShowNewForm] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [requests, setRequests] = useState(leaveRequests)

  const filtered = requests.filter(
    (r) => filterStatus === 'all' || r.status === filterStatus
  )

  const handleReview = async (id: string, status: 'APPROUVE' | 'REFUSE') => {
    const res = await fetch(`/api/conges/${id}/review`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      )
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
      {/* Controls */}
      <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-secondary-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-secondary-200 text-sm text-secondary-600 focus:ring-2 focus:ring-primary-500"
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="APPROUVE">Approuvés</option>
            <option value="REFUSE">Refusés</option>
          </select>
        </div>

        <Button
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowNewForm(true)}
        >
          Nouvelle demande
        </Button>
      </motion.div>

      {/* Stats cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-800">
                {requests.filter((r) => r.status === 'EN_ATTENTE').length}
              </p>
              <p className="text-xs text-secondary-500">En attente</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent-50 flex items-center justify-center">
              <Check className="w-5 h-5 text-accent-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-800">
                {requests.filter((r) => r.status === 'APPROUVE').length}
              </p>
              <p className="text-xs text-secondary-500">Approuvés</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-secondary-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-error-50 flex items-center justify-center">
              <X className="w-5 h-5 text-error-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-800">
                {requests.filter((r) => r.status === 'REFUSE').length}
              </p>
              <p className="text-xs text-secondary-500">Refusés</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* List */}
      <motion.div variants={fadeUp} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="Aucune demande de congé"
            description="Les demandes de congés apparaîtront ici."
            action={
              <Button
                icon={<Plus className="w-4 h-4" />}
                onClick={() => setShowNewForm(true)}
              >
                Nouvelle demande
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  {isManager && (
                    <th className="text-left px-4 py-3 font-medium text-secondary-600">Agent</th>
                  )}
                  <th className="text-left px-4 py-3 font-medium text-secondary-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-600">Du</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-600">Au</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-600">Motif</th>
                  <th className="text-left px-4 py-3 font-medium text-secondary-600">Statut</th>
                  {isManager && (
                    <th className="text-left px-4 py-3 font-medium text-secondary-600">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {filtered.map((request) => {
                  const status = statusConfig[request.status] || statusConfig.EN_ATTENTE
                  return (
                    <tr key={request.id} className="hover:bg-secondary-50/50 transition-colors">
                      {isManager && (
                        <td className="px-4 py-3 font-medium text-secondary-800">
                          {request.user.firstName} {request.user.lastName}
                        </td>
                      )}
                      <td className="px-4 py-3">{typeLabels[request.type] || request.type}</td>
                      <td className="px-4 py-3 text-secondary-600">
                        {new Date(request.startDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-secondary-600">
                        {new Date(request.endDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-secondary-500 max-w-[200px] truncate">
                        {request.reason || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </td>
                      {isManager && (
                        <td className="px-4 py-3">
                          {request.status === 'EN_ATTENTE' && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleReview(request.id, 'APPROUVE')}
                                className="p-1.5 rounded-lg text-accent-600 hover:bg-accent-50 transition-colors"
                                aria-label="Approuver"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReview(request.id, 'REFUSE')}
                                className="p-1.5 rounded-lg text-error-600 hover:bg-error-50 transition-colors"
                                aria-label="Refuser"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* New leave modal */}
      <Modal
        isOpen={showNewForm}
        onClose={() => setShowNewForm(false)}
        title="Nouvelle demande de congé"
        size="md"
      >
        <NewLeaveForm
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
