'use client'

import { motion } from 'framer-motion'
import { X, Sun, Moon, User } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'

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

type Props = {
  date: Date
  assignments: Assignment[]
  onClose: () => void
  onClickAgent: (userId: string) => void
  shiftJourLabel: string
  shiftNuitLabel: string
}

const statusLabels: Record<string, { label: string; variant: 'warning' | 'success' | 'error' | 'default' }> = {
  PLANIFIE: { label: 'Prévisionnel', variant: 'warning' },
  CONFIRME: { label: 'Confirmé', variant: 'success' },
  ANNULE: { label: 'Annulé', variant: 'error' },
  REMPLACE: { label: 'Remplacé', variant: 'default' },
}

export function DayDetailPanel({ date, assignments, onClose, onClickAgent, shiftJourLabel, shiftNuitLabel }: Props) {
  const dateStr = format(date, 'yyyy-MM-dd')
  const dayAssignments = assignments.filter((a) => a.date === dateStr && a.status !== 'ANNULE')
  const jour = dayAssignments.filter((a) => a.shiftTemplate.type === 'JOUR')
  const nuit = dayAssignments.filter((a) => a.shiftTemplate.type === 'NUIT')

  const renderShiftList = (title: string, icon: React.ReactNode, items: Assignment[], color: string) => (
    <div className="mb-4">
      <div className={`flex items-center gap-2 mb-2 pb-2 border-b ${color}`}>
        {icon}
        <h4 className="font-semibold text-secondary-800">{title}</h4>
        <Badge variant={title.startsWith('Jour') ? 'jour' : 'nuit'} className="ml-auto">
          {items.length} agent{items.length > 1 ? 's' : ''}
        </Badge>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-secondary-400 italic py-2">Aucun agent affecté</p>
      ) : (
        <div className="space-y-1">
          {items.map((a) => {
            const st = statusLabels[a.status] || statusLabels.PLANIFIE
            return (
              <button
                key={a.id}
                onClick={() => onClickAgent(a.user.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary-50 transition-colors text-left"
              >
                <Avatar firstName={a.user.firstName} lastName={a.user.lastName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary-800 truncate">
                    {a.user.firstName} {a.user.lastName}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {a.user.competence === 'INF' ? 'Infirmière' : 'Puéricultrice'}
                  </p>
                </div>
                <Badge variant={st.variant}>{st.label}</Badge>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-secondary-200"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-200 bg-secondary-50">
        <div>
          <h3 className="font-bold text-secondary-800 capitalize">
            {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
          </h3>
          <p className="text-xs text-secondary-500 mt-0.5">
            {dayAssignments.length} affectation{dayAssignments.length > 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors" aria-label="Fermer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {renderShiftList(
          `Jour — ${shiftJourLabel}`,
          <Sun className="w-5 h-5 text-amber-500" />,
          jour,
          'border-amber-200'
        )}
        {renderShiftList(
          `Nuit — ${shiftNuitLabel}`,
          <Moon className="w-5 h-5 text-indigo-500" />,
          nuit,
          'border-indigo-200'
        )}

        <div className="mt-4 p-3 rounded-lg bg-secondary-50 text-xs text-secondary-500">
          <div className="grid grid-cols-2 gap-2">
            <div><span className="font-medium text-secondary-700">INF jour :</span> {jour.filter((a) => a.user.competence === 'INF').length}</div>
            <div><span className="font-medium text-secondary-700">Puer jour :</span> {jour.filter((a) => a.user.competence === 'PUERICULTRCE').length}</div>
            <div><span className="font-medium text-secondary-700">INF nuit :</span> {nuit.filter((a) => a.user.competence === 'INF').length}</div>
            <div><span className="font-medium text-secondary-700">Puer nuit :</span> {nuit.filter((a) => a.user.competence === 'PUERICULTRCE').length}</div>
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-secondary-200 text-xs text-secondary-400">
        <User className="w-3 h-3 inline mr-1" />
        Cliquez sur un agent pour voir son planning mensuel
      </div>
    </motion.div>
  )
}
